// ============================================
// LANDBOT + WHATSAPP FALLBACK MANAGER
// Otomatis fallback ke form & WA jika Landbot
// gagal load, error, atau kuota habis.
// ============================================

class LandbotFallbackManager {
    constructor() {
        // ── Gmail ──
        this.GMAIL_TO      = 'anginbiru891@gmail.com';
        this.GMAIL_SUBJECT = 'Hai, Saya mau menghubungi pengembang THEARC Project';

        // ── WhatsApp ──
        this.WA_DEFAULT = 'Hai, Saya mau menghubungi pengembang THEARC Project'

        // Konfigurasi Landbot
        this.LANDBOT_SRC    = 'https://cdn.landbot.io/landbot-3/landbot-3.0.0.mjs';
        this.LANDBOT_CONFIG = 'https://storage.googleapis.com/landbot.online/v3/H-3392862-X1R7FAPKDWS26Z2T/index.json';

        // Timeout (ms) sebelum fallback ditampilkan jika widget tidak muncul
        this.WIDGET_TIMEOUT = 10000;

        this._loaded      = false;
        this._fallbackOn  = false;
        this._timer       = null;
        this._observer    = null;
    }

    // ── Entry point ──────────────────────────────────────────────
    init() {
        this._injectStyles();
        this._buildWidget();

        const trigger = () => this._tryLandbot();
        window.addEventListener('mouseover',  trigger, { once: true });
        window.addEventListener('touchstart', trigger, { once: true });
    }

    // ── Coba muat Landbot ────────────────────────────────────────
    _tryLandbot() {
        if (this._loaded) return;

        // Fallback timer: jika widget tidak muncul dalam WIDGET_TIMEOUT ms
        this._timer = setTimeout(() => {
            if (!this._loaded) {
                console.warn('[Landbot] Timeout — widget tidak terdeteksi, fallback aktif.');
                this._showFallback();
            }
        }, this.WIDGET_TIMEOUT);

        const s    = document.createElement('script');
        s.type     = 'module';
        s.async    = true;
        s.src      = this.LANDBOT_SRC;

        // Script berhasil dimuat — coba inisialisasi
        s.addEventListener('load', () => {
            try {
                const lb = new Landbot.Livechat({ configUrl: this.LANDBOT_CONFIG });
                window.myLandbot = lb;
                // Mulai mengawasi apakah widget benar-benar muncul di DOM
                this._watchForWidget();
            } catch (err) {
                console.warn('[Landbot] Inisialisasi gagal:', err);
                this._cancelTimerAndFallback();
            }
        });

        // Script gagal diunduh (network error, CDN down, dll.)
        s.addEventListener('error', () => {
            console.warn('[Landbot] Script gagal dimuat — fallback aktif.');
            this._cancelTimerAndFallback();
        });

        const ref = document.getElementsByTagName('script')[0];
        ref.parentNode.insertBefore(s, ref);
    }

    // ── MutationObserver: pantau kemunculan widget di DOM ────────
    _watchForWidget() {
        let checks = 0;
        const maxChecks = 20; // 20 × 500 ms = 10 detik

        const check = () => {
            checks++;
            const found = document.querySelector(
                '[id^="landbot"], iframe[src*="landbot"], .LandbotLivechat, [class*="Landbot"]'
            );
            if (found) {
                this._loaded = true;
                clearTimeout(this._timer);
                console.log('[Landbot] Widget terdeteksi ✓');
            } else if (checks >= maxChecks) {
                console.warn('[Landbot] Widget tidak muncul setelah inisialisasi — kemungkinan kuota habis. Fallback aktif.');
                clearTimeout(this._timer);
                this._showFallback();
            } else {
                setTimeout(check, 500);
            }
        };
        setTimeout(check, 500);
    }

    _cancelTimerAndFallback() {
        clearTimeout(this._timer);
        this._showFallback();
    }

