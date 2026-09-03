
const API_BASE_URL = 'https://chess-proxy.ardianyahandre85.workers.dev/'; 

// ── Storage session token (gantikan localStorage chessMasterSession) ──
const ChessAPI = {

  // ─────────────────────────────────────────────
  //  INTERNAL: request helper
  // ─────────────────────────────────────────────
  async _req(method, path, body = null, auth = false) {
    const headers = { 'Content-Type': 'application/json' };
    if (auth) {
      const token = localStorage.getItem('chessMasterToken');
      if (token) headers['X-Session-Token'] = token;
    }
    const opts = { method, headers };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(API_BASE_URL + path, opts);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request gagal');
    return data;
  },

  // ─────────────────────────────────────────────
  //  AUTH
  // ─────────────────────────────────────────────

  async register(username, password, avatar = '⚔️', bio = '') {
    const data = await this._req('POST', '/api/auth/register',
      { username, password, avatar, bio });
    localStorage.setItem('chessMasterToken', data.token);
    return data.player;
  },

  async login(username, password) {
    const data = await this._req('POST', '/api/auth/login',
      { username, password });
    localStorage.setItem('chessMasterToken', data.token);
    return data.player;
  },

  async logout() {
    try {
      await this._req('POST', '/api/auth/logout', null, true);
    } catch(e) {}
    localStorage.removeItem('chessMasterToken');
  },

  async me() {
    const data = await this._req('GET', '/api/auth/me', null, true);
    return data.player;
  },

  // ─────────────────────────────────────────────
  //  PROFILE
  // ─────────────────────────────────────────────

  async updateProfile({ avatar, bio, password, new_password } = {}) {
    const data = await this._req('PUT', '/api/players/me',
      { avatar, bio, password, new_password }, true);
    return data.player;
  },

  async getPlayer(username) {
    const data = await this._req('GET', `/api/players/${username}`);
    return data.player;
  },

  // ─────────────────────────────────────────────
  //  LEADERBOARD
  // ─────────────────────────────────────────────

  async getLeaderboard(limit = 50, offset = 0) {
    const data = await this._req('GET',
      `/api/leaderboard?limit=${limit}&offset=${offset}`);
    return data;
  },

  async getMyRank() {
    const data = await this._req('GET', '/api/leaderboard/me', null, true);
    return data.me;
  },

  // ─────────────────────────────────────────────
  //  MATCH
  // ─────────────────────────────────────────────

  async recordMatch({
    opponent_username, my_color, result, end_reason,
    total_moves, duration_secs, room_code
  }) {
    const data = await this._req('POST', '/api/matches',
      { opponent_username, my_color, result, end_reason,
        total_moves, duration_secs, room_code }, true);
    return data;
  },

  async getMyMatches(limit = 20, offset = 0) {
    const data = await this._req('GET',
      `/api/matches/me?limit=${limit}&offset=${offset}`, null, true);
    return data.matches;
  },

  async getMyEloHistory(limit = 50) {
    const data = await this._req('GET',
      `/api/elo-history/me?limit=${limit}`, null, true);
    return data.history;
  },

  // ─────────────────────────────────────────────
  //  UTIL
  // ─────────────────────────────────────────────

  async healthCheck() {
    return await this._req('GET', '/api/health');
  },

  isLoggedIn() {
    return !!localStorage.getItem('chessMasterToken');
  }
};


// Override doLogin
async function doLogin() {
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  const errEl    = document.getElementById('login-err');
  errEl.textContent = '';

  if (!username) { errEl.textContent = '⚠ Masukkan username.'; return; }
  if (!password) { errEl.textContent = '⚠ Masukkan password.'; return; }

  const btn = document.getElementById('login-btn');
  btn.disabled = true; btn.textContent = '⏳ Masuk…';

  try {
    const player = await ChessAPI.login(username, password);
    loginUser(player);
  } catch(e) {
    errEl.textContent = '⚠ ' + e.message;
  } finally {
    btn.disabled = false; btn.textContent = 'Masuk →';
  }
}

