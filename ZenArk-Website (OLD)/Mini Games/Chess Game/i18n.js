/* ══════════════════════════════════
   CHESS MASTER — Language / i18n System
   Bahasa: Indonesia (id), English (en),
           中文简体 (zh), 日本語 (ja), Bahasa Melayu (ms)
   v1.6.0
══════════════════════════════════ */
const LANGS = {

/* ──────────────────────────────────
   BAHASA INDONESIA
────────────────────────────────── */
id: {
  tagline:'Permainan Kerajaan',
  vsAI:'vs AI', local:'Lokal', online:'Online',
  profile:'Profil',
  battleComputer:'Lawan komputer',
  passPlay:'Bergantian, satu perangkat',
  twoDevices:'Main di dua perangkat',
  playAI:'Main vs AI', playLocal:'Main 2 Pemain', playOnline:'Main Online',
  leaderboard:'Leaderboard Online',
  language:'Bahasa', about:'Tentang',
  selectLang:'Pilih Bahasa',
  authSub:'Buat akun untuk melacak peringkat ELO kamu',
  login:'Login', signup:'Daftar',
  loginBtn:'Masuk →', signupBtn:'Buat Akun →',
  skip:'Lewati — main tanpa akun',
  username:'Username', usernameHint:'Huruf, angka, underscore',
  password:'Password', passwordHint:'Min. 4 karakter',
  bio:'Bio', bioHint:'Opsional', bioPlaceholder:'Cerita singkat tentang kamu',
  avatar:'Avatar', uploadPhoto:'📷 Upload Foto',
  welcome:'Selamat datang',
  newPassword:'Password Baru', newPasswordHint:'Kosongkan jika tidak ingin ganti',
  yourUsername:'Username kamu', createPassword:'Buat password',
  pickUsername:'Pilih username unik',
  settings:'Pengaturan',
  playerSection:'Pemain', twoPlayers:'2 Pemain',
  yourName:'Nama Kamu', shownInGame:'Ditampilkan saat bermain',
  aiName:'Nama AI', nameOfOpponent:'Nama lawan kamu',
  aiAvatarLabel:'Avatar AI', aiAvatarSub:'Emoji atau foto',
  playAs:'Bermain sebagai', chooseColor:'Pilih warna kamu',
  white:'Putih', black:'Hitam',
  difficulty:'Kesulitan AI',
  diffVeryEasy:'Sangat Mudah', diffEasy:'Mudah', diffMedium:'Sedang',
  diffHard:'Sulit', diffMaster:'Master',
  boardTheme:'Tema Papan',
  themeClassic:'Klasik', themeForest:'Hutan',
  themeOcean:'Samudra', themeWalnut:'Kenari',
  options:'Opsi', mpOptions:'Opsi Multiplayer',
  moveHints:'Petunjuk Gerakan',
  moveHintsSub:'Tampilkan gerakan legal saat memilih',
  coordinates:'Koordinat',
  highlightLastMove:'Sorot Gerakan Terakhir',
  startAI:'⚔ Mulai vs AI', startMP:'🤝 Mulai Game 2 Pemain',
  player1Title:'Pemain 1 — Putih ♙', player2Title:'Pemain 2 — Hitam ♟',
  name:'Nama',
  statusTitle:'Status', actionsTitle:'Aksi', moveHistory:'Riwayat Gerakan',
  flipBoard:'Balik Papan', toggleHints:'Toggle Petunjuk', resignBtn:'Menyerah',
  pause:'Jeda', undo:'Undo',
  whiteTurn:'Giliran Putih', blackTurn:'Giliran Hitam',
  aiThinking:'AI sedang berpikir…',
  yourTurn:'Giliran kamu — pilih bidak.',
  pauseTitle:'Game Dijeda',
  pauseSubAI:'Papan menunggu.',
  pauseSubMP:'Giliran bergantian!',
  pauseSubOnline:'Game online dijeda.',
  resume:'Lanjut', undoMove:'Batalkan Gerakan', quit:'Keluar ke Menu',
  checkmate:'Skak Mat!', winner:'Pemenang', draw:'Seri',
  moves:'Gerakan', captures:'Tangkapan', checks:'Skak',
  playAgain:'⚔ Main Lagi',
  changeSettings:'⚙ Ganti Pengaturan',
  mainMenu:'⌂ Menu Utama',
  lbInfo:'Rating ELO dari pertandingan online. ELO awal: 500.',
  refresh:'Refresh',
  lbPlayer:'Pemain', lbW:'M', lbL:'K', lbD:'S',
  winsLabel:'Menang', lossesLabel:'Kalah', drawsLabel:'Seri',
  onlineGame:'Game Online',
  yourNameSection:'Nama Kamu',
  displayName:'Nama Tampilan', shownToOpponent:'Terlihat oleh lawan',
  hostGame:'🏠 Host Game', joinGame:'🔗 Gabung Game',
  roomCode:'Kode Room', shareCode:'Bagikan kode 6 huruf ini ke lawan kamu',
  copyCode:'📋 Salin Kode',
  generate:'⚡ Buat Room', joining:'🔗 Gabung',
  enterCode:'Masukkan Kode Room',
  codePlaceholder:'Contoh: ABC123',
  hintHost:'Kamu bermain sebagai <strong style="color:var(--ivory)">Putih ♙</strong>. Buat room, bagikan kode, lalu tunggu lawan.',
  hintJoin:'Kamu bermain sebagai <strong style="color:var(--ivory)">Hitam ♟</strong>. Masukkan kode 6 huruf dari lawanmu.',
  waitingForOpponent:'Menunggu Lawan',
  shareWithFriend:'Bagikan kode ini ke temanmu:',
  autoStart:'Game mulai otomatis saat mereka bergabung.',
  cancel:'Batal',
  hostConnDefault:'Klik Generate untuk membuat room',
  pawnPromotion:'Promosi Pion',
  profile:'Profil', logout:'Logout', editProfile:'Edit Profil',
  editCancel:'Batal',
  howToPlayTitle:'Cara Bermain',
  pieceKing:'Raja', pieceQueen:'Ratu', pieceRook:'Benteng',
  pieceBishop:'Gajah', pieceKnight:'Kuda', piecePawn:'Pion',
  descKing:'Bergerak 1 kotak ke segala arah. Terkepung tanpa jalan keluar = skak mat.',
  descQueen:'Paling kuat. Bergerak berapa pun kotak ke segala arah.',
  descRook:'Bergerak horizontal atau vertikal berapa pun kotak.',
  descBishop:'Bergerak diagonal berapa pun kotak. Tetap di warnanya.',
  descKnight:'Gerakan L. Satu-satunya bidak yang bisa melompati bidak lain.',
  descPawn:'Maju 1 (atau 2 saat pertama). Tangkap diagonal. Promosi di baris belakang.',
  ruleCastling:'Rokade:',
  ruleCastlingDesc:' Raja bergerak 2 kotak ke arah Benteng; Benteng melompati. Keduanya belum bergerak; Raja tidak boleh melewati skak.',
  ruleEnPassant:'En Passant:',
  ruleEnPassantDesc:' Setelah pion maju 2 kotak, pion lawan yang berdekatan bisa menangkapnya — langsung setelah saja.',
  rulePromotion:'Promosi:',
  rulePromotionDesc:' Pion yang mencapai baris belakang harus dipromosikan ke Ratu, Benteng, Gajah, atau Kuda.',
  ruleCheck:'Skak & Skak Mat:',
  ruleCheckDesc:' Harus keluar dari skak. Tidak ada jalan keluar = skak mat = permainan berakhir.',
  ruleStalemate:'Pat:',
  ruleStalemateDesc:' Tidak ada gerakan legal tapi tidak dalam skak = seri.',
  rule2P:'Mode 2 Pemain:',
  rule2PDesc:' Kedua pemain berbagi perangkat.',
  clBadge:'🆕 UPDATE', clTitle:'Yang Baru',
  clClose:'Mengerti ✓', clDontShow:'Jangan tampilkan lagi',
  aboutClose:'Tutup',
  yourTurnShort:'Giliran kamu',
  authbtn:'💾 Simpan Profil',
  authskip:'Batal',
  backtogame:'<span>▶</span> Kembali ke Game',
  aboutDesc1:'Game catur dengan AI Minimax (Alpha-Beta pruning + Piece-Square Table), mode lokal 2 pemain, dan multiplayer online via ntfy.sh.',
  aboutDesc2:'Fitur: rokade, en passant, promosi, undo, tema papan, sistem ELO, leaderboard online, sistem akun, avatar kustom.',
  cldesc1:'Perbaikan UI/UX', cl1:"Perbaikan tampilan dan pengalaman pengguna."
},

/* ──────────────────────────────────
   ENGLISH
────────────────────────────────── */
en: {
  tagline:'The Royal Game',
  vsAI:'vs AI', local:'Local', online:'Online',
  battleComputer:'Battle the computer',
  passPlay:'Pass & play, one device',
  twoDevices:'Play on two devices',
  playAI:'Play vs AI', playLocal:'Play 2 Players', playOnline:'Play Online',
  leaderboard:'Online Leaderboard',
  language:'Language', about:'About',
  selectLang:'Select Language',
  authSub:'Create an account to track your ELO ranking',
  login:'Login', signup:'Sign Up',
  loginBtn:'Sign In →', signupBtn:'Create Account →',
  skip:'Skip — play as guest',
  username:'Username', usernameHint:'Letters, numbers, underscore',
  password:'Password', passwordHint:'Min. 4 characters',
  bio:'Bio', bioHint:'Optional', bioPlaceholder:'A short story about you',
  avatar:'Avatar', uploadPhoto:'📷 Upload Photo',
  welcome:'Welcome',
  newPassword:'New Password', newPasswordHint:'Leave blank to keep current',
  yourUsername:'Your username', createPassword:'Create password',
  pickUsername:'Choose a unique username',
  settings:'Settings',
  playerSection:'Player', twoPlayers:'2 Players',
  yourName:'Your Name', shownInGame:'Shown in-game',
  aiName:'AI Name', nameOfOpponent:'Name of your opponent',
  aiAvatarLabel:'AI Avatar', aiAvatarSub:'Emoji or custom photo',
  playAs:'Play as', chooseColor:'Choose your color',
  white:'White', black:'Black',
  difficulty:'AI Difficulty',
  diffVeryEasy:'Very Easy', diffEasy:'Easy', diffMedium:'Medium',
  diffHard:'Hard', diffMaster:'Master',
  boardTheme:'Board Theme',
  themeClassic:'Classic', themeForest:'Forest',
  themeOcean:'Ocean', themeWalnut:'Walnut',
  options:'Options', mpOptions:'Multiplayer Options',
  moveHints:'Move Hints',
  moveHintsSub:'Show legal moves on select',
  coordinates:'Coordinates',
  highlightLastMove:'Highlight Last Move',
  startAI:'⚔ Start vs AI', startMP:'🤝 Start 2-Player Game',
  player1Title:'Player 1 — White ♙', player2Title:'Player 2 — Black ♟',
  name:'Name',
  statusTitle:'Status', actionsTitle:'Actions', moveHistory:'Move History',
  flipBoard:'Flip Board', toggleHints:'Toggle Hints', resignBtn:'Resign',
  pause:'Pause', undo:'Undo',
  whiteTurn:"White's Turn", blackTurn:"Black's Turn",
  aiThinking:'AI is thinking…',
  yourTurn:'Your turn — select a piece.',
  pauseTitle:'Game Paused',
  pauseSubAI:'The board awaits.',
  pauseSubMP:'Pass the device!',
  pauseSubOnline:'Online game paused.',
  resume:'Resume', undoMove:'Undo Last Move', quit:'Quit to Menu',
  checkmate:'Checkmate!', winner:'Winner', draw:'Draw',
  moves:'Moves', captures:'Captures', checks:'Checks',
  playAgain:'⚔ Play Again',
  changeSettings:'⚙ Change Settings',
  mainMenu:'⌂ Main Menu',
  lbInfo:'ELO ratings from online ranked matches. Starting ELO: 1200.',
  refresh:'Refresh',
  lbPlayer:'Player', lbW:'W', lbL:'L', lbD:'D',
  winsLabel:'Wins', lossesLabel:'Losses', drawsLabel:'Draws',
  onlineGame:'Online Game',
  yourNameSection:'Your Name',
  displayName:'Display name', shownToOpponent:'Shown to your opponent',
  hostGame:'🏠 Host a Game', joinGame:'🔗 Join a Game',
  roomCode:'Room Code', shareCode:'Share this 6-letter code with your opponent',
  copyCode:'📋 Copy Code',
  generate:'⚡ Generate Room', joining:'🔗 Join Game',
  enterCode:'Enter Room Code',
  codePlaceholder:'e.g. ABC123',
  hintHost:'You will play as <strong style="color:var(--ivory)">White ♙</strong>. Generate a room, share the code, then wait.',
  hintJoin:'You will play as <strong style="color:var(--ivory)">Black ♟</strong>. Enter the 6-letter code from your opponent.',
  waitingForOpponent:'Waiting for Opponent',
  shareWithFriend:'Share this code with your friend:',
  autoStart:'Game starts automatically when they join.',
  cancel:'Cancel',
  hostConnDefault:'Click Generate to create a room',
  pawnPromotion:'Pawn Promotion',
  profile:'Profile', logout:'Logout', editProfile:'Edit Profile',
  editCancel:'Cancel',
  howToPlayTitle:'How to Play',
  pieceKing:'King', pieceQueen:'Queen', pieceRook:'Rook',
  pieceBishop:'Bishop', pieceKnight:'Knight', piecePawn:'Pawn',
  descKing:'Moves one square in any direction. Cornered with no escape = checkmate.',
  descQueen:'Most powerful. Moves any number of squares in any direction.',
  descRook:'Moves any number of squares horizontally or vertically.',
  descBishop:'Moves any number of squares diagonally. Stays on its color.',
  descKnight:'L-shape move. Only piece that can jump over others.',
  descPawn:'Forward 1 (or 2 on first move). Captures diagonally. Promotes at back rank.',
  ruleCastling:'Castling:',
  ruleCastlingDesc:" King moves 2 squares toward a Rook; the Rook jumps over. Neither must have moved; King cannot pass through check.",
  ruleEnPassant:'En Passant:',
  ruleEnPassantDesc:' After a pawn advances 2 squares, an adjacent enemy pawn may capture it as if it only moved 1 — immediately after only.',
  rulePromotion:'Promotion:',
  rulePromotionDesc:' A pawn reaching the back rank must promote to Queen, Rook, Bishop, or Knight.',
  ruleCheck:'Check & Checkmate:',
  ruleCheckDesc:' Must escape check. No legal escape = checkmate = game over.',
  ruleStalemate:'Stalemate:',
  ruleStalemateDesc:' No legal move but not in check = draw.',
  rule2P:'2-Player Mode:',
  rule2PDesc:' Both players share the device.',
  clBadge:'🆕 UPDATE', clTitle:"What's New",
  clClose:'Got it ✓', clDontShow:"Don't show again",
  aboutClose:'Close',
  yourTurnShort:'Your turn',
  authbtn:'💾 Save Profile',
  authskip:'Cancel',
  backtogame:'<span>▶</span> Back to Game',
  aboutDesc1:'Chess game with Minimax AI (Alpha-Beta pruning + Piece-Square Table), 2-player local mode, and online multiplayer via ntfy.sh.',
  aboutDesc2:'Features: castling, en passant, promotion, undo, board themes, ELO system, online leaderboard, account system, custom avatar.',
  cldesc1:'UI/UX Improvements', cl1:"Improved appearance and user experience.",
},

/* ──────────────────────────────────
   中文（简体）
────────────────────────────────── */
zh: {
  tagline:'帝王之戏',
  vsAI:'对战AI', local:'本地', online:'在线',
  battleComputer:'挑战电脑',
  passPlay:'轮流游玩，一台设备',
  twoDevices:'两台设备',
  playAI:'对战AI', playLocal:'双人对战', playOnline:'在线对战',
  leaderboard:'在线排行榜',
  language:'语言', about:'关于',
  selectLang:'选择语言',
  authSub:'创建账户以追踪您的ELO排名',
  login:'登录', signup:'注册',
  loginBtn:'登录 →', signupBtn:'创建账户 →',
  skip:'跳过 — 以访客身份游玩',
  username:'用户名', usernameHint:'字母、数字、下划线',
  password:'密码', passwordHint:'至少4个字符',
  bio:'简介', bioHint:'可选', bioPlaceholder:'简短介绍自己',
  avatar:'头像', uploadPhoto:'📷 上传照片',
  welcome:'欢迎',
  newPassword:'新密码', newPasswordHint:'留空则保持当前密码',
  yourUsername:'输入用户名', createPassword:'创建密码',
  pickUsername:'选择唯一用户名',
  settings:'设置',
  playerSection:'玩家', twoPlayers:'双人',
  yourName:'你的名字', shownInGame:'游戏中显示',
  aiName:'AI名字', nameOfOpponent:'对手名字',
  aiAvatarLabel:'AI头像', aiAvatarSub:'表情符号或自定义照片',
  playAs:'选择颜色', chooseColor:'选择你的颜色',
  white:'白棋', black:'黑棋',
  difficulty:'AI难度',
  diffVeryEasy:'极易', diffEasy:'简单', diffMedium:'中等',
  diffHard:'困难', diffMaster:'大师',
  boardTheme:'棋盘主题',
  themeClassic:'经典', themeForest:'森林',
  themeOcean:'海洋', themeWalnut:'胡桃',
  options:'选项', mpOptions:'多人选项',
  moveHints:'移动提示',
  moveHintsSub:'选择时显示合法走法',
  coordinates:'坐标',
  highlightLastMove:'高亮最后一步',
  startAI:'⚔ 开始对战AI', startMP:'🤝 开始双人游戏',
  player1Title:'玩家1 — 白棋 ♙', player2Title:'玩家2 — 黑棋 ♟',
  name:'名字',
  statusTitle:'状态', actionsTitle:'操作', moveHistory:'走棋记录',
  flipBoard:'翻转棋盘', toggleHints:'切换提示', resignBtn:'认输',
  pause:'暂停', undo:'悔棋',
  whiteTurn:'白方回合', blackTurn:'黑方回合',
  aiThinking:'AI思考中…',
  yourTurn:'你的回合 — 选择棋子。',
  pauseTitle:'游戏暂停',
  pauseSubAI:'棋盘等待中。',
  pauseSubMP:'请传递设备！',
  pauseSubOnline:'在线游戏已暂停。',
  resume:'继续', undoMove:'悔棋', quit:'退出到主菜单',
  checkmate:'将死！', winner:'获胜者', draw:'平局',
  moves:'步数', captures:'吃子', checks:'将军',
  playAgain:'⚔ 再来一局',
  changeSettings:'⚙ 更改设置',
  mainMenu:'⌂ 主菜单',
  lbInfo:'来自在线对局的ELO评分。初始ELO：1200。',
  refresh:'刷新',
  lbPlayer:'玩家', lbW:'胜', lbL:'负', lbD:'和',
  winsLabel:'胜', lossesLabel:'负', drawsLabel:'和',
  onlineGame:'在线游戏',
  yourNameSection:'你的名字',
  displayName:'显示名称', shownToOpponent:'对手可见',
  hostGame:'🏠 创建房间', joinGame:'🔗 加入游戏',
  roomCode:'房间代码', shareCode:'将此6字母代码分享给对手',
  copyCode:'📋 复制代码',
  generate:'⚡ 生成房间', joining:'🔗 加入',
  enterCode:'输入房间代码',
  codePlaceholder:'例：ABC123',
  hintHost:'你执<strong style="color:var(--ivory)">白棋 ♙</strong>。生成房间，分享代码，等待对手。',
  hintJoin:'你执<strong style="color:var(--ivory)">黑棋 ♟</strong>。输入对手的6字母代码。',
  waitingForOpponent:'等待对手',
  shareWithFriend:'将此代码分享给朋友：',
  autoStart:'对手加入后游戏自动开始。',
  cancel:'取消',
  hostConnDefault:'点击生成来创建房间',
  pawnPromotion:'兵的升变',
  profile:'个人资料', logout:'退出登录', editProfile:'编辑资料',
  editCancel:'取消',
  howToPlayTitle:'游戏规则',
  pieceKing:'王', pieceQueen:'后', pieceRook:'车',
  pieceBishop:'象', pieceKnight:'马', piecePawn:'兵',
  descKing:'向任意方向移动一格。被困无处逃脱 = 将死。',
  descQueen:'最强大的棋子。可向任意方向移动任意格数。',
  descRook:'可水平或垂直移动任意格数。',
  descBishop:'沿对角线移动任意格数。始终在同色格子上。',
  descKnight:'L形移动。唯一可以跳越其他棋子的棋子。',
  descPawn:'向前1格（第一步可走2格）。斜向吃子。到达底线可升变。',
  ruleCastling:'王车易位：',
  ruleCastlingDesc:' 王向车方向移动2格，车跳到王的另一侧。双方均未移动过；王不能经过被将军的格子。',
  ruleEnPassant:'吃过路兵：',
  ruleEnPassantDesc:' 当兵前进2格时，相邻敌兵可以将其吃掉，就好像它只走了1格——仅限紧接着下一步。',
  rulePromotion:'升变：',
  rulePromotionDesc:' 到达底线的兵必须升变为后、车、象或马。',
  ruleCheck:'将军与将死：',
  ruleCheckDesc:' 必须应将。无法逃脱 = 将死 = 游戏结束。',
  ruleStalemate:'逼和：',
  ruleStalemateDesc:' 没有合法走法但未被将军 = 平局。',
  rule2P:'双人模式：',
  rule2PDesc:' 两名玩家共用一台设备。',
  clBadge:'🆕 更新', clTitle:'新功能',
  clClose:'知道了 ✓', clDontShow:'不再显示',
  aboutClose:'关闭',
  yourTurnShort:'你的回合',
  authbtn:'💾 保存资料',
  authskip:'取消',
  backtogame:'<span>▶</span> 返回游戏',
  aboutDesc1:'一款采用极小极大人工智能（Alpha-Beta 剪枝 + 棋子-方格表）的国际象棋游戏，支持本地双人模式，并通过 ntfy.sh 进行在线多人游戏。',
  aboutDesc2:'功能：王车易位、吃过路兵、升变、撤销、棋盘主题、ELO 等级分系统、在线排行榜、账号系统、自定义头像。',
  cldesc1:'UI/UX改进', cl1:"外观和用户体验得到改善。",
},

/* ──────────────────────────────────
   日本語
────────────────────────────────── */
ja: {
  tagline:'王の遊戯',
  vsAI:'AI対戦', local:'ローカル', online:'オンライン',
  battleComputer:'コンピューターと対戦',
  passPlay:'交互プレイ、1台',
  twoDevices:'2台のデバイス',
  playAI:'AIと対戦', playLocal:'2人対戦', playOnline:'オンライン対戦',
  leaderboard:'オンラインランキング',
  language:'言語', about:'について',
  selectLang:'言語を選択',
  authSub:'ELOランキングを追跡するためアカウントを作成',
  login:'ログイン', signup:'新規登録',
  loginBtn:'ログイン →', signupBtn:'アカウント作成 →',
  skip:'スキップ — ゲストとしてプレイ',
  username:'ユーザー名', usernameHint:'英数字とアンダースコア',
  password:'パスワード', passwordHint:'最低4文字',
  bio:'自己紹介', bioHint:'任意', bioPlaceholder:'自己紹介を入力',
  avatar:'アバター', uploadPhoto:'📷 写真をアップロード',
  welcome:'ようこそ',
  newPassword:'新しいパスワード', newPasswordHint:'空欄のままなら変更なし',
  yourUsername:'ユーザー名を入力', createPassword:'パスワードを作成',
  pickUsername:'ユニークな名前を選択',
  settings:'設定',
  playerSection:'プレイヤー', twoPlayers:'2人',
  yourName:'あなたの名前', shownInGame:'ゲーム中に表示',
  aiName:'AI名', nameOfOpponent:'相手の名前',
  aiAvatarLabel:'AIアバター', aiAvatarSub:'絵文字またはカスタム写真',
  playAs:'色を選択', chooseColor:'色を選択',
  white:'白', black:'黒',
  difficulty:'AI難易度',
  diffVeryEasy:'超簡単', diffEasy:'簡単', diffMedium:'普通',
  diffHard:'難しい', diffMaster:'マスター',
  boardTheme:'ボードテーマ',
  themeClassic:'クラシック', themeForest:'フォレスト',
  themeOcean:'オーシャン', themeWalnut:'ウォルナット',
  options:'オプション', mpOptions:'マルチプレイヤーオプション',
  moveHints:'移動ヒント',
  moveHintsSub:'選択時に合法手を表示',
  coordinates:'座標',
  highlightLastMove:'最後の手を強調',
  startAI:'⚔ AI対戦開始', startMP:'🤝 2人ゲーム開始',
  player1Title:'プレイヤー1 — 白 ♙', player2Title:'プレイヤー2 — 黒 ♟',
  name:'名前',
  statusTitle:'ステータス', actionsTitle:'アクション', moveHistory:'手順',
  flipBoard:'ボード反転', toggleHints:'ヒント切替', resignBtn:'投了',
  pause:'一時停止', undo:'待った',
  whiteTurn:'白のターン', blackTurn:'黒のターン',
  aiThinking:'AI思考中…',
  yourTurn:'あなたのターン — 駒を選んでください。',
  pauseTitle:'一時停止',
  pauseSubAI:'盤が待っています。',
  pauseSubMP:'端末を渡してください！',
  pauseSubOnline:'オンラインゲームが一時停止中。',
  resume:'再開', undoMove:'待った', quit:'メインメニューへ',
  checkmate:'チェックメイト！', winner:'勝者', draw:'引き分け',
  moves:'手数', captures:'取り', checks:'チェック',
  playAgain:'⚔ もう一度',
  changeSettings:'⚙ 設定変更',
  mainMenu:'⌂ メインメニュー',
  lbInfo:'オンライン対局のELOランキング。初期ELO：1200。',
  refresh:'更新',
  lbPlayer:'プレイヤー', lbW:'勝', lbL:'負', lbD:'分',
  winsLabel:'勝利', lossesLabel:'敗北', drawsLabel:'引分',
  onlineGame:'オンラインゲーム',
  yourNameSection:'あなたの名前',
  displayName:'表示名', shownToOpponent:'相手に表示される',
  hostGame:'🏠 ホスト', joinGame:'🔗 参加',
  roomCode:'ルームコード', shareCode:'この6文字のコードを相手に共有してください',
  copyCode:'📋 コードをコピー',
  generate:'⚡ ルーム作成', joining:'🔗 参加',
  enterCode:'ルームコードを入力',
  codePlaceholder:'例：ABC123',
  hintHost:'あなたは<strong style="color:var(--ivory)">白 ♙</strong>でプレイします。ルームを作成し、コードを共有してください。',
  hintJoin:'あなたは<strong style="color:var(--ivory)">黒 ♟</strong>でプレイします。相手の6文字コードを入力してください。',
  waitingForOpponent:'相手を待っています',
  shareWithFriend:'このコードを友達に共有：',
  autoStart:'参加後自動的に開始されます。',
  cancel:'キャンセル',
  hostConnDefault:'生成をクリックしてルームを作成',
  pawnPromotion:'ポーン昇格',
  profile:'プロフィール', logout:'ログアウト', editProfile:'プロフィール編集',
  editCancel:'キャンセル',
  howToPlayTitle:'遊び方',
  pieceKing:'キング', pieceQueen:'クイーン', pieceRook:'ルーク',
  pieceBishop:'ビショップ', pieceKnight:'ナイト', piecePawn:'ポーン',
  descKing:'どの方向にも1マス動けます。逃げ場なし = チェックメイト。',
  descQueen:'最も強力。どの方向にも何マスでも動けます。',
  descRook:'水平または垂直に何マスでも動けます。',
  descBishop:'斜めに何マスでも動けます。同じ色のマスに留まります。',
  descKnight:'L字移動。他の駒を飛び越えられる唯一の駒。',
  descPawn:'前に1マス（最初は2マス可）。斜め前に取る。最奥でプロモーション。',
  ruleCastling:'キャスリング：',
  ruleCastlingDesc:' キングがルークの方向に2マス移動し、ルークが飛び越えます。双方とも未移動；キングはチェックを通過できません。',
  ruleEnPassant:'アンパッサン：',
  ruleEnPassantDesc:' ポーンが2マス進んだ直後、隣の敵ポーンが1マスだけ進んだかのように取れます。',
  rulePromotion:'プロモーション：',
  rulePromotionDesc:' 最奥に達したポーンはクイーン、ルーク、ビショップ、またはナイトに昇格。',
  ruleCheck:'チェックとチェックメイト：',
  ruleCheckDesc:' チェックから逃げなければなりません。逃げ場なし = チェックメイト。',
  ruleStalemate:'ステイルメイト：',
  ruleStalemateDesc:' 合法手がないがチェックでない = 引き分け。',
  rule2P:'2人プレイ：',
  rule2PDesc:' 両プレイヤーが1台の端末を共有します。',
  clBadge:'🆕 アップデート', clTitle:'新機能',
  clClose:'わかった ✓', clDontShow:'次から表示しない',
  aboutClose:'閉じる',
  yourTurnShort:'あなたのターン',
  authbtn:'💾 プロフィールを保存',
  authskip:'キャンセル',
  backtogame:'<span>▶</span> ゲームに戻る',
  aboutDesc1:'ミニマックスAI（アルファベータ枝刈り＋駒マス表）を搭載したチェスゲーム。2人対戦ローカルモードとntfy.sh経由のオンラインマルチプレイヤーに対応。',
  aboutDesc2:'機能：キャスリング、アンパッサン、昇格、アンドゥ、ボードテーマ、ELOレーティングシステム、オンラインリーダーボード、アカウントシステム、カスタムアバター。',
  cldesc1:'UI/UXの改善', cl1: "外観とユーザーエクスペリエンスの向上。",
},

/* ──────────────────────────────────
   BAHASA MELAYU
────────────────────────────────── */
ms: {
  tagline:'Permainan Diraja',
  vsAI:'vs AI', local:'Tempatan', online:'Dalam Talian',
  battleComputer:'Lawan komputer',
  passPlay:'Gilir-gilir, satu peranti',
  twoDevices:'Dua peranti',
  playAI:'Main vs AI', playLocal:'Main 2 Pemain', playOnline:'Main Dalam Talian',
  leaderboard:'Papan Kedudukan Dalam Talian',
  language:'Bahasa', about:'Tentang',
  selectLang:'Pilih Bahasa',
  authSub:'Buat akaun untuk jejak penarafan ELO anda',
  login:'Log Masuk', signup:'Daftar',
  loginBtn:'Masuk →', signupBtn:'Buat Akaun →',
  skip:'Langkau — main tanpa akaun',
  username:'Nama Pengguna', usernameHint:'Huruf, angka, garis bawah',
  password:'Kata Laluan', passwordHint:'Min. 4 aksara',
  bio:'Bio', bioHint:'Pilihan', bioPlaceholder:'Cerita ringkas tentang anda',
  avatar:'Avatar', uploadPhoto:'📷 Muat Naik Foto',
  welcome:'Selamat datang',
  newPassword:'Kata Laluan Baharu', newPasswordHint:'Biarkan kosong untuk kekal',
  yourUsername:'Nama pengguna anda', createPassword:'Cipta kata laluan',
  pickUsername:'Pilih nama unik',
  settings:'Tetapan',
  playerSection:'Pemain', twoPlayers:'2 Pemain',
  yourName:'Nama Anda', shownInGame:'Ditunjukkan semasa bermain',
  aiName:'Nama AI', nameOfOpponent:'Nama lawan anda',
  aiAvatarLabel:'Avatar AI', aiAvatarSub:'Emoji atau foto tersuai',
  playAs:'Main sebagai', chooseColor:'Pilih warna anda',
  white:'Putih', black:'Hitam',
  difficulty:'Kesukaran AI',
  diffVeryEasy:'Sangat Mudah', diffEasy:'Mudah', diffMedium:'Sederhana',
  diffHard:'Sukar', diffMaster:'Master',
  boardTheme:'Tema Papan',
  themeClassic:'Klasik', themeForest:'Hutan',
  themeOcean:'Lautan', themeWalnut:'Walnut',
  options:'Pilihan', mpOptions:'Pilihan Pelbagai Pemain',
  moveHints:'Petunjuk Gerakan',
  moveHintsSub:'Tunjukkan gerakan sah semasa memilih',
  coordinates:'Koordinat',
  highlightLastMove:'Serlahkan Gerakan Terakhir',
  startAI:'⚔ Mula vs AI', startMP:'🤝 Mula 2 Pemain',
  player1Title:'Pemain 1 — Putih ♙', player2Title:'Pemain 2 — Hitam ♟',
  name:'Nama',
  statusTitle:'Status', actionsTitle:'Tindakan', moveHistory:'Sejarah Gerakan',
  flipBoard:'Balik Papan', toggleHints:'Tukar Petunjuk', resignBtn:'Menyerah',
  pause:'Jeda', undo:'Batal',
  whiteTurn:'Giliran Putih', blackTurn:'Giliran Hitam',
  aiThinking:'AI sedang berfikir…',
  yourTurn:'Giliran anda — pilih buah catur.',
  pauseTitle:'Permainan Dijeda',
  pauseSubAI:'Papan menunggu.',
  pauseSubMP:'Giliran berganti!',
  pauseSubOnline:'Permainan dalam talian dijeda.',
  resume:'Teruskan', undoMove:'Batal Gerakan', quit:'Keluar ke Menu',
  checkmate:'Skak Mat!', winner:'Pemenang', draw:'Seri',
  moves:'Gerakan', captures:'Tangkapan', checks:'Skak',
  playAgain:'⚔ Main Lagi',
  changeSettings:'⚙ Tukar Tetapan',
  mainMenu:'⌂ Menu Utama',
  lbInfo:'Penarafan ELO daripada pertandingan dalam talian. ELO permulaan: 1200.',
  refresh:'Muat Semula',
  lbPlayer:'Pemain', lbW:'M', lbL:'K', lbD:'S',
  winsLabel:'Menang', lossesLabel:'Kalah', drawsLabel:'Seri',
  onlineGame:'Permainan Dalam Talian',
  yourNameSection:'Nama Anda',
  displayName:'Nama Paparan', shownToOpponent:'Dilihat oleh lawan',
  hostGame:'🏠 Host Permainan', joinGame:'🔗 Sertai Permainan',
  roomCode:'Kod Bilik', shareCode:'Kongsi kod 6 huruf ini dengan lawan anda',
  copyCode:'📋 Salin Kod',
  generate:'⚡ Jana Bilik', joining:'🔗 Sertai',
  enterCode:'Masukkan Kod Bilik',
  codePlaceholder:'cth. ABC123',
  hintHost:'Anda bermain sebagai <strong style="color:var(--ivory)">Putih ♙</strong>. Jana bilik, kongsi kod, tunggu lawan.',
  hintJoin:'Anda bermain sebagai <strong style="color:var(--ivory)">Hitam ♟</strong>. Masukkan kod daripada lawan anda.',
  waitingForOpponent:'Menunggu Lawan',
  shareWithFriend:'Kongsi kod ini dengan rakan anda:',
  autoStart:'Permainan bermula secara automatik apabila mereka menyertai.',
  cancel:'Batal',
  hostConnDefault:'Klik Jana untuk membuat bilik',
  pawnPromotion:'Promosi Bidak',
  profile:'Profil', logout:'Log Keluar', editProfile:'Edit Profil',
  editCancel:'Batal',
  howToPlayTitle:'Cara Bermain',
  pieceKing:'Raja', pieceQueen:'Ratu', pieceRook:'Benteng',
  pieceBishop:'Gajah', pieceKnight:'Kuda', piecePawn:'Pion',
  descKing:'Bergerak 1 petak ke mana-mana arah. Terperangkap tanpa jalan keluar = skak mat.',
  descQueen:'Paling kuat. Bergerak berapa pun petak ke mana-mana arah.',
  descRook:'Bergerak secara mendatar atau menegak berapa pun petak.',
  descBishop:'Bergerak secara pepenjuru berapa pun petak. Kekal pada warnanya.',
  descKnight:'Gerakan L. Satu-satunya buah yang boleh melompati buah lain.',
  descPawn:'Maju 1 (atau 2 kali pertama). Tangkap pepenjuru. Promosi di baris belakang.',
  ruleCastling:'Pencawaian:',
  ruleCastlingDesc:' Raja bergerak 2 petak ke arah Benteng; Benteng melompati. Kedua-duanya belum bergerak; Raja tidak boleh melalui skak.',
  ruleEnPassant:'En Passant:',
  ruleEnPassantDesc:' Selepas pion maju 2 petak, pion musuh yang bersebelahan boleh menangkapnya seolah-olah ia hanya maju 1 — terus selepas itu sahaja.',
  rulePromotion:'Promosi:',
  rulePromotionDesc:' Pion yang mencapai baris belakang mesti dipromosikan kepada Ratu, Benteng, Gajah, atau Kuda.',
  ruleCheck:'Skak & Skak Mat:',
  ruleCheckDesc:' Mesti keluar daripada skak. Tiada jalan keluar = skak mat = permainan tamat.',
  ruleStalemate:'Seri:',
  ruleStalemateDesc:' Tiada gerakan sah tetapi tidak dalam skak = seri.',
  rule2P:'Mod 2 Pemain:',
  rule2PDesc:' Kedua-dua pemain berkongsi peranti.',
  clBadge:'🆕 KEMAS KINI', clTitle:'Yang Baharu',
  clClose:'Faham ✓', clDontShow:'Jangan papar lagi',
  aboutClose:'Tutup',
  yourTurnShort:'Giliran anda',
  authbtn:'💾 Simpan Profil',
  authskip:'Batal',
  backtogame:'<span>▶</span> Kembali ke Permainan',
  aboutDesc1:'Permainan catur dengan Minimax AI (pemangkasan Alpha-Beta + Jadual Piece-Square), mod tempatan 2 pemain dan berbilang pemain dalam talian melalui ntfy.sh.',
  aboutDesc2:'Ciri-ciri: castling, en passant, promosi, buat asal, papan tema, sistem ELO, papan pendahulu dalam talian, sistem akaun, avatar tersuai.',
  cldesc1:'Penambahbaikan UI/UX', cl1: "Peningkatan penampilan dan pengalaman pengguna.",
},

}; // end LANGS

