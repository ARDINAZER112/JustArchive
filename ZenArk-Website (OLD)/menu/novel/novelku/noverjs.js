/**
 * NOVELKU CORE ENGINE - BUG FREE & OAUTH READY
 */

const NOVEL_URL = 'https://bqplhvnkigosfeodcjoy.supabase.co'; 
const NOVEL_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxcGxodm5raWdvc2Zlb2Rjam95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNjI5MzgsImV4cCI6MjA5MjkzODkzOH0.maYEJAZqccHbfrBKbk_INXb3cD9cMdNvae3ngKcVXDI'; 

let _supabase = null;
let isConfigured = false;
let authMode = 'login'; 
let currentUser = null;
let novels = [];
let quill = null;
let editingNovelId = null; // State untuk melacak novel yang sedang diedit

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

// --- THEME ENGINE ---
function toggleTheme() {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        localStorage.setItem('novelku-theme', 'light');
    } else {
        html.classList.add('dark');
        localStorage.setItem('novelku-theme', 'dark');
    }
    renderNav(); 
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
        <div class="mb-8 md:mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div class="w-full md:w-auto flex-1 animate-fade-in-up">
                <h1 class="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-3">Temukan <span class="gradient-text">Inspirasimu</span></h1>
                <p class="text-slate-500 dark:text-slate-400 text-base md:text-lg font-medium">Platform kreatif untuk para penulis dan pembaca masa kini.</p>
            </div>
            ${currentUser ? `
            <button onclick="editingNovelId = null; clearSearchAndGoHome('upload')" class="animate-fade-in-up delay-100 w-full md:w-auto justify-center bg-indigo-600 dark:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-xl hover:shadow-indigo-200 dark:hover:shadow-indigo-900/50 transition-all flex items-center gap-2 flex-shrink-0">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
                Mulai Menulis
            </button>` : ''}
        </div>
        <div id="novel-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"></div>
    `,
auth: () => {
        const savedEmail = localStorage.getItem('novelku-email') || '';
        const isRemembered = savedEmail ? 'checked' : '';

        return `
        <div class="fixed inset-0 z-50 flex flex-col md:flex-row bg-white dark:bg-slate-950 overflow-y-auto md:overflow-hidden transition-colors duration-300">
            
            <div class="animate-fade-in-left w-full md:w-5/12 lg:w-1/2 p-8 pt-12 sm:p-12 md:p-16 flex flex-col justify-center text-white relative overflow-hidden min-h-[45vh] md:min-h-screen bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=1000&auto=format&fit=crop');">
                <div class="absolute inset-0 bg-slate-900/70 dark:bg-slate-900/80"></div>
                <div class="relative z-10 flex flex-col justify-center h-full">
                    <div class="flex items-center gap-3 mb-6 md:mb-10">
                        <div class="bg-white/20 p-2.5 md:p-3 rounded-2xl backdrop-blur-sm">
                           <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>
                        </div>
                        <span class="text-2xl md:text-3xl font-extrabold tracking-tighter">NovelKu</span>
                    </div>
                    <h2 class="text-3xl md:text-5xl font-black mb-3 md:mb-6 tracking-tight leading-tight">
                        ${authMode === 'login' ? 'Selamat Datang<br>Kembali.' : 'Mulai<br>Karyamu.'}
                    </h2>
                    <p class="text-slate-200/90 font-medium leading-relaxed text-sm md:text-lg max-w-md">
                        ${authMode === 'login' ? 'Lanjutkan karya terbaikmu, kelola naskah, dan sapa ribuan pembacamu hari ini.' : 'Platform menulis masa kini. Terbitkan ceritamu, kelola draft, dan bangun komunitas pembacamu.'}
                    </p>
                </div>
            </div>

            <div class="animate-fade-in-up delay-200 w-full md:w-7/12 lg:w-1/2 p-6 sm:p-12 lg:p-20 flex flex-col justify-center bg-white dark:bg-slate-950 flex-1 md:min-h-screen md:overflow-y-auto">
                <div class="max-w-md w-full mx-auto relative pt-4 md:pt-0">
                    <div class="mb-6 md:mb-8">
                        <h2 class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">${authMode === 'login' ? 'Masuk' : 'Daftar'}</h2>
                        <p class="text-slate-500 dark:text-slate-400 text-sm mt-2">${authMode === 'login' ? 'Silakan masuk menggunakan email dan kata sandi kamu.' : 'Lengkapi form di bawah ini untuk membuat akun baru.'}</p>
                    </div>
                    
                    <div class="space-y-5">
                        ${authMode === 'register' ? `
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Username</label>
                                    <input id="auth-username" type="text" placeholder="@username" class="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 font-bold text-slate-900 dark:text-white transition-all text-sm">
                                </div>
                                <div>
                                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Nama Pena</label>
                                    <input id="auth-nickname" type="text" placeholder="Nama Tampil" class="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 font-bold text-slate-900 dark:text-white transition-all text-sm">
                                </div>
                            </div>
                        ` : ''}
                        
                        <div>
                            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Alamat Email</label>
                            <input id="auth-email" type="email" value="${authMode === 'login' ? savedEmail : ''}" placeholder="contoh@email.com" class="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 font-bold text-slate-900 dark:text-white transition-all text-sm sm:text-base">
                        </div>
                        
                        <div>
                            <div class="flex items-center justify-between ml-1 mb-2">
                                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kata Sandi</label>
                                ${authMode === 'login' ? `
                                <button onclick="authMode = 'login'; showView('forgot')" class="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                                    Lupa Sandi?
                                </button>
                                ` : ''}
                            </div>
                            <input id="auth-pass" type="password" placeholder="••••••••" class="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 font-bold text-slate-900 dark:text-white transition-all text-sm sm:text-base">
                            
                            ${authMode === 'login' ? `
                            <div class="flex items-center gap-2 mt-3 ml-2">
                                <input type="checkbox" id="remember-me" class="w-4 h-4 text-indigo-600 bg-slate-200 border-slate-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-slate-900 focus:ring-2 dark:bg-slate-800 dark:border-slate-700 cursor-pointer accent-indigo-600" ${isRemembered}>
                                <label for="remember-me" class="text-xs font-bold text-slate-500 dark:text-slate-400 cursor-pointer select-none">Ingat Saya</label>
                            </div>
                            ` : ''}
                        </div>

                        <button id="btn-auth" onclick="${authMode === 'login' ? 'handleLogin()' : 'handleSignUp()'}" class="w-full py-4 md:py-5 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black shadow-lg hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:shadow-indigo-200 dark:hover:shadow-indigo-900/50 transition-all active:scale-95 mt-2 text-sm uppercase tracking-widest">
                            ${authMode === 'login' ? 'Masuk Sekarang' : 'Daftar Akun'}
                        </button>
                        
                        <div class="relative my-6">
                            <div class="absolute inset-0 flex items-center">
                                <div class="w-full border-t border-slate-200 dark:border-slate-800"></div>
                            </div>
                            <div class="relative flex justify-center text-sm">
                                <span class="px-4 bg-white dark:bg-slate-950 text-slate-400 text-[10px] font-black uppercase tracking-widest">Atau dengan</span>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <button onclick="handleOAuth('google')" class="flex items-center justify-center gap-2 w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-sm active:scale-95">
                                <svg viewBox="0 0 24 24" class="w-5 h-5"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                                Google
                            </button>
                        </div>
                        
                        <div class="text-center pt-4">
                            <button onclick="toggleAuthMode()" class="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                ${authMode === 'login' ? 'Belum punya akun? <span class="text-indigo-600 dark:text-indigo-400 font-black">Daftar di sini</span>' : 'Sudah punya akun? <span class="text-indigo-600 dark:text-indigo-400 font-black">Masuk di sini</span>'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <button onclick="showView('home')" class="fixed top-4 right-4 md:top-8 md:right-8 z-50 w-11 h-11 flex items-center justify-center bg-slate-900/40 hover:bg-slate-900/60 md:bg-slate-100 md:hover:bg-slate-200 md:dark:bg-slate-800 md:dark:hover:bg-slate-700 text-white md:text-slate-600 md:dark:text-slate-300 backdrop-blur-md rounded-2xl transition-all shadow-lg border border-white/20 md:border-none">
                <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
        </div>
        `;
    },
forgot: () => `
        <div class="fixed inset-0 z-50 flex flex-col md:flex-row bg-white dark:bg-slate-950 overflow-y-auto md:overflow-hidden transition-colors duration-300">
            
            <div class="animate-fade-in-left w-full md:w-5/12 lg:w-1/2 p-8 pt-12 sm:p-12 md:p-16 flex flex-col justify-center text-white relative overflow-hidden min-h-[45vh] md:min-h-screen bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=1000&auto=format&fit=crop');">
                <div class="absolute inset-0 bg-slate-900/70 dark:bg-slate-900/80"></div>
                <div class="relative z-10 flex flex-col justify-center h-full">
                    <div class="flex items-center gap-3 mb-6 md:mb-10">
                        <div class="bg-white/20 p-2.5 md:p-3 rounded-2xl backdrop-blur-sm">
                           <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>
                        </div>
                        <span class="text-2xl md:text-3xl font-extrabold tracking-tighter">NovelKu</span>
                    </div>
                    <h2 class="text-3xl md:text-5xl font-black mb-3 md:mb-6 tracking-tight leading-tight">Lupa<br>Kata Sandi?</h2>
                    <p class="text-slate-200/90 font-medium leading-relaxed text-sm md:text-lg max-w-md">Tenang saja. Masukkan alamat email kamu, dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi.</p>
                </div>
            </div>

            <div class="animate-fade-in-up delay-200 w-full md:w-7/12 lg:w-1/2 p-6 sm:p-12 lg:p-20 flex flex-col justify-center bg-white dark:bg-slate-950 flex-1 md:min-h-screen md:overflow-y-auto">
                <div class="max-w-md w-full mx-auto relative pt-4 md:pt-0">
                    <div class="mb-6 md:mb-8">
                        <h2 class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Atur Ulang Sandi</h2>
                        <p class="text-slate-500 dark:text-slate-400 text-sm mt-2">Pastikan email yang kamu masukkan sudah terdaftar di NovelKu.</p>
                    </div>
                    
                    <div class="space-y-5">
                        <div>
                            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Alamat Email</label>
                            <input id="forgot-email" type="email" placeholder="contoh@email.com" class="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 font-bold text-slate-900 dark:text-white transition-all text-sm sm:text-base">
                        </div>
                        
                        <button id="btn-forgot" onclick="handleForgotPassword()" class="w-full py-4 md:py-5 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black shadow-lg hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:shadow-indigo-200 dark:hover:shadow-indigo-900/50 transition-all active:scale-95 mt-4 text-sm uppercase tracking-widest">
                            Kirim Tautan Reset
                        </button>
                        
                        <div class="text-center pt-4">
                            <button onclick="showView('auth')" class="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                Ingat kata sandimu? <span class="text-indigo-600 dark:text-indigo-400 font-black">Masuk di sini</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <button onclick="showView('auth')" class="fixed top-4 right-4 md:top-8 md:right-8 z-50 w-11 h-11 flex items-center justify-center bg-slate-900/40 hover:bg-slate-900/60 md:bg-slate-100 md:hover:bg-slate-200 md:dark:bg-slate-800 md:dark:hover:bg-slate-700 text-white md:text-slate-600 md:dark:text-slate-300 backdrop-blur-md rounded-2xl transition-all shadow-lg border border-white/20 md:border-none">
                <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
        </div>
    `,
    upload: () => `
        <div class="max-w-6xl mx-auto animate-fade-in-up">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <h2 class="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">${editingNovelId ? 'Edit' : 'Terbitkan'} <span class="text-indigo-600 dark:text-indigo-400">Naskah</span></h2>
                
                <div class="flex items-center gap-3">
                    <button id="btn-draft" onclick="handleSaveDraft()" class="px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-sm">SIMPAN DRAFT</button>
                    <button id="btn-upload" onclick="handleUpload()" class="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-200/50 dark:shadow-indigo-900/30 hover:bg-indigo-700 transition-all text-sm">${editingNovelId ? 'PERBARUI TERBITAN' : 'DITERBITKAN'}</button>
                </div>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="space-y-6">
                    <div onclick="document.getElementById('poster-input').click()" class="group relative aspect-[3/4] bg-white dark:bg-slate-900 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/20 transition-all overflow-hidden">
                        <img id="poster-preview" class="absolute inset-0 w-full h-full object-cover hidden">
                        <div id="poster-placeholder" class="text-center p-6">
                            <div class="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
                            </div>
                            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tambah Poster Karya</p>
                        </div>
                    </div>

                    <div class="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800 space-y-5">
                        <div>
                            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Judul Karya</label>
                            <input id="up-title" type="text" placeholder="Tulis judul..." class="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none text-slate-900 dark:text-white font-bold">
                        </div>
                        
                        <div>
                            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Kategori / Genre</label>
                            <select id="up-cat" class="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none text-slate-900 dark:text-white font-bold appearance-none">
                                <option>Fantasi</option><option>Misteri</option><option>Romansa</option><option>Drama</option><option>Horor</option>
                            </select>
                        </div>

                        <div>
                            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Impor Naskah</label>
                            <button onclick="document.getElementById('file-importer').click()" class="w-full p-4 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 rounded-2xl flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all group">
                                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" class="group-hover:-translate-y-1 transition-transform"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                                Pilih File Naskah
                            </button>
                            <input type="file" id="file-importer" accept=".txt,.docx,.pdf" onchange="extractContentFromFile(event)" class="hidden">
                            <p class="text-[9px] text-slate-400 mt-3 text-center leading-relaxed">Isi file akan otomatis muncul di editor.</p>
                        </div>
                    </div>
                </div>

                <div class="lg:col-span-2">
                    <div class="bg-white dark:bg-slate-900 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                        <div id="novel-editor" class="min-h-[550px] p-6 text-slate-900 dark:text-slate-100"></div>
                    </div>
                </div>
            </div>
        </div>
    `
};

// --- SISTEM PENCARIAN & GRID ---
function renderNovelGrid(query = '') {
    const grid = document.getElementById('novel-grid');
    if (!grid) return;

    const q = query.toLowerCase().trim();
    
    const filteredNovels = novels.filter(n => {
        const isMatch = (n.title && n.title.toLowerCase().includes(q)) || 
                        (n.author && n.author.toLowerCase().includes(q)) || 
                        (n.category && n.category.toLowerCase().includes(q));
        
        const isVisible = n.status !== 'draft' || (currentUser && n.author_id === currentUser.id);

        return isMatch && isVisible;
    });

    if (filteredNovels.length === 0) {
        grid.innerHTML = `<div class="col-span-full py-16 md:py-20 text-center bg-white dark:bg-slate-900 rounded-[30px] md:rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-bold">
            ${query ? 'Tidak ada karya yang cocok dengan pencarianmu.' : 'Belum ada karya yang diterbitkan.'}
        </div>`;
        return;
    }

    grid.innerHTML = filteredNovels.map((n, i) => {
        const delayClass = `delay-${Math.min((i + 1) * 100, 500)}`;

        return `
        <div class="animate-fade-in-up ${delayClass} group relative bg-white dark:bg-slate-900 rounded-[30px] md:rounded-[40px] border border-slate-100 dark:border-slate-800 p-5 md:p-6 shadow-sm hover:shadow-2xl hover:shadow-indigo-100 dark:hover:shadow-indigo-900/20 hover:-translate-y-2 transition-all cursor-pointer" onclick="openNovel('${n.id}')">
            
            ${currentUser && currentUser.id === n.author_id ? `
            <button onclick="event.stopPropagation(); handleDeleteNovel('${n.id}')" class="absolute top-8 right-8 z-20 w-9 h-9 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-red-500 dark:text-red-400 rounded-2xl flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white transition-all transform hover:scale-110">
                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>
            </button>
            ` : ''}

            ${(currentUser && currentUser.id === n.author_id && n.status === 'draft') ? `
            <button onclick="event.stopPropagation(); loadEditNovel('${n.id}')" class="absolute top-8 right-20 z-20 w-9 h-9 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-indigo-500 dark:text-indigo-400 rounded-2xl flex items-center justify-center shadow-lg hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white transition-all transform hover:scale-110">
                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
            </button>
            ` : ''}

            <div class="aspect-[3/4] bg-slate-50 dark:bg-slate-800/50 rounded-[24px] md:rounded-[32px] mb-5 md:mb-6 flex items-center justify-center overflow-hidden relative border border-slate-50 dark:border-slate-800">
                ${n.cover_url ? `<img src="${n.cover_url}" class="w-full h-full object-cover">` : `<svg class="text-indigo-100 dark:text-slate-700 group-hover:scale-125 transition-transform duration-500" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/></svg>`}
                <div class="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4 flex items-center gap-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-3 py-2 rounded-2xl">
                    ${n.author_avatar ? `<img src="${n.author_avatar}" class="w-5 h-5 rounded-full object-cover">` : '<div class="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-[10px] text-indigo-400 font-bold">?</div>'}
                    <span class="text-[10px] font-black text-slate-700 dark:text-slate-300 truncate">${escapeHTML(n.author)}</span>
                </div>
            </div>
            <h3 class="font-extrabold text-slate-900 dark:text-white text-lg mb-1 line-clamp-1">${escapeHTML(n.title)}</h3>
            <div class="flex items-center gap-2 mb-4 md:mb-5">
                <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                <p class="text-[10px] md:text-[11px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider">${escapeHTML(n.category)}</p>
                ${n.status === 'draft' ? `<div class="absolute top-4 left-4 z-20 bg-amber-500 text-white text-[9px] font-black px-3 py-1 rounded-full shadow-lg">DRAFT</div>` : ''}
            </div>
            <button class="w-full py-3 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest group-hover:bg-indigo-600 dark:group-hover:bg-indigo-500 transition-colors">BACA KARYA</button>
        </div>
        `;
    }).join('');
}

// --- SISTEM PENCARIAN GLOBAL ---
function handleNavSearch(query) {
    const desktopInput = document.getElementById('nav-search-desktop');
    const mobileInput = document.getElementById('nav-search-mobile');
    
    if (desktopInput && desktopInput.value !== query) desktopInput.value = query;
    if (mobileInput && mobileInput.value !== query) mobileInput.value = query;

    const grid = document.getElementById('novel-grid');
    if (!grid) {
        showView('home');
        setTimeout(() => renderNovelGrid(query), 50);
    } else {
        renderNovelGrid(query);
    }
}

function clearSearchAndGoHome(targetView = 'home') {
    const desktopInput = document.getElementById('nav-search-desktop');
    const mobileInput = document.getElementById('nav-search-mobile');
    
    if (desktopInput) desktopInput.value = '';
    if (mobileInput) mobileInput.value = '';
    
    showView(targetView);
}

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

    if (name === 'home') {
        renderNovelGrid(); 
    }
    
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
    const files = event.target.files; 
    if (!files || !files.length) return;
    
    // FIX BUG: Extract index pertama file
    const file = files;
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
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files;
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

// FUNGSI GABUNGAN UPLOAD/SIMPAN DRAFT
async function processSave(statusToSave, btnId, btnText) {
    const title = document.getElementById('up-title').value;
    const category = document.getElementById('up-cat').value;
    const content = quill ? quill.root.innerHTML : "";

    if (!title) return showToast("Berikan judul untuk naskah kamu!", "error");
    if (statusToSave === 'published' && (!content || content === '<p><br></p>')) return showToast("Lengkapi naskah sebelum terbit!", "error");

    const btn = document.getElementById(btnId);
    btn.disabled = true;
    btn.innerText = "PROSES...";

    try {
        let coverUrl = null;
        if (selectedPosterFile) {
            const fileExt = selectedPosterFile.name.split('.').pop();
            const filePath = `cover-${Date.now()}.${fileExt}`;
            const { error: uploadError } = await _supabase.storage.from('covers').upload(filePath, selectedPosterFile);
            if (uploadError) throw uploadError;
            coverUrl = _supabase.storage.from('covers').getPublicUrl(filePath).data.publicUrl;
        }

        const { data: { user } } = await _supabase.auth.getUser();
        const meta = user.user_metadata || {};
        
        // FIX BUG: Split index pertama email
        const authorName = meta.nickname || meta.username || user.email.split('@');
        const authorAvatar = meta.avatar_url || null;

        const payload = {
            title, category, content, 
            status: statusToSave,
            author: authorName,
            author_id: user.id,
            author_avatar: authorAvatar
        };

        if (coverUrl) payload.cover_url = coverUrl;

        let error;
        if (editingNovelId) {
            // Update naskah yang sudah ada (edit)
            const res = await _supabase.from('novels').update(payload).eq('id', editingNovelId);
            error = res.error;
        } else {
            // Insert naskah baru
            const res = await _supabase.from('novels').insert([payload]);
            error = res.error;
        }

        if (error) throw error;
        
        showToast(`Karya berhasil ${statusToSave === 'draft' ? 'disimpan' : 'diterbitkan'}!`);
        selectedPosterFile = null;
        editingNovelId = null; // Reset setelah berhasil
        fetchNovels();
    } catch (e) {
        showToast("Gagal: " + e.message, "error");
    } finally {
        if(btn) {
            btn.disabled = false;
            btn.innerText = btnText;
        }
    }
}

function handleUpload() {
    processSave('published', 'btn-upload', 'DITERBITKAN');
}

function handleSaveDraft() {
    processSave('draft', 'btn-draft', 'SIMPAN DRAFT');
}

function loadEditNovel(id) {
    const n = novels.find(x => String(x.id) === String(id));
    if (!n) return showToast("Data tidak ditemukan", "error");

    editingNovelId = id;
    showView('upload');

    // Tunggu DOM render, baru masukkan data
    setTimeout(() => {
        document.getElementById('up-title').value = n.title || '';
        document.getElementById('up-cat').value = n.category || 'Fantasi';
        
        if (quill && n.content) {
            quill.clipboard.dangerouslyPasteHTML(n.content);
        }

        if (n.cover_url) {
            const img = document.getElementById('poster-preview');
            img.src = n.cover_url;
            img.classList.remove('hidden');
            document.getElementById('poster-placeholder').classList.add('opacity-0');
        }
    }, 100);
}

// --- SISTEM OAUTH & AUTH ---
async function handleOAuth(provider) {
    showToast(`Mengalihkan ke ${provider}...`);
    try {
        const { error } = await _supabase.auth.signInWithOAuth({
            provider: provider,
            options: { redirectTo: window.location.origin + window.location.pathname }
        });
        if (error) throw error;
    } catch (e) {
        showToast("Gagal terhubung: " + e.message, "error");
    }
}

async function handleLogin() {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-pass').value;
    const rememberMe = document.getElementById('remember-me'); 

    if (!email || !password) return showToast("Isi semua kolom!", "error");

    try {
        const { data, error } = await _supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        if (rememberMe && rememberMe.checked) {
            localStorage.setItem('novelku-email', email);
        } else {
            localStorage.removeItem('novelku-email');
        }

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
    const files = event.target.files;
    
    // FIX BUG: Pastikan menggunakan indeks array pertama
    if (!files || files.length === 0 || !currentUser) return;
    const file = files; 
    
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
    const isDark = document.documentElement.classList.contains('dark');
    
    const themeBtn = `
        <button onclick="toggleTheme()" title="Ganti Tema" class="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 rounded-2xl transition-all">
            ${isDark 
                ? '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>' 
                : '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>'}
        </button>
    `;

    if (currentUser) {
        const meta = currentUser.user_metadata || {};
        // FIX BUG: Nama email split array
        const name = meta.nickname || meta.username || (currentUser.email ? currentUser.email.split('@') : "Penulis");
        container.innerHTML = `
            <div class="flex items-center gap-3 sm:gap-4">
                ${themeBtn}
                <div class="text-right hidden sm:block">
                    <p class="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest leading-none mb-1">Pena Aktif</p>
                    <p class="text-xs font-extrabold text-slate-900 dark:text-white">${escapeHTML(name)}</p>
                </div>
                <div title="Klik untuk ubah foto" onclick="document.getElementById('avatar-input').click()" class="w-11 h-11 rounded-2xl profile-ring p-0.5 cursor-pointer shadow-lg transition-transform hover:scale-105 overflow-hidden bg-slate-100 dark:bg-slate-800 relative group">
                    ${meta.avatar_url ? `<img src="${meta.avatar_url}" class="w-full h-full rounded-[14px] object-cover">` : '<div class="w-full h-full flex items-center justify-center text-indigo-300 font-bold">U</div>'}
                </div>
                <button onclick="handleLogout()" title="Keluar" class="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-400 rounded-2xl hover:bg-red-50 hover:text-red-600 dark:bg-slate-800 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-all">
                    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
                </button>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="flex items-center gap-3">
                ${themeBtn}
                <button onclick="showView('auth')" class="bg-slate-900 dark:bg-indigo-600 text-white px-6 sm:px-8 py-3 rounded-2xl text-xs font-black tracking-widest hover:bg-indigo-600 dark:hover:bg-indigo-700 transition-all shadow-xl">MASUK</button>
            </div>
        `;
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

        _supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                currentUser = session.user;
                renderNav();
                if (document.getElementById('auth-email')) {
                    showView('home');
                    showToast("Login berhasil!");
                }
            } else if (event === 'SIGNED_OUT') {
                currentUser = null;
                renderNav();
            }
        });
    }
};