/* ══════════════════════════════════
   PARTICLES
══════════════════════════════════ */
(function(){
  const c=document.getElementById('particles');
  for(let i=0;i<20;i++){
    const p=document.createElement('div');p.className='ptcl';
    const s=Math.random()*4+2;
    p.style.cssText=`width:${s}px;height:${s}px;left:${Math.random()*100}%;animation-duration:${8+Math.random()*14}s;animation-delay:${-Math.random()*14}s;`;
    c.appendChild(p);
  }
})();

/* ══════════════════════════════════
   SCREEN NAVIGATION
══════════════════════════════════ */
let curScreen='screen-auth';
function goTo(id){
  if(curScreen===id)return;
  document.getElementById(curScreen).classList.add('hidden');
  document.getElementById(id).classList.remove('hidden');
  curScreen=id;
}
// Flag: apakah settings dibuka dari dalam game (pause)
let fromPause = false;

function openPause(){ document.getElementById('screen-pause').classList.remove('hidden'); pauseTimer(); }
function closePause(){ document.getElementById('screen-pause').classList.add('hidden'); if(timerEnabled && !gameOver) resumeTimer(); }

function pauseGoSettings(){
  fromPause = true;
  closePause();
  // Tampilkan banner "kembali ke game" di semua settings screen
  document.querySelectorAll('.back-to-game-bar').forEach(el => el.style.display='flex');
  if(gameMode==='online')     goTo('screen-online');
  else if(gameMode==='mp')    goTo('screen-settings-mp');
  else                        goTo('screen-settings-ai');
}

function pauseGoMenu(){
  fromPause = false;
  closePause();
  stopTimer();
  document.querySelectorAll('.back-to-game-bar').forEach(el => el.style.display='none');
  goTo('screen-menu');
}

// Kembali ke game yang sedang berjalan tanpa reset
function returnToGame(){
  fromPause = false;
  document.querySelectorAll('.back-to-game-bar').forEach(el => el.style.display='none');
  goTo('screen-game');
  renderBoard();
  updateUI();
  if(timerEnabled && !gameOver) resumeTimer();
}
function openAbout(){ document.getElementById('about-modal').classList.add('show'); }
function closeAbout(){ document.getElementById('about-modal').classList.remove('show'); }

/* ══════════════════════════════════
   GAME MODE SELECTOR
══════════════════════════════════ */
let gameMode='ai';
let menuMode='ai';

function selMode(m){
  menuMode=m;
  document.getElementById('mc-ai').classList.toggle('on', m==='ai');
  document.getElementById('mc-mp').classList.toggle('on', m==='mp');
  document.getElementById('mc-online').classList.toggle('on', m==='online');
  const btn=document.getElementById('btn-play');
  const lbl=document.getElementById('btn-play-lbl');
  if(m==='ai'){ btn.className='mbtn prime'; lbl.textContent=t('playAI'); }
  else if(m==='mp'){ btn.className='mbtn mp-prime'; lbl.textContent=t('playLocal'); }
  else { btn.className='mbtn'; btn.style.borderColor='var(--blue)';btn.style.color='#7fb3d3'; lbl.textContent=t('playOnline'); }
}

function goPlay(){
  gameMode=menuMode;
  if(gameMode==='online') goTo('screen-online');
  else if(gameMode==='mp') goTo('screen-settings-mp');
  else goTo('screen-settings-ai');
}

/* ══════════════════════════════════
   CONFIGURATION
══════════════════════════════════ */
const CFG={
  playerName:'Player', aiName:'Deep Mind', aiAvatar:'🤖', playerColor:'w', aiDepth:1,
  p1Name:'Player 1', p2Name:'Player 2',
  showHints:true, showCoords:true, showLastMove:true,
  mpAutoFlip:false, mpPassScreen:false,
  theme:{sl:'#e8dcc8',sd:'#7a6248'}
};
const THEMES={
  classic:{sl:'#e8dcc8',sd:'#7a6248'},
  forest:{sl:'#eeeed2',sd:'#769656'},
  ocean:{sl:'#dee3e6',sd:'#8ca2ad'},
  walnut:{sl:'#f0d9b5',sd:'#b58863'}
};
function getDiffDesc(d){
  return [
    t('diff1desc'), t('diff2desc'), t('diff3desc'),
    t('diff4desc'), t('diff5desc')
  ][d-1] || '';
}

function pickCol(col,el){
  CFG.playerColor=col;
  document.querySelectorAll('#chip-w,#chip-b').forEach(e=>e.classList.remove('on'));
  el.classList.add('on');
}
function pickDiff(d,el){
  CFG.aiDepth=d;
  document.querySelectorAll('#d1,#d2,#d3,#d4,#d5').forEach(e=>e.classList.remove('on'));
  el.classList.add('on');
  document.getElementById('diffdesc').textContent=getDiffDesc(d);
}
function pickTheme(name,el,groupId){
  CFG.theme=THEMES[name];
  document.querySelectorAll(`#${groupId} .cpopt`).forEach(e=>{
    e.classList.remove('on');
    e.querySelector('.cpsw').textContent='';
  });
  el.classList.add('on');
  el.querySelector('.cpsw').textContent='✓';
  if(curScreen==='screen-game') renderBoard();
}
function togOpt(key,el){
  el.classList.toggle('on');
  const v=el.classList.contains('on');
  if(key==='hints') CFG.showHints=v;
  if(key==='coords') CFG.showCoords=v;
  if(key==='lastmove') CFG.showLastMove=v;
  if(curScreen==='screen-game') renderBoard();
}
function togTimerOpt(el){
  const v = !el.classList.contains('on');
  el.classList.toggle('on', v);
  // Sync both toggles
  ['ai-tog-timer','mp-tog-timer'].forEach(id=>{
    const t = document.getElementById(id);
    if(t) t.classList.toggle('on', v);
  });
  timerEnabled = v;
}

function doTogHints(){
  CFG.showHints=!CFG.showHints;
  // Sync toggle buttons
  ['ai-tog-hints','mp-tog-hints'].forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.classList.toggle('on',CFG.showHints);
  });
  renderBoard();
}

/* ══════════════════════════════════
   CHESS ENGINE
══════════════════════════════════ */
const SYM={wK:'♚',wQ:'♛',wR:'♜',wB:'♝',wN:'♞',wP:'♟',bK:'♔',bQ:'♕',bR:'♖',bB:'♗',bN:'♘',bP:'♙'};
const VAL={K:20000,Q:900,R:500,B:330,N:320,P:100};
const PST={
  P:[0,0,0,0,0,0,0,0,50,50,50,50,50,50,50,50,10,10,20,30,30,20,10,10,5,5,10,25,25,10,5,5,0,0,0,20,20,0,0,0,5,-5,-10,0,0,-10,-5,5,5,10,10,-20,-20,10,10,5,0,0,0,0,0,0,0,0],
  N:[-50,-40,-30,-30,-30,-30,-40,-50,-40,-20,0,0,0,0,-20,-40,-30,0,10,15,15,10,0,-30,-30,5,15,20,20,15,5,-30,-30,0,15,20,20,15,0,-30,-30,5,10,15,15,10,5,-30,-40,-20,0,5,5,0,-20,-40,-50,-40,-30,-30,-30,-30,-40,-50],
  B:[-20,-10,-10,-10,-10,-10,-10,-20,-10,0,0,0,0,0,0,-10,-10,0,5,10,10,5,0,-10,-10,5,5,10,10,5,5,-10,-10,0,10,10,10,10,0,-10,-10,10,10,10,10,10,10,-10,-10,5,0,0,0,0,5,-10,-20,-10,-10,-10,-10,-10,-10,-20],
  R:[0,0,0,0,0,0,0,0,5,10,10,10,10,10,10,5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,0,0,0,5,5,0,0,0],
  Q:[-20,-10,-10,-5,-5,-10,-10,-20,-10,0,0,0,0,0,0,-10,-10,0,5,5,5,5,0,-10,-5,0,5,5,5,5,0,-5,0,0,5,5,5,5,0,-5,-10,5,5,5,5,5,0,-10,-10,0,5,0,0,0,0,-10,-20,-10,-10,-5,-5,-10,-10,-20],
  K:[-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-20,-30,-30,-40,-40,-30,-30,-20,-10,-20,-20,-20,-20,-20,-20,-10,20,20,0,0,0,0,20,20,20,30,10,0,0,10,30,20]
};

// ── GAME STATE ──
let board=[], turn='w', selected=null, legalMoves=[], gameOver=false;
let flipped=false, epSq=null, cast={wK:true,wQ:true,bK:true,bQ:true};
let lastMove=null, history=[], moveLog=[], capW=[], capB=[];
let aiThinking=false, statsChecks=0, statsCaptures=0;
let playerColor='w'; // AI mode only
let mpWaitingForReveal=false; // blocks clicks during pass screen in MP mode

const RW=i=>Math.floor(i/8), CL=i=>i%8, SQ=(r,c)=>r*8+c;

function initBoard(){
  board=Array(64).fill(null);
  const bk=['R','N','B','Q','K','B','N','R'];
  for(let i=0;i<8;i++){
    board[i]='b'+bk[i]; board[56+i]='w'+bk[i];
    board[8+i]='bP'; board[48+i]='wP';
  }
}

function movesFor(bs,sq,ep,ca){
  const pc=bs[sq]; if(!pc) return [];
  const col=pc[0], tp=pc[1], rr=RW(sq), cc=CL(sq);
  const raw=[];
  const add=to=>{if(to>=0&&to<64&&(!bs[to]||bs[to][0]!==col))raw.push(to);};
  const slide=(dr,dc)=>{for(let s=1;s<8;s++){const nr=rr+dr*s,nc=cc+dc*s;if(nr<0||nr>7||nc<0||nc>7)break;const to=SQ(nr,nc);const t=bs[to];if(t){if(t[0]!==col)raw.push(to);break;}raw.push(to);}};
  if(tp==='P'){
    const dir=col==='w'?-1:1, sr=col==='w'?6:1, nr=rr+dir;
    if(nr>=0&&nr<=7){
      if(!bs[SQ(nr,cc)]){raw.push(SQ(nr,cc));if(rr===sr&&!bs[SQ(rr+2*dir,cc)])raw.push(SQ(rr+2*dir,cc));}
      for(const dc2 of[-1,1]){const nc2=cc+dc2;if(nc2<0||nc2>7)continue;const to2=SQ(nr,nc2);if((bs[to2]&&bs[to2][0]!==col)||to2===ep)raw.push(to2);}
    }
  } else if(tp==='N'){
    for(const[dr,dc]of[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]){const nr=rr+dr,nc=cc+dc;if(nr>=0&&nr<=7&&nc>=0&&nc<=7)add(SQ(nr,nc));}
  } else if(tp==='B'){for(const[dr,dc]of[[-1,-1],[-1,1],[1,-1],[1,1]])slide(dr,dc);}
  else if(tp==='R'){for(const[dr,dc]of[[-1,0],[1,0],[0,-1],[0,1]])slide(dr,dc);}
  else if(tp==='Q'){for(const[dr,dc]of[[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]])slide(dr,dc);}
  else if(tp==='K'){
    for(const[dr,dc]of[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]){const nr=rr+dr,nc=cc+dc;if(nr>=0&&nr<=7&&nc>=0&&nc<=7)add(SQ(nr,nc));}
    if(col==='w'&&rr===7&&cc===4){
      if(ca.wK&&!bs[61]&&!bs[62]&&bs[63]==='wR'&&!atk(bs,60,'b')&&!atk(bs,61,'b')&&!atk(bs,62,'b'))raw.push(62);
      if(ca.wQ&&!bs[59]&&!bs[58]&&!bs[57]&&bs[56]==='wR'&&!atk(bs,60,'b')&&!atk(bs,59,'b')&&!atk(bs,58,'b'))raw.push(58);
    }
    if(col==='b'&&rr===0&&cc===4){
      if(ca.bK&&!bs[5]&&!bs[6]&&bs[7]==='bR'&&!atk(bs,4,'w')&&!atk(bs,5,'w')&&!atk(bs,6,'w'))raw.push(6);
      if(ca.bQ&&!bs[3]&&!bs[2]&&!bs[1]&&bs[0]==='bR'&&!atk(bs,4,'w')&&!atk(bs,3,'w')&&!atk(bs,2,'w'))raw.push(2);
    }
  }
  return raw.filter(to=>{const nb=applyMvSim(bs,sq,to,ep);const ki=nb.indexOf(col+'K');return ki>=0&&!atk(nb,ki,col==='w'?'b':'w');});
}