    // ── Tampilkan tombol fallback ─────────────────────────────────
    _showFallback() {
        if (this._fallbackOn) return;
        this._fallbackOn = true;
        const btn = document.getElementById('_archten-fb-btn');
        if (btn) {
            btn.style.display = 'flex';
            requestAnimationFrame(() => {
                requestAnimationFrame(() => btn.classList.add('_fb-visible'));
            });
        }
    }

    // ── Buka / tutup modal ────────────────────────────────────────
    _openModal() {
        const m = document.getElementById('_archten-fb-modal');
        if (m) { m.style.display = 'flex'; requestAnimationFrame(() => m.classList.add('_fb-open')); }
    }
    _closeModal() {
        const m = document.getElementById('_archten-fb-modal');
        if (!m) return;
        m.classList.remove('_fb-open');
        setTimeout(() => { m.style.display = 'none'; }, 300);
    }

    // ── Kirim form via Gmail (mailto) ────────────────────────────
    _sendForm() {
        const name = (document.getElementById('_fb-name')?.value || '').trim();
        const msg  = (document.getElementById('_fb-msg')?.value  || '').trim();
        if (!name || !msg) {
            this._shake(document.querySelector('._fb-send'));
            return;
        }
        const subject = encodeURIComponent(this.GMAIL_SUBJECT);
        const body    = encodeURIComponent(`Nama: ${name}\n\n${msg}`);
        window.open(`https://mail.google.com/mail/?view=cm&to=${this.GMAIL_TO}&su=${subject}&body=${body}`, '_blank');
        this._closeModal();
    }

    _shake(el) {
        if (!el) return;
        el.classList.add('_fb-shake');
        setTimeout(() => el.classList.remove('_fb-shake'), 600);
    }

