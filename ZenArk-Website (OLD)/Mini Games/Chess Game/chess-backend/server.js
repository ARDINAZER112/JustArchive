// ============================================================
//  CHESS MASTER — Backend API Server
//  Stack: Node.js + Express + PostgreSQL (pg)
//
//  Cara menjalankan:
//    1. npm install
//    2. cp .env.example .env  → isi DATABASE_URL
//    3. psql $DATABASE_URL -f schema.sql
//    4. npm start
// ============================================================

require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const rateLimit  = require('express-rate-limit');
const { Pool }   = require('pg');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Database Pool ──
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
  max: 10,              // max koneksi pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test koneksi saat startup
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    console.error('   Pastikan DATABASE_URL di .env sudah benar.');
    process.exit(1);
  }
  release();
  console.log('✅ Database terhubung');
});

// ── Middleware ──
app.use(express.json({ limit: '2mb' }));  // 2mb untuk avatar base64

// CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || '*',
  methods: ['GET','POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type','Authorization','X-Session-Token'],
}));

// Rate limiter global
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 menit
  max: 200,
  message: { error: 'Terlalu banyak request. Coba lagi nanti.' }
});
app.use(limiter);

// Rate limiter ketat untuk auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Terlalu banyak percobaan login. Coba lagi dalam 15 menit.' }
});

// ── Helper ──
function simpleHash(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++)
    h = ((h << 5) + h) ^ str.charCodeAt(i);
  return (h >>> 0).toString(36);
}

// Middleware autentikasi via session token
async function requireAuth(req, res, next) {
  const token = req.headers['x-session-token'];
  if (!token) return res.status(401).json({ error: 'Token tidak ditemukan.' });
  try {
    const { rows } = await pool.query(
      `SELECT s.player_id, p.username, p.avatar, p.bio
       FROM sessions s JOIN players p ON p.id = s.player_id
       WHERE s.token = $1 AND s.expires_at > NOW() AND p.is_active = TRUE`,
      [token]
    );
    if (!rows.length) return res.status(401).json({ error: 'Session tidak valid atau kadaluarsa.' });
    req.player = rows[0];
    next();
  } catch (e) {
    res.status(500).json({ error: 'Server error.' });
  }
}

// ============================================================
//  ROUTES: AUTH
// ============================================================

