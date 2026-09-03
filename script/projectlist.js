/* ── PROJECT DATA ──────────────────────────────── */
const PROJ = [
  //{title:'Arc Project', desc:'Project web pertama yang aku buat dan dibuat agar bermanfaat',                tags:['Web Dev','Full Stack','Responsive'],               github:'',                                                                                   demo:'https://veliciaproject.vercel.app',                                                   cat:'website', img:'asset/img/Therzevena.jpg',          alt:'TheArc'   },
  {title:'Snake Games',       desc:'Snake Game — Raihlah skor tertinggi',                                     tags:['Kasual','Arcade','Klasik'],                  github:'https://github.com/ARDINAZER112/Snake-Game',                                         demo:'https://luxinesid.my.id/Mini%20Games/Snake%20Game/index.html',              cat:'game',    img:'asset/img/Snake_Game_Preview.jpg',  alt:'Snake Game'   },
  {title:'Fruit Dropper',     desc:'Fruit Dropper — Raihlah skor tertinggi',                                  tags:['Kasual','Arcade','Puzzel'],                  github:'https://github.com/ARDINAZER112/Fruit-Dropper',                                      demo:'https://luxinesid.my.id/Mini%20Games/Fruit%20Dropper/fruit-dropper.html',   cat:'game',    img:'asset/img/Fruit_Dropper.jpg',       alt:'Fruit Dropper'},
  {title:'Shooter Game',      desc:'Shooter Game — Raihlah skor tertinggi',                                   tags:['FPS',"Shoot 'em up"],                        github:'https://github.com/ARDINAZER112/Shooter-Game',                                       demo:'https://luxinesid.my.id/Mini%20Games/Shooter-Games/index.html',             cat:'game',    img:'asset/img/Shooter_Game_Preview.jpg',alt:'Shooter Game' },
  {title:'Jadwal Ramadhan',   desc:'Project Kecil — Jadwal Ramadhan Real-Time.',                              tags:['Web App','Real-Time','Utility'],             github:'https://github.com/ARDINAZER112/Ramadhan-Project',                                   demo:'https://luxinesid.my.id/menu/Other/Ramadhan.html',                          cat:'website', img:'asset/img/Ramdhan_Preview.jpg',     alt:'Ramadhan'     },
  {title:'Chess Game',        desc:'Chess Master — Jadilan pemenang di permainan catur',                      tags:['Strategi','Permainan Papan','AI'],           github:'',                                                                                   demo:'https://luxinesid.my.id/Mini%20Games/Chess%20Game/chess-master.html',       cat:'game',    img:'asset/img/Chess_Game.jpg',          alt:'Chess Game'   },
  {title:'Tetris Game',       desc:'Tetris — Susunlah balok dan raih score tertinggi',                        tags:['Puzzel','Strategi','Arcade'],                github:'https://github.com/ARDINAZER112/TetrisGame',                                         demo:'https://luxinesid.my.id/Mini%20Games/Tetris%20Game/tetris.html',            cat:'game',    img:'asset/img/tetrisgamepre.jpg',       alt:'Tetris Game'  },
  {title:'Sudoku Game',       desc:'Sudoku — Temukan dan selesaikan puzzel',                                  tags:['Puzzel','Permainan Kombinatorial','Kasual'], github:'https://github.com/ARDINAZER112/Sudoku-Game',                                        demo:'https://luxinesid.my.id/Mini%20Games/Sudoku%20Game/sudoku.html',            cat:'game',    img:'asset/img/sudoku.jpg',              alt:'Sudoku Game'  },
  {title:'Menu Belajar',      desc:'Menu Belajar — Kumpulan materi pembelajaran interaktif.',                 tags:['JavaScript','Inteactive','Utility'],         github:'',                                                                                   demo:'https://luxinesid.my.id/Learn.html',                                        cat:'website', img:'asset/img/Learning.jpg',              alt:'Learning'     },
  {title:'NovelKu',           desc:'NovelKu — Platform baca, tulis dan upload Novel.',                        tags:['Web Dev', 'Penulis', 'Real-Time'],           github:'',                                                                                   demo:'https://luxinesid.my.id/menu/novel/novelku/novelku.html',                   cat:'website', img:'asset/img/coming.jpg',              alt:'NovelKu'      },
  {title:'Coming Soon',       desc:'Tunggu ya~ 🔜',                                                           tags:['Unknown'],                                   github:'',                                                                                   demo:'',                                                                          cat:'all',     img:'asset/img/coming.jpg',              alt:'Coming Soon'  }
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