    // ── Bangun DOM widget ─────────────────────────────────────────
    _buildWidget() {
        // Floating button
        const btn = document.createElement('button');
        btn.id            = '_archten-fb-btn';
        btn.title         = 'Hubungi Kami';
        btn.setAttribute('aria-label', 'Hubungi Kami');
        btn.innerHTML     = `
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span>Hubungi</span>
        `;
        btn.onclick = () => this._openModal();
        document.body.appendChild(btn);

        // Backdrop + modal panel
        const modal = document.createElement('div');
        modal.id           = '_archten-fb-modal';
        modal.style.display = 'none';
        modal.innerHTML    = `
            <div class="_fb-panel" role="dialog" aria-modal="true" aria-label="Form Hubungi Kami">
                <div class="_fb-header">
                    <span class="_fb-logo">✦</span>
                    <h3>Hubungi Kami</h3>
                    <button class="_fb-close" aria-label="Tutup">&times;</button>
                </div>

                <div class="_fb-notice">
                    <span class="_fb-notice-icon">⚠️</span>
                    <p>Layanan live chat sedang tidak tersedia. Gunakan salah satu cara di bawah.</p>
                </div>

                <!-- Tombol WA langsung -->
                <a  href="https://wa.me/6285236995741?text=${encodeURIComponent(this.WA_DEFAULT)}"
                    target="_blank" rel="noopener noreferrer" class="_fb-wa-direct">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.121 1.532 5.852L.073 23.927l6.244-1.638A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.37l-.358-.214-3.708.972.99-3.616-.234-.372A9.818 9.818 0 012.182 12C2.182 6.568 6.568 2.182 12 2.182S21.818 6.568 21.818 12 17.432 21.818 12 21.818z"/>
                    </svg>
                    Chat via WhatsApp
                </a>

                <div class="_fb-separator"><span>atau isi form</span></div>

                <!-- Form -->
                <div class="_fb-form">
                    <label for="_fb-name">Nama</label>
                    <input  id="_fb-name" type="text" placeholder="Nama kamu..." autocomplete="name" />
                    <label for="_fb-msg">Pesan</label>
                    <textarea id="_fb-msg" placeholder="Tuliskan pesanmu di sini..." rows="3"></textarea>
                    <button class="_fb-send">Kirim via Gmail →</button>
                </div>
            </div>
        `;

        // Event listeners modal
        modal.addEventListener('click', (e) => { if (e.target === modal) this._closeModal(); });
        document.body.appendChild(modal);

        // Delegasi klik tombol di dalam modal
        modal.querySelector('._fb-close').addEventListener('click', () => this._closeModal());
        modal.querySelector('._fb-send').addEventListener('click',  () => this._sendForm());

        // Tutup dengan Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('_fb-open')) this._closeModal();
        });
    }

    // ── Inject CSS (mengikuti CSS variables ARCHTEN) ──────────────
    _injectStyles() {
        const css = `
            /* ── Floating button ── */
            #_archten-fb-btn {
                display: none;
                position: fixed;
                bottom: 28px;
                right: 28px;
                align-items: center;
                gap: 8px;
                padding: 12px 20px;
                background: var(--grad-primary, linear-gradient(135deg,#7c3aed,#06b6d4));
                color: #fff;
                border: 1px solid rgba(255,255,255,0.15);
                border-radius: 50px;
                font-family: var(--font-body, 'DM Sans', sans-serif);
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                z-index: 8800;
                box-shadow: 0 8px 32px rgba(124,58,237,0.4);
                opacity: 0;
                transform: translateY(16px) scale(0.92);
                transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
            }
            #_archten-fb-btn._fb-visible {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
            #_archten-fb-btn:hover {
                transform: translateY(-3px) scale(1.04);
                box-shadow: 0 16px 48px rgba(124,58,237,0.55);
            }
            #_archten-fb-btn:active { transform: scale(0.97); }

            /* ── Modal backdrop ── */
            #_archten-fb-modal {
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.65);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                z-index: 9800;
                align-items: flex-end;
                justify-content: flex-end;
                padding: 24px;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            #_archten-fb-modal._fb-open { opacity: 1; }

            /* ── Panel ── */
            ._fb-panel {
                background: var(--bg-elevated, #141923);
                border: 1px solid var(--border-accent, rgba(124,58,237,0.4));
                border-radius: 20px;
                width: 100%;
                max-width: 360px;
                overflow: hidden;
                box-shadow: 0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04);
                transform: translateY(24px);
                transition: transform 0.35s cubic-bezier(0.34,1.4,0.64,1);
            }
            #_archten-fb-modal._fb-open ._fb-panel { transform: translateY(0); }

            /* ── Header ── */
            ._fb-header {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 16px 20px;
                background: linear-gradient(135deg, rgba(124,58,237,0.18), rgba(6,182,212,0.08));
                border-bottom: 1px solid var(--border-subtle, rgba(255,255,255,0.06));
            }
            ._fb-logo {
                font-size: 18px;
                background: var(--grad-primary, linear-gradient(135deg,#7c3aed,#06b6d4));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                line-height: 1;
            }
            ._fb-header h3 {
                flex: 1;
                margin: 0;
                font-family: var(--font-display, 'Syne', sans-serif);
                font-size: 15px;
                font-weight: 700;
                color: var(--text-primary, #f0f4ff);
            }
            ._fb-close {
                background: none;
                border: none;
                color: var(--text-secondary, #8892a4);
                font-size: 24px;
                line-height: 1;
                cursor: pointer;
                padding: 0 2px;
                transition: color 0.2s;
            }
            ._fb-close:hover { color: var(--text-primary, #f0f4ff); }

            /* ── Notice banner ── */
            ._fb-notice {
                display: flex;
                align-items: flex-start;
                gap: 10px;
                margin: 16px 20px 0;
                padding: 10px 14px;
                background: rgba(244,63,94,0.08);
                border: 1px solid rgba(244,63,94,0.2);
                border-radius: 10px;
            }
            ._fb-notice-icon { font-size: 15px; flex-shrink: 0; margin-top: 1px; }
            ._fb-notice p {
                margin: 0;
                font-family: var(--font-body, 'DM Sans', sans-serif);
                font-size: 12px;
                color: var(--text-secondary, #8892a4);
                line-height: 1.5;
            }

            /* ── WhatsApp direct button ── */
            ._fb-wa-direct {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                margin: 16px 20px 0;
                padding: 12px 16px;
                background: linear-gradient(135deg, #25D366, #128C7E);
                color: #fff;
                border-radius: 12px;
                text-decoration: none;
                font-family: var(--font-body, 'DM Sans', sans-serif);
                font-size: 14px;
                font-weight: 600;
                box-shadow: 0 4px 20px rgba(37,211,102,0.3);
                transition: transform 0.25s ease, box-shadow 0.25s ease;
            }
            ._fb-wa-direct:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 28px rgba(37,211,102,0.5);
                color: #fff;
            }
            ._fb-wa-direct:active { transform: scale(0.98); }

            /* ── Separator ── */
            ._fb-separator {
                display: flex;
                align-items: center;
                gap: 12px;
                margin: 14px 20px;
                color: var(--text-muted, #4a5568);
                font-family: var(--font-body, 'DM Sans', sans-serif);
                font-size: 11px;
                letter-spacing: 0.05em;
                text-transform: uppercase;
            }
            ._fb-separator::before, ._fb-separator::after {
                content: '';
                flex: 1;
                height: 1px;
                background: var(--border-subtle, rgba(255,255,255,0.06));
            }

            /* ── Form ── */
            ._fb-form {
                padding: 0 20px 20px;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            ._fb-form label {
                font-family: var(--font-body, 'DM Sans', sans-serif);
                font-size: 12px;
                font-weight: 600;
                color: var(--text-secondary, #8892a4);
                letter-spacing: 0.04em;
                text-transform: uppercase;
            }
            ._fb-form input, ._fb-form textarea {
                padding: 10px 13px;
                background: rgba(255,255,255,0.04);
                border: 1px solid var(--border-default, rgba(255,255,255,0.1));
                border-radius: 10px;
                color: var(--text-primary, #f0f4ff);
                font-family: var(--font-body, 'DM Sans', sans-serif);
                font-size: 13px;
                outline: none;
                resize: none;
                transition: border-color 0.2s, background 0.2s;
            }
            ._fb-form input::placeholder, ._fb-form textarea::placeholder {
                color: var(--text-muted, #4a5568);
            }
            ._fb-form input:focus, ._fb-form textarea:focus {
                border-color: var(--accent-primary, #7c3aed);
                background: rgba(124,58,237,0.06);
            }
            ._fb-send {
                margin-top: 4px;
                padding: 12px;
                background: var(--grad-primary, linear-gradient(135deg,#7c3aed,#06b6d4));
                color: #fff;
                border: none;
                border-radius: 10px;
                font-family: var(--font-body, 'DM Sans', sans-serif);
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: opacity 0.2s, transform 0.2s;
            }
            ._fb-send:hover { opacity: 0.88; transform: translateY(-1px); }
            ._fb-send:active { transform: scale(0.98); }

            /* ── Shake animasi validasi ── */
            @keyframes _fbShake {
                0%,100% { transform: translateX(0); }
                20%      { transform: translateX(-6px); }
                40%      { transform: translateX(6px); }
                60%      { transform: translateX(-4px); }
                80%      { transform: translateX(4px); }
            }
            ._fb-shake { animation: _fbShake 0.5s ease; }

            /* ── Responsive ── */
            @media (max-width: 480px) {
                #_archten-fb-btn { bottom: 16px; right: 16px; padding: 11px 16px; }
                #_archten-fb-modal { padding: 0; align-items: flex-end; justify-content: stretch; }
                ._fb-panel { max-width: 100%; border-radius: 20px 20px 0 0; }
            }
        `;
        const style = document.createElement('style');
        style.id = '_archten-fb-styles';
        style.textContent = css;
        document.head.appendChild(style);
    }
}

// ── Inisialisasi Landbot + Fallback ──────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    window.archtenFallback = new LandbotFallbackManager();
    window.archtenFallback.init();
});