(() => {
  'use strict';
  const escape = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const when = date => new Date(date).toLocaleString('zh-CN', {year:'numeric',month:'long',day:'numeric',hour:'2-digit',minute:'2-digit'});
  const time = seconds => window.PracticeTiming.format(Math.max(0, Number(seconds) || 0));

  function getAllPresets() {
    const mathList = (window.MathPapers?.presets || []).map(p => ({...p, subject: 'math'}));
    const cnList = (window.ChinesePapers?.presets || []).map(p => ({...p, subject: 'chinese'}));
    return [...mathList, ...cnList];
  }

  function getActiveSubjectPresets() {
    const subj = window.currentExamSubject === 'chinese' ? 'chinese' : 'math';
    if (subj === 'chinese' && window.ChinesePapers?.presets) return window.ChinesePapers.presets;
    return window.MathPapers?.presets || [];
  }

  function getPaperExplanation(paper, animKey) {
    if (paper?.subject === 'chinese' || String(paper?.mode || '').startsWith('cn_paper_')) {
      return window.ChinesePapers?.explanation(paper, animKey);
    }
    return window.MathPapers?.explanation(paper, animKey);
  }

  function mount({store, onStart, onAnimation}) {
    const dialog = document.getElementById('practiceRecordsDialog');
    const content = document.getElementById('practiceRecordsContent');
    let page = 'overview', selectedMode = '', selectedId = '', onlyWrong = true;

    function refresh({renderOpen = false} = {}) {
      const allPresets = getAllPresets();
      let completed = 0;
      const summaries = new Map(allPresets.map(preset => {
        const summary = store.summary(preset.id);
        if (summary.count) completed++;
        return [preset.id, summary];
      }));
      const activePresets = getActiveSubjectPresets();
      const picker = document.getElementById('mathPaperPreset');
      if (picker) {
        const selected = picker.value;
        picker.innerHTML = activePresets.map(preset => {
          const s = summaries.get(preset.id) || {count: 0, latestScore: null, draft: false};
          const status = s.count ? `已做${s.count}次 · 最近${s.latestScore}分` : '未做';
          return `<option value="${preset.id}">${escape(preset.label)} · ${status}${s.draft ? ' · 待完成' : ''}</option>`;
        }).join('');
        if (activePresets.some(p => p.id === selected)) picker.value = selected;
      }
      document.querySelectorAll('[data-paper-record-summary]').forEach(el => {
        el.textContent = `已完成 ${completed} / ${allPresets.length} 套 · 查看成绩与错题`;
      });
      document.querySelectorAll('[data-record-save-status]').forEach(el => {
        el.textContent = store.error;
        el.hidden = !store.error;
      });
      if (dialog.open && renderOpen) render();
    }

    function attemptRow(record) {
      const paper = record.kind === 'paper', score = paper ? record.paper.totalScore : record.score;
      const wrongs = (paper ? window.PracticeRecords.reviewPaper(record.paper) : window.PracticeRecords.reviewQuiz(record)).filter(q => !q.correct);
      const paperTitle = paper
        ? (String(record.paper.letter || '').startsWith('语文') ? `${record.paper.letter}卷` : `数学${record.paper.letter}卷`)
        : record.title;
      return `<button class="practice-attempt" data-record-id="${escape(record.id)}">
        <span class="practice-attempt-icon" aria-hidden="true">${wrongs.length ? '📒' : '🏅'}</span>
        <span class="practice-attempt-copy"><strong>${escape(paperTitle)}</strong>
          <small>${escape(when(record.completedAt))} · 用时 ${time(paper ? record.paper.secondsElapsed : record.secondsElapsed)}</small>
          <span>${wrongs.length ? `${wrongs.length} 道错题 / 漏题，去复习` : '全部答对，查看答卷'} →</span></span>
        <b class="practice-attempt-score">${Number(score) || 0}<small>分</small></b></button>`;
    }

    function render() {
      const all = store.list();
      const allPresets = getAllPresets();
      const notice = `<p class="practice-record-note">保存在当前浏览器。清除网站数据或更换浏览器后，记录不会保留。</p>`;
      if (page === 'detail') {
        const record = all.find(item => item.id === selectedId);
        if (!record) {page = 'overview'; render(); return;}
        const isPaper = record.kind === 'paper';
        const review = isPaper ? window.PracticeRecords.reviewPaper(record.paper) : window.PracticeRecords.reviewQuiz(record);
        const wrongs = review.filter(q => !q.correct), shown = onlyWrong ? wrongs : review;
        const isCn = isPaper && (record.paper.subject === 'chinese' || String(record.paper.mode || '').startsWith('cn_paper_'));
        content.innerHTML = `<button class="practice-back" data-record-back>← 返回练习记录</button>
          <div class="practice-detail-head"><div><span class="practice-eyebrow">${escape(when(record.completedAt))} · 用时 ${time(isPaper ? record.paper.secondsElapsed : record.secondsElapsed)}</span>
            <h3>${escape(isPaper ? `${record.paper.letter}卷 · 答题记录` : record.title)}</h3>
            <p>${wrongs.length ? `${wrongs.length} 道错题 / 漏题，一道一道弄明白` : '这次全部答对啦，继续保持！'}</p></div>
            <strong class="practice-detail-score">${Number(isPaper ? record.paper.totalScore : record.score) || 0}<small>分</small></strong></div>
          <div class="practice-review-filter" aria-label="答卷筛选">
            <button data-review-filter="wrong" aria-pressed="${onlyWrong}">只看错题 (${wrongs.length})</button>
            <button data-review-filter="all" aria-pressed="${!onlyWrong}">全部题目 (${review.length})</button>
          </div>
          <div class="practice-review-list">${shown.map((q, index) => `<article class="practice-review-question ${q.correct ? 'is-correct' : ''}">
            <div class="practice-review-top"><b>${escape(q.label)} · ${q.correct ? '✓ 正确' : q.yourAnswer === '未作答' ? '待补答' : '需要巩固'}</b>
              ${(q.animKey && (isCn || !['q15','q16'].includes(q.animKey))) || q.question?.animData ? `<button data-record-animation="${index}">🎬 动画讲解</button>` : ''}</div>
            <p class="practice-review-prompt">${escape(q.prompt)}</p>
            <div class="practice-answer-pair"><div><small>我的答案</small><strong>${escape(q.yourAnswer)}</strong></div>
              <div><small>正确答案</small><strong>${escape(q.correctAnswer)}</strong></div></div>
            ${q.explanation ? `<p class="practice-review-explanation">${escape(q.explanation)}</p>` : ''}</article>`).join('') || '<div class="practice-empty">🌟 没有错题！可以切到“全部题目”看看自己的答卷。</div>'}</div>${notice}`;
        content.querySelectorAll('[data-record-animation]').forEach(button => button.addEventListener('click', () => {
          const item = shown[Number(button.dataset.recordAnimation)];
          dialog.close();
          onAnimation(isPaper ? getPaperExplanation(record.paper, item.animKey) : item.question);
        }));
      } else if (page === 'paper') {
        const preset = allPresets.find(p => p.id === selectedMode) || allPresets[0];
        const records = all.filter(r => r.kind === 'paper' && r.paper.mode === selectedMode);
        content.innerHTML = `<button class="practice-back" data-record-back>← 全部练习</button>
          <div class="practice-detail-head"><div><span class="practice-eyebrow">每次进步，都记在这里</span><h3>${escape(preset.label)}</h3>
            <p>已完成 ${records.length} 次 · 点击任意记录查看当时的错题</p></div>
            <button class="practice-primary" data-resume-paper="${selectedMode}">${store.draft(selectedMode) ? '继续未完成的试卷' : '再练一次'} →</button></div>
          <div class="practice-attempt-list">${records.map(attemptRow).join('') || '<div class="practice-empty">还没有交卷记录，开始第一份练习吧。</div>'}</div>${notice}`;
      } else {
        content.innerHTML = `<div class="practice-record-intro"><span class="practice-eyebrow">每一次练习，都有收获</span>
          <h3>我的练习足迹（数学${window.MathPapers.presets.length}套 + 语文${window.ChinesePapers?.presets.length || 0}套）</h3><p>看看做过哪套卷，把错题再想一遍。</p></div>
          <div class="practice-paper-grid">${allPresets.map(preset => {
            const s = store.summary(preset.id);
            return `<article class="practice-paper-card ${s.count ? 'is-done' : ''}"><div class="practice-paper-card-head">
              <span class="practice-paper-letter">${escape(preset.letter)}</span><div><h4>${escape(preset.label)}</h4>
              <span class="practice-paper-state">${s.count ? `✓ 已做 ${s.count} 次 · 最近 ${s.latestScore} 分` : '还没做过'}${s.draft ? ' · 有未完成答卷' : ''}</span></div></div>
              <p>${s.count ? `最高成绩 ${s.bestScore} 分` : '准备好就开始，不用着急'}${s.draft ? ' · 答案已自动保存' : ''}</p>
              <div class="practice-card-actions"><button class="practice-primary" data-resume-paper="${preset.id}">${s.draft ? '继续答题' : s.count ? '再练一次' : '开始答题'} →</button>
                ${s.count ? `<button class="practice-secondary" data-record-paper="${preset.id}">成绩与错题</button>` : ''}</div></article>`;
          }).join('')}</div>
          <h4 class="practice-section-title">最近的答题记录 <small>共 ${all.length} 次</small></h4>
          <div class="practice-attempt-list">${all.map(attemptRow).join('') || '<div class="practice-empty">交卷后，成绩和错题会自动出现在这里。数学、语文和英语闯关也会记录。</div>'}</div>${notice}`;
      }
      content.scrollTop = 0;
    }

    document.querySelectorAll('[data-open-practice-records]').forEach(button => button.addEventListener('click', () => {
      page = 'overview'; selectedMode = ''; selectedId = ''; refresh(); render(); if (!dialog.open) dialog.showModal();
    }));
    document.getElementById('practiceRecordsClose').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {if (event.target === dialog) dialog.close();});
    content.addEventListener('click', event => {
      const target = event.target.closest('button');
      if (!target) return;
      if (target.hasAttribute('data-resume-paper')) {dialog.close(); onStart(target.dataset.resumePaper); return;}
      if (target.hasAttribute('data-record-paper')) {page = 'paper'; selectedMode = target.dataset.recordPaper;}
      else if (target.hasAttribute('data-record-id')) {page = 'detail'; selectedId = target.dataset.recordId; onlyWrong = true;}
      else if (target.hasAttribute('data-review-filter')) {onlyWrong = target.dataset.reviewFilter === 'wrong';}
      else if (target.hasAttribute('data-record-back')) {page = page === 'detail' && selectedMode ? 'paper' : 'overview'; if (page === 'overview') selectedMode = '';}
      else return;
      render();
    });
    window.addEventListener('storage', event => {if (event.key === window.PracticeRecords.KEY || event.key === null) refresh({renderOpen:true});});
    refresh();
    return {refresh};
  }
  window.PracticeRecordsUI = {mount, escape};
})();