function applyMvSim(bs,from,to,ep){
  const nb=[...bs],pc=nb[from],col=pc[0],tp=pc[1];
  nb[to]=pc;nb[from]=null;
  if(tp==='P'&&to===ep){const cr=RW(to)+(col==='w'?1:-1);nb[SQ(cr,CL(to))]=null;}
  if(tp==='K'){if(from===60&&to===62){nb[63]=null;nb[61]='wR';}if(from===60&&to===58){nb[56]=null;nb[59]='wR';}if(from===4&&to===6){nb[7]=null;nb[5]='bR';}if(from===4&&to===2){nb[0]=null;nb[3]='bR';}}
  return nb;
}

function atk(bs,sq,byCol){
  const sr=RW(sq),sc=CL(sq);
  for(let i=0;i<64;i++){
    const p=bs[i]; if(!p||p[0]!==byCol)continue;
    const tp=p[1],pr=RW(i),pc2=CL(i);
    if(tp==='P'){const d=byCol==='w'?-1:1;if(sr===pr+d&&Math.abs(sc-pc2)===1)return true;}
    else if(tp==='N'){const dr=Math.abs(sr-pr),dc=Math.abs(sc-pc2);if((dr===2&&dc===1)||(dr===1&&dc===2))return true;}
    else if(tp==='K'){if(Math.abs(sr-pr)<=1&&Math.abs(sc-pc2)<=1)return true;}
    if(tp==='B'||tp==='Q'){if(Math.abs(sr-pr)===Math.abs(sc-pc2)&&sr!==pr){const dr=sr>pr?1:-1,dc=sc>pc2?1:-1;let cr=pr+dr,cc2=pc2+dc,ok=true;while(cr!==sr||cc2!==sc){if(bs[SQ(cr,cc2)]){ok=false;break;}cr+=dr;cc2+=dc;}if(ok)return true;}}
    if(tp==='R'||tp==='Q'){if(sr===pr||sc===pc2){const dr=sr===pr?0:(sr>pr?1:-1),dc=sc===pc2?0:(sc>pc2?1:-1);if(dr||dc){let cr=pr+dr,cc2=pc2+dc,ok=true;while(cr!==sr||cc2!==sc){if(bs[SQ(cr,cc2)]){ok=false;break;}cr+=dr;cc2+=dc;}if(ok)return true;}}}
  }
  return false;
}

function inChk(bs,col){const ki=bs.indexOf(col+'K');return ki>=0&&atk(bs,ki,col==='w'?'b':'w');}
function allMoves(bs,col,ep,ca){const out=[];for(let i=0;i<64;i++){const p=bs[i];if(!p||p[0]!==col)continue;for(const to of movesFor(bs,i,ep,ca))out.push({from:i,to});}return out;}
function newEP(pc,from,to){if(!pc||pc[1]!=='P')return null;if(Math.abs(RW(to)-RW(from))===2)return SQ((RW(from)+RW(to))/2,CL(from));return null;}
function newCast(ca,_bs,from,to){const n={...ca};if(from===60||to===60){n.wK=false;n.wQ=false;}if(from===63||to===63)n.wK=false;if(from===56||to===56)n.wQ=false;if(from===4||to===4){n.bK=false;n.bQ=false;}if(from===7||to===7)n.bK=false;if(from===0||to===0)n.bQ=false;return n;}

function evalBoard(bs){
  let s=0;
  for(let i=0;i<64;i++){const p=bs[i];if(!p)continue;const col=p[0],tp=p[1];const v=VAL[tp]||0;const pi=col==='w'?i:(56-(RW(i)*8))+CL(i);const pos=(PST[tp]||[])[pi]||0;s+=(col==='w'?1:-1)*(v+pos);}
  return s;
}

function mmab(bs,depth,alpha,beta,maxing,ep,ca){
  if(depth===0)return evalBoard(bs);
  const col=maxing?'w':'b';
  const moves=allMoves(bs,col,ep,ca);
  if(!moves.length)return inChk(bs,col)?(maxing?-100000:100000):0;
  moves.sort((a,b)=>(bs[b.to]?(VAL[bs[b.to][1]]||0):0)-(bs[a.to]?(VAL[bs[a.to][1]]||0):0));
  if(maxing){
    let best=-Infinity;
    for(const m of moves){const nb=applyMvSim(bs,m.from,m.to,ep);if(nb[m.to]==='wP'&&RW(m.to)===0)nb[m.to]='wQ';if(nb[m.to]==='bP'&&RW(m.to)===7)nb[m.to]='bQ';const sc=mmab(nb,depth-1,alpha,beta,false,newEP(bs[m.from],m.from,m.to),newCast(ca,bs,m.from,m.to));best=Math.max(best,sc);alpha=Math.max(alpha,sc);if(beta<=alpha)break;}
    return best;
  } else {
    let best=Infinity;
    for(const m of moves){const nb=applyMvSim(bs,m.from,m.to,ep);if(nb[m.to]==='wP'&&RW(m.to)===0)nb[m.to]='wQ';if(nb[m.to]==='bP'&&RW(m.to)===7)nb[m.to]='bQ';const sc=mmab(nb,depth-1,alpha,beta,true,newEP(bs[m.from],m.from,m.to),newCast(ca,bs,m.from,m.to));best=Math.min(best,sc);beta=Math.min(beta,sc);if(beta<=alpha)break;}
    return best;
  }
}

function findBest(bs,depth,ep,ca,aiCol){
  const moves=allMoves(bs,aiCol,ep,ca); if(!moves.length)return null;
  moves.sort((a,b)=>(bs[b.to]?(VAL[bs[b.to][1]]||0):0)-(bs[a.to]?(VAL[bs[a.to][1]]||0):0));
  const maxing=aiCol==='w'; let bestSc=maxing?-Infinity:Infinity, best=moves[0];
  for(const m of moves){
    const nb=applyMvSim(bs,m.from,m.to,ep);
    if(nb[m.to]==='wP'&&RW(m.to)===0)nb[m.to]='wQ'; if(nb[m.to]==='bP'&&RW(m.to)===7)nb[m.to]='bQ';
    const sc=mmab(nb,depth-1,-Infinity,Infinity,!maxing,newEP(bs[m.from],m.from,m.to),newCast(ca,bs,m.from,m.to));
    if(maxing?sc>bestSc:sc<bestSc){bestSc=sc;best=m;}
  }
  return best;
}

function askPromo(col){
  return new Promise(res=>{
    const modal=document.getElementById('promo-modal'), ch=document.getElementById('promo-chs');
    const opts=col==='w'?[['♕','Q'],['♖','R'],['♗','B'],['♘','N']]:[['♛','Q'],['♜','R'],['♝','B'],['♞','N']];
    ch.innerHTML='';
    opts.forEach(([sym,tp])=>{
      const btn=document.createElement('div'); btn.className='promoch'; btn.textContent=sym;
      btn.onclick=()=>{modal.classList.remove('show'); res(col+tp);};
      ch.appendChild(btn);
    });
    modal.classList.add('show');
  });
}

async function applyMove(from, to, isAI){
  const pc=board[from], col=pc[0], tp=pc[1];
  const captured=board[to];
  // Save snapshot
  history.push({
    board:[...board], turn, epSq, cast:{...cast},
    lastMove:lastMove?{...lastMove}:null,
    capW:[...capW], capB:[...capB],
    moveLog:JSON.parse(JSON.stringify(moveLog)),
    statsChecks, statsCaptures
  });
  // En passant capture
  let epCap=null;
  if(tp==='P'&&to===epSq){const cr=RW(to)+(col==='w'?1:-1); epCap=board[SQ(cr,CL(to))]; board[SQ(cr,CL(to))]=null;}
  const capPc=captured||epCap;
  if(capPc){ statsCaptures++; if(col==='w')capW.push(capPc); else capB.push(capPc); }
  board[to]=pc; board[from]=null;
  // Castling
  if(tp==='K'){if(from===60&&to===62){board[63]=null;board[61]='wR';}if(from===60&&to===58){board[56]=null;board[59]='wR';}if(from===4&&to===6){board[7]=null;board[5]='bR';}if(from===4&&to===2){board[0]=null;board[3]='bR';}}
  // Promotion
  if(tp==='P'&&(RW(to)===0||RW(to)===7)) board[to]=isAI?col+'Q':await askPromo(col);
  cast=newCast(cast,null,from,to);
  epSq=newEP(pc,from,to);
  lastMove={from,to};
  // Notation
  const F='abcdefgh';
  const note=`${F[CL(from)]}${8-RW(from)}→${F[CL(to)]}${8-RW(to)}`;
  if(col==='w'){ moveLog.push({w:note,b:null}); }
  else { if(moveLog.length>0&&moveLog[moveLog.length-1].b===null) moveLog[moveLog.length-1].b=note; else moveLog.push({w:'…',b:note}); }
  turn=col==='w'?'b':'w';
  selected=null; legalMoves=[];
  if(timerEnabled) startTimer(); // restart countdown for next player
}

/* ── UNDO ── */
function doUndo(){
  if(!history.length||aiThinking)return;
  if(gameMode==='online'){ requestOnlineUndo(); return; }
  // AI mode: undo 2 half-moves (player + AI); MP mode: undo 1
  const cnt=(gameMode==='ai'&&history.length>=2)?2:1;
  for(let i=0;i<cnt;i++){if(history.length)history.pop();}
  if(!history.length){
    initBoard(); turn='w'; epSq=null; cast={wK:true,wQ:true,bK:true,bQ:true};
    lastMove=null; capW=[]; capB=[]; moveLog=[]; statsChecks=0; statsCaptures=0;
  } else {
    const s=history[history.length-1];
    board=[...s.board]; turn=s.turn; epSq=s.epSq; cast={...s.cast};
    lastMove=s.lastMove?{...s.lastMove}:null;
    capW=[...s.capW]; capB=[...s.capB];
    moveLog=JSON.parse(JSON.stringify(s.moveLog));
    statsChecks=s.statsChecks; statsCaptures=s.statsCaptures;
  }
  selected=null; legalMoves=[]; gameOver=false;
  mpWaitingForReveal=false;
  clearTimeout(mpBannerTimer);
  document.getElementById('mp-turn-banner').classList.remove('show','hide');
  closePause();
  renderBoard(); updateUI();
}

/* ── RESIGN ── */
function doResign(){
  if(gameOver) return;
  if(gameMode==='online'){ doResignOnline(); return; }
  const who=getName(turn);
  if(confirm(`${who} ${t('resignConfirm')}`)){
    gameOver=true;
    showResult('resign', turn==='w'?'b':'w');
  }
}

