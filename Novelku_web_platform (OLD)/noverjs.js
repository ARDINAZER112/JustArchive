/**
 * NOVELKU CORE ENGINE - REFINED VERSION
 */

const NOVEL_URL = 'https://bqplhvnkigosfeodcjoy.supabase.co'; 
const NOVEL_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxcGxodm5raWdvc2Zlb2Rjam95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNjI5MzgsImV4cCI6MjA5MjkzODkzOH0.maYEJAZqccHbfrBKbk_INXb3cD9cMdNvae3ngKcVXDI'; 

let _supabase = null;
let isConfigured = false;
let authMode = 'login'; 
let currentUser = null;
let novels = [];
let quill = null;

// --- UTILITIES ---
function escapeHTML(str) {
    if (!str) return "";
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function showToast(msg, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    const color = type === 'success' ? 'bg-indigo-600' : 'bg-red-500';
    toast.className = `${color} text-white px-6 py-3 rounded-2xl shadow-lg font-bold text-sm transform translate-y-10 opacity-0 transition-all duration-300 flex items-center gap-3`;
    toast.innerHTML = `<span>${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => { toast.classList.remove('translate-y-10', 'opacity-0'); }, 10);
    setTimeout(() => { 
        toast.classList.add('opacity-0'); 
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// --- INITIALIZATION ---
function initSupabase() {
    try {
        _supabase = supabase.createClient(NOVEL_URL, NOVEL_KEY);
        isConfigured = true;
        return true;
    } catch (e) {
        console.error("Supabase Init Error:", e);
        return false;
    }
}

// --- VIEWS ---
const views = {
home: () => `
        <div class="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
                <h1 class="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-3 md:mb-4">Temukan <span class="gradient-text">Inspirasimu</span></h1>
                <p class="text-slate-500 text-base md:text-lg font-medium">Platform kreatif untuk para penulis dan pembaca masa kini.</p>
            </div>
            ${currentUser ? `
            <button onclick="showView('upload')" class="w-full md:w-auto justify-center bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-xl hover:shadow-indigo-200 transition-all flex items-center gap-2">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
                Mulai Menulis
            </button>` : ''}
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            ${novels.length === 0 ? '<div class="col-span-full py-16 md:py-20 text-center bg-white rounded-[30px] md:rounded-[40px] border-2 border-dashed border-slate-200 text-slate-400 font-bold">Belum ada karya yang diterbitkan.</div>' : ''}
            ${novels.map(n => `
                <div class="group relative bg-white rounded-[30px] md:rounded-[40px] border border-slate-100 p-5 md:p-6 shadow-sm hover:shadow-2xl hover:shadow-indigo-100 hover:-translate-y-2 transition-all cursor-pointer" onclick="openNovel('${n.id}')">
                    
                    ${currentUser && currentUser.id === n.author_id ? `
                    <button onclick="event.stopPropagation(); handleDeleteNovel('${n.id}')" class="absolute top-8 right-8 z-20 w-9 h-9 bg-white/90 backdrop-blur-md text-red-500 rounded-2xl flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition-all transform hover:scale-110">
                        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>
                    </button>
                    ` : ''}

                    <div class="aspect-[3/4] bg-slate-50 rounded-[24px] md:rounded-[32px] mb-5 md:mb-6 flex items-center justify-center overflow-hidden relative border border-slate-50">
${n.cover_url ? `<img src="${n.cover_url}" class="w-full h-full object-cover">` : `<svg class="text-indigo-100 group-hover:scale-125 transition-transform duration-500" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/></svg>`}
                        <div class="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-2 rounded-2xl">
                            ${n.author_avatar ? `<img src="${n.author_avatar}" class="w-5 h-5 rounded-full object-cover">` : '<div class="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] text-indigo-400 font-bold">?</div>'}
                            <span class="text-[10px] font-black text-slate-700 truncate">${escapeHTML(n.author)}</span>
                        </div>
                    </div>
                    <h3 class="font-extrabold text-slate-900 text-lg mb-1 line-clamp-1">${escapeHTML(n.title)}</h3>
                    <div class="flex items-center gap-2 mb-4 md:mb-5">
                        <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                        <p class="text-[10px] md:text-[11px] text-slate-400 font-black uppercase tracking-wider">${escapeHTML(n.category)}</p>
                    ${n.status === 'draft' ? `
    <div class="absolute top-4 left-4 z-20 bg-amber-500 text-white text-[9px] font-black px-3 py-1 rounded-full shadow-lg">DRAFT</div>` : ''}
                    </div>
                    <button class="w-full py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest group-hover:bg-indigo-600 transition-colors">BACA KARYA</button>
                </div>
            `).join('')}
        </div>
    `,
    auth: () => `
        <div class="max-w-md mx-auto w-full bg-white p-8 sm:p-12 rounded-[40px] sm:rounded-[50px] shadow-2xl border border-slate-50">
            <h2 class="text-2xl sm:text-3xl font-black text-center mb-2 text-slate-900 tracking-tight">${authMode === 'login' ? 'Selamat Datang' : 'Buat Akun'}</h2>
            <p class="text-center text-slate-400 text-xs sm:text-sm mb-8 sm:mb-10">${authMode === 'login' ? 'Masuk untuk mengelola perpustakaanmu.' : 'Daftar dan mulai terbitkan karyamu.'}</p>
            
            <div class="space-y-3 sm:space-y-4">
                ${authMode === 'register' ? `
                    <input id="auth-username" type="text" placeholder="Username" class="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold transition-all text-sm sm:text-base">
                    <input id="auth-nickname" type="text" placeholder="Nama Pena" class="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold transition-all text-sm sm:text-base">
                ` : ''}
                <input id="auth-email" type="email" placeholder="Alamat Email" class="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold transition-all text-sm sm:text-base">
                <input id="auth-pass" type="password" placeholder="Kata Sandi" class="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold transition-all text-sm sm:text-base">
                
                <button id="btn-auth" onclick="${authMode === 'login' ? 'handleLogin()' : 'handleSignUp()'}" class="w-full py-4 sm:py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 mt-4 sm:mt-6 text-sm">
                    ${authMode === 'login' ? 'MASUK SEKARANG' : 'DAFTAR AKUN'}
                </button>
                
                <div class="text-center mt-6 sm:mt-8 flex flex-col gap-3">
                    <button onclick="toggleAuthMode()" class="text-[10px] sm:text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">
                        ${authMode === 'login' ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
                    </button>
                    ${authMode === 'login' ? `
                    <button onclick="authMode = 'login'; showView('forgot')" class="text-[10px] sm:text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors">
                        Lupa Kata Sandi?
                    </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `,
    forgot: () => `
        <div class="max-w-md mx-auto w-full bg-white p-8 sm:p-12 rounded-[40px] sm:rounded-[50px] shadow-2xl border border-slate-50 relative">
            <button onclick="showView('auth')" class="absolute top-6 left-6 sm:top-8 sm:left-8 w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-2xl transition-all hover:bg-indigo-50">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <h2 class="text-2xl sm:text-3xl font-black text-center mb-2 mt-8 sm:mt-4 text-slate-900 tracking-tight">Lupa Sandi?</h2>
            <p class="text-center text-slate-400 text-xs sm:text-sm mb-8 sm:mb-10 leading-relaxed">Masukkan alamat email yang terdaftar. Kami akan mengirimkan tautan untuk mengatur ulang kata sandi kamu.</p>
            
            <div class="space-y-4">
                <input id="forgot-email" type="email" placeholder="Alamat Email" class="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold transition-all text-sm sm:text-base">
                
                <button id="btn-forgot" onclick="handleForgotPassword()" class="w-full py-4 sm:py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 mt-4 sm:mt-6 text-sm">
                    KIRIM TAUTAN RESET
                </button>
            </div>
        </div>
    `,
upload: () => `
    <div class="max-w-6xl mx-auto">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h2 class="text-3xl font-black text-slate-900 tracking-tighter">Terbitkan <span class="text-indigo-600">Naskah</span></h2>
            
            <div class="flex items-center gap-3">
                <button id="btn-draft" onclick="handleSaveDraft()" class="px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all text-sm">SIMPAN DRAFT</button>
                <button id="btn-upload" onclick="handleUpload()" class="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl hover:bg-indigo-700 transition-all text-sm">DITERBITKAN</button>
            </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="space-y-6">
                <div onclick="document.getElementById('poster-input').click()" class="group relative aspect-[3/4] bg-white rounded-[40px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/30 transition-all overflow-hidden">
                    <img id="poster-preview" class="absolute inset-0 w-full h-full object-cover hidden">
                    <div id="poster-placeholder" class="text-center p-6">
                        <div class="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
                        </div>
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tambah Poster Karya</p>
                    </div>
                </div>

                <div class="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 space-y-5">
                    <div>
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Judul Karya</label>
                        <input id="up-title" type="text" placeholder="Tulis judul..." class="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold">
                    </div>
                    
                    <div>
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Kategori / Genre</label>
                        <select id="up-cat" class="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold appearance-none">
                            <option>Fantasi</option><option>Misteri</option><option>Romansa</option><option>Drama</option><option>Horor</option>
                        </select>
                    </div>

                    <div>
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Impor Naskah (.pdf, .docx, .txt)</label>
                        <button onclick="document.getElementById('file-importer').click()" class="w-full p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center gap-2 text-indigo-600 font-bold hover:bg-indigo-100 transition-all group">
                            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" class="group-hover:-translate-y-1 transition-transform"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                            Pilih File Naskah
                        </button>
                        <input type="file" id="file-importer" accept=".txt,.docx,.pdf" onchange="extractContentFromFile(event)" class="hidden">
                        <p class="text-[9px] text-slate-400 mt-3 text-center leading-relaxed">Isi file akan otomatis muncul di editor di bawah ini.</p>
                    </div>
                </div>
            </div>

            <div class="lg:col-span-2">
                <div class="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
                    <div id="novel-editor" class="min-h-[550px] p-6"></div>
                </div>
            </div>
        </div>
    </div>
`
};

// --- CORE LOGIC ---
async function fetchNovels() {
    if (!isConfigured) return;
    try {
        const { data, error } = await _supabase.from('novels').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        novels = data || [];
        showView('home');
    } catch (e) {
        showToast("Gagal mengambil data naskah", "error");
    }
}

function showView(name) {
    const container = document.getElementById('app-view');
    container.innerHTML = views[name]();
    window.scrollTo(0, 0);

    if (name === 'upload') {
        quill = new Quill('#novel-editor', {
            theme: 'snow',
            modules: { toolbar: true },
            placeholder: 'Tuliskan ceritamu di sini...'
        });
    }
}

// --- FILE EXTRACTION ---
async function extractContentFromFile(event) {
    const file = event.target.files; 
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    showToast("Mengekstrak naskah...");

    try {
        let content = "";
        if (ext === 'docx') {
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({ arrayBuffer });
            content = result.value;
        } else if (ext === 'pdf') {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const text = await page.getTextContent();
                content += text.items.map(s => s.str).join(' ') + '\n';
            }
        } else {
            content = await file.text();
        }
        
        if (quill) {
            quill.setText(content);
            showToast("Naskah berhasil diimpor ke editor!");
        }
    } catch (e) {
        showToast("Gagal membaca file: " + e.message, "error");
    } finally {
        event.target.value = ''; 
    }
}

// --- ACTIONS ---
let selectedPosterFile = null;

function handlePosterPreview(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validasi
    if (file.size > 5 * 1024 * 1024) return showToast("File terlalu besar (Maks 5MB)", "error");
    
    selectedPosterFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = document.getElementById('poster-preview');
        img.src = e.target.result;
        img.classList.remove('hidden');
        document.getElementById('poster-placeholder').classList.add('opacity-0');
    };
    reader.readAsDataURL(file);
}

async function handleUpload() {
    const title = document.getElementById('up-title').value;
    const category = document.getElementById('up-cat').value;
    const content = quill ? quill.root.innerHTML : "";

    if (!title || !content || content === '<p><br></p>') return showToast("Lengkapi naskah!", "error");

    const btn = document.getElementById('btn-upload');
    btn.disabled = true;
    btn.innerText = "PROSES...";

    try {
        let coverUrl = null;
        if (selectedPosterFile) {
            const fileExt = selectedPosterFile.name.split('.').pop();
            const filePath = `cover-${Date.now()}.${fileExt}`;
            const { data: uploadData, error: uploadError } = await _supabase.storage.from('covers').upload(filePath, selectedPosterFile);
            if (uploadError) throw uploadError;
            coverUrl = _supabase.storage.from('covers').getPublicUrl(filePath).data.publicUrl;
        }

        const { data: { user } } = await _supabase.auth.getUser();
        const meta = user.user_metadata || {};
        const authorName = meta.nickname || meta.username || user.email.split('@')[0];
        const authorAvatar = meta.avatar_url || null;

        const { error } = await _supabase.from('novels').insert([{
            title, category, content, cover_url: coverUrl,
            author: authorName,
            author_id: user.id,
            author_avatar: authorAvatar 
        }]);

        if (error) throw error;
        showToast("Karya berhasil terbit!");
        selectedPosterFile = null;
        fetchNovels();
    } catch (e) {
        showToast("Gagal: " + e.message, "error");
    } finally {
        btn.disabled = false;
        btn.innerText = "DITERBITKAN";
    }
}

// --- FUNGSI SIMPAN DRAFT ---
async function handleSaveDraft() {
    const title = document.getElementById('up-title').value;
    const category = document.getElementById('up-cat').value;
    const content = quill ? quill.root.innerHTML : "";

    if (!title) return showToast("Berikan judul untuk draft kamu!", "error");

    const btn = document.getElementById('btn-draft');
    btn.disabled = true;
    btn.innerText = "MENYIMPAN...";

    try {
        let coverUrl = null;
        if (selectedPosterFile) {
            const fileExt = selectedPosterFile.name.split('.').pop();
            const filePath = `cover-${Date.now()}.${fileExt}`;
            await _supabase.storage.from('covers').upload(filePath, selectedPosterFile);
            coverUrl = _supabase.storage.from('covers').getPublicUrl(filePath).data.publicUrl;
        }

        const { data: { user } } = await _supabase.auth.getUser();
        const meta = user.user_metadata || {};

        const { error } = await _supabase.from('novels').insert([{
            title, category, content, 
            cover_url: coverUrl,
            status: 'draft', 
            author: meta.nickname || meta.username || user.email.split('@'),
            author_id: user.id,
            author_avatar: meta.avatar_url || null
        }]);

        if (error) throw error;
        showToast("Draft berhasil disimpan!");
        selectedPosterFile = null;
        fetchNovels(); 
    } catch (e) {
        showToast("Gagal simpan draft: " + e.message, "error");
    } finally {
        btn.disabled = false;
        btn.innerText = "SIMPAN DRAFT";
    }
}

async function handleLogin() {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-pass').value;
    if (!email || !password) return showToast("Isi semua kolom!", "error");

    try {
        const { data, error } = await _supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        currentUser = data.user;
        renderNav();
        fetchNovels();
        showToast(`Selamat datang kembali!`);
    } catch (e) {
        showToast("Login gagal. " + e.message, "error");
    }
}

async function handleSignUp() {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-pass').value;
    const username = document.getElementById('auth-username').value;
    const nickname = document.getElementById('auth-nickname').value;

    if (!email || !password || !username || !nickname) return showToast("Lengkapi data!", "error");

    try {
        const { error } = await _supabase.auth.signUp({
            email, password,
            options: { data: { username, nickname } }
        });
        if (error) throw error;
        showToast("Cek email untuk verifikasi!");
        authMode = 'login';
        showView('auth');
    } catch (e) {
        showToast(e.message, "error");
    }
}

async function handleForgotPassword() {
    const email = document.getElementById('forgot-email').value;
    if (!email) return showToast("Masukkan alamat email kamu!", "error");

    const btn = document.getElementById('btn-forgot');
    btn.disabled = true;
    btn.innerText = "MENGIRIM...";

    try {
        const { error } = await _supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'https://www.luxinesid.my.id/menu/novel/novelku/reset-password.html',
        });
        
        if (error) throw error;
        
        showToast("Tautan reset kata sandi telah dikirim ke email!");
        document.getElementById('forgot-email').value = ""; 
        showView('auth'); 
    } catch (e) {
        showToast("Gagal: " + e.message, "error");
    } finally {
        if(btn) {
            btn.disabled = false;
            btn.innerText = "KIRIM TAUTAN RESET";
        }
    }
}

