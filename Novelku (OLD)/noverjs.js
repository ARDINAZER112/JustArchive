        /**
         * KONFIGURASI SUPABASE
         */
        const SUPABASE_URL = 'https://syrxhvrzbgqieidhvjqw.supabase.co'; 
        const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5cnhodnJ6YmdxaWVpZGh2anF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMTA1MTYsImV4cCI6MjA5MDY4NjUxNn0.jVyJJ6LsIVLtrQwkmaeEtedJCj1IM8kpoTGe_afBUhE'; 
        
        let _supabase = null;
        let isConfigured = false;
        let authMode = 'login'; 

        function initSupabase() {
            if (SUPABASE_URL.includes('PROJECT_ID') || SUPABASE_KEY.includes('YOUR_ANON_KEY')) {
                updateDBStatus('bg-red-500', 'Supabase: Harap isi API Key di kode!', false);
                return false;
            }
            try {
                _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
                updateDBStatus('bg-green-500', 'Supabase PostgreSQL: Connected (Live)', false);
                isConfigured = true;
                return true;
            } catch (e) {
                updateDBStatus('bg-red-500', 'Supabase: Error Koneksi Jaringan', false);
                return false;
            }
        }

        function updateDBStatus(colorClass, text, pulse) {
            const indicator = document.getElementById('status-indicator');
            const statusText = document.getElementById('status-text');
            if(indicator) indicator.className = `w-2 h-2 rounded-full ${colorClass} ${pulse ? 'animate-pulse' : ''}`;
            if(statusText) statusText.innerText = text;
        }

        let currentUser = null;
        let novels = [];

        // Helper untuk kompresi gambar menggunakan Canvas
        async function compressImage(file) {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = (event) => {
                    const img = new Image();
                    img.src = event.target.result;
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        const MAX_WIDTH = 200; // Ukuran profil kecil saja agar ringan
                        const MAX_HEIGHT = 200;
                        let width = img.width;
                        let height = img.height;

                        if (width > height) {
                            if (width > MAX_WIDTH) {
                                height *= MAX_WIDTH / width;
                                width = MAX_WIDTH;
                            }
                        } else {
                            if (height > MAX_HEIGHT) {
                                width *= MAX_HEIGHT / height;
                                height = MAX_HEIGHT;
                            }
                        }

                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);
                        
                        // Output as base64 string dengan kualitas 0.7 (kompresi 70%)
                        resolve(canvas.toDataURL('image/jpeg', 0.7));
                    };
                };
            });
        }

        async function handleAvatarUpload(event) {
            const file = event.target.files;
            if (!file) return;

            try {
                const compressedBase64 = await compressImage(file);
                
                // Update metadata pengguna di Supabase
                const { data, error } = await _supabase.auth.updateUser({
                    data: { avatar_url: compressedBase64 }
                });

                if (error) throw error;
                
                currentUser = data.user;
                renderNav();
                alert("Foto profil berhasil diperbarui!");
            } catch (e) {
                alert("Gagal mengunggah foto: " + e.message);
            }
        }

        const views = {
            home: () => `
                <div class="mb-12">
                    <h1 class="text-4xl font-black text-slate-900 tracking-tight mb-2">Novel<span class="gradient-text">Ku</span></h1>
                    <p class="text-slate-500">Jelajahi karya yang ada di sini</p>
                </div>
                ${!isConfigured ? `
                    <div class="bg-amber-50 border border-amber-200 p-8 rounded-3xl text-center">
                        <p class="text-amber-800 font-bold">Koneksi Server masih Belum Siap</p>
                        <p class="text-amber-600 text-sm mt-2"></p>
                    </div>
                ` : `
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        ${novels.length === 0 ? '<p class="col-span-full text-center text-slate-400 py-10">Belum ada naskah di database.</p>' : ''}
                        ${novels.map(n => `
                            <div class="bg-white rounded-[32px] border border-slate-100 p-5 shadow-sm hover:shadow-xl transition-all cursor-pointer" onclick="openNovel('${n.id}')">
                                <div class="aspect-[4/5] bg-slate-50 rounded-[24px] mb-4 flex items-center justify-center overflow-hidden relative">
                                    <svg class="text-slate-200" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/></svg>
                                    <div class="absolute bottom-3 left-3 flex items-center gap-1 bg-white/80 backdrop-blur px-2 py-1 rounded-lg">
                                        ${n.author_avatar ? `<img src="${n.author_avatar}" class="w-3 h-3 rounded-full object-cover">` : '<div class="w-3 h-3 rounded-full bg-slate-300"></div>'}
                                        <span class="text-[8px] font-bold text-slate-600 truncate max-w-[60px]">${n.author}</span>
                                    </div>
                                </div>
                                <h3 class="font-bold text-slate-900 line-clamp-1">${n.title}</h3>
                                <p class="text-xs text-slate-400 font-semibold mb-4">Genre: ${n.category}</p>
                                <span class="text-[9px] font-black uppercase bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">BACA SEKARANG</span>
                            </div>
                        `).join('')}
                        ${currentUser ? `
                            <div onclick="showView('upload')" class="border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center text-slate-400 hover:bg-indigo-50 cursor-pointer min-h-[300px] transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
                                <span class="font-bold mt-2 text-sm uppercase tracking-widest">Tulis Cerita</span>
                            </div>
                        ` : ''}
                    </div>
                `}
            `,
            auth: () => `
                <div class="max-w-md mx-auto bg-white p-10 rounded-[40px] shadow-2xl border">
                    <h2 class="text-2xl font-black text-center mb-2 text-slate-900">${authMode === 'login' ? 'Selamat Datang Kembali' : 'Buat Akun Baru'}</h2>
                    <p class="text-center text-slate-400 text-sm mb-8">${authMode === 'login' ? 'Masuk ke perpustakaan digital Anda.' : 'Mulai perjalanan menulis Anda hari ini.'}</p>
                    
                    <div class="space-y-4">
                        ${authMode === 'register' ? `
                            <input id="auth-username" type="text" placeholder="Username" class="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-indigo-500 font-semibold transition-all">
                            <input id="auth-nickname" type="text" placeholder="Nama Pena / Nickname" class="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-indigo-500 font-semibold transition-all">
                        ` : ''}
                        <input id="auth-email" type="email" placeholder="Email" class="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-indigo-500 font-semibold transition-all">
                        <input id="auth-pass" type="password" placeholder="Password" class="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-indigo-500 font-semibold transition-all">
                        
                        <button id="btn-auth" onclick="${authMode === 'login' ? 'handleLogin()' : 'handleSignUp()'}" class="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition-all active:scale-95">
                            ${authMode === 'login' ? 'Masuk Sekarang' : 'Daftar Akun'}
                        </button>
                        
                        <div class="text-center mt-6">
                            <button onclick="toggleAuthMode()" class="text-xs font-bold text-indigo-600 hover:underline">
                                ${authMode === 'login' ? 'Belum punya akun? Daftar di sini' : 'Sudah punya akun? Masuk di sini'}
                            </button>
                        </div>
                    </div>
                </div>
            `,
            upload: () => `
                <div class="max-w-2xl mx-auto bg-white p-10 rounded-[40px] shadow-2xl border">
                    <h2 class="text-2xl font-black mb-8 text-slate-900 tracking-tight">Terbitkan <span class="text-indigo-600">Naskah</span></h2>
                    <div class="space-y-4">
                        <input id="up-title" type="text" placeholder="Judul Novel" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-lg">
                        <select id="up-cat" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold">
                            <option>Fantasi</option><option>Misteri</option><option>Romansa</option><option>Drama</option>
                        </select>
                        <textarea id="up-content" rows="8" placeholder="Tuliskan cerita Anda di sini..." class="w-full p-6 bg-slate-50 border border-slate-200 rounded-[32px] outline-none leading-relaxed"></textarea>
                        <button id="btn-upload" onclick="handleUpload()" class="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-xl hover:bg-indigo-700 transition-all">Simpan ke PostgreSQL</button>
                    </div>
                </div>
            `
        };

        async function fetchNovels() {
            if (!isConfigured) return showView('home');
            try {
                // Pastikan tabel memiliki kolom author_avatar (TEXT) untuk menyimpan profil penulis pada saat diposting
                const { data, error } = await _supabase.from('novels').select('*').order('created_at', { ascending: false });
                if (error) throw error;
                novels = data || [];
                showView('home');
            } catch (e) {
                updateDBStatus('bg-red-500', 'Supabase: Gagal mengambil data', false);
                showView('home');
            }
        }

        function toggleAuthMode() {
            authMode = authMode === 'login' ? 'register' : 'login';
            showView('auth');
        }

        async function handleSignUp() {
            const btn = document.getElementById('btn-auth');
            const email = document.getElementById('auth-email').value;
            const password = document.getElementById('auth-pass').value;
            const username = document.getElementById('auth-username')?.value;
            const nickname = document.getElementById('auth-nickname')?.value;

            if (!email || password.length < 6 || !username || !nickname) {
                return alert("Harap lengkapi semua data pendaftaran.");
            }

            btn.disabled = true;
            btn.innerText = "Mendaftarkan...";

            try {
                const { data, error } = await _supabase.auth.signUp({ 
                    email, password,
                    options: { data: { username, nickname, avatar_url: null } }
                });
                if (error) throw error;
                
                if (data.user && data.session === null) {
                    alert("Cek email konfirmasi Anda!");
                    authMode = 'login';
                    showView('auth');
                } else if (data.user) {
                    currentUser = data.user;
                    renderNav();
                    fetchNovels();
                }
            } catch (e) {
                alert("Gagal Daftar: " + e.message);
            } finally {
                btn.disabled = false;
                btn.innerText = "Daftar Akun";
            }
        }

        async function handleLogin() {
            const btn = document.getElementById('btn-auth');
            const email = document.getElementById('auth-email').value;
            const password = document.getElementById('auth-pass').value;

            if (!email || !password) return alert("Isi email dan password.");

            btn.disabled = true;
            btn.innerText = "Memverifikasi...";

            try {
                const { data, error } = await _supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                currentUser = data.user;
                renderNav();
                fetchNovels();
            } catch (e) {
                alert("Login Gagal: " + e.message);
            } finally {
                btn.disabled = false;
                btn.innerText = "Masuk";
            }
        }

        async function handleUpload() {
            const btn = document.getElementById('btn-upload');
            const title = document.getElementById('up-title').value;
            const category = document.getElementById('up-cat').value;
            const content = document.getElementById('up-content').value;

            if (!currentUser) return alert("Login kembali.");
            if (!title || !content) return alert("Isi judul dan konten.");

            btn.disabled = true;
            btn.innerText = "Menyimpan...";

            try {
                const meta = currentUser.user_metadata || {};
                const authorName = meta.nickname || meta.username || currentUser.email.split('@');
                const authorAvatar = meta.avatar_url || null;

                const { error } = await _supabase.from('novels').insert([
                    { 
                        title, category, content, 
                        author: authorName,
                        author_id: currentUser.id,
                        author_avatar: authorAvatar 
                    }
                ]);
                if (error) throw error;
                
                alert("Karya berhasil diterbitkan!");
                fetchNovels();
            } catch (e) {
                alert("Gagal simpan: " + e.message + ". Pastikan kolom author_avatar tersedia di tabel.");
            } finally {
                btn.disabled = false;
                btn.innerText = "Simpan ke PostgreSQL";
            }
        }

        function renderNav() {
            const container = document.getElementById('nav-actions');
            if (currentUser) {
                const meta = currentUser.user_metadata || {};
                const displayName = meta.nickname || meta.username || currentUser.email.split('@');
                const avatar = meta.avatar_url;

                container.innerHTML = `
                    <div class="flex items-center gap-4">
                        <div class="text-right hidden sm:block">
                            <p class="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none mb-1">Pena Aktif</p>
                            <p class="text-xs font-bold text-slate-900 truncate max-w-[120px]">${displayName}</p>
                        </div>
                        <div onclick="document.getElementById('avatar-input').click()" class="relative group cursor-pointer">
                            <div class="w-10 h-10 rounded-full profile-ring p-0.5 transition-transform group-hover:scale-105">
                                ${avatar ? 
                                    `<img src="${avatar}" class="w-full h-full rounded-full object-cover">` : 
                                    `<div class="w-full h-full rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
                                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                                    </div>`
                                }
                            </div>
                            <div class="absolute -bottom-1 -right-1 bg-white border shadow-sm p-1 rounded-full text-indigo-600">
                                <svg width="8" height="8" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
                            </div>
                        </div>
                        <button onclick="handleLogout()" class="bg-slate-100 text-slate-600 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight hover:bg-red-50 hover:text-red-600 transition-all">Keluar</button>
                    </div>
                `;
            } else {
                container.innerHTML = `
                    <button onclick="showView('auth')" class="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-600 transition-all shadow-md">Masuk / Daftar</button>
                `;
            }
        }

        async function handleLogout() {
            await _supabase.auth.signOut();
            currentUser = null;
            renderNav();
            fetchNovels();
        }

        function showView(name) {
            const container = document.getElementById('app-view');
            container.innerHTML = views[name]();
        }

        function openNovel(id) {
            const n = novels.find(x => String(x.id) === String(id));
            if (!n) return;
            
            const readerAvatar = document.getElementById('reader-avatar');
            if (n.author_avatar) {
                readerAvatar.src = n.author_avatar;
                readerAvatar.classList.remove('hidden');
            } else {
                readerAvatar.classList.add('hidden');
            }

            document.getElementById('reader-title').innerText = n.title;
            document.getElementById('reader-author').innerText = `Karya ${n.author}`;
            document.getElementById('reader-content').innerText = n.content;
            document.getElementById('reader-view').classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }

        function closeReader() {
            document.getElementById('reader-view').classList.add('hidden');
            document.body.style.overflow = 'auto';
        }

        window.onload = async () => {
            if (initSupabase()) {
                const { data } = await _supabase.auth.getSession();
                currentUser = data?.session?.user || null;
                renderNav();
                fetchNovels();
            } else {
                renderNav();
                showView('home');
            }
        };