/* ══════════════════════════════════
   HELPERS
══════════════════════════════════ */
function getName(col){
  if(gameMode==='online') return getOnlineName(col);
  if(gameMode==='ai') return col===playerColor?CFG.playerName:CFG.aiName;
  return col==='w'?CFG.p1Name:CFG.p2Name;
}
function getAvatar(col){
  if(gameMode==='online'){
    if(col===onlineColor) return (currentUser && currentUser.avatar) ? currentUser.avatar : '👑';
    return onlineOpponentAvatar || '🌐';
  }
  if(gameMode==='ai'){
    if(col===playerColor && currentUser && currentUser.avatar) return currentUser.avatar;
    if(col===playerColor) return '👑';
    return CFG.aiAvatar || '🤖';
  }
  // MP: P1 (white) pakai foto akun jika login
  if(col==='w') return (currentUser && currentUser.avatar) ? currentUser.avatar : '♙';
  return '♟';
}

// Render avatar into pavatar element (supports photo)
function setAvatarEl(elId, av){
  const el = document.getElementById(elId);
  if(!el) return;
  renderAvatar(el, av);
}

/* ══════════════════════════════════
   RENDER BOARD
══════════════════════════════════ */
function renderBoard(){
  const el=document.getElementById('board'); el.innerHTML='';
  const chkSq=inChk(board,turn)?board.indexOf(turn+'K'):-1;
  for(let v=0;v<64;v++){
    const vr=Math.floor(v/8), vc=v%8;
    const ar=flipped?7-vr:vr, ac=flipped?7-vc:vc;
    const sq=SQ(ar,ac); const light=(ar+ac)%2===0;
    const div=document.createElement('div');
    div.className='sq '+(light?'light':'dark');
    div.style.background=light?CFG.theme.sl:CFG.theme.sd;
    if(selected===sq) div.classList.add('sel');
    if(CFG.showHints&&legalMoves.includes(sq)){
      if(board[sq]&&board[sq][0]!==turn) div.classList.add('capring'); else div.classList.add('dot');
    }
    if(sq===chkSq) div.classList.add('chksq');
    if(CFG.showLastMove&&lastMove){ if(sq===lastMove.from)div.classList.add('lasta'); else if(sq===lastMove.to)div.classList.add('lastb'); }
    if(board[sq]){ const sp=document.createElement('span'); sp.className='piece'; sp.textContent=SYM[board[sq]]; div.appendChild(sp); }
    div.addEventListener('click',()=>handleClick(sq));
    el.appendChild(div);
  }
  // Coordinates
  const files=flipped?'hgfedcba':'abcdefgh', ranks=flipped?'12345678':'87654321';
  const chbot=document.getElementById('chbot'), cvl=document.getElementById('cvl'), cvr=document.getElementById('cvr');
  if(CFG.showCoords){
    chbot.innerHTML=files.split('').map(f=>`<span class="cch">${f}</span>`).join('');
    cvl.innerHTML=cvr.innerHTML=ranks.split('').map(r=>`<span class="ccv">${r}</span>`).join('');
    [chbot,cvl,cvr].forEach(e=>e.style.display='flex');
  } else [chbot,cvl,cvr].forEach(e=>e.style.display='none');
  // Captured pieces: capW = white captured black; capB = black captured white
  // p2 panel (left) shows what black player has captured
  document.getElementById('cap-p2').innerHTML=capB.map(p=>`<span class="capp">${SYM[p]}</span>`).join('');
  // p1 panel (right) shows what white player has captured
  document.getElementById('cap-p1').innerHTML=capW.map(p=>`<span class="capp">${SYM[p]}</span>`).join('');
  // Move history
  const mh=document.getElementById('movehist');
  mh.innerHTML=moveLog.map((m,i)=>`<div class="mrow"><span class="mnum">${i+1}.</span><span class="mw${i===moveLog.length-1?' lat':''}">${m.w}</span><span class="mb${i===moveLog.length-1?' lat':''}">${m.b||''}</span></div>`).join('');
  mh.scrollTop=mh.scrollHeight;
}

/* ══════════════════════════════════
   UPDATE UI STATE
══════════════════════════════════ */
function updateUI(){
  const moves=allMoves(board,turn,epSq,cast);
  const chk=inChk(board,turn);

  // Determine which card is "my" card vs opponent's
  // In online: p2card = me (bottom), p1card = opponent (top)  [when Black/flipped]
  //            p1card = me (bottom), p2card = opponent (top)  [when White]
  // In AI/MP:  p1card = White (bottom), p2card = Black (top)
  // Active card = whoever's turn it is (same logic for all modes)
  document.getElementById('p1card').classList.toggle('active', turn==='w'&&!gameOver);
  document.getElementById('p2card').classList.toggle('active', turn==='b'&&!gameOver);
  document.getElementById('p1card').classList.toggle('incheck', turn==='w'&&chk&&!gameOver);
  document.getElementById('p2card').classList.toggle('incheck', turn==='b'&&chk&&!gameOver);

  const ti=document.getElementById('turnind');
  const cb=document.getElementById('chkbadge');
  const sb=document.getElementById('statbox');
  const curName=getName(turn);
  const isAITurn=gameMode==='ai'&&turn!==playerColor&&!gameOver;
  const isOnlineOpponentTurn=gameMode==='online'&&turn!==onlineColor&&!gameOver;
  ti.textContent = isAITurn
    ? t('aiThinking')
    : isOnlineOpponentTurn
      ? `${t('waitingFor')} ${onlineOpponentName}…`
      : `${curName}'s Turn`;
  ti.className='turnind '+(turn==='w'?'wt':'bt');
  cb.style.display=(chk&&!gameOver)?'inline':'none';
  if(!moves.length&&!gameOver){
    gameOver=true;
    showResult(chk?'checkmate':'stalemate', chk?(turn==='w'?'b':'w'):null);
    return;
  }
  if(chk&&!gameOver){
    statsChecks++;
    sb.textContent=`⚠ ${curName} ${t('inCheck')}`;
    sb.className='statbox chk';
  } else if(!gameOver){
    if(isAITurn) sb.textContent=t('aiCalculating');
    else if(isOnlineOpponentTurn) sb.textContent=`${t('waitingFor')} ${onlineOpponentName}…`;
    else sb.textContent=t('yourTurnSelect');
    sb.className='statbox';
  }
}

function showResult(type, winnerCol){
  stopTimer();
  const eloCard = document.getElementById('res-elo-card');
  if(eloCard) eloCard.style.display = 'none';

  const trophy=document.getElementById('res-trophy');
  const title=document.getElementById('res-title');
  const sub=document.getElementById('res-sub');
  const wcard=document.getElementById('res-winner');
  const wavEl=document.getElementById('res-wav');
  const colorName = col => col==='w' ? t('white') : t('black');
  if(type==='checkmate'){
    trophy.textContent='🏆'; title.textContent=t('checkmate'); sub.textContent=t('resultDecisive');
    renderAvatar(wavEl, getAvatar(winnerCol));
    document.getElementById('res-wname').textContent=getName(winnerCol);
    document.getElementById('res-wlbl').textContent=`${t('winner')} · ${colorName(winnerCol)}`;
    wcard.style.display='flex';
  } else if(type==='stalemate'){
    trophy.textContent='🤝'; title.textContent=t('stalemate'); sub.textContent=t('resultStalemate');
    wcard.style.display='none';
  } else if(type==='resign'){
    trophy.textContent='🏳'; title.textContent=t('resigned'); sub.textContent=t('resultResigned');
    renderAvatar(wavEl, getAvatar(winnerCol));
    document.getElementById('res-wname').textContent=getName(winnerCol);
    document.getElementById('res-wlbl').textContent=`${t('winner')} · ${colorName(winnerCol)}`;
    wcard.style.display='flex';
  } else if(type==='timeout'){
    trophy.textContent='⏱'; title.textContent=t('timesUp');
    sub.textContent=`${getName(winnerCol==='w'?'b':'w')} ${t('timeRanOut')}`;
    renderAvatar(wavEl, getAvatar(winnerCol));
    document.getElementById('res-wname').textContent=getName(winnerCol);
    document.getElementById('res-wlbl').textContent=`${t('winner')} · ${colorName(winnerCol)}`;
    wcard.style.display='flex';
  }
  document.getElementById('st-moves').textContent=moveLog.length;
  document.getElementById('st-caps').textContent=statsCaptures;
  document.getElementById('st-chks').textContent=statsChecks;

  if(gameMode==='online'){
    const winnerForElo = (type==='stalemate') ? null : winnerCol;
    handleOnlineRankUpdate(winnerForElo);
  }

  setTimeout(()=>goTo('screen-result'), 650);
}

/* ══════════════════════════════════
   CLICK HANDLER
══════════════════════════════════ */
async function handleClick(sq){
  if(gameOver||aiThinking) return;
  if(gameMode==='online'){
    await handleClickOnline(sq);
    return;
  }
  if(gameMode==='mp' && mpWaitingForReveal) return; // block all clicks until pass screen dismissed
  if(gameMode==='ai'&&turn!==playerColor) return; // block during AI turn
  if(selected===null){
    if(!board[sq]||board[sq][0]!==turn) return;
    selected=sq; legalMoves=movesFor(board,sq,epSq,cast); renderBoard();
  } else {
    if(legalMoves.includes(sq)){
      await applyMove(selected,sq,false);
      renderBoard(); updateUI();
      if(gameOver) return;
      if(gameMode==='ai') setTimeout(runAI,150);
      else mpAfterMove();
    } else if(board[sq]&&board[sq][0]===turn){
      selected=sq; legalMoves=movesFor(board,sq,epSq,cast); renderBoard();
    } else {
      selected=null; legalMoves=[]; renderBoard();
    }
  }
}

/* ══════════════════════════════════
   AI
══════════════════════════════════ */
function runAI(){
  const aiCol=playerColor==='w'?'b':'w';
  aiThinking=true;
  document.getElementById('thinkbar').classList.add('on');
  setTimeout(()=>{
    const m=findBest(board,CFG.aiDepth,epSq,cast,aiCol);
    if(m){
      applyMove(m.from,m.to,true).then(()=>{
        aiThinking=false;
        document.getElementById('thinkbar').classList.remove('on');
        renderBoard(); updateUI();
      });
    } else {
      aiThinking=false;
      document.getElementById('thinkbar').classList.remove('on');
      updateUI();
    }
  },60);
}

/* ══════════════════════════════════
   MULTIPLAYER PASS-AND-PLAY
══════════════════════════════════ */
let mpBannerTimer = null;

function mpAfterMove(){
  // Langsung lanjut — tidak ada flip, tidak ada banner
}



/* ══════════════════════════════════
   FLIP
══════════════════════════════════ */
function doFlip(){ flipped=!flipped; renderBoard(); }