async function handleAvatarUpload(event) {
    const file = event.target.files;
    if (!file || !currentUser) return;
    
    // --- VALIDASI FILE ---
    const maxSize = 5 * 1024 * 1024; 
    if (file.size > maxSize) {
        showToast("Gagal: Ukuran foto terlalu besar! Maksimal 5MB.", "error");
        event.target.value = ''; 
        return;
    }

    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
    const fileExt = file.name.split('.').pop().toLowerCase();
    const allowedExts = ['png', 'jpg', 'jpeg', 'webp'];

    if (!allowedTypes.includes(file.type) && !allowedExts.includes(fileExt)) {
        showToast("Gagal: Format foto tidak didukung! Gunakan PNG, WEBP, JPG/JPEG.", "error");
        event.target.value = '';
        return;
    }
    
    showToast("Mengunggah foto profil...");
    try {
        const fileExt = file.name.split('.').pop();
        const filePath = `${currentUser.id}-${Math.random()}.${fileExt}`;

        const { error: uploadError } = await _supabase.storage.from('avatars').upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data } = _supabase.storage.from('avatars').getPublicUrl(filePath);
        const avatarUrl = data.publicUrl;

        const { error: updateError } = await _supabase.auth.updateUser({
            data: { avatar_url: avatarUrl }
        });
        if (updateError) throw updateError;

        currentUser.user_metadata.avatar_url = avatarUrl;
        renderNav();
        showToast("Foto profil berhasil diperbarui!");
    } catch (e) {
        showToast("Gagal mengunggah foto. Pastikan koneksi stabil.", "error");
        console.error(e);
    } finally {
        event.target.value = ''; 
    }
}