/* ══════════════════════════════════
   CORE i18n FUNCTIONS
══════════════════════════════════ */
let currentLang = 'id';

function t(key){
  return (LANGS[currentLang]||LANGS.id)[key] || (LANGS.en)[key] || key;
}

function setText(id, text){ const el=document.getElementById(id); if(el) el.textContent=text; }
function setHtml(id, html){ const el=document.getElementById(id); if(el) el.innerHTML=html; }
function setPlaceholder(id, text){ const el=document.getElementById(id); if(el) el.placeholder=text; }

function applyLang(){
  document.body.style.direction = 'ltr';

  // ── MENU ──
  setText('lbl-tagline', t('tagline'));
  const modeLabels=document.querySelectorAll('.mode-label');
  const modeDescs=document.querySelectorAll('.mode-desc');
  if(modeLabels[0]) modeLabels[0].textContent=t('vsAI');
  if(modeLabels[1]) modeLabels[1].textContent=t('local');
  if(modeLabels[2]) modeLabels[2].textContent=t('online');
  if(modeDescs[0])  modeDescs[0].textContent=t('battleComputer');
  if(modeDescs[1])  modeDescs[1].textContent=t('passPlay');
  if(modeDescs[2])  modeDescs[2].textContent=t('twoDevices');
  selMode(menuMode);
  setHtml('lbl-howtoplay-btn', t('howToPlayTitle'));
  setHtml('lbl-leaderboard-btn', t('leaderboard'));
  setHtml('lbl-language-btn', t('language'));
  setHtml('lbl-about-btn', t('about'));

  // ── AUTH ──
  const authSub=document.querySelector('.auth-sub');
  if(authSub) authSub.textContent=t('authSub');
  setText('atab-login', t('login'));
  setText('atab-signup', t('signup'));
  const lb=document.getElementById('login-btn');
  if(lb&&!lb.disabled) lb.textContent=t('loginBtn');
  const sb=document.getElementById('signup-btn');
  if(sb&&!sb.disabled) sb.textContent=t('signupBtn');
  document.querySelectorAll('.auth-skip').forEach(el=>{ el.textContent=t('skip'); });
  setHtml('lbl-login-username', t('username'));
  setHtml('lbl-login-password', t('password'));
  setHtml('lbl-signup-username', t('username')+' <small>'+t('usernameHint')+'</small>');
  setHtml('lbl-signup-password', t('password')+' <small>'+t('passwordHint')+'</small>');
  setText('lbl-signup-avatar', t('avatar'));
  setText('lbl-edit-avatar', t('avatar'));
  setText('lbl-upload-signup', t('uploadPhoto'));
  setText('lbl-upload-edit', t('uploadPhoto'));
  setHtml('lbl-bio', t('bio')+' <small>'+t('bioHint')+'</small>');
  setText('lbl-edit-bio', t('bio'));
  setHtml('lbl-edit-pw', t('newPassword')+' <small>'+t('newPasswordHint')+'</small>');
  setPlaceholder('signup-username', t('pickUsername'));
  setPlaceholder('signup-bio', t('bioPlaceholder'));
  setPlaceholder('signup-password', t('createPassword'));
  setPlaceholder('login-username', t('yourUsername'));
  setPlaceholder('login-password', t('password'));

  // ── SETTINGS AI ──
  setHtml('backbtn', t('backtogame'))
  setText('lbl-settings-title-ai', t('settings'));
  setText('lbl-badge-ai', t('vsAI'));
  setText('lbl-sec-player', t('playerSection'));
  setHtml('lbl-yourname', t('yourName')+' <small>'+t('shownInGame')+'</small>');
  setHtml('lbl-ainame', t('aiName')+' <small>'+t('nameOfOpponent')+'</small>');
  setText('lbl-ai-avatar-label', t('aiAvatarLabel'));
  setText('lbl-ai-avatar-sub', t('aiAvatarSub'));
  setText('lbl-ai-upload', t('uploadPhoto'));
  setHtml('lbl-playas', t('playAs')+' <small>'+t('chooseColor')+'</small>');
  setText('lbl-white', '♙ '+t('white'));
  setText('lbl-black', '♟ '+t('black'));
  setText('lbl-difficulty', t('difficulty'));
  setText('d1', t('diffVeryEasy'));
  setText('d2', t('diffEasy'));
  setText('d3', t('diffMedium'));
  setText('d4', t('diffHard'));
  setText('d5', t('diffMaster'));
  setText('lbl-boardtheme-ai', t('boardTheme'));
  ['ai','mp'].forEach(g=>{
    setText('lbl-theme-classic-'+g, t('themeClassic'));
    setText('lbl-theme-forest-'+g,  t('themeForest'));
    setText('lbl-theme-ocean-'+g,   t('themeOcean'));
    setText('lbl-theme-walnut-'+g,  t('themeWalnut'));
  });
  setText('lbl-options', t('options'));
  setHtml('lbl-movehints', t('moveHints')+' <small>'+t('moveHintsSub')+'</small>');
  setText('lbl-coords', t('coordinates'));
  setText('lbl-lastmove', t('highlightLastMove'));
  const goAI=document.querySelector('.go-btn.ai');
  if(goAI) goAI.textContent=t('startAI');

  // ── SETTINGS MP ──
  setText('lbl-settings-title-mp', t('settings'));
  setText('lbl-badge-mp', t('twoPlayers'));
  setText('lbl-p1-title', t('player1Title'));
  setText('lbl-p2-title', t('player2Title'));
  setText('lbl-name-p1', t('name'));
  setText('lbl-name-p2', t('name'));
  setText('lbl-boardtheme-mp', t('boardTheme'));
  setText('lbl-mp-options', t('mpOptions'));
  setText('lbl-movehints-mp', t('moveHints'));
  setText('lbl-coords-mp', t('coordinates'));
  const goMP=document.querySelector('.go-btn.mp');
  if(goMP) goMP.textContent=t('startMP');

  //About
  setText('av', t('version'));
  setText('lbl-aboutDesc1', t('aboutDesc1'));
  setText('lbl-aboutDesc2', t('aboutDesc2'));

  // ── GAME ──
  setText('lbl-btn-pause', '⏸ '+t('pause'));
  setText('lbl-btn-undo', '↩ '+t('undo'));
  setText('lbl-status', t('statusTitle'));
  setText('lbl-actions', t('actionsTitle'));
  setText('lbl-flip', t('flipBoard'));
  setText('lbl-toggle-hints', t('toggleHints'));
  setText('lbl-resign', t('resignBtn'));
  setText('lbl-movehistory', t('moveHistory'));

  // ── RESULT ──
  setText('lbl-st-moves', t('moves'));
  setText('lbl-st-caps', t('captures'));
  setText('lbl-st-chks', t('checks'));
  setText('lbl-play-again', t('playAgain'));
  setText('lbl-change-settings', t('changeSettings'));
  setText('lbl-main-menu', t('mainMenu'));

  // ── LEADERBOARD ──
  setText('lbl-lb-title', t('leaderboard'));
  setText('lbl-lb-info', t('lbInfo'));
  setText('lbl-lb-refresh', '🔄 '+t('refresh'));
  setText('lbl-lb-player', t('lbPlayer'));
  setText('lbl-lb-w', t('lbW'));
  setText('lbl-lb-l', t('lbL'));
  setText('lbl-lb-d', t('lbD'));

  // ── ONLINE ──
  setText('lbl-online-title', t('onlineGame'));
  setText('lbl-online-yourname', t('yourNameSection'));
  setHtml('lbl-displayname', t('displayName')+' <small>'+t('shownToOpponent')+'</small>');
  setText('lbl-host-tab', t('hostGame'));
  setText('lbl-join-tab', t('joinGame'));
  setText('lbl-roomcode', t('roomCode'));
  setText('lbl-share-code', t('shareCode'));
  setText('lbl-copy-code', '📋 '+t('copyCode'));
  setText('lbl-generate', t('generate'));
  setText('lbl-enter-code', t('enterCode'));
  setText('lbl-join-btn', t('joining'));
  const hH=document.getElementById('lbl-hint-host');
  if(hH) hH.innerHTML=t('hintHost');
  const hJ=document.getElementById('lbl-hint-join');
  if(hJ) hJ.innerHTML=t('hintJoin');
  setPlaceholder('join-code-input', t('codePlaceholder'));
  const hct=document.getElementById('host-conn-text');
  if(hct&&!hct.textContent.includes('…')&&!hct.textContent.includes('✓'))
    hct.textContent=t('hostConnDefault');

  // ── WAITING ──
  setText('lbl-waiting', t('waitingForOpponent'));
  setText('lbl-share-friend', t('shareWithFriend'));
  setText('lbl-auto-start', t('autoStart'));
  setText('lbl-cancel', '✕ '+t('cancel'));

  // ── PAUSE ──
  setText('lbl-pause-title', t('pauseTitle'));
  setText('lbl-resume', '▶ '+t('resume'));
  setText('lbl-undo-move', '↩ '+t('undoMove'));
  setText('lbl-settings-btn', '⚙ '+t('settings'));
  setText('lbl-quit', '⌂ '+t('quit'));

  // ── PROMO ──
  setText('lbl-promo', t('pawnPromotion'));

  // ── PROFILE ──
  setText('lbl-elo-stat', 'ELO');
  setText('lbl-wins-stat', t('winsLabel'));
  setText('lbl-losses-stat', t('lossesLabel'));
  setText('lbl-draws-stat', t('drawsLabel'));
  setText('lbl-edit-profile', '✏️ '+t('editProfile'));
  setText('lbl-logout', '🚪 '+t('logout'));
  const pbBtn=document.querySelector('.profile-bar-btn');
  if(pbBtn) pbBtn.innerHTML='👤 <span>'+t('profile')+'</span>';
  setText('lbl-edit-cancel', t('editCancel'));
  setText('auth-btn', '💾 '+t('authbtn'))
  setText('auth-skip', t('authskip'));

  // ── HOW TO PLAY ──
  setText('lbl-howto-title', t('howToPlayTitle'));
  setText('lbl-piece-king',   t('pieceKing'));
  setText('lbl-piece-queen',  t('pieceQueen'));
  setText('lbl-piece-rook',   t('pieceRook'));
  setText('lbl-piece-bishop', t('pieceBishop'));
  setText('lbl-piece-knight', t('pieceKnight'));
  setText('lbl-piece-pawn',   t('piecePawn'));
  setText('lbl-desc-king',    t('descKing'));
  setText('lbl-desc-queen',   t('descQueen'));
  setText('lbl-desc-rook',    t('descRook'));
  setText('lbl-desc-bishop',  t('descBishop'));
  setText('lbl-desc-knight',  t('descKnight'));
  setText('lbl-desc-pawn',    t('descPawn'));
  setHtml('lbl-rule-castling',  '<strong>'+t('ruleCastling')+'</strong>'+t('ruleCastlingDesc'));
  setHtml('lbl-rule-enpassant', '<strong>'+t('ruleEnPassant')+'</strong>'+t('ruleEnPassantDesc'));
  setHtml('lbl-rule-promotion', '<strong>'+t('rulePromotion')+'</strong>'+t('rulePromotionDesc'));
  setHtml('lbl-rule-check',     '<strong>'+t('ruleCheck')+'</strong>'+t('ruleCheckDesc'));
  setHtml('lbl-rule-stalemate', '<strong>'+t('ruleStalemate')+'</strong>'+t('ruleStalemateDesc'));
  setHtml('lbl-rule-2p',        '<strong>'+t('rule2P')+'</strong>'+t('rule2PDesc'));

  // ── CHANGELOG ──
  setText('lbl-cl-badge', t('clBadge'));
  setText('lbl-cl-title', t('clTitle'));
  setText('lbl-cl-close', t('clClose'));
  setText('cldesc1', t('cldesc1'));
  setText('cl1', t('cl1'))
  const ds=document.getElementById('lbl-cl-dontshow');
  if(ds){
    const cb=document.getElementById('changelog-skip-cb');
    ds.innerHTML='';
    if(cb) ds.appendChild(cb);
    ds.append(' '+t('clDontShow'));
  }
  setText('lbl-about-close', t('aboutClose'));

  // ── LANG MODAL ──
  document.querySelectorAll('.lang-opt').forEach(el=>{
    el.classList.toggle('active', el.dataset.lang===currentLang);
  });
}

function setLanguage(lang){
  if(!LANGS[lang]) return;
  currentLang=lang;
  localStorage.setItem('chessMasterLang', lang);
  applyLang();
  setTimeout(closeLangModal, 250);
}

function openLangModal(){
  document.querySelectorAll('.lang-opt').forEach(el=>{
    el.classList.toggle('active', el.dataset.lang===currentLang);
  });
  document.getElementById('lang-modal').classList.add('show');
}

function closeLangModal(){
  document.getElementById('lang-modal').classList.remove('show');
}

// Apply on startup
(function(){
  const saved=localStorage.getItem('chessMasterLang');
  if(saved && LANGS[saved]) currentLang=saved;
  setTimeout(applyLang, 100);
})();