/* ══════════════════════════════════
   START: AI MODE
══════════════════════════════════ */
function startAI(){
  CFG.playerName=document.getElementById('ai-name').value.trim()||'Player';
  CFG.aiName=document.getElementById('ai-name-opp').value.trim()||'Deep Mind';
  playerColor=CFG.playerColor;
  saveSettings();
  // Jika dari pause (pengaturan mid-game), kembali ke game tanpa reset
  if(fromPause){ returnToGame(); return; }
  gameMode='ai';
  resetState();
  flipped=(playerColor==='b');

  // Use logged-in user's avatar for player, CFG.aiAvatar for AI
  const playerAv = (currentUser && currentUser.avatar) ? currentUser.avatar : '👑';
  const aiAv     = CFG.aiAvatar || '🤖';

  if(playerColor==='w'){
    setPanel('p1', playerAv, CFG.playerName, `${t('humanLabel')} · ${t('white')}`);
    setPanel('p2', aiAv,     CFG.aiName,     `AI · ${t('black')}`);
    document.getElementById('cap-lbl-p1').textContent=t('capturedByYou');
    document.getElementById('cap-lbl-p2').textContent=`${t('capturedBy')} ${CFG.aiName}`;
  } else {
    setPanel('p1', aiAv,     CFG.aiName,     `AI · ${t('white')}`);
    setPanel('p2', playerAv, CFG.playerName, `${t('humanLabel')} · ${t('black')}`);
    document.getElementById('cap-lbl-p1').textContent=`${t('capturedBy')} ${CFG.aiName}`;
    document.getElementById('cap-lbl-p2').textContent=t('capturedByYou');
  }
  document.getElementById('gmbadge').textContent='vs AI';
  document.getElementById('gmbadge').className='gmodebadge ai';
  document.getElementById('pausesub').textContent=t('pauseSubAI');
  launchGame();
  if(playerColor==='b') setTimeout(runAI,500);
}

/* ══════════════════════════════════
   START: MULTIPLAYER
══════════════════════════════════ */
function setPanel(id,av,name,lbl){
  renderAvatar(document.getElementById(id+'av'), av);
  document.getElementById(id+'nm').textContent=name;
  document.getElementById(id+'lb').textContent=lbl;
}

/* ══════════════════════════════════
   TURN TIMER
══════════════════════════════════ */
const TIMER_SECS = 180; // 3 minutes
let timerInterval = null;
let timerSecsLeft = TIMER_SECS;
let timerEnabled = true;

function startTimer(){
  stopTimer();
  if(!timerEnabled) return;
  timerSecsLeft = TIMER_SECS;
  updateTimerDisplay();
  timerInterval = setInterval(tickTimer, 1000);
}

function stopTimer(){
  if(timerInterval){ clearInterval(timerInterval); timerInterval=null; }
}

function pauseTimer(){
  stopTimer();
}

function resumeTimer(){
  if(!timerEnabled || gameOver) return;
  timerInterval = setInterval(tickTimer, 1000);
}

function tickTimer(){
  if(gameOver){ stopTimer(); return; }
  // Pause counting during AI thinking or waiting for online opponent
  if(gameMode==='ai' && aiThinking) return;
  if(gameMode==='online' && turn!==onlineColor) return;
  timerSecsLeft--;
  updateTimerDisplay();
  if(timerSecsLeft <= 0){
    stopTimer();
    onTimerExpired();
  }
}

function updateTimerDisplay(){
  const el = document.getElementById('turn-timer');
  const disp = document.getElementById('timer-display');
  if(!el) return;
  const m = Math.floor(timerSecsLeft / 60);
  const s = timerSecsLeft % 60;
  disp.textContent = m + ':' + String(s).padStart(2,'0');
  el.classList.remove('warn','danger');
  if(timerSecsLeft <= 30) el.classList.add('danger');
  else if(timerSecsLeft <= 60) el.classList.add('warn');
}

function onTimerExpired(){
  if(gameOver) return;
  gameOver = true;
  // Player whose turn ran out loses
  const loser = turn;
  const winner = loser === 'w' ? 'b' : 'w';
  showToast(`⏱ ${getName(loser)} ${t('timeRanOut')}`, 3000);
  setTimeout(()=> showResult('timeout', winner), 600);
}

function setTimerEnabled(on){
  timerEnabled = on;
  const el = document.getElementById('turn-timer');
  if(el) el.style.display = on ? 'flex' : 'none';
  if(!on) stopTimer();
}



function resetState(){
  initBoard(); turn='w'; selected=null; legalMoves=[]; gameOver=false; aiThinking=false;
  epSq=null; cast={wK:true,wQ:true,bK:true,bQ:true};
  lastMove=null; history=[]; moveLog=[]; capW=[]; capB=[];
  statsChecks=0; statsCaptures=0; mpWaitingForReveal=false;
  stopTimer();
}

function launchGame(){
  document.getElementById('thinkbar').classList.remove('on');
  closePause();
  clearTimeout(mpBannerTimer);
  document.getElementById('mp-turn-banner').classList.remove('show','hide');
  mpWaitingForReveal=false;
  // Sync timer display visibility
  const timerEl = document.getElementById('turn-timer');
  if(timerEl) timerEl.style.display = timerEnabled ? 'flex' : 'none';
  goTo('screen-game');
  renderBoard(); updateUI();
  if(timerEnabled) startTimer();
}



/* ══════════════════════════════════
   ONLINE MULTIPLAYER
   Uses ntfy.sh — free public pub/sub
   No signup, works from any browser,
   no CORS issues, no WebSocket needed.
   Room code = unique topic name.
══════════════════════════════════ */

// ntfy.sh: POST to publish, GET with EventSource to subscribe
// Topic = "chessmstr_" + room code (6 chars) to avoid collisions
// Each message is JSON in the notification body

const NTFY = 'https://ntfy.sh';
const TOPIC_PFX = 'chessmstr_';

let onlineEs = null;       // EventSource for receiving
let onlineColor = 'w';
let onlineName = 'Player';
let onlineOpponentName = 'Opponent';
let onlineOpponentAvatar = '🌐'; // avatar lawan online
let onlineConnected = false;
let onlineRoomCode = '';
let onlineRole = '';
let onlineReady = false;
let onlineHelloTimer = null;
let onlineProcessedIds = new Set();
let onlineMoveSeq = 0;

function genCode(){
  const c='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s='';for(let i=0;i<6;i++)s+=c[Math.floor(Math.random()*c.length)];return s;
}

function topicName(code){ return TOPIC_PFX+code; }

// ── PUBLISH (send message) ──
async function ntfyPublish(code, payload){
  // payload = plain object, serialized to JSON string as message body
  const body = JSON.stringify(payload);
  try{
    await fetch(`${NTFY}/${topicName(code)}`, {
      method:'POST',
      headers:{'Content-Type':'application/json', 'Title':'chess'},
      body
    });
    return true;
  }catch(e){ return false; }
}

// ── SUBSCRIBE (receive messages) ──
function ntfySubscribe(code, onMsg){
  if(onlineEs){ try{onlineEs.close();}catch(e){} onlineEs=null; }
  // Use since=0 to get a stream of new messages only (not historical)
  const url = `${NTFY}/${topicName(code)}/sse?since=all&poll=1`;
  // Actually: we want only NEW messages. Use since=now (unix timestamp)
  const since = Math.floor(Date.now()/1000);
  const esUrl = `${NTFY}/${topicName(code)}/sse?since=${since}`;
  try{
    onlineEs = new EventSource(esUrl);
    onlineEs.onmessage = (ev)=>{
      try{
        const wrapper = JSON.parse(ev.data);
        // ntfy wraps our body in wrapper.message
        const data = JSON.parse(wrapper.message||'{}');
        // Deduplicate
        const id = wrapper.id||'';
        if(id && onlineProcessedIds.has(id)) return;
        if(id) onlineProcessedIds.add(id);
        // Ignore our own messages
        if(data.from === onlineColor) return;
        onMsg(data);
      }catch(e){}
    };
    onlineEs.onerror = ()=>{
      // SSE reconnects automatically; no action needed
    };
  }catch(e){
    showToast('Could not connect. Check internet.',4000);
  }
}

function stopSubscription(){
  if(onlineEs){ try{onlineEs.close();}catch(e){} onlineEs=null; }
  if(onlineHelloTimer){ clearInterval(onlineHelloTimer); onlineHelloTimer=null; }
}

// ── TAB SWITCH ──
function switchOTab(t){
  ['host','join'].forEach(id=>{
    document.getElementById('otab-'+id).classList.toggle('on',id===t);
    document.getElementById('opanel-'+id).classList.toggle('show',id===t);
  });
}

// ── BACK ──
function onlineBack(){
  // Jika dari pause mid-game, kembali ke game tanpa disconnect
  if(fromPause){ returnToGame(); return; }
  stopSubscription();
  onlineRoomCode='';onlineConnected=false;onlineReady=false;onlineOpponentAvatar='🌐';
  document.getElementById('online-waiting-overlay').classList.remove('show');
  goTo('screen-menu');
}

// ── HOST ──
async function hostGenerateRoom(){
  onlineName = document.getElementById('online-name').value.trim()||'Player';
  stopSubscription();

  const code = genCode();
  onlineRoomCode=code; onlineRole='host'; onlineColor='w';
  onlineMoveSeq=0; onlineProcessedIds=new Set(); onlineReady=false;

  const btn=document.getElementById('host-gen-btn');
  btn.disabled=true; btn.textContent='⏳ Setting up…';
  setHostStatus('waiting','Setting up room…');
  document.getElementById('host-room-id').textContent='——';
  document.getElementById('host-copy-btn').style.display='none';

  // Test connectivity first — kirim juga avatar
  const myAv = (currentUser && currentUser.avatar) ? currentUser.avatar : '👑';
  const ok = await ntfyPublish(code,{from:'w',type:'host_present',name:onlineName,avatar:myAv});
  if(!ok){
    setHostStatus('error','Cannot connect to server. Check internet.');
    btn.disabled=false; btn.textContent='⚡ Generate Room';
    return;
  }

  document.getElementById('host-room-id').textContent=code;
  document.getElementById('ow-room-id').textContent=code;
  document.getElementById('host-copy-btn').style.display='inline-block';
  setHostStatus('waiting','⏳ Waiting for opponent…');
  btn.disabled=false; btn.textContent='⚡ Regenerate';
  document.getElementById('online-waiting-overlay').classList.add('show');

  // Subscribe to receive joiner's message
  ntfySubscribe(code, (data)=>{
    if(data.type==='join_request' && !onlineReady){
      onlineOpponentName  = data.name||'Opponent';
      onlineOpponentAvatar= data.avatar||'🌐';
      onlineReady=true;
      clearInterval(onlineHelloTimer);
      // Confirm to joiner — kirim avatar kita
      ntfyPublish(code,{from:'w',type:'join_confirm',name:onlineName,avatar:myAv});
      document.getElementById('online-waiting-overlay').classList.remove('show');
      setHostStatus('connected','✓ '+onlineOpponentName+' joined!');
      onlineConnected=true;
      setTimeout(()=>startOnlineGame(),600);
    }
    // In-game messages handled in handleIncoming
    if(onlineReady && gameMode==='online') handleIncoming(data);
  });

  // Periodically announce presence so joiner can find us
  onlineHelloTimer=setInterval(()=>{
    if(!onlineReady) ntfyPublish(code,{from:'w',type:'host_present',name:onlineName,avatar:myAv});
  },3000);
}

function copyRoomId(){
  const code=document.getElementById('host-room-id').textContent;
  if(!code||code==='——') return;
  const doCopy=()=>{
    const ta=document.createElement('textarea');ta.value=code;
    ta.style.cssText='position:fixed;opacity:0;top:0;left:0;';
    document.body.appendChild(ta);ta.focus();ta.select();
    try{document.execCommand('copy');}catch(e){}
    document.body.removeChild(ta);
  };
  if(navigator.clipboard){navigator.clipboard.writeText(code).catch(doCopy);}
  else doCopy();
  const btn=document.getElementById('host-copy-btn');
  btn.textContent='✓ Copied!';
  setTimeout(()=>btn.textContent='📋 Copy Code',2000);
}