async function handleDeleteNovel(id) {
    const isConfirmed = confirm("Apakah kamu yakin ingin menghapus karya ini? Tindakan ini tidak dapat dibatalkan.");
    if (!isConfirmed) return;

    showToast("Menghapus karya...");

    try {
        const { error } = await _supabase
            .from('novels')
            .delete()
            .eq('id', id);

        if (error) throw error;
        
        showToast("Karya berhasil dihapus!");
        // Refresh daftar novel setelah berhasil dihapus
        fetchNovels(); 
    } catch (e) {
        showToast("Gagal menghapus karya: " + e.message, "error");
    }
}

function openNovel(id) {
    const n = novels.find(x => String(x.id) === String(id));
    if (!n) return;

    document.getElementById('reader-title').innerText = n.title;
    document.getElementById('reader-author').innerText = `Karya ${n.author}`;
    
    const cleanContent = DOMPurify.sanitize(n.content);
    document.getElementById('reader-content').innerHTML = cleanContent;

    const ravatar = document.getElementById('reader-avatar');
    if (n.author_avatar) {
        ravatar.src = n.author_avatar;
        ravatar.classList.remove('hidden');
    } else {
        ravatar.classList.add('hidden');
    }

    document.getElementById('reader-view').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeReader() {
    document.getElementById('reader-view').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function renderNav() {
    const container = document.getElementById('nav-actions');
    if (currentUser) {
        const meta = currentUser.user_metadata || {};
        const name = meta.nickname || meta.username || "Penulis";
container.innerHTML = `
    <div class="flex items-center gap-4">
        <div class="text-right hidden sm:block">
            <p class="text-[9px] font-black text-indigo-600 uppercase tracking-widest leading-none mb-1">Pena Aktif</p>
            <p class="text-xs font-extrabold text-slate-900">${escapeHTML(name)}</p>
        </div>
        
        <div title="Klik untuk ubah foto (Maks 5MB, Format: PNG, WEBP,JPEG,JPG)" onclick="document.getElementById('avatar-input').click()" class="w-11 h-11 rounded-2xl profile-ring p-0.5 cursor-pointer shadow-lg transition-transform hover:scale-105 overflow-hidden bg-slate-100 relative group">
            ${meta.avatar_url ? `<img src="${meta.avatar_url}" class="w-full h-full rounded-[14px] object-cover">` : '<div class="w-full h-full flex items-center justify-center text-indigo-300 font-bold">U</div>'}
        </div>
        
        <button onclick="handleLogout()" title="Keluar" class="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-400 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
        </button>
    </div>
`;
    } else {
        container.innerHTML = `<button onclick="showView('auth')" class="bg-slate-900 text-white px-8 py-3 rounded-2xl text-xs font-black tracking-widest hover:bg-indigo-600 transition-all shadow-xl">MASUK / DAFTAR</button>`;
    }
}

async function handleLogout() {
    await _supabase.auth.signOut();
    currentUser = null;
    renderNav();
    fetchNovels();
}

function toggleAuthMode() {
    authMode = authMode === 'login' ? 'register' : 'login';
    showView('auth');
}

// --- APP START ---
window.onload = async () => {
    if (initSupabase()) {
        const { data } = await _supabase.auth.getSession();
        currentUser = data?.session?.user || null;
        renderNav();
        fetchNovels();
    }
};