// Override doSignup
async function doSignup() {
  const username = document.getElementById('signup-username').value.trim();
  const password = document.getElementById('signup-password').value;
  const bio      = document.getElementById('signup-bio').value.trim();
  const errEl    = document.getElementById('signup-err');
  errEl.textContent = '';

  if (!username || username.length < 3)
    return errEl.textContent = '⚠ Username minimal 3 karakter.';
  if (!/^[a-zA-Z0-9_]+$/.test(username))
    return errEl.textContent = '⚠ Hanya huruf, angka, underscore.';
  if (!password || password.length < 4)
    return errEl.textContent = '⚠ Password minimal 4 karakter.';

  const btn = document.getElementById('signup-btn');
  btn.disabled = true; btn.textContent = '⏳ Mendaftar…';

  try {
    // selectedAvatar adalah variabel global dari chess-script.js
    const avatar = typeof selectedAvatar !== 'undefined' ? selectedAvatar : '⚔️';
    const player = await ChessAPI.register(username, password, avatar, bio);
    loginUser(player);
  } catch(e) {
    errEl.textContent = '⚠ ' + e.message;
  } finally {
    btn.disabled = false; btn.textContent = 'Buat Akun →';
  }
}

// Override doLogout
async function doLogout() {
  await ChessAPI.logout();
  currentUser = null;
  CFG.playerName = 'Player';
  const _aiN = document.getElementById('ai-name');
  if (_aiN) _aiN.value = 'Player';
  const _onN = document.getElementById('online-name');
  if (_onN) _onN.value = 'Player';
  closeProfile();
  updateMenuProfile();
  document.getElementById('screen-menu').classList.add('hidden');
  document.getElementById('screen-auth').classList.remove('hidden');
  curScreen = 'screen-auth';
  showToast('Berhasil logout.');
}

// Override saveEditProfile
async function saveEditProfile() {
  if (!currentUser) return;
  const bio      = document.getElementById('edit-bio').value.trim();
  const newPw    = document.getElementById('edit-password').value;
  const errEl    = document.getElementById('edit-err');
  errEl.textContent = '';

  if (newPw && newPw.length < 4)
    return errEl.textContent = '⚠ Password baru minimal 4 karakter.';

  const avatar = typeof selectedEditAvatar !== 'undefined'
    ? selectedEditAvatar
    : currentUser.avatar;

  try {
    const updated = await ChessAPI.updateProfile({
      avatar, bio,
      new_password: newPw || undefined
    });
    currentUser = updated;
    openProfile();
    closeEditProfile();
    updateMenuProfile();
    showToast('✓ Profil diperbarui!');
  } catch(e) {
    errEl.textContent = '⚠ ' + e.message;
  }
}

// Override checkAutoLogin
async function checkAutoLogin() {
  if (!ChessAPI.isLoggedIn()) return;
  try {
    const player = await ChessAPI.me();
    loginUser(player);
  } catch(e) {
    localStorage.removeItem('chessMasterToken');
  }
}