function cancelOnlineHost(){
  stopSubscription();
  onlineRoomCode='';
  document.getElementById('online-waiting-overlay').classList.remove('show');
  document.getElementById('host-room-id').textContent='——';
  document.getElementById('host-copy-btn').style.display='none';
  setHostStatus('waiting','Click Generate to create a room.');
  const btn=document.getElementById('host-gen-btn');
  btn.disabled=false; btn.textContent='⚡ Generate Room';
}

function setHostStatus(type,msg){
  const el=document.getElementById('host-conn-status');
  el.className='conn-status '+type;
  document.getElementById('host-conn-text').textContent=msg;
}

// ── JOIN ──
async function joinRoom(){
  onlineName = document.getElementById('online-name').value.trim()||'Player';
  const code = document.getElementById('join-code-input').value.trim().toUpperCase();
  if(code.length!==6){showJoinStatus('error','Enter a 6-letter code.');return;}

  stopSubscription();
  onlineRoomCode=code; onlineRole='join'; onlineColor='b';
  onlineMoveSeq=0; onlineProcessedIds=new Set(); onlineReady=false;

  const btn=document.getElementById('join-btn');
  btn.disabled=true; btn.textContent='⏳ Joining…';
  showJoinStatus('waiting','Connecting…');

  // Subscribe first, then announce ourselves
  const myAv = (currentUser && currentUser.avatar) ? currentUser.avatar : '👑';
  ntfySubscribe(code,(data)=>{
    if(data.type==='host_present' && !onlineReady){
      onlineOpponentName   = data.name||'Host';
      onlineOpponentAvatar = data.avatar||'🌐';
      // Send join request with our avatar
      ntfyPublish(code,{from:'b',type:'join_request',name:onlineName,avatar:myAv});
      showJoinStatus('waiting','Join request sent, waiting for host…');
    }
    if(data.type==='join_confirm' && !onlineReady){
      clearTimeout(onlineHelloTimer);
      onlineOpponentName   = data.name||'Host';
      onlineOpponentAvatar = data.avatar||'🌐';
      onlineReady=true; onlineConnected=true;
      showJoinStatus('connected','✓ Connected! Starting…');
      setTimeout(()=>startOnlineGame(),400);
    }
    if(onlineReady && gameMode==='online') handleIncoming(data);
  });

  // Send initial join request immediately
  await ntfyPublish(code,{from:'b',type:'join_request',name:onlineName,avatar:myAv});
  showJoinStatus('waiting','Waiting for host…');

  // Timeout if host never responds
  onlineHelloTimer=setTimeout(()=>{
    if(!onlineReady){
      stopSubscription();
      showJoinStatus('error','No host found. Check the code or ask host to regenerate.');
      btn.disabled=false; btn.textContent='🔗 Join Game';
    }
  },15000);
}

function showJoinStatus(type,msg){
  const el=document.getElementById('join-conn-status');
  el.style.display='flex'; el.className='conn-status '+type;
  document.getElementById('join-conn-text').textContent=msg;
}

// ── IN-GAME MESSAGE HANDLER ──
function handleIncoming(data){
  if(data.type==='move') receiveOnlineMove(data);
  if(data.type==='resign'&&!gameOver){ gameOver=true; showResult('resign',onlineColor); }
  if(data.type==='undo_req') handleOnlineUndoReq();
  if(data.type==='undo_ok') doUndoOnline();
  if(data.type==='undo_no') showToast('Opponent declined undo.');
}

// ── START GAME ──
function startOnlineGame(){
  stopSubscription();
  gameMode='online'; playerColor=onlineColor;
  resetState();
  flipped=(onlineColor==='b');

  const myAv  = (currentUser && currentUser.avatar) ? currentUser.avatar : '👑';
  const oppAv = onlineOpponentAvatar || '🌐';

  if(onlineColor==='w'){
    setPanel('p1', myAv,  onlineName,          `${t('youLabel')} · ${t('white')} ♙`);
    setPanel('p2', oppAv, onlineOpponentName,   `${t('oppLabel')} · ${t('black')} ♟`);
    document.getElementById('cap-lbl-p1').textContent=t('capturedByYou');
    document.getElementById('cap-lbl-p2').textContent=`${t('capturedBy')} ${onlineOpponentName}`;
  } else {
    setPanel('p1', oppAv, onlineOpponentName,   `${t('oppLabel')} · ${t('white')} ♙`);
    setPanel('p2', myAv,  onlineName,           `${t('youLabel')} · ${t('black')} ♟`);
    document.getElementById('cap-lbl-p1').textContent=`${t('capturedBy')} ${onlineOpponentName}`;
    document.getElementById('cap-lbl-p2').textContent=t('capturedByYou');
  }

  const badge=document.getElementById('gmbadge');
  badge.textContent='🌐 Online'; badge.className='gmodebadge';
  badge.style.borderColor='var(--blue)'; badge.style.color='var(--blue)';
  document.getElementById('pausesub').textContent=t('pauseSubOnline');

  launchGame();

  // Re-subscribe for in-game moves
  const since=Math.floor(Date.now()/1000);
  onlineEs=new EventSource(`${NTFY}/${topicName(onlineRoomCode)}/sse?since=${since}`);
  onlineEs.onmessage=(ev)=>{
    try{
      const wrapper=JSON.parse(ev.data);
      const data=JSON.parse(wrapper.message||'{}');
      const id=wrapper.id||'';
      if(id&&onlineProcessedIds.has(id)) return;
      if(id) onlineProcessedIds.add(id);
      if(data.from===onlineColor) return;
      if(gameMode==='online') handleIncoming(data);
    }catch(e){}
  };
}

// ── SEND MOVE ──
async function handleClickOnline(sq){
  if(turn!==onlineColor) return;
  if(selected===null){
    if(!board[sq]||board[sq][0]!==turn) return;
    selected=sq; legalMoves=movesFor(board,sq,epSq,cast); renderBoard();
  } else {
    if(legalMoves.includes(sq)){
      const from=selected;
      await applyMove(from,sq,false);
      ntfyPublish(onlineRoomCode,{from:onlineColor,type:'move',from_sq:from,to:sq,promo:board[sq],seq:onlineMoveSeq++});
      renderBoard(); updateUI();
    } else if(board[sq]&&board[sq][0]===turn){
      selected=sq; legalMoves=movesFor(board,sq,epSq,cast); renderBoard();
    } else {
      selected=null; legalMoves=[]; renderBoard();
    }
  }
}

async function receiveOnlineMove(mv){
  // mv.from_sq = source square (mv.from = color, so renamed)
  const fromSq = mv.from_sq;
  const fromPc=board[fromSq];
  const needsPromo=fromPc&&fromPc[1]==='P'&&(RW(mv.to)===0||RW(mv.to)===7);
  if(needsPromo&&mv.promo){await applyMove(fromSq,mv.to,true);board[mv.to]=mv.promo;}
  else await applyMove(fromSq,mv.to,false);
  renderBoard(); updateUI();
}

// ── UNDO ──
function requestOnlineUndo(){
  if(!onlineConnected){showToast('Not connected.');return;}
  ntfyPublish(onlineRoomCode,{from:onlineColor,type:'undo_req'});
  showToast('Undo request sent…');
}

function handleOnlineUndoReq(){
  const ok=confirm('Opponent requests to undo. Allow?');
  if(ok){ ntfyPublish(onlineRoomCode,{from:onlineColor,type:'undo_ok'}); doUndoOnline(); }
  else   ntfyPublish(onlineRoomCode,{from:onlineColor,type:'undo_no'});
}

function doUndoOnline(){
  for(let i=0;i<2;i++){if(history.length)history.pop();}
  if(!history.length){
    initBoard();turn='w';epSq=null;cast={wK:true,wQ:true,bK:true,bQ:true};
    lastMove=null;capW=[];capB=[];moveLog=[];statsChecks=0;statsCaptures=0;
  } else {
    const s=history[history.length-1];
    board=[...s.board];turn=s.turn;epSq=s.epSq;cast={...s.cast};
    lastMove=s.lastMove?{...s.lastMove}:null;
    capW=[...s.capW];capB=[...s.capB];
    moveLog=JSON.parse(JSON.stringify(s.moveLog));
    statsChecks=s.statsChecks;statsCaptures=s.statsCaptures;
  }
  selected=null;legalMoves=[];gameOver=false;
  closePause();renderBoard();updateUI();showToast('Move undone.');
}

// ── RESIGN ──
function doResignOnline(){
  if(gameOver) return;
  if(confirm('Resign? Opponent wins.')){
    gameOver=true;
    ntfyPublish(onlineRoomCode,{from:onlineColor,type:'resign'});
    showResult('resign',onlineColor==='w'?'b':'w');
  }
}

function showOnlineDisconnect(){
  onlineConnected=false;
  showToast('⚠ Opponent disconnected.',6000);
}

function getOnlineName(col){return col===onlineColor?onlineName:onlineOpponentName;}

function showToast(msg,duration=2800){
  let t=document.getElementById('toast-notif');
  if(!t){
    t=document.createElement('div');t.id='toast-notif';
    t.style.cssText='position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:var(--card);border:1px solid var(--border);border-radius:8px;padding:10px 20px;font-family:Cinzel,serif;font-size:.7rem;letter-spacing:.1em;color:var(--ivory-m);z-index:200;transition:opacity .3s;box-shadow:var(--sh-md);white-space:nowrap;max-width:90vw;text-align:center;';
    document.body.appendChild(t);
  }
  t.textContent=msg;t.style.opacity='1';
  clearTimeout(t._to);t._to=setTimeout(()=>t.style.opacity='0',duration);
}

function replayGame(){
  if(gameMode==='ai') startAI();
  else if(gameMode==='mp') startMP();
  else goTo('screen-online');
}
function goResSettings(){
  if(gameMode==='mp') goTo('screen-settings-mp');
  else if(gameMode==='online') goTo('screen-online');
  else goTo('screen-settings-ai');
}

/* ══════════════════════════════════
   CHANGELOG
══════════════════════════════════ */
const CHANGELOG_VERSION = 'v1.6.0';

function showChangelog(force=false){
  const skipped = localStorage.getItem('chessMasterChangelogSeen');
  if(!force && skipped === CHANGELOG_VERSION) return;
  // Reset checkbox
  const cb = document.getElementById('changelog-skip-cb');
  if(cb) cb.checked = false;
  document.getElementById('changelog-modal').classList.add('show');
}

function closeChangelog(){
  const skip = document.getElementById('changelog-skip-cb').checked;
  if(skip) localStorage.setItem('chessMasterChangelogSeen', CHANGELOG_VERSION);
  document.getElementById('changelog-modal').classList.remove('show');
}



/* ══════════════════════════════════
   SUPABASE CONFIG
   Isi dengan nilai dari dashboard Supabase kamu:
   https://app.supabase.com → Project → Settings → API
══════════════════════════════════ */
const SUPABASE_URL      = 'https://limftufjmdlbvgwkwjat.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpbWZ0dWZqbWRsYnZnd2t3amF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MDQ1NTQsImV4cCI6MjA5NjQ4MDU1NH0.HBPXG9JB6_HU0hr872m83jdQE8klfkyEY2gAZBa-H38';

const ELO_DEFAULT = 500;
const ELO_K       = 32;

// Cache agar tidak terlalu banyak request
let _playersCache    = null;
let _cacheTime       = 0;
let _accountsCache   = null;
let _accountsCacheTime = 0;
const CACHE_TTL      = 15000;
const ACCOUNTS_TTL   = 30000;

