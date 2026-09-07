/* ── PROJECT DATA ──────────────────────────────── */
const PROJ = [
  {title:'Arc Project', desc:'Project web pertama yang aku buat dan dibuat agar bermanfaat',                tags:['Web Dev','Full Stack','Responsive'],   github:'',                                                                                   demo:'https://veliciaproject.vercel.app',                                                   cat:'website', img:'asset/img/Therzevena.jpg',          alt:'TheArc'   },
  {title:'Snake Games',       desc:'Project MiniGame Berbasis Web ke 1',                                          tags:['JavaScript','Game Dev','Canvas'],      github:'https://github.com/ARDINAZER112/Snake-Game',                                         demo:'https://veliciaproject.vercel.app/Mini%20Games/Snake%20Game/index.html',              cat:'game',    img:'asset/img/Snake_Game_Preview.jpg',  alt:'Snake Game'   },
  {title:'Fruit Dropper',     desc:'Project MiniGame Berbasis Web ke 2',                                          tags:['JavaScript','Game Dev','HTML5'],       github:'https://github.com/ARDINAZER112/Fruit-Dropper',                                      demo:'https://veliciaproject.vercel.app/Mini%20Games/Fruit%20Dropper/fruit-dropper.html',   cat:'game',    img:'asset/img/Fruit_Dropper.jpg',       alt:'Fruit Dropper'},
  {title:'Shooter Game',      desc:'Project MiniGame Berbasis Web ke 3',                                          tags:['JavaScript','Game Dev','Interactive'], github:'https://github.com/ARDINAZER112/Shooter-Game',                                       demo:'https://veliciaproject.vercel.app/Mini%20Games/Shooter-Games/index.html',             cat:'game',    img:'asset/img/Shooter_Game_Preview.jpg',alt:'Shooter Game' },
  {title:'Jadwal Ramadhan',   desc:'Project Kecil, Jadwal Ramadhan Real-Time',                                    tags:['Web App','Real-Time','Utility'],       github:'https://github.com/ARDINAZER112/Ramadhan-Project',                                   demo:'https://veliciaproject.vercel.app/menu/Other/Ramadhan.html',                          cat:'website', img:'asset/img/Ramdhan_Preview.jpg',     alt:'Ramadhan'     },
  {title:'Chess Game',        desc:'Game Catur: vs AI, multiplayer lokal & online via ntfy.sh',                   tags:['Game Dev','JavaScript','AI'],          github:'',                                                                                   demo:'https://veliciaproject.vercel.app/Mini%20Games/Chess%20Game/chess-master.html',       cat:'game',    img:'asset/img/Chess_Game.jpg',          alt:'Chess Game'   },
  {title:'Tetris Game',       desc:'Susun  Balok dan raihlah score tertinggi',                                    tags:['Game Dev','JavaScript','Canvas'],      github:'https://github.com/ARDINAZER112/TetrisGame',                                         demo:'https://veliciaproject.vercel.app/Mini%20Games/Tetris%20Game/tetris.html',            cat:'game',    img:'asset/img/tetrisgamepre.jpg',       alt:'Tetris Game'   },
  {title:'Sudoku Game',       desc:'Sudoku adalah teka-teki penempatan angka berbasis logika dan kombinatorial',  tags:['Game Dev','JavaScript','Interactive'], github:'https://github.com/ARDINAZER112/Sudoku-Game',                                        demo:'https://veliciaproject.vercel.app/Mini%20Games/Sudoku%20Game/sudoku.html',            cat:'game',    img:'asset/img/sudoku.jpg',              alt:'Sudoku Game'   },
  {title:'Coming Soon',       desc:'Tunggu ya~ 🔜',                                                               tags:['Unknown'],                             github:'',                                                                                   demo:'',                                                                                    cat:'all',     img:'asset/img/coming.jpg',              alt:'Coming Soon'  }
];
let activeFilter = 'all';

/* ── MODAL ─────────────────────────────────────── */
const modalOvl = document.getElementById('modalOvl');
const modalGrid = document.getElementById('modalGrid');

