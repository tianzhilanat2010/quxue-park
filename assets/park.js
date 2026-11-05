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
  const count = Math.min(5, readParkDaily());
  document.querySelector('[data-daily-label]').textContent = `${count}/5`;
  document.querySelectorAll('.mission-dots i').forEach((el, i) => { el.classList.toggle('done', i < count); el.textContent = i < count ? '✓' : i + 1; });
  document.querySelectorAll('[data-reward]').forEach(el => el.classList.toggle('unlocked', state.stats.stars >= Number(el.dataset.reward)));
}
window.addEventListener('DOMContentLoaded', () => {
  refreshParkStats();
  document.querySelectorAll('[data-park-action]').forEach(el => el.addEventListener('click', () => {
    const action = el.dataset.parkAction;
    if (action === 'math') switchView('math');
    if (action === 'daily') startQuiz('mixed', generateQuizSet('mixed', 5));
    if (action === 'theater') { switchView('theater'); renderTheaterView(0); }
  }));
  const dialog = document.getElementById('parkDialog');
  document.getElementById('parkDialogClose').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog && (event.clientX < dialog.getBoundingClientRect().left || event.clientX > dialog.getBoundingClientRect().right || event.clientY < dialog.getBoundingClientRect().top || event.clientY > dialog.getBoundingClientRect().bottom)) dialog.close(); });
  document.querySelectorAll('[data-park-panel]').forEach(el => el.addEventListener('click', () => {
    const panel = el.dataset.parkPanel;
    const stars = Number(state.stats.stars) || 0;
    const exams = Number(state.stats.exams) || 0;
    const best = state.stats.bestScore === null ? '—' : Number(state.stats.bestScore);
    const rewards = [[3,'🌱','萌芽小苗'],[10,'🧭','好奇探索家'],[30,'🏆','数学小勇士'],[60,'👑','冒险小大师']];
    document.getElementById('parkDialogContent').innerHTML = panel === 'rewards' || panel === 'growth'
      ? `<span class="dialog-emoji">🏆</span><h2>${panel === 'growth' ? '我的成长图鉴' : '星星成就奖励'}</h2><p>每完成一套试卷获得 1–3 颗星，累计点亮成长徽章。</p><div class="badge-grid">${rewards.map(([n,emoji,title]) => `<div class="badge-item ${stars >= n ? 'earned' : ''}"><span>${emoji}</span><b>${title}</b><small>${stars >= n ? '已点亮' : `还差 ${n-stars} 颗星`}</small></div>`).join('')}</div><p>已收集 ${stars} 颗星星，继续加油！</p>`
      : `<span class="dialog-emoji">🌱</span><h2>每一份努力，都看得见</h2><p>孩子在这台设备上的数学学习记录</p><div class="report-metrics"><div><b>${exams}</b><span>完成试卷</span></div><div><b>${best}</b><span>最高分</span></div><div><b>${stars}</b><span>累计星星</span></div></div><p>今天已提交 ${readParkDaily()} 道已作答题目。${exams ? '可以到动画课堂复习，再开始下一次挑战。' : '从每天 5 道题开始，慢慢建立学习习惯。'}</p><small>记录保存在当前浏览器，暂不跨设备同步；星际游戏分数单独计算。</small>`;
    dialog.showModal();
  }));
});