// POST /api/auth/register
app.post('/api/auth/register', authLimiter, async (req, res) => {
  const { username, password, avatar, bio } = req.body;

  if (!username || username.length < 3 || username.length > 24)
    return res.status(400).json({ error: 'Username harus 3–24 karakter.' });
  if (!/^[a-zA-Z0-9_]+$/.test(username))
    return res.status(400).json({ error: 'Username hanya boleh huruf, angka, underscore.' });
  if (!password || password.length < 4)
    return res.status(400).json({ error: 'Password minimal 4 karakter.' });

  try {
    const pwHash = simpleHash(password);
    const { rows } = await pool.query(
      `SELECT register_player($1, $2, $3, $4) AS player`,
      [username, pwHash, avatar || '⚔️', bio || '']
    );
    const player = rows[0].player;

    // Buat session
    const { rows: sessionRows } = await pool.query(
      `INSERT INTO sessions (player_id, ip_addr, user_agent)
       VALUES ($1, $2, $3) RETURNING token`,
      [player.id, req.ip, req.headers['user-agent']]
    );

    // Ambil stats lengkap
    const { rows: statsRows } = await pool.query(
      `SELECT * FROM player_profile WHERE id = $1`, [player.id]
    );

    res.status(201).json({
      message: `Selamat datang, ${username}!`,
      token: sessionRows[0].token,
      player: statsRows[0]
    });
  } catch (e) {
    if (e.code === '23505')  // unique violation
      return res.status(409).json({ error: 'Username sudah dipakai.' });
    console.error('Register error:', e.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', authLimiter, async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Username dan password harus diisi.' });

  try {
    const pwHash = simpleHash(password);
    const { rows } = await pool.query(
      `SELECT id FROM players
       WHERE username_lower = $1 AND pw_hash = $2 AND is_active = TRUE`,
      [username.toLowerCase(), pwHash]
    );
    if (!rows.length)
      return res.status(401).json({ error: 'Username atau password salah.' });

    const playerId = rows[0].id;

    // Update last_login
    await pool.query('SELECT update_last_login($1)', [playerId]);

    // Buat session baru
    const { rows: sessionRows } = await pool.query(
      `INSERT INTO sessions (player_id, ip_addr, user_agent)
       VALUES ($1, $2, $3) RETURNING token`,
      [playerId, req.ip, req.headers['user-agent']]
    );

    // Ambil profil lengkap
    const { rows: profileRows } = await pool.query(
      `SELECT * FROM player_profile WHERE id = $1`, [playerId]
    );

    res.json({
      message: `Selamat datang kembali, ${profileRows[0].username}!`,
      token: sessionRows[0].token,
      player: profileRows[0]
    });
  } catch (e) {
    console.error('Login error:', e.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/auth/logout
app.post('/api/auth/logout', requireAuth, async (req, res) => {
  const token = req.headers['x-session-token'];
  await pool.query('DELETE FROM sessions WHERE token = $1', [token]);
  res.json({ message: 'Logout berhasil.' });
});

// GET /api/auth/me  — auto-login via token
app.get('/api/auth/me', requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    `SELECT * FROM player_profile WHERE id = $1`,
    [req.player.player_id]
  );
  res.json({ player: rows[0] });
});

// ============================================================
//  ROUTES: PLAYER PROFILE
// ============================================================

// GET /api/players/:username
app.get('/api/players/:username', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM player_profile WHERE username_lower = $1`,
      [req.params.username.toLowerCase()]
    );
    if (!rows.length) return res.status(404).json({ error: 'Pemain tidak ditemukan.' });

    // Jangan tampilkan info sensitif ke publik
    const { id, username, avatar, bio, elo, elo_peak, tier, games_total,
            games_win, games_loss, games_draw, win_rate, win_streak,
            best_win_streak, created_at } = rows[0];
    res.json({ player: { id, username, avatar, bio, elo, elo_peak, tier,
      games_total, games_win, games_loss, games_draw, win_rate,
      win_streak, best_win_streak, created_at } });
  } catch (e) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /api/players/me  — update profil sendiri
app.put('/api/players/me', requireAuth, async (req, res) => {
  const { avatar, bio, password, new_password } = req.body;
  const playerId = req.player.player_id;

  try {
    // Jika ganti password, verifikasi password lama dulu
    if (new_password) {
      if (!password) return res.status(400).json({ error: 'Password lama harus diisi.' });
      if (new_password.length < 4) return res.status(400).json({ error: 'Password baru minimal 4 karakter.' });
      const { rows } = await pool.query(
        `SELECT id FROM players WHERE id = $1 AND pw_hash = $2`,
        [playerId, simpleHash(password)]
      );
      if (!rows.length) return res.status(401).json({ error: 'Password lama salah.' });
    }

    // Build update query dinamis
    const updates = [];
    const values  = [];
    let   idx     = 1;

    if (avatar !== undefined) { updates.push(`avatar = $${idx++}`); values.push(avatar); }
    if (bio    !== undefined) { updates.push(`bio = $${idx++}`);    values.push(bio.slice(0,200)); }
    if (new_password)         { updates.push(`pw_hash = $${idx++}`); values.push(simpleHash(new_password)); }

    if (updates.length) {
      values.push(playerId);
      await pool.query(
        `UPDATE players SET ${updates.join(', ')} WHERE id = $${idx}`,
        values
      );
    }

    // Return profil terbaru
    const { rows } = await pool.query(
      `SELECT * FROM player_profile WHERE id = $1`, [playerId]
    );
    res.json({ message: 'Profil diperbarui.', player: rows[0] });
  } catch (e) {
    console.error('Update profile error:', e.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ============================================================
//  ROUTES: LEADERBOARD
// ============================================================

// GET /api/leaderboard?limit=50&offset=0
app.get('/api/leaderboard', async (req, res) => {
  const limit  = Math.min(parseInt(req.query.limit)  || 50, 100);
  const offset = parseInt(req.query.offset) || 0;

  try {
    const { rows } = await pool.query(
      `SELECT rank, username, avatar, elo, elo_peak, tier,
              games_total, games_win, games_loss, games_draw, win_rate
       FROM leaderboard
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    const { rows: countRows } = await pool.query(
      `SELECT COUNT(*) AS total FROM player_stats ps
       JOIN players p ON p.id = ps.player_id WHERE p.is_active = TRUE`
    );
    res.json({
      leaderboard: rows,
      total: parseInt(countRows[0].total),
      limit, offset
    });
  } catch (e) {
    console.error('Leaderboard error:', e.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/leaderboard/me  — posisi rank pemain yang login
app.get('/api/leaderboard/me', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT rank, username, elo, tier, win_rate
       FROM leaderboard WHERE id = $1`,
      [req.player.player_id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Belum ada data.' });
    res.json({ me: rows[0] });
  } catch (e) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// ============================================================
//  ROUTES: MATCH
// ============================================================

// POST /api/matches  — catat hasil pertandingan online
app.post('/api/matches', requireAuth, async (req, res) => {
  const {
    opponent_username, my_color,   // 'white' atau 'black'
    result,                        // 'white', 'black', 'draw'
    end_reason,
    total_moves, duration_secs, room_code
  } = req.body;

  if (!opponent_username || !my_color || !result || !end_reason)
    return res.status(400).json({ error: 'Data tidak lengkap.' });

  try {
    // Cari opponent
    const { rows: oppRows } = await pool.query(
      `SELECT id, username FROM players WHERE username_lower = $1 AND is_active = TRUE`,
      [opponent_username.toLowerCase()]
    );
    if (!oppRows.length)
      return res.status(404).json({ error: 'Lawan tidak ditemukan.' });

    const myId   = req.player.player_id;
    const myName = req.player.username;
    const oppId  = oppRows[0].id;
    const oppName= oppRows[0].username;

    // Tentukan white/black
    const whiteId   = my_color === 'white' ? myId   : oppId;
    const blackId   = my_color === 'white' ? oppId  : myId;
    const whiteName = my_color === 'white' ? myName : oppName;
    const blackName = my_color === 'white' ? oppName: myName;

    // Panggil fungsi database
    const { rows } = await pool.query(
      `SELECT record_match_result($1,$2,$3,$4,$5,$6,$7,$8,$9) AS match`,
      [whiteId, blackId, whiteName, blackName,
       result, end_reason, total_moves || null,
       duration_secs || null, room_code || null]
    );

    // Ambil stats terbaru
    const { rows: statsRows } = await pool.query(
      `SELECT elo, tier, games_total, games_win, games_loss, games_draw
       FROM player_profile WHERE id = $1`, [myId]
    );

    // ELO delta untuk response
    const match = rows[0].match;
    const myEloBefore = my_color === 'white' ? match.elo_white_before : match.elo_black_before;
    const myEloAfter  = my_color === 'white' ? match.elo_white_after  : match.elo_black_after;

    res.status(201).json({
      message: 'Pertandingan berhasil dicatat.',
      elo_before: myEloBefore,
      elo_after:  myEloAfter,
      elo_delta:  myEloAfter - myEloBefore,
      stats: statsRows[0]
    });
  } catch (e) {
    console.error('Record match error:', e.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/matches/me?limit=20  — riwayat pertandingan sendiri
app.get('/api/matches/me', requireAuth, async (req, res) => {
  const limit  = Math.min(parseInt(req.query.limit) || 20, 100);
  const offset = parseInt(req.query.offset) || 0;
  const playerId = req.player.player_id;

  try {
    const { rows } = await pool.query(
      `SELECT
         id, result, end_reason,
         player_white_name, player_black_name,
         CASE WHEN player_white_id = $1 THEN 'white' ELSE 'black' END AS my_color,
         CASE
           WHEN player_white_id = $1 THEN elo_white_before
           ELSE elo_black_before
         END AS elo_before,
         CASE
           WHEN player_white_id = $1 THEN elo_white_after
           ELSE elo_black_after
         END AS elo_after,
         total_moves, duration_secs, played_at
       FROM match_history
       WHERE player_white_id = $1 OR player_black_id = $1
       ORDER BY played_at DESC
       LIMIT $2 OFFSET $3`,
      [playerId, limit, offset]
    );
    res.json({ matches: rows, limit, offset });
  } catch (e) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/elo-history/me  — riwayat perubahan ELO (untuk grafik)
app.get('/api/elo-history/me', requireAuth, async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 50, 200);
  const playerId = req.player.player_id;

  try {
    const { rows } = await pool.query(
      `SELECT elo_before, elo_after, elo_delta, recorded_at
       FROM elo_history
       WHERE player_id = $1
       ORDER BY recorded_at ASC
       LIMIT $2`,
      [playerId, limit]
    );
    res.json({ history: rows });
  } catch (e) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// ============================================================
//  ROUTES: UTIL
// ============================================================

// GET /api/health
app.get('/api/health', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT NOW() AS time, version() AS pg_version');
    res.json({
      status: 'ok',
      database: 'connected',
      time: rows[0].time,
      pg_version: rows[0].pg_version.split(' ')[0] + ' ' + rows[0].pg_version.split(' ')[1]
    });
  } catch (e) {
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});

// GET /api/stats  — statistik global server
app.get('/api/stats', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM players WHERE is_active = TRUE)     AS total_players,
        (SELECT COUNT(*) FROM match_history)                      AS total_matches,
        (SELECT COUNT(*) FROM match_history
         WHERE played_at > NOW() - INTERVAL '24 hours')          AS matches_today,
        (SELECT MAX(elo) FROM player_stats)                       AS highest_elo,
        (SELECT username FROM players p JOIN player_stats ps
         ON p.id = ps.player_id ORDER BY ps.elo DESC LIMIT 1)    AS top_player
    `);
    res.json({ stats: rows[0] });
  } catch (e) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint tidak ditemukan.' });
});

// Error handler global
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

// ── Start server ──
app.listen(PORT, () => {
  console.log(`🏰 Chess Master API berjalan di http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