function openModal(e) {
  e.preventDefault();
  modalOvl.classList.add('on');
  document.body.style.overflow = 'hidden';
  renderModal();
}
function closeModal() {
  modalOvl.classList.remove('on');
  document.body.style.overflow = '';
}
function setFilter(btn) {
  document.querySelectorAll('.ftab').forEach(t => t.classList.remove('on'));
  btn.classList.add('on');
  activeFilter = btn.dataset.f;
  renderModal();
}
function renderModal() {
  const list = activeFilter === 'all'
    ? PROJ : PROJ.filter(p => p.cat === activeFilter || p.cat === 'all');
  if (!list.length) { modalGrid.innerHTML = '<div class="no-res">Tidak ada project di sini.</div>'; return; }
  modalGrid.innerHTML = list.map(p => {
    const hasGH   = !!p.github;
    const hasDemo = !!p.demo;
    const noLink  = !hasGH && !hasDemo;
    let btns = '';
    if (noLink) {
      btns = `<button class="pbtn" disabled style="opacity:.5;cursor:not-allowed">Segera Hadir</button>`;
    } else {
      btns = `<div class="pbtns">
        ${hasGH   ? `<a href="${p.github}" target="_blank" rel="noopener noreferrer"><button class="pbtn pbtn-s">Source</button></a>` : ''}
        ${hasDemo ? `<a href="${p.demo}"   target="_blank" rel="noopener noreferrer"><button class="pbtn">Visit</button></a>` : ''}
      </div>`;
    }
    return `
    <div class="pitem">
      <img src="${p.img}" alt="${p.alt}" loading="lazy" decoding="async" width="260" height="146">
      <h3>${p.title}</h3><p>${p.desc}</p>
      <div class="ptags">${p.tags.map(t=>`<span class="ptag">${t}</span>`).join('')}</div>
      ${btns}
    </div>`;
  }).join('');
  if (typeof gsap !== 'undefined')
    gsap.from(modalGrid.querySelectorAll('.pitem'), {y:26,opacity:0,scale:.94,duration:.38,stagger:.06,ease:'power2.out',clearProps:'all'});
}
modalOvl.addEventListener('click', e => { if (e.target === modalOvl) closeModal(); });
document.addEventListener('keydown', e => { if (e.key==='Escape') closeModal(); });

/* ── NAV ────────────────────────────────────────── */
function toggleMenu() {
  const open = document.getElementById('navLinks').classList.toggle('open');
  document.getElementById('hbg').classList.toggle('open');
  document.getElementById('hbg').setAttribute('aria-expanded', open);
  document.getElementById('navOvl').classList.toggle('on', open);
  document.body.style.overflow = open ? 'hidden' : '';
}
function closeMenu() {
  ['navLinks','hbg'].forEach(id => document.getElementById(id).classList.remove('open'));
  document.getElementById('hbg').setAttribute('aria-expanded','false');
  document.getElementById('navOvl').classList.remove('on');
  document.body.style.overflow = '';
}
/* smooth scroll */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const el = document.querySelector(this.getAttribute('href'));
    if (el) { e.preventDefault(); el.scrollIntoView({behavior:'smooth'}); }
  });
});
/* nav scroll class — throttled via rAF */
const navbar = document.getElementById('navbar');
let tick = false;
window.addEventListener('scroll', () => {
  if (!tick) { requestAnimationFrame(() => { navbar.classList.toggle('scrolled', scrollY > 60); tick = false; }); tick = true; }
}, {passive:true});

/* ── CURSOR NAME ─────────────────────────────────── */
function changeName() {
  const input = document.getElementById('newName');
  const val = input.value.trim();
  if (!val) { alert('Masukkan nama dulu ya~'); return; }
  document.getElementById('curName').textContent = val;
  document.getElementById('tname').textContent   = val;
  input.value = '';
}
document.getElementById('newName').addEventListener('keydown', e => { if (e.key==='Enter') changeName(); });

/* ── HERO BLUR ───────────────────────────────────── */
const ht = document.getElementById('heroTitle');
ht.addEventListener('mouseenter', () => ht.classList.add('blurred'));
ht.addEventListener('mouseleave', () => ht.classList.remove('blurred'));
ht.addEventListener('touchstart', e => { e.preventDefault(); ht.classList.add('blurred'); }, {passive:false});
ht.addEventListener('touchend',   () => setTimeout(() => ht.classList.remove('blurred'), 600));

/* ── DESKTOP CURSOR ──────────────────────────────── */
if (matchMedia('(pointer:fine)').matches) {
  const dot = document.getElementById('curDot');
  const nam = document.getElementById('curName');
  let mx=0,my=0,nx=0,ny=0;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; dot.style.left=mx+'px'; dot.style.top=my+'px'; }, {passive:true});
(function loop(){ nx+=(mx-nx)*.12; ny+=(my-ny)*.12; nam.style.left=nx+'px'; nam.style.top=ny+'px'; requestAnimationFrame(loop); })();
}

