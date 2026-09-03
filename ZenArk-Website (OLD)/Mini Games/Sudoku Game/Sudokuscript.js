/* ════════════════════════════════════════
   STATE
════════════════════════════════════════ */
let PZL=[],SOL=[],PLY=[],NOTES=[];
let sel=-1,selNum=0,errs=0,score=0,hints=3;
let mode='normal',tInterval=null,secs=0,dead=false,hist=[];
let diff='sedang';
const MAX_E=3;
const CLUES={mudah:46,sedang:36,sulit:28,ekstrem:22};
const SMUL={mudah:1,sedang:2,sulit:3,ekstrem:5};

/* ════════════════════════════════════════
   PUZZLE ENGINE
════════════════════════════════════════ */
const shuf=a=>{for(let i=a.length-1;i>0;i--){const j=0|Math.random()*(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;};

function ok(b,i,n){
  const r=0|i/9,c=i%9;
  for(let x=0;x<9;x++) if(b[r*9+x]===n||b[x*9+c]===n) return false;
  const br=(0|r/3)*3,bc=(0|c/3)*3;
  for(let dr=0;dr<3;dr++) for(let dc=0;dc<3;dc++) if(b[(br+dr)*9+(bc+dc)]===n) return false;
  return true;
}

function fill(b){
  const e=b.indexOf(0); if(e===-1) return true;
  for(const n of shuf([1,2,3,4,5,6,7,8,9])){
    if(ok(b,e,n)){b[e]=n; if(fill(b)) return true; b[e]=0;}
  }
  return false;
}

function nSols(b){
  let c=0;
  const go=a=>{
    if(c>1)return;
    const e=a.indexOf(0); if(e===-1){c++;return;}
    for(let n=1;n<=9;n++) if(ok(a,e,n)){a[e]=n;go(a);a[e]=0;}
  };
  go([...b]); return c;
}

function makePuzzle(clues){
  const sol=new Array(81).fill(0); fill(sol);
  const puz=[...sol];
  for(const p of shuf([...Array(81).keys()])){
    if(puz.filter(x=>x!==0).length<=clues) break;
    const bk=puz[p]; puz[p]=0;
    if(nSols(puz)!==1) puz[p]=bk;
  }
  return{puz,sol};
}

/* ════════════════════════════════════════
   GAME LIFECYCLE
════════════════════════════════════════ */
function newGame(){
  clearInterval(tInterval);
  secs=0;score=0;errs=0;hints=3;sel=-1;selNum=0;dead=false;hist=[];
  const d=makePuzzle(CLUES[diff]);
  PZL=d.puz; SOL=d.sol; PLY=[...PZL];
  NOTES=Array(81).fill(null).map(()=>new Set());
  renderBoard(); renderNPs(); sync(); syncBest(); startTimer();
}

function startTimer(){
  document.getElementById('tv').textContent='00:00';
  tInterval=setInterval(()=>{secs++; document.getElementById('tv').textContent=fmtT(secs);},1000);
}
const fmtT=s=>`${String(0|s/60).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

/* ════════════════════════════════════════
   BOARD RENDER
════════════════════════════════════════ */
function renderBoard(){
  const bd=document.getElementById('board'); bd.innerHTML='';
  for(let i=0;i<81;i++){
    const c=document.createElement('div');
    c.className='cell'; c.dataset.i=i;
    drawCell(c,i);
    c.addEventListener('pointerdown',e=>{e.preventDefault();pickCell(i);});
    bd.appendChild(c);
  }
}

const gc=i=>document.querySelector(`.cell[data-i="${i}"]`);

function drawCell(el,i){
  const v=PLY[i],giv=PZL[i]!==0,err=v!==0&&v!==SOL[i];
  el.className='cell';
  if(giv) el.classList.add('given');
  if(err) el.classList.add('error');
  if(i===sel) el.classList.add('selected');
  else if(grp(i,sel)) el.classList.add('highlight');
  else if(sel>=0&&PLY[sel]!==0&&PLY[i]===PLY[sel]&&v!==0) el.classList.add('same-num');
  if(v!==0){
    el.textContent=v;
  } else if(NOTES[i]&&NOTES[i].size>0){
    el.textContent='';
    const g=document.createElement('div'); g.className='notes-grid';
    for(let n=1;n<=9;n++){
      const d=document.createElement('div');
      d.className='note-n'+(NOTES[i].has(n)?' on':'');
      d.textContent=NOTES[i].has(n)?n:'';
      g.appendChild(d);
    }
    el.appendChild(g);
  } else el.textContent='';
}

function grp(a,b){
  if(b<0) return false;
  const ar=0|a/9,ac=a%9,br=0|b/9,bc=b%9;
  return ar===br||ac===bc||(0|ar/3)===(0|br/3)&&(0|ac/3)===(0|bc/3);
}

function refreshB(){for(let i=0;i<81;i++) drawCell(gc(i),i);}

/* ════════════════════════════════════════
   NUMPADS
════════════════════════════════════════ */
function renderNPs(){
  buildNP('np-d','nb','nb-cnt');
  buildNP('np-m','bnb','bnb-c');
  buildNP('np-ls','ls-nb','ls-nc');
}
function buildNP(id,cls,ccls){
  const el=document.getElementById(id); if(!el)return; el.innerHTML='';
  for(let n=1;n<=9;n++){
    const cnt=PLY.filter((v,i)=>v===n&&v===SOL[i]).length;
    const btn=document.createElement('button');
    btn.className=cls; btn.dataset.num=n; btn.dataset.done=cnt>=9;
    btn.innerHTML=`${n}<span class="${ccls}">${cnt}</span>`;
    if(n===selNum) btn.classList.add('sn');
    btn.addEventListener('pointerdown',e=>{e.preventDefault();putNum(n);});
    el.appendChild(btn);
  }
}

/* ════════════════════════════════════════
   SYNC DISPLAY
════════════════════════════════════════ */
function sync(){
  const filled=PLY.filter((v,i)=>v!==0&&v===SOL[i]).length;
  const pct=Math.round(filled/81*100)+'%';
  document.getElementById('sv').textContent=score;
  document.getElementById('mv').textContent=`${errs}/${MAX_E}`;
  document.getElementById('pf-d').style.width=pct;
  const pm=document.getElementById('pf-m'); if(pm) pm.style.width=pct;
  document.getElementById('pl').textContent=filled+' terisi';
  document.getElementById('hd').textContent=hints;
  const hm=document.getElementById('hm'); if(hm) hm.textContent=hints;
  const DL={mudah:'Mudah',sedang:'Sedang',sulit:'Sulit',ekstrem:'Ekstrem'};
  document.getElementById('dl').textContent=DL[diff];
}
function syncBest(){
  const b=localStorage.getItem('sdk_best_'+diff);
  const row=document.getElementById('btr');
  const btEl=document.getElementById('bt');
  const bm=document.getElementById('btm-bt');
  if(b){ row.style.display=''; btEl.textContent=fmtT(+b); if(bm) bm.textContent=fmtT(+b); }
  else { row.style.display='none'; if(bm) bm.textContent='--:--'; }
}

/* ════════════════════════════════════════
   INTERACTION
════════════════════════════════════════ */
function pickCell(i){
  if(dead) return;
  sel=i; refreshB();
}

function putNum(n){
  if(dead||sel<0||PZL[sel]!==0) return;
  if(mode==='note'){
    hist.push({t:'note',i:sel,p:new Set(NOTES[sel])});
    NOTES[sel].has(n)?NOTES[sel].delete(n):NOTES[sel].add(n);
    drawCell(gc(sel),sel); return;
  }
  if(PLY[sel]===n) return;
  hist.push({t:'fill',i:sel,p:PLY[sel],pn:new Set(NOTES[sel])});
  PLY[sel]=n; NOTES[sel].clear(); selNum=n;
  const el=gc(sel);
  if(n!==SOL[sel]){
    errs++;
    el.classList.add('error','shake-anim');
    setTimeout(()=>el.classList.remove('shake-anim'),320);
    toast('Angka salah!','bad');
    if(errs>=MAX_E){dead=true;clearInterval(tInterval);toast('Game Over — terlalu banyak kesalahan!','bad');}
  } else {
    el.classList.add('pop-anim','correct-flash');
    setTimeout(()=>el.classList.remove('pop-anim','correct-flash'),520);
    score+=10*SMUL[diff];
    clearRN(sel,n);
  }
  sync(); renderNPs(); refreshB(); checkWin();
}

function clearRN(idx,n){
  const r=0|idx/9,c=idx%9;
  for(let i=0;i<81;i++){
    const ri=0|i/9,ci=i%9;
    if(ri===r||ci===c||(0|ri/3)===(0|r/3)&&(0|ci/3)===(0|c/3)) NOTES[i].delete(n);
  }
}

function erase(){
  if(dead||sel<0||PZL[sel]!==0) return;
  if(PLY[sel]===0&&NOTES[sel].size===0) return;
  hist.push({t:'fill',i:sel,p:PLY[sel],pn:new Set(NOTES[sel])});
  PLY[sel]=0; NOTES[sel].clear();
  drawCell(gc(sel),sel); sync(); renderNPs();
}

function undo(){
  if(!hist.length){toast('Tidak ada yang bisa di-undo','warn');return;}
  const h=hist.pop();
  if(h.t==='fill'){
    if(PLY[h.i]!==0&&PLY[h.i]===SOL[h.i]&&h.p!==SOL[h.i]) score=Math.max(0,score-10*SMUL[diff]);
    PLY[h.i]=h.p; NOTES[h.i]=h.pn;
  } else NOTES[h.i]=h.p;
  sync(); renderNPs(); refreshB();
}

function useHint(){
  if(dead||hints<=0){toast('Hint habis!','warn');return;}
  const emp=[]; for(let i=0;i<81;i++) if(PZL[i]===0&&PLY[i]!==SOL[i]) emp.push(i);
  if(!emp.length){toast('Semua sudah benar!','ok');return;}
  const idx=sel>=0&&emp.includes(sel)?sel:emp[0|Math.random()*emp.length];
  hist.push({t:'fill',i:idx,p:PLY[idx],pn:new Set(NOTES[idx])});
  PLY[idx]=SOL[idx]; NOTES[idx].clear(); hints--; score=Math.max(0,score-20); sel=idx;
  const el=gc(idx);
  el.classList.add('pop-anim'); setTimeout(()=>el.classList.remove('pop-anim'),260);
  clearRN(idx,SOL[idx]);
  sync(); renderNPs(); refreshB(); checkWin();
  toast(`Hint! Sisa: ${hints}`,'warn');
}

function confirmReset(){
  if(!confirm('Reset puzzle ini?')) return;
  clearInterval(tInterval);
  secs=0;score=0;errs=0;hist=[];dead=false;hints=3;
  PLY=[...PZL]; NOTES=Array(81).fill(null).map(()=>new Set()); sel=-1;
  sync(); renderNPs(); refreshB(); startTimer(); toast('Puzzle direset','warn');
}

function checkWin(){
  for(let i=0;i<81;i++) if(PLY[i]!==SOL[i]) return;
  clearInterval(tInterval); dead=true;
  const key='sdk_best_'+diff,prev=localStorage.getItem(key);
  if(!prev||secs<+prev){ localStorage.setItem(key,secs); toast('🏆 Rekor baru!','gold'); }
  document.getElementById('wt').textContent=fmtT(secs);
  document.getElementById('ws').textContent=score;
  document.getElementById('we').textContent=errs;
  spawnConfetti();
  setTimeout(()=>document.getElementById('win').classList.add('show'),600);
}

function closeWin(){document.getElementById('win').classList.remove('show');}
document.getElementById('win').addEventListener('click',function(e){if(e.target===this)closeWin();});

/* confetti */
function spawnConfetti(){
  const c=document.getElementById('confetti'); c.innerHTML='';
  const colors=[
    'var(--gold)','var(--jade)','var(--sky)','var(--rose)','var(--amber)',
    'var(--gold-light)','#fff','var(--text)'
  ];
  for(let i=0;i<40;i++){
    const s=document.createElement('span');
    s.style.cssText=`
      left:${Math.random()*100}%;
      top:${-10+Math.random()*20}px;
      background:${colors[0|Math.random()*colors.length]};
      width:${4+Math.random()*6}px; height:${4+Math.random()*6}px;
      border-radius:${Math.random()>.5?'50%':'2px'};
      animation-delay:${Math.random()*.8}s;
      animation-duration:${1.5+Math.random()*1}s;
    `;
    c.appendChild(s);
  }
}

/* ════════════════════════════════════════
   MODE & DIFFICULTY
════════════════════════════════════════ */
function setMode(m){
  mode=m;
  const pairs=[
    ['md-n','md-t'],['bm-n','bm-t'],['ls-n','ls-t']
  ];
  pairs.forEach(([a,b])=>{
    const ea=document.getElementById(a),eb=document.getElementById(b);
    if(!ea)return;
    ea.classList.toggle('on',m==='normal');
    eb.classList.toggle('on',m==='note');
  });
}

document.querySelectorAll('.d-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.d-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active'); diff=btn.dataset.d; newGame();
  });
});

/* ════════════════════════════════════════
   KEYBOARD
════════════════════════════════════════ */
document.addEventListener('keydown',e=>{
  if(dead) return;
  const k=e.key;
  if(k>='1'&&k<='9'){putNum(+k);return;}
  if(k==='0'||k==='Backspace'||k==='Delete'){erase();return;}
  if(k==='z'&&(e.ctrlKey||e.metaKey)){e.preventDefault();undo();return;}
  if(k==='n'||k==='N'){setMode(mode==='note'?'normal':'note');return;}
  if(sel<0){pickCell(0);return;}
  let nx=sel;
  if(k==='ArrowRight') nx=sel%9<8?sel+1:sel;
  if(k==='ArrowLeft')  nx=sel%9>0?sel-1:sel;
  if(k==='ArrowDown')  nx=sel<72?sel+9:sel;
  if(k==='ArrowUp')    nx=sel>=9?sel-9:sel;
  if(nx!==sel) pickCell(nx);
});

/* ════════════════════════════════════════
   TOAST
════════════════════════════════════════ */
let tTO;
function toast(msg,type=''){
  const t=document.getElementById('toast');
  t.textContent=msg; t.className=type?`show ${type}`:'show';
  clearTimeout(tTO); tTO=setTimeout(()=>t.classList.remove('show'),2500);
}

/* ════════════════════════════════════════
   BOOT
════════════════════════════════════════ */
newGame();