// Override loadLeaderboard (menggunakan API baru)
async function loadLeaderboard() {
  const statusEl = document.getElementById('lb-status');
  const tbody    = document.getElementById('lb-body');
  statusEl.textContent = '⏳ Memuat peringkat…';
  statusEl.style.display = 'block';
  tbody.innerHTML = '';

  try {
    const { leaderboard } = await ChessAPI.getLeaderboard(100);

    if (!leaderboard.length) {
      statusEl.innerHTML = '<div style="text-align:center;padding:30px">🏁 Belum ada pemain.</div>';
      return;
    }
    statusEl.style.display = 'none';

    const myUsername = currentUser?.username?.toLowerCase() || '';

    leaderboard.forEach(p => {
      const tier = getRankTier(p.elo);
      const isMe = p.username.toLowerCase() === myUsername;

      const rankBadge =
        p.rank === 1 ? `<span class="lb-pos lb-pos-1">1</span>` :
        p.rank === 2 ? `<span class="lb-pos lb-pos-2">2</span>` :
        p.rank === 3 ? `<span class="lb-pos lb-pos-3">3</span>` :
                       `<span class="lb-pos">${p.rank}</span>`;

      const tierIcon = tier.img
        ? `<img src="${tier.img}" class="lb-tier-img" alt="${tier.name}">`
        : tier.icon;
      const tierBadge = `<span class="lb-tier" style="color:${tier.color};border-color:${tier.border};background:${tier.bg}">${tierIcon} ${p.tier}</span>`;

      const barColor = p.win_rate >= 60 ? '#4ade80' : p.win_rate >= 40 ? '#fbbf24' : '#f87171';
      const winBar = `<div class="lb-winbar"><div class="lb-winbar-fill" style="width:${p.win_rate}%;background:${barColor}"></div></div><span class="lb-winpct">${p.win_rate}%</span>`;

      const tr = document.createElement('tr');
      if (isMe) tr.className = 'lb-me';
      tr.innerHTML = `
        <td class="lb-rank-col">${rankBadge}</td>
        <td class="lb-name-col">
          <div class="lb-player-row">
            <span class="lb-name">${p.username}${isMe ? ' <span class="lb-me-tag">(kamu)</span>' : ''}</span>
            ${tierBadge}
          </div>
          <div class="lb-sub">${winBar}</div>
        </td>
        <td class="lb-elo-col">${p.elo}</td>
        <td style="text-align:center;color:#4ade80">${p.games_win}</td>
        <td style="text-align:center;color:#f87171">${p.games_loss}</td>
        <td style="text-align:center;color:var(--ivory-m)">${p.games_draw}</td>`;
      tbody.appendChild(tr);
    });
  } catch(e) {
    statusEl.innerHTML = `<div style="text-align:center;padding:20px;color:#f87171">❌ ${e.message}</div>`;
    statusEl.style.display = 'block';
  }
}

// Override handleOnlineRankUpdate — kirim ke backend PostgreSQL
async function handleOnlineRankUpdate(winnerCol) {
  if (gameMode !== 'online' || !currentUser) return;

  const myResult   = winnerCol === null ? 'draw' :
                     winnerCol === onlineColor ? 'win' : 'loss';
  const resultMap  = { win: onlineColor === 'w' ? 'white' : 'black',
                       loss: onlineColor === 'w' ? 'black' : 'white',
                       draw: 'draw' };
  const endReasons = { checkmate: 'checkmate', stalemate: 'stalemate',
                       resign: 'resign', timeout: 'timeout' };

  try {
    const res = await ChessAPI.recordMatch({
      opponent_username: onlineOpponentName,
      my_color:    onlineColor === 'w' ? 'white' : 'black',
      result:      resultMap[myResult],
      end_reason:  'checkmate',   // TODO: track actual end reason
      total_moves: moveLog.length,
      room_code:   onlineRoomCode
    });

    // Tampilkan ELO card
    const fmt = d => d > 0 ? `<span class="elo-delta up">▲+${d}</span>`
                 : d < 0 ? `<span class="elo-delta dn">▼${d}</span>`
                          : `<span class="elo-delta eq">—0</span>`;
    const card   = document.getElementById('res-elo-card');
    const rowMe  = document.getElementById('elo-row-me');
    const rowOpp = document.getElementById('elo-row-opp');
    if (card && rowMe) {
      rowMe.innerHTML = `<span class="elo-name">👑 ${currentUser.username}</span>
        <span><span class="elo-val">${res.elo_after}</span>${fmt(res.elo_delta)}</span>`;
      rowOpp.innerHTML = `<span class="elo-name">🌐 ${onlineOpponentName}</span>
        <span class="elo-val">—</span>`;
      card.style.display = 'block';
    }

    // Update currentUser ELO lokal
    if (currentUser) {
      currentUser.elo = res.elo_after;
      updateMenuProfile();
    }
  } catch(e) {
    console.warn('ELO update failed:', e.message);
  }
}

console.log('✅ Chess Master API Client loaded. Backend:', API_BASE_URL);