// ── Supabase REST helper ──
async function sbFetch(path, opts={}){
  const url = SUPABASE_URL + '/rest/v1/' + path;
  const res = await fetch(url, {
    ...opts,
    headers: {
      'apikey':        SUPABASE_ANON_KEY,
      'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
      'Content-Type':  'application/json',
      ...(opts.headers||{})
    }
  });
  if(!res.ok){
    const txt = await res.text().catch(()=>'');
    throw new Error('Supabase ' + res.status + ': ' + txt);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : [];
}

function sanitizeName(n){
  return n.trim().toLowerCase().replace(/[^a-z0-9]/g,'_').replace(/_+/g,'_').replace(/^_|_$/g,'').slice(0,24)||'player';
}

/* ── PLAYERS (ELO / leaderboard) ──
   Tabel Supabase: players
   Kolom: id, name, elo, wins, losses, draws, games
*/
async function fetchAllPlayers(forceRefresh=false){
  if(!forceRefresh && _playersCache && (Date.now()-_cacheTime < CACHE_TTL)) return _playersCache;
  try{
    const rows = await sbFetch('players?select=*&order=elo.desc');
    const map = {};
    rows.forEach(r=>{ map[sanitizeName(r.name)] = r; });
    _playersCache = map;
    _cacheTime = Date.now();
    return map;
  }catch(e){
    console.warn('fetchAllPlayers error:', e);
    return _playersCache || {};
  }
}

async function saveAllPlayers(players){
  _playersCache = players;
  _cacheTime = Date.now();
  // saveAllPlayers dipanggil batch — kita upsert tiap baris yg berubah
  // Handled inside submitOnlineResult per-player
}

/* ── Upsert satu player ke Supabase ── */
async function upsertPlayer(key, data){
  await sbFetch('players', {
    method: 'POST',
    headers: { 'Prefer': 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ name: data.name||key, elo: data.elo||ELO_DEFAULT,
      wins: data.wins||0, losses: data.losses||0, draws: data.draws||0, games: data.games||0 })
  });
}

/* ── ACCOUNTS (auth) ──
   Tabel Supabase: accounts
   Kolom: id, username, key, pw_hash, avatar, bio, elo, wins, losses, draws, games, created_at
*/
async function fetchAllAccounts(forceRefresh=false){
  if(!forceRefresh && _accountsCache && (Date.now()-_accountsCacheTime < ACCOUNTS_TTL)) return _accountsCache;
  try{
    const rows = await sbFetch('accounts?select=*');
    const map = {};
    rows.forEach(r=>{ map[r.key] = r; });
    _accountsCache = map;
    _accountsCacheTime = Date.now();
    return map;
  }catch(e){
    console.warn('fetchAllAccounts error:', e);
    return _accountsCache || {};
  }
}

async function saveAllAccounts(accounts){
  _accountsCache = accounts;
  _accountsCacheTime = Date.now();
  // Handled per-account in doSignup/saveEditProfile
}

/* ── Upsert satu account ke Supabase ── */
async function upsertAccount(acc){
  await sbFetch('accounts', {
    method: 'POST',
    headers: { 'Prefer': 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(acc)
  });
}

function calcElo(myElo, oppElo, result){
  const expected = 1 / (1 + Math.pow(10, (oppElo - myElo) / 400));
  const delta = Math.round(ELO_K * (result - expected));
  return { newElo: myElo + delta, delta };
}

async function submitOnlineResult(myName, oppName, myResult){
  // Ambil data kedua pemain
  const rows = await sbFetch(
    `players?name=in.(${encodeURIComponent(myName)},${encodeURIComponent(oppName)})&select=*`
  ).catch(()=>[]);

  const find = (n) => rows.find(r=>r.name.toLowerCase()===n.toLowerCase()) ||
    { name:n, elo:ELO_DEFAULT, wins:0, losses:0, draws:0, games:0 };

  const me  = find(myName);
  const opp = find(oppName);

  const rv  = myResult==='win'?1 : myResult==='draw'?0.5 : 0;
  const orv = 1 - rv;

  const myCalc  = calcElo(me.elo,  opp.elo, rv);
  const oppCalc = calcElo(opp.elo, me.elo,  orv);

  me.elo  = Math.max(100, myCalc.newElo);  me.games++;
  opp.elo = Math.max(100, oppCalc.newElo); opp.games++;

  if(myResult==='win')       { me.wins++;   opp.losses++; }
  else if(myResult==='loss') { me.losses++; opp.wins++;   }
  else                       { me.draws++;  opp.draws++;  }

  // Upsert keduanya ke Supabase
  await Promise.all([upsertPlayer(sanitizeName(myName), me), upsertPlayer(sanitizeName(oppName), opp)]);

  // Update cache
  _playersCache = null; // force refresh next time

  return { myDelta: myCalc.delta, oppDelta: oppCalc.delta, myElo: me.elo, oppElo: opp.elo };
}

function showEloCard(myName, oppName, myDelta, oppDelta, myElo, oppElo){
  const card   = document.getElementById('res-elo-card');
  const rowMe  = document.getElementById('elo-row-me');
  const rowOpp = document.getElementById('elo-row-opp');
  if(!card) return;
  const fmt = d => d>0 ? `<span class="elo-delta up">▲+${d}</span>`
                 : d<0 ? `<span class="elo-delta dn">▼${d}</span>`
                       : `<span class="elo-delta eq">—0</span>`;
  rowMe.innerHTML  = `<span class="elo-name">👑 ${myName}</span><span><span class="elo-val">${myElo}</span>${fmt(myDelta)}</span>`;
  rowOpp.innerHTML = `<span class="elo-name">🌐 ${oppName}</span><span><span class="elo-val">${oppElo}</span>${fmt(oppDelta)}</span>`;
  card.style.display = 'block';
}

async function handleOnlineRankUpdate(winnerCol){
  if(gameMode !== 'online') return;
  const myResult = winnerCol===null ? 'draw' : winnerCol===onlineColor ? 'win' : 'loss';
  try{
    const res = await submitOnlineResultWithSync(onlineName, onlineOpponentName, myResult);
    showEloCard(onlineName, onlineOpponentName, res.myDelta, res.oppDelta, res.myElo, res.oppElo);
  }catch(e){ console.warn('ELO update failed:', e); }
}

/* ══════════════════════════════════
   LEADERBOARD + RANK TIER SYSTEM
   Tier berdasarkan ELO:
   Newcomer  < 1050  | Bronze 1050 | Silver 1150
   Gold 1300 | Emerald 1450 | Diamond 1600
   Master 1800 | Grandmaster 2000+
══════════════════════════════════ */
const RANK_IMGS = {
  Bronze:      'asset/rank/Bronze.png',
  Silver:      'asset/rank/Silver.png',
  Gold:        'asset/rank/Gold.png',
  Emerald:     'asset/rank/Emerald.png',
  Diamond:     'asset/rank/Diamond.png',
  Master:      'asset/rank/Master.png',
  Grandmaster: 'asset/rank/Grandmaster.png',
};

function getRankTier(elo){
  if(elo >= 2000) return { name:'Grandmaster', color:'#ff6b35', bg:'rgba(255,107,53,.12)',  border:'rgba(255,107,53,.4)',  img:RANK_IMGS.Grandmaster, icon:'👑' };
  if(elo >= 1800) return { name:'Master',      color:'#c084fc', bg:'rgba(192,132,252,.12)', border:'rgba(192,132,252,.4)', img:RANK_IMGS.Master,      icon:'🔮' };
  if(elo >= 1600) return { name:'Diamond',     color:'#67e8f9', bg:'rgba(103,232,249,.12)', border:'rgba(103,232,249,.4)', img:RANK_IMGS.Diamond,     icon:'💎' };
  if(elo >= 1450) return { name:'Emerald',     color:'#4ade80', bg:'rgba(74,222,128,.12)',  border:'rgba(74,222,128,.4)',  img:RANK_IMGS.Emerald,     icon:'🟢' };
  if(elo >= 1300) return { name:'Gold',        color:'#fbbf24', bg:'rgba(251,191,36,.12)',  border:'rgba(251,191,36,.4)',  img:RANK_IMGS.Gold,        icon:'🥇' };
  if(elo >= 1150) return { name:'Silver',      color:'#cbd5e1', bg:'rgba(203,213,225,.10)', border:'rgba(203,213,225,.3)', img:RANK_IMGS.Silver,      icon:'🥈' };
  if(elo >= 1050) return { name:'Bronze',      color:'#cd7f32', bg:'rgba(205,127,50,.12)',  border:'rgba(205,127,50,.4)',  img:RANK_IMGS.Bronze,      icon:'🥉' };
  return           { name:'Newcomer',          color:'#94a3b8', bg:'rgba(148,163,184,.08)', border:'rgba(148,163,184,.25)',img:null,                  icon:'⚪' };
}

async function openLeaderboard(){
  goTo('screen-leaderboard');
  await loadLeaderboard();
}

async function loadLeaderboard(){
  const statusEl = document.getElementById('lb-status');
  const tbody    = document.getElementById('lb-body');
  statusEl.textContent = '⏳ Memuat peringkat…';
  statusEl.style.display = 'block';
  tbody.innerHTML = '';

  try{
    const rows = await sbFetch('players?select=*&order=elo.desc');
    const list = rows.filter(p => p && p.elo != null);

    if(!list.length){
      statusEl.innerHTML = '<div style="text-align:center;padding:30px 0;color:var(--ivory-d)">🏁 Belum ada pemain.<br><small>Mainkan game online untuk masuk leaderboard!</small></div>';
      statusEl.style.display = 'block';
      return;
    }
    statusEl.style.display = 'none';

    const myUsername = currentUser
      ? currentUser.username.toLowerCase()
      : (document.getElementById('online-name')?.value || onlineName || '').trim().toLowerCase();

    list.forEach((p, i) => {
      const rank    = i + 1;
      const elo     = p.elo || ELO_DEFAULT;
      const tier    = getRankTier(elo);
      const wins    = p.wins   || 0;
      const losses  = p.losses || 0;
      const draws   = p.draws  || 0;
      const games   = p.games  || (wins + losses + draws);
      const winPct  = games > 0 ? Math.round(wins * 100 / games) : 0;

      const pName = (p.name || '').trim().toLowerCase();
      const isMe  = pName === myUsername;

      const rankBadge =
        rank === 1 ? `<span class="lb-pos lb-pos-1">1</span>` :
        rank === 2 ? `<span class="lb-pos lb-pos-2">2</span>` :
        rank === 3 ? `<span class="lb-pos lb-pos-3">3</span>` :
                     `<span class="lb-pos">${rank}</span>`;

      const tierIcon = tier.img
        ? `<img src="${tier.img}" class="lb-tier-img" alt="${tier.name}">`
        : tier.icon;
      const tierBadge = `<span class="lb-tier" style="color:${tier.color};border-color:${tier.border};background:${tier.bg}">${tierIcon} ${tier.name}</span>`;

      const barColor = winPct >= 60 ? '#4ade80' : winPct >= 40 ? '#fbbf24' : '#f87171';
      const winBar   = `<div class="lb-winbar"><div class="lb-winbar-fill" style="width:${winPct}%;background:${barColor}"></div></div><span class="lb-winpct">${winPct}%</span>`;

      const tr = document.createElement('tr');
      if(isMe) tr.className = 'lb-me';
      tr.innerHTML = `
        <td class="lb-rank-col">${rankBadge}</td>
        <td class="lb-name-col">
          <div class="lb-player-row">
            <span class="lb-name">${p.name || '—'}${isMe ? ' <span class="lb-me-tag">(kamu)</span>' : ''}</span>
            ${tierBadge}
          </div>
          <div class="lb-sub">${winBar}</div>
        </td>
        <td class="lb-elo-col">${elo}</td>
        <td style="text-align:center;color:#4ade80">${wins}</td>
        <td style="text-align:center;color:#f87171">${losses}</td>
        <td style="text-align:center;color:var(--ivory-m)">${draws}</td>`;
      tbody.appendChild(tr);
    });
  }catch(e){
    statusEl.innerHTML = `<div style="text-align:center;padding:20px;color:#f87171">❌ Gagal memuat.<br><small>${e.message}</small></div>`;
    statusEl.style.display = 'block';
    console.error('Leaderboard error:', e);
  }
}



/* Accounts via Supabase — constants already defined above */

let currentUser = null;
let selectedAvatar = '♔';      // emoji or 'photo:' prefixed base64
let selectedEditAvatar = '♔';

function simpleHash(str){
  let h = 5381;
  for(let i=0;i<str.length;i++) h = ((h<<5)+h) ^ str.charCodeAt(i);
  return (h >>> 0).toString(36);
}

/* ── AVATAR HELPERS ── */
function isPhotoAvatar(av){ return av && av.startsWith('data:image'); }

// Render avatar into any element (emoji as text, photo as <img>)
function renderAvatar(el, av){
  if(!el) return;
  if(isPhotoAvatar(av)){
    el.innerHTML = `<img src="${av}" style="width:100%;height:100%;border-radius:inherit;object-fit:cover;">`;
    el.style.fontSize = '0';
  } else {
    el.innerHTML = av||'♔';
    el.style.fontSize = '';
  }
}

function handleAvatarUpload(input, context){
  const file = input.files[0];
  if(!file) return;
  if(file.size > 5*1024*1024){ // 5MB raw file limit
    showToast('⚠ Ukuran file max 5MB.');
    input.value = '';
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e){
    const img = new Image();
    img.onload = function(){
      // Compress aggressively: 48x48px JPEG q=0.4 → ~1-2KB base64
      const canvas = document.createElement('canvas');
      canvas.width = 48; canvas.height = 48;
      const ctx = canvas.getContext('2d');
      // Crop square from center
      const minSide = Math.min(img.width, img.height);
      const sx = (img.width - minSide) / 2;
      const sy = (img.height - minSide) / 2;
      ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, 48, 48);
      const compressed = canvas.toDataURL('image/jpeg', 0.4);
      // compressed is now ~1-2KB base64 — very storage-friendly

      if(context==='signup'){
        selectedAvatar = compressed;
        document.getElementById('signup-av-img').src = compressed;
        document.getElementById('signup-av-preview').style.display = 'flex';
        document.querySelectorAll('#avatar-picker .av-opt').forEach(e=>e.classList.remove('on'));
      } else {
        selectedEditAvatar = compressed;
        document.getElementById('edit-av-img').src = compressed;
        document.getElementById('edit-av-preview').style.display = 'flex';
        document.querySelectorAll('#edit-avatar-picker .av-opt').forEach(e=>e.classList.remove('on'));
      }
    };
    img.onerror = function(){ showToast('⚠ Gagal membaca gambar.'); };
    img.src = e.target.result;
  };
  reader.onerror = function(){ showToast('⚠ Gagal membaca file.'); };
  reader.readAsDataURL(file);
}

