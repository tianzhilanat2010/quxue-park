function parkToday() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}
function readParkDaily() {
  try { const data = JSON.parse(localStorage.getItem('math_park_daily') || '{}'); return data.date === parkToday() ? Number(data.count) || 0 : 0; } catch { return 0; }
}
function recordParkPractice(count) {
  try { localStorage.setItem('math_park_daily', JSON.stringify({ date: parkToday(), count: readParkDaily() + count })); } catch {}
}
function refreshParkStats() {
  document.querySelectorAll('[data-park-stars]').forEach(el => el.textContent = state.stats.stars);
  document.querySelectorAll('[data-park-exams]').forEach(el => el.textContent = state.stats.exams);
  document.getElementById('resumeAdventure').hidden = !state.questions.length || state.quizGraded;
  const count = Math.min(5, readParkDaily());
  document.querySelector('[data-daily-label]').textContent = `${count}/5`;
  document.querySelectorAll('[data-reward]').forEach(el => el.classList.toggle('unlocked', state.stats.stars >= Number(el.dataset.reward)));
}
window.addEventListener('DOMContentLoaded', () => {
  refreshParkStats();
  const settings = document.getElementById('parkSettings');
  document.getElementById('openSettings').addEventListener('click', () => settings.showModal());
  document.getElementById('resumeAdventure').addEventListener('click', () => switchView('quiz'));
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let motionPaused = reducedMotion.matches;
  try { motionPaused = reducedMotion.matches || localStorage.getItem('park_motion_paused') === 'true'; } catch {}
  const motionButton = document.getElementById('motionToggle');
  function applyMotion() {
    document.documentElement.classList.toggle('motion-paused', motionPaused);
    document.querySelectorAll('.motion-art').forEach(img => { img.src = motionPaused ? img.dataset.still : img.dataset.motion; });
    motionButton.textContent = motionPaused ? '▷ 播放动画' : 'Ⅱ 暂停动画';
    motionButton.setAttribute('aria-pressed', String(motionPaused));
  }
  motionButton.addEventListener('click', () => {
    motionPaused = !motionPaused;
    try { localStorage.setItem('park_motion_paused', String(motionPaused)); } catch {}
    applyMotion();
  });
  reducedMotion.addEventListener('change', event => { motionPaused = event.matches; applyMotion(); });
  document.querySelectorAll('.motion-art').forEach(img => img.addEventListener('error', () => {
    if (img.getAttribute('src') !== img.dataset.still) img.src = img.dataset.still;
  }));
  applyMotion();

  // Interactive star sparkle trail & click burst on the Adventure Park home, Math Island & Chinese Island
  const sparkleIcons = ['✦', '★', '✨', '⭐', '✧'];
  const sparkleColors = ['#f59e0b', '#fbbf24', '#34d399', '#38bdf8', '#f472b6'];
  let lastSparkleTime = 0;
  function spawnCursorSparkle(x, y, count = 1) {
    if (motionPaused) return;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.className = 'cursor-sparkle';
      el.textContent = sparkleIcons[Math.floor(Math.random() * sparkleIcons.length)];
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
      el.style.textShadow = '0 0 10px #fef08a';
      const dx = Math.round((Math.random() - 0.5) * (count > 1 ? 76 : 34));
      const dy = Math.round(-20 - Math.random() * (count > 1 ? 52 : 28));
      el.style.setProperty('--dx', `${dx}px`);
      el.style.setProperty('--dy', `${dy}px`);
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 860);
    }
  }
  window.addEventListener('pointermove', (e) => {
    if ((state.view !== 'home' && state.view !== 'math' && state.view !== 'chinese' && state.view !== 'english' && state.view !== 'games') || motionPaused) return;
    const now = performance.now();
    if (now - lastSparkleTime > 95) {
      lastSparkleTime = now;
      spawnCursorSparkle(e.clientX, e.clientY, 1);
    }
  });
  window.addEventListener('pointerdown', (e) => {
    if (motionPaused) return;
    spawnCursorSparkle(e.clientX, e.clientY, 5);
  });

  // Rotating encouraging lines & click interaction for Dr. Panda on Math Island
  const mascotLines = [
    "“今天想挑战哪个单元呀？✨”",
    "“点任意一座小岛就能立即出发！🧭”",
    "“遇到难题别怕，跟着动画想一想！🎬”",
    "“背熟九九口诀，乘除法超轻松！🍊”",
    "“连续答对还能触发火焰连击哦！🔥”"
  ];
  let mascotLineIdx = 0;
  const mascotSpeechEl = document.getElementById("mathMascotSpeech");
  const mascotBoxEl = document.getElementById("mathMascotBox");
  setInterval(() => {
    if (motionPaused || state.view !== "math" || !mascotSpeechEl) return;
    mascotLineIdx = (mascotLineIdx + 1) % mascotLines.length;
    mascotSpeechEl.textContent = mascotLines[mascotLineIdx];
  }, 4200);
  if (mascotBoxEl) {
    mascotBoxEl.addEventListener("click", (e) => {
      mascotLineIdx = (mascotLineIdx + 1) % mascotLines.length;
      if (mascotSpeechEl) mascotSpeechEl.textContent = mascotLines[mascotLineIdx];
      spawnCursorSparkle(e.clientX || window.innerWidth / 2, e.clientY || 240, 8);
      if (typeof playSound === "function") playSound("pop");
      if (typeof speakText === "function") speakText(mascotLines[mascotLineIdx].replace(/[“”✨🧭🎬🍊🔥]/g, ""));
    });
  }

  // Rotating encouraging lines & click interaction for Dr. Panda on Chinese Island
  const cnMascotLines = [
    "“一起来读古诗、巧记汉字吧！🌸”",
    "“三点水伴清晴睛，偏旁口诀最好记！🔍”",
    "“白勺的、土也地、双人得，分清楚！🎋”",
    "“点开必背古诗馆，听我为你朗诵！📜”",
    "“坐井观天、狐假虎威，成语故事超有趣！🦊”"
  ];
  let cnMascotIdx = 0;
  const cnSpeechEl = document.getElementById("chineseMascotSpeech");
  const cnBoxEl = document.getElementById("chineseMascotBox");
  setInterval(() => {
    if (motionPaused || state.view !== "chinese" || !cnSpeechEl) return;
    cnMascotIdx = (cnMascotIdx + 1) % cnMascotLines.length;
    cnSpeechEl.textContent = cnMascotLines[cnMascotIdx];
  }, 4200);
  if (cnBoxEl) {
    cnBoxEl.addEventListener("click", (e) => {
      cnMascotIdx = (cnMascotIdx + 1) % cnMascotLines.length;
      if (cnSpeechEl) cnSpeechEl.textContent = cnMascotLines[cnMascotIdx];
      spawnCursorSparkle(e.clientX || window.innerWidth / 2, e.clientY || 240, 8);
      if (typeof playSound === "function") playSound("pop");
      if (typeof speakText === "function") speakText(cnMascotLines[cnMascotIdx].replace(/[“”🌸🔍🎋📜🦊]/g, ""));
    });
  }

  // Rotating encouraging lines & click interaction for Dr. Panda on English Island
  const enMascotLines = [
    "“Hello, little explorer! Let's learn English! ✨”",
    "“Phonics is magic: c-a-t makes cat! 🐱”",
    "“What's your favorite color? I like rainbow! 🌈”",
    "“Sight words are super easy to remember! ⭐”",
    "“You are doing great! Keep it up! 🏆”"
  ];
  let enMascotIdx = 0;
  const enSpeechEl = document.getElementById("englishMascotSpeech");
  const enBoxEl = document.getElementById("englishMascotBox");
  setInterval(() => {
    if (motionPaused || state.view !== "english" || !enSpeechEl) return;
    enMascotIdx = (enMascotIdx + 1) % enMascotLines.length;
    enSpeechEl.textContent = enMascotLines[enMascotIdx];
  }, 4200);
  if (enBoxEl) {
    enBoxEl.addEventListener("click", (e) => {
      enMascotIdx = (enMascotIdx + 1) % enMascotLines.length;
      if (enSpeechEl) enSpeechEl.textContent = enMascotLines[enMascotIdx];
      spawnCursorSparkle(e.clientX || window.innerWidth / 2, e.clientY || 240, 8);
      if (typeof playSound === "function") playSound("pop");
      const cleanEn = enMascotLines[enMascotIdx].replace(/[“”✨🐱🌈⭐🏆]/g, "");
      if (typeof speakEnglishText === "function") speakEnglishText(cleanEn);
      else if (typeof speakText === "function") speakText(cleanEn);
    });
  }

  document.querySelectorAll('[data-park-action]').forEach(el => el.addEventListener('click', () => {
    const action = el.dataset.parkAction;
    if (action === 'math') switchView('math');
    if (action === 'chinese') switchView('chinese');
    if (action === 'english') switchView('english');
    if (action === 'games') switchView('games');
    if (action === 'phonics' && typeof openPhonicsModal === 'function') openPhonicsModal();
    if (action === 'daily') startQuiz('grade2_core', generateQuizSet('grade2_core', 5));
    if (action === 'theater') { switchView('theater'); renderTheaterView(0); }
    if (action === 'mantra' && typeof openMantraModal === 'function') openMantraModal();
    if (action === 'poem' && typeof openPoemModal === 'function') openPoemModal();
  }));
  const dialog = document.getElementById('parkDialog');
  document.getElementById('parkDialogClose').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog && (event.clientX < dialog.getBoundingClientRect().left || event.clientX > dialog.getBoundingClientRect().right || event.clientY < dialog.getBoundingClientRect().top || event.clientY > dialog.getBoundingClientRect().bottom)) dialog.close(); });
  document.querySelectorAll('[data-park-panel]').forEach(el => el.addEventListener('click', () => {
    const panel = el.dataset.parkPanel;
    const stars = Number(state.stats.stars) || 0;
    const exams = Number(state.stats.exams) || 0;
    const best = state.stats.bestScore === null ? '—' : Number(state.stats.bestScore);
    const bestCombo = Number(state.stats.bestCombo) || 0;
    const rewards = [[3,'🌱','萌芽小苗'],[10,'🧭','好奇探索家'],[20,'📜','诗词小才子'],[30,'🏆','二年级小勇士'],[60,'👑','语数学霸大师']];
    document.getElementById('parkDialogContent').innerHTML = panel === 'rewards' || panel === 'growth'
      ? `<span class="dialog-emoji">🏆</span><h2>${panel === 'growth' ? '我的二年级成长图鉴' : '星星成就奖励'}</h2><p>每完成一套二年级数学或语文闯关获得 1–3 颗星，累计点亮成长徽章。</p><div class="badge-grid">${rewards.map(([n,emoji,title]) => `<div class="badge-item ${stars >= n ? 'earned' : ''}"><span>${emoji}</span><b>${title}</b><small>${stars >= n ? '已点亮' : `还差 ${n-stars} 颗星`}</small></div>`).join('')}</div><p>已收集 ${stars} 颗星星 · 最高连击 ${bestCombo} 题，继续加油！</p>`
      : `<span class="dialog-emoji">🌱</span><h2>每一份努力，都看得见</h2><p>孩子在这台设备上的二年级数学与语文学习记录</p><div class="report-metrics"><div><b>${exams}</b><span>完成试卷</span></div><div><b>${best}</b><span>最高分</span></div><div><b>${stars}</b><span>累计星星</span></div><div><b>${bestCombo}</b><span>最高连击</span></div></div><p>今天已提交 ${readParkDaily()} 道已作答题目。已全面覆盖二年级数学 12 大专题（乘除法、有余数除法、混合运算、钟表、数独等）与二年级语文 8 大专题（必背古诗、形近字族、多音字、成语寓言、量词与的地得、部首查字典、句式转换、课文与看图写话）。</p><small>记录保存在当前浏览器，暂不跨设备同步；跳跳乐游戏分数单独计算。</small>`;
    dialog.showModal();
  }));
});