/* ── TOUCH CURSOR ────────────────────────────────── */
if (matchMedia('(pointer:coarse)').matches) {
  const dot=document.getElementById('tdot'),ring=document.getElementById('tring'),nam=document.getElementById('tname');
  let rx=0,ry=0,cx=0,cy=0,rafR,rafP,on=false,lp=0;
  function pts(x,y,n){for(let i=0;i<n;i++){const el=document.createElement('div');el.className='tparticle';const sz=4+Math.random()*6,a=Math.random()*6.28,d=18+Math.random()*28,col=i%2?'#00d4ff':'#0059ff';el.style.cssText=`left:${x}px;top:${y}px;width:${sz}px;height:${sz}px;background:${col};box-shadow:0 0 6px ${col};--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d}px;animation-duration:${.45+Math.random()*.3}s`;document.body.appendChild(el);setTimeout(()=>el.remove(),750);}}
  function animR(){rx+=(cx-rx)*.13;ry+=(cy-ry)*.13;ring.style.cssText=`left:${rx}px;top:${ry}px`;rafR=requestAnimationFrame(animR);}
  function partL(t){if(!on)return;if(t-lp>60){pts(cx,cy,3);lp=t;}rafP=requestAnimationFrame(partL);}
  document.addEventListener('touchstart',e=>{const t=e.touches[0];cx=t.clientX;cy=t.clientY;on=true;dot.style.cssText=`left:${cx}px;top:${cy}px;opacity:1;transform:translate(-50%,-50%) scale(1)`;ring.style.opacity='1';ring.style.transform='translate(-50%,-50%) scale(1)';rx=cx;ry=cy;nam.style.left=cx+'px'; nam.style.top=cy+'px'; nam.style.opacity='1';cancelAnimationFrame(rafR);animR();pts(cx,cy,8);cancelAnimationFrame(rafP);rafP=requestAnimationFrame(partL);},{passive:true});
  document.addEventListener('touchmove',e=>{const t=e.touches[0];cx=t.clientX;cy=t.clientY;dot.style.left=cx+'px';dot.style.top=cy+'px';nam.style.left=cx+'px';nam.style.top=cy+'px';},{passive:true});
  document.addEventListener('touchend',()=>{on=false;cancelAnimationFrame(rafP);dot.style.opacity='0';dot.style.transform='translate(-50%,-50%) scale(1.8)';ring.style.opacity='0';ring.style.transform='translate(-50%,-50%) scale(2)';nam.style.opacity='0';cancelAnimationFrame(rafR);pts(cx,cy,10);});
}

/* ── GSAP ANIMATIONS ─────────────────────────────── */
(function(){
  function loadSrc(src, cb) {
    const s=document.createElement('script');s.src=src;s.async=true;
    const t=setTimeout(()=>cb(false),4000);
    s.onload=()=>{clearTimeout(t);cb(true);};
    s.onerror=()=>{clearTimeout(t);cb(false);};
    document.head.appendChild(s);
  }
  loadSrc('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js', ok1 => {
    if(!ok1||typeof gsap==='undefined') return;
    loadSrc('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js', ok2 => {
      if(!ok2||typeof ScrollTrigger==='undefined') return;
      init();
    });
  });

  function init() {
    gsap.registerPlugin(ScrollTrigger);
    /* shorthand ScrollTrigger config */
    const st = (el, start) => ({ scrollTrigger:{ trigger:el, start:start||'top 85%', once:true } });

    /* HERO — load timeline */
    gsap.timeline({delay:.2})
      .from('#heroTitle',    {y:55,opacity:0,duration:.9, ease:'power3.out'})
      .from('.hero p',       {y:35,opacity:0,duration:.75,ease:'power2.out'},'-=.35')
      .from('.cta',          {y:35,opacity:0,duration:.75,ease:'power2.out'},'-=.3')
      .from('.scroll-arrow', {opacity:0,duration:.5,ease:'power1.out'},'-=.15');

    /* ABOUT */
    gsap.from('.about .section-title', {y:45,opacity:0,duration:.8, ease:'power3.out',...st('.about')});
    gsap.from('.about-text',  {x:-60,opacity:0,duration:.85,ease:'power3.out',...st('.about-grid')});
    gsap.from('.about-visual',{x:60, opacity:0,duration:.85,ease:'power3.out',...st('.about-grid')});
    gsap.from('.skill',{y:36,opacity:0,duration:.5,stagger:.09,ease:'power2.out',...st('.skills-grid','top 90%')});

    /* PROJECTS */
    gsap.from('.projects .section-title',{y:45,opacity:0,duration:.8,ease:'power3.out',...st('.projects')});
    gsap.from('.proj-card',{y:55,opacity:0,duration:.6,stagger:{each:.1,from:'start'},ease:'power3.out',...st('.proj-grid','top 88%')});
    gsap.from('.btn-more',{y:28,opacity:0,duration:.6,delay:.55,ease:'power2.out',...st('.proj-grid','top 88%')});

    /* CONTACT */
    gsap.from('.contact .section-title',{y:45,opacity:0,duration:.8,ease:'power3.out',...st('.contact')});
    gsap.from('.contact>p',{y:28,opacity:0,duration:.7,delay:.1,ease:'power2.out',...st('.contact')});
    gsap.from('.soc',{y:36,opacity:0,scale:.9,duration:.5,stagger:.07,ease:'back.out(1.5)',...st('.soc-grid','top 90%')});

    /* FOOTER */
    gsap.from('footer',{y:28,opacity:0,duration:.65,ease:'power2.out',...st('footer')});
  }
})();