function removeAvatarUpload(context){
  if(context==='signup'){
    selectedAvatar = '♔';
    document.getElementById('signup-av-preview').style.display = 'none';
    document.getElementById('signup-av-img').src = '';
    document.getElementById('signup-avatar-file').value = '';
    // Re-select default emoji
    const first = document.querySelector('#avatar-picker .av-opt');
    if(first){ first.classList.add('on'); selectedAvatar=first.dataset.av; }
  } else {
    selectedEditAvatar = currentUser?.avatar||'♔';
    document.getElementById('edit-av-preview').style.display = 'none';
    document.getElementById('edit-av-img').src = '';
    document.getElementById('edit-avatar-file').value = '';
    document.querySelectorAll('#edit-avatar-picker .av-opt').forEach(e=>{
      e.classList.toggle('on', e.dataset.av===selectedEditAvatar);
    });
  }
}

function pickAvatar(el){
  document.querySelectorAll('#avatar-picker .av-opt').forEach(e=>e.classList.remove('on'));
  el.classList.add('on');
  selectedAvatar = el.dataset.av;
  // Clear photo if emoji selected
  document.getElementById('signup-av-preview').style.display = 'none';
  document.getElementById('signup-av-img').src = '';
  document.getElementById('signup-avatar-file').value = '';
}

function pickEditAvatar(el){
  document.querySelectorAll('#edit-avatar-picker .av-opt').forEach(e=>e.classList.remove('on'));
  el.classList.add('on');
  selectedEditAvatar = el.dataset.av;
  document.getElementById('edit-av-preview').style.display = 'none';
  document.getElementById('edit-av-img').src = '';
  document.getElementById('edit-avatar-file').value = '';
}

/* ── AI AVATAR ── */
function pickAIAvatar(el){
  document.querySelectorAll('#ai-emoji-row .av-opt').forEach(e=>e.classList.remove('on'));
  el.classList.add('on');
  CFG.aiAvatar = el.dataset.av;
  document.getElementById('ai-av-preview-wrap').style.display = 'none';
  document.getElementById('ai-av-preview-img').src = '';
  document.getElementById('ai-avatar-file').value = '';
  renderAvatar(document.getElementById('ai-avatar-preview'), CFG.aiAvatar);
}

function handleAIAvatarUpload(input){
  const file = input.files[0];
  if(!file) return;
  if(file.size > 5*1024*1024){ showToast('⚠ File max 5MB.'); input.value=''; return; }
  const reader = new FileReader();
  reader.onload = function(e){
    const img = new Image();
    img.onload = function(){
      const canvas = document.createElement('canvas');
      canvas.width = 48; canvas.height = 48;
      const ctx = canvas.getContext('2d');
      const minSide = Math.min(img.width, img.height);
      const sx = (img.width - minSide)/2, sy = (img.height - minSide)/2;
      ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, 48, 48);
      const compressed = canvas.toDataURL('image/jpeg', 0.4);
      CFG.aiAvatar = compressed;
      renderAvatar(document.getElementById('ai-avatar-preview'), compressed);
      document.getElementById('ai-av-preview-img').src = compressed;
      document.getElementById('ai-av-preview-wrap').style.display = 'flex';
      document.querySelectorAll('#ai-emoji-row .av-opt').forEach(e=>e.classList.remove('on'));
    };
    img.onerror = ()=>showToast('⚠ Failed to read image.');
    img.src = e.target.result;
  };
  reader.onerror = ()=>showToast('⚠ Failed to read file.');
  reader.readAsDataURL(file);
}

function removeAIAvatarUpload(){
  CFG.aiAvatar = '🤖';
  document.getElementById('ai-av-preview-wrap').style.display = 'none';
  document.getElementById('ai-av-preview-img').src = '';
  document.getElementById('ai-avatar-file').value = '';
  const first = document.querySelector('#ai-emoji-row .av-opt');
  if(first){ first.classList.add('on'); }
  renderAvatar(document.getElementById('ai-avatar-preview'), '🤖');
}

/* fetchAllAccounts & saveAllAccounts sudah di blok Supabase di atas */

function switchAuthTab(tab){
  ['login','signup'].forEach(t=>{
    document.getElementById('atab-'+t).classList.toggle('on', t===tab);
    document.getElementById('apanel-'+t).classList.toggle('show', t===tab);
  });
  document.getElementById('login-err').textContent='';
  document.getElementById('signup-err').textContent='';
}

function togglePw(inputId, btn){
  const el = document.getElementById(inputId);
  if(el.type==='password'){ el.type='text'; btn.textContent='🙈'; }
  else { el.type='password'; btn.textContent='👁'; }
}

function setAuthLoading(id, loading){
  const btn = document.getElementById(id);
  if(!btn) return;
  btn.disabled = loading;
  btn.textContent = loading ? '⏳ Memproses…' : (id==='login-btn' ? 'Masuk →' : 'Buat Akun →');
}

async function doSignup(){
  const username = document.getElementById('signup-username').value.trim();
  const password = document.getElementById('signup-password').value;
  const bio      = document.getElementById('signup-bio').value.trim();
  const errEl    = document.getElementById('signup-err');
  errEl.textContent = '';
  if(!username || username.length<3){ errEl.textContent='⚠ Username minimal 3 karakter.'; return; }
  if(!/^[a-zA-Z0-9_]+$/.test(username)){ errEl.textContent='⚠ Hanya huruf, angka, underscore.'; return; }
  if(!password || password.length<4){ errEl.textContent='⚠ Password minimal 4 karakter.'; return; }
  setAuthLoading('signup-btn', true);
  const key = username.toLowerCase();
  try{
    const existing = await sbFetch('accounts?key=eq.'+encodeURIComponent(key)+'&select=key');
    if(existing && existing.length){ errEl.textContent='⚠ Username sudah dipakai.'; setAuthLoading('signup-btn',false); return; }
  }catch(e){ errEl.textContent='⚠ Gagal cek username.'; setAuthLoading('signup-btn',false); return; }
  const newAcc = { username, key, pw_hash:simpleHash(password), avatar:selectedAvatar, bio,
    elo:ELO_DEFAULT, wins:0, losses:0, draws:0, games:0, created_at:new Date().toISOString() };
  // Simpan ke Supabase
  await upsertAccount(newAcc);
  // Buat entry di tabel players untuk leaderboard
  await upsertPlayer(key, {name:username, elo:ELO_DEFAULT, wins:0,losses:0,draws:0,games:0});
  setAuthLoading('signup-btn', false);
  loginUser(newAcc);
}

async function doLogin(){
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  const errEl    = document.getElementById('login-err');
  errEl.textContent = '';
  if(!username){ errEl.textContent='⚠ Masukkan username.'; return; }
  if(!password){ errEl.textContent='⚠ Masukkan password.'; return; }
  setAuthLoading('login-btn', true);
  try{
    const key = username.toLowerCase();
    const rows = await sbFetch('accounts?key=eq.'+encodeURIComponent(key)+'&select=*');
    const acc = rows && rows[0];
    if(!acc || acc.pw_hash !== simpleHash(password)){
      document.getElementById('login-err').textContent='⚠ Username atau password salah.';
      setAuthLoading('login-btn',false); return;
    }
    setAuthLoading('login-btn', false);
    loginUser(acc);
  }catch(e){
    document.getElementById('login-err').textContent='⚠ Gagal terhubung. Coba lagi.';
    setAuthLoading('login-btn',false);
  }
}

function skipAuth(){
  currentUser = null;
  localStorage.removeItem('chessMasterSession');
  goTo('screen-menu');
  updateMenuProfile();
  setTimeout(showChangelog, 600);
}

function loginUser(account){
  currentUser = account;
  localStorage.setItem('chessMasterSession', JSON.stringify({ key:account.key, username:account.username }));
  // Sync username ke semua name input
  const _onN = document.getElementById('online-name');
  if(_onN) _onN.value = account.username;
  const _aiN = document.getElementById('ai-name');
  if(_aiN) _aiN.value = account.username;
  CFG.playerName = account.username;
  goTo('screen-menu');
  updateMenuProfile();
  showToast(`✓ Selamat datang, ${account.username}!`);
  setTimeout(showChangelog, 600);
}
function doLogout(){
  currentUser = null;
  localStorage.removeItem('chessMasterSession');
  CFG.playerName = 'Player';
  const _aiN = document.getElementById('ai-name');
  if(_aiN) _aiN.value = 'Player';
  const _onN = document.getElementById('online-name');
  if(_onN) _onN.value = 'Player';
  closeProfile();
  updateMenuProfile();
  document.getElementById('screen-menu').classList.add('hidden');
  document.getElementById('screen-auth').classList.remove('hidden');
  curScreen = 'screen-auth';
  showToast('Berhasil logout.');
}
function updateMenuProfile(){
  const bar = document.getElementById('profile-bar');
  if(!bar) return;
  if(!currentUser){ bar.classList.add('hidden'); return; }
  bar.classList.remove('hidden');
  renderAvatar(document.getElementById('pb-avatar'), currentUser.avatar||'♔');
  document.getElementById('pb-name').textContent = currentUser.username;
  document.getElementById('pb-elo').textContent  = `ELO ${currentUser.elo||ELO_DEFAULT}`;
}

function openProfile(){
  if(!currentUser) return;
  renderAvatar(document.getElementById('pm-avatar'), currentUser.avatar||'♔');
  document.getElementById('pm-username').textContent = currentUser.username;
  document.getElementById('pm-bio').textContent      = currentUser.bio||'';
  document.getElementById('pm-elo').textContent      = currentUser.elo||ELO_DEFAULT;
  document.getElementById('pm-wins').textContent     = currentUser.wins||0;
  document.getElementById('pm-losses').textContent   = currentUser.losses||0;
  document.getElementById('pm-draws').textContent    = currentUser.draws||0;
  document.getElementById('profile-edit-form').classList.add('hidden');
  document.getElementById('profile-modal').classList.add('show');
}
function closeProfile(){ document.getElementById('profile-modal').classList.remove('show'); }

function openEditProfile(){
  if(!currentUser) return;
  document.getElementById('edit-bio').value = currentUser.bio||'';
  document.getElementById('edit-password').value = '';
  document.getElementById('edit-err').textContent = '';
  selectedEditAvatar = currentUser.avatar||'♔';
  // If current avatar is a photo, show it in preview; otherwise highlight emoji
  if(isPhotoAvatar(selectedEditAvatar)){
    document.getElementById('edit-av-img').src = selectedEditAvatar;
    document.getElementById('edit-av-preview').style.display = 'flex';
    document.querySelectorAll('#edit-avatar-picker .av-opt').forEach(e=>e.classList.remove('on'));
  } else {
    document.getElementById('edit-av-preview').style.display = 'none';
    document.querySelectorAll('#edit-avatar-picker .av-opt').forEach(e=>{
      e.classList.toggle('on', e.dataset.av===selectedEditAvatar);
    });
  }
  document.getElementById('profile-edit-form').classList.remove('hidden');
}
function closeEditProfile(){ document.getElementById('profile-edit-form').classList.add('hidden'); }

async function saveEditProfile(){
  if(!currentUser) return;
  const bio   = document.getElementById('edit-bio').value.trim();
  const newPw = document.getElementById('edit-password').value;
  const errEl = document.getElementById('edit-err');
  errEl.textContent = '';
  if(newPw && newPw.length<4){ errEl.textContent='⚠ Password baru minimal 4 karakter.'; return; }
  // Update objek currentUser
  const acc = { ...currentUser, avatar:selectedEditAvatar, bio };
  if(newPw) acc.pw_hash = simpleHash(newPw);
  try{
    await upsertAccount(acc);
    // Sync nama ke tabel players
    await sbFetch('players?name=eq.'+encodeURIComponent(acc.username), {
      method:'PATCH', headers:{'Prefer':'return=minimal'},
      body: JSON.stringify({ name: acc.username })
    }).catch(()=>{});
    currentUser = acc;
    openProfile();
    closeEditProfile();
    updateMenuProfile();
    showToast('✓ Profil diperbarui!');
  }catch(e){
    errEl.textContent = '⚠ Gagal menyimpan: ' + e.message;
  }
}

async function checkAutoLogin(){
  const session = localStorage.getItem('chessMasterSession');
  if(!session) return;
  try{
    const { key } = JSON.parse(session);
    // Ambil langsung dari Supabase
    const rows = await sbFetch('accounts?key=eq.'+encodeURIComponent(key)+'&select=*');
    if(!rows || !rows.length){ localStorage.removeItem('chessMasterSession'); return; }
    const acc = rows[0];
    // Sync ELO terbaru dari tabel players
    try{
      const pr = await sbFetch('players?name=eq.'+encodeURIComponent(acc.username)+'&select=elo,wins,losses,draws,games');
      if(pr && pr.length){
        const p = pr[0];
        if(p.elo    !== undefined) acc.elo    = p.elo;
        if(p.wins   !== undefined) acc.wins   = p.wins;
        if(p.losses !== undefined) acc.losses = p.losses;
        if(p.draws  !== undefined) acc.draws  = p.draws;
        if(p.games  !== undefined) acc.games  = p.games;
      }
    }catch(e2){}
    loginUser(acc);
  }catch(e){ console.warn('checkAutoLogin error:', e); localStorage.removeItem('chessMasterSession'); }
}
async function submitOnlineResultWithSync(myName, oppName, myResult){
  const res = await submitOnlineResult(myName, oppName, myResult);
  // Sync ELO & stats ke tabel accounts juga
  if(currentUser && currentUser.username.toLowerCase() === myName.toLowerCase()){
    currentUser.elo    = res.myElo;
    currentUser.games  = (currentUser.games||0)+1;
    if(myResult==='win')       currentUser.wins   = (currentUser.wins||0)+1;
    else if(myResult==='loss') currentUser.losses = (currentUser.losses||0)+1;
    else                       currentUser.draws  = (currentUser.draws||0)+1;
    await upsertAccount(currentUser);
    updateMenuProfile();
  }
  return res;
}

checkAutoLogin();

function saveSettings(){
  try{
    // Read live input values before saving
    const _ni = document.getElementById('ai-name');
    if(_ni && _ni.value.trim()) CFG.playerName = _ni.value.trim();
    const _ai = document.getElementById('ai-name-opp');
    if(_ai && _ai.value.trim()) CFG.aiName = _ai.value.trim();
    const data={
      playerName: CFG.playerName,
      aiName:     CFG.aiName,
      aiAvatar:   CFG.aiAvatar,
      playerColor:CFG.playerColor,
      aiDepth:    CFG.aiDepth,
      p1Name:     CFG.p1Name,
      p2Name:     CFG.p2Name,
      showHints:  CFG.showHints,
      showCoords: CFG.showCoords,
      showLastMove:CFG.showLastMove,
    };
    localStorage.setItem('chessMasterSettings', JSON.stringify(data));
  }catch(e){}
}
function loadSettings(){
  try{
    const raw=localStorage.getItem('chessMasterSettings');
    if(!raw) return;
    const data=JSON.parse(raw);
    // Apply to CFG
    if(data.playerName) CFG.playerName=data.playerName;
    if(data.aiName)     CFG.aiName=data.aiName;
    if(data.aiAvatar){
      CFG.aiAvatar = data.aiAvatar;
      const prev = document.getElementById('ai-avatar-preview');
      if(prev) renderAvatar(prev, CFG.aiAvatar);
      if(CFG.aiAvatar.startsWith('data:image')){
        const img = document.getElementById('ai-av-preview-img');
        const wrap = document.getElementById('ai-av-preview-wrap');
        if(img) img.src = CFG.aiAvatar;
        if(wrap) wrap.style.display = 'flex';
        document.querySelectorAll('#ai-emoji-row .av-opt').forEach(e=>e.classList.remove('on'));
      } else {
        document.querySelectorAll('#ai-emoji-row .av-opt').forEach(e=>{
          e.classList.toggle('on', e.dataset.av===CFG.aiAvatar);
        });
      }
    }
    if(data.playerColor) CFG.playerColor=data.playerColor;
    if(data.aiDepth)    CFG.aiDepth=data.aiDepth;
    if(data.p1Name)     CFG.p1Name=data.p1Name;
    if(data.p2Name)     CFG.p2Name=data.p2Name;
    if(data.showHints!==undefined)    CFG.showHints=data.showHints;
    if(data.showCoords!==undefined)   CFG.showCoords=data.showCoords;
    if(data.showLastMove!==undefined) CFG.showLastMove=data.showLastMove;
    // Apply to UI inputs
    const aiNameEl=document.getElementById('ai-name');
    if(aiNameEl) aiNameEl.value=CFG.playerName;
    const aiNameOppEl=document.getElementById('ai-name-opp');
    if(aiNameOppEl) aiNameOppEl.value=CFG.aiName;
    const mp1El=document.getElementById('mp-p1');
    if(mp1El) mp1El.value=CFG.p1Name;
    const mp2El=document.getElementById('mp-p2');
    if(mp2El) mp2El.value=CFG.p2Name;
    // Color chip
    document.querySelectorAll('#chip-w,#chip-b').forEach(e=>e.classList.remove('on'));
    const chipEl=document.getElementById('chip-'+CFG.playerColor);
    if(chipEl) chipEl.classList.add('on');
    // Difficulty chip
    document.querySelectorAll('#d1,#d2,#d3,#d4,#d5').forEach(e=>e.classList.remove('on'));
    const diffEl=document.getElementById('d'+CFG.aiDepth);
    if(diffEl){ diffEl.classList.add('on'); document.getElementById('diffdesc').textContent=getDiffDesc(CFG.aiDepth); }
    // Toggles
    ['ai-tog-hints','mp-tog-hints'].forEach(id=>{
      const el=document.getElementById(id); if(el) el.classList.toggle('on',CFG.showHints);
    });
    ['ai-tog-coords','mp-tog-coords'].forEach(id=>{
      const el=document.getElementById(id); if(el) el.classList.toggle('on',CFG.showCoords);
    });
    const lastEl=document.getElementById('ai-tog-last');
    if(lastEl) lastEl.classList.toggle('on',CFG.showLastMove);
  }catch(e){}
}

// Also save settings when MP starts
// Patch startMP to save
function startMP(){
  CFG.p1Name=document.getElementById('mp-p1').value.trim()||'Player 1';
  CFG.p2Name=document.getElementById('mp-p2').value.trim()||'Player 2';
  saveSettings();
  // Jika dari pause (pengaturan mid-game), kembali ke game tanpa reset
  if(fromPause){ returnToGame(); return; }
  gameMode='mp';
  resetState();
  flipped=false;
  // Gunakan avatar akun yang login untuk P1, P2 pakai emoji default
  const p1av = (currentUser && currentUser.avatar) ? currentUser.avatar : '♙';
  setPanel('p1', p1av,  CFG.p1Name, `${t('humanLabel')} · ${t('white')}`);
  setPanel('p2', '♟',   CFG.p2Name, `${t('humanLabel')} · ${t('black')}`);
  document.getElementById('cap-lbl-p1').textContent=`${t('capturedBy')} ${CFG.p1Name}`;
  document.getElementById('cap-lbl-p2').textContent=`${t('capturedBy')} ${CFG.p2Name}`;
  document.getElementById('gmbadge').textContent=t('twoPlayers');
  document.getElementById('gmbadge').className='gmodebadge mp';
  document.getElementById('pausesub').textContent=t('pauseSubMP');
  launchGame();
}

// Init on load
loadSettings();
