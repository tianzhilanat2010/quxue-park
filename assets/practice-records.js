// Keep attempts on this browser and origin; never overwrite an older answer sheet on retry.
(() => {
  'use strict';
  const KEY = 'panda_practice_records_v1';
  const copy = value => JSON.parse(JSON.stringify(value));
  const hasAnswer = value => value !== undefined && value !== null && String(value).trim() !== '';
  const text = value => hasAnswer(value) ? String(value) : '未作答';
  const numberIs = (value, expected) => hasAnswer(value) && Number(value) === expected;
  const circled = value => ['①', '②', '③', '④'][Number(value) - 1] || String(value);
  const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
  const isChinesePaper = p => Boolean(p && (p.subject === 'chinese' || String(p.mode || '').startsWith('cn_paper_')));
  const validPaper = p => {
    if (!p || typeof p.mode !== 'string' || typeof p.title !== 'string' || !p.answers) return false;
    if (isChinesePaper(p)) {
      return Array.isArray(p.sec1Questions) && Array.isArray(p.sec2Questions) &&
        Array.isArray(p.sec3Questions) && Boolean(p.readingPassage?.questions) && Boolean(p.writingTask?.blanks);
    }
    return Array.isArray(p.q15Items) && Array.isArray(p.q16Cfg?.items) &&
      ['q11Cfg', 'q12Cfg', 'q13Cfg', 'q14Cfg', 'q17Cfg', 'q18Cfg', 'q19Cfg'].every(key => p[key]);
  };
  const validRecord = r => r && typeof r.id === 'string' && typeof r.completedAt === 'string' &&
    (r.kind === 'paper' ? validPaper(r.paper) : r.kind === 'quiz' && Array.isArray(r.questions) && r.userAnswers);

  function createStore(storage) {
    let error = '';
    const empty = () => ({version: 1, drafts: {}, attempts: []});
    function read() {
      try {
        const raw = storage.getItem(KEY);
        if (raw === null) return empty();
        const data = JSON.parse(raw);
        if (data?.version !== 1 || !Array.isArray(data.attempts) || !data.drafts || Array.isArray(data.drafts)) throw new Error('invalid records');
        data.attempts = data.attempts.filter(validRecord);
        return data;
      } catch {
        error = '暂时无法读取本浏览器的练习记录；本次答题仍可继续。';
        return null;
      }
    }
    function write(data) {
      if (!data) return false;
      try {
        storage.setItem(KEY, JSON.stringify(data));
        error = '';
        return true;
      } catch {
        error = '本次记录未能保存，浏览器存储可能已满或被禁用。请先保留当前页面。';
        return false;
      }
    }
    function identify(paper) {
      paper.attemptId ||= uid();
      paper.startedAt ||= new Date().toISOString();
    }
    return {
      get error() {return error;},
      list: () => copy(read()?.attempts || []),
      draft(mode) {
        const draft = read()?.drafts[mode];
        return validPaper(draft) && !draft.graded ? copy(draft) : null;
      },
      summary(mode) {
        const data = read();
        const records = (data?.attempts || []).filter(r => r.kind === 'paper' && r.paper.mode === mode);
        return {count: records.length, latestScore: records[0]?.paper.totalScore ?? null,
          bestScore: records.length ? Math.max(...records.map(r => r.paper.totalScore)) : null,
          draft: validPaper(data?.drafts[mode]) && !data.drafts[mode].graded};
      },
      saveDraft(paper) {
        if (!validPaper(paper) || paper.graded) return true;
        if (!Object.values(paper.answers).some(hasAnswer)) {
          if (!paper.attemptId) return true;
          const data = read();
          if (!data) return false;
          if (data.drafts[paper.mode]?.attemptId !== paper.attemptId) return true;
          delete data.drafts[paper.mode];
          return write(data);
        }
        identify(paper);
        const data = read();
        if (!data) return false;
        if (data.attempts.some(r => r.id === paper.attemptId)) return true;
        data.drafts[paper.mode] = {...copy(paper), savedAt: new Date().toISOString()};
        return write(data);
      },
      completePaper(paper) {
        if (!validPaper(paper) || !paper.graded) return false;
        identify(paper);
        const data = read();
        if (!data) return false;
        if (data.attempts.some(r => r.id === paper.attemptId)) return true;
        data.attempts.unshift({id: paper.attemptId, kind: 'paper', completedAt: new Date().toISOString(), paper: copy(paper)});
        if (data.drafts[paper.mode]?.attemptId === paper.attemptId) delete data.drafts[paper.mode];
        return write(data);
      },
      completeQuiz(quiz) {
        if (!Array.isArray(quiz.questions) || !quiz.userAnswers) return false;
        const data = read();
        if (!data) return false;
        quiz.id ||= uid();
        if (data.attempts.some(r => r.id === quiz.id)) return true;
        data.attempts.unshift({...copy(quiz), kind: 'quiz', completedAt: new Date().toISOString()});
        return write(data);
      }
    };
  }

  function matchTwoOperands(aVal, bVal, expA, expB, commutative) {
    if (numberIs(aVal, expA) && numberIs(bVal, expB)) return true;
    if (commutative && numberIs(aVal, expB) && numberIs(bVal, expA)) return true;
    return false;
  }

  function reviewChinesePaper(p) {
    const a = p.answers || {}, items = [];
    const allQs = [
      ...(p.sec1Questions || []),
      ...(p.sec2Questions || []),
      ...(p.sec3Questions || []),
      ...(p.readingPassage?.questions || [])
    ];
    for (const q of allQs) {
      const val = a[q.key];
      const choiceText = idx => hasAnswer(idx) ? `${circled(idx)} ${q.choices[Number(idx) - 1] || ''}` : '未作答';
      items.push({
        id: q.key,
        label: `第 ${q.num} 题 · ${q.title}`,
        prompt: `${q.promptPrefix}（ ？ ）${q.promptSuffix}`,
        yourAnswer: choiceText(val),
        correctAnswer: choiceText(q.correctIdx),
        correct: numberIs(val, q.correctIdx),
        points: q.points,
        explanation: q.explainDetail || '',
        animKey: q.key
      });
    }
    const w = p.writingTask;
    if (w && Array.isArray(w.blanks)) {
      w.blanks.forEach((b, idx) => {
        const val = a[b.key];
        const choiceText = cIdx => hasAnswer(cIdx) ? `${circled(cIdx)} ${b.choices[Number(cIdx) - 1] || ''}` : '未作答';
        items.push({
          id: b.key,
          label: `第 17 题（${idx + 1}）· ${b.label}`,
          prompt: `${b.prefix}（ ？ ）${b.suffix}`,
          yourAnswer: choiceText(val),
          correctAnswer: choiceText(b.correctIdx),
          correct: numberIs(val, b.correctIdx),
          points: b.points || 3,
          explanation: w.explainDetail || '',
          animKey: 'q17'
        });
      });
    }
    return items;
  }

  function reviewPaper(p) {
    if (isChinesePaper(p)) return reviewChinesePaper(p);
    const a = p.answers, items = [];
    const add = (key, label, prompt, yourAnswer, correctAnswer, correct, points, explanation = '') =>
      items.push({id: key, label, prompt, yourAnswer, correctAnswer, correct, points, explanation, animKey: key.split('_')[0]});
    for (const key of ['q11', 'q12', 'q13', 'q14']) {
      const c = p[key + 'Cfg'];
      let prompt, options;
      if (c.customMcq) {
        prompt = `${c.promptPrefix} ？ ${c.promptSuffix}`;
        options = c.choices.map(val => String(val));
      } else if (key === 'q11') {
        prompt = c.promptPrefix ? `${c.promptPrefix} ？ ${c.promptSuffix}` : `${c.actor}搬${c.total}${c.unit}${c.item}，每次搬${c.perStep}${c.unit}，需要几次？`;
        options = c.choices.map(value => `${value}${c.unitLabel || '次'}`);
      } else if (key === 'q12') {
        prompt = `${c.total} ÷ ${c.a} = ${c.b}，哪种${c.name}摆法不符合？`;
        options = [`每组${c.a}个，分${c.b}组`, `分成${c.a}组，每组${c.b}个`, `两组分别${c.wrongA}个和${c.wrongB}个`];
      } else if (key === 'q13') {
        const u = c.unit || '束';
        prompt = `每${u}${c.item || '花'}${c.price}元，买${c.buyN}${u}送${c.freeN}${u}，${c.budget}元可以得到几${u}？`;
        options = c.choices.map(value => `${value}${u}`);
      } else {
        const u = c.unit || '双', name = c.itemName || '袜子';
        prompt = `${c.items.map(item => `${circled(item.idx)} ${item.count}${u}${item.cost}元`).join('；')}。哪种${name}平均每${u}最便宜？`;
        options = c.items.map(item => `${item.count}${u}${item.cost}元`);
      }
      const choiceText = value => hasAnswer(value) ? `${circled(value)} ${options[Number(value) - 1] || ''}` : '未作答';
      add(key, `第 ${key.slice(1)} 题`, prompt, choiceText(a[key]), choiceText(c.correctIdx), numberIs(a[key], c.correctIdx), 2, c.explainDetail || '');
    }
    for (const [key, list, points] of [['q15', p.q15Items, 1], ['q16', p.q16Cfg.items, 2]]) {
      list.forEach((item, i) => add(`${key}_${i}`, `第 ${key.slice(1)} 题 · 第 ${i + 1} 小题`, item.expr,
        text(a[`${key}_${i}`]), String(item.ans), numberIs(a[`${key}_${i}`], item.ans), points,
        `${item.expr.replace(/=\s*$/, '').trim()} = ${item.ans}`));
    }
    const fields = (keys, display) => keys.some(key => hasAnswer(a[key])) ? display : '未作答';
    const box = key => hasAnswer(a[key]) ? String(a[key]) : '□';
    for (const part of [1, 2]) {
      const c = p.q17Cfg, prefix = `q17_${part}`;
      const op = part === 1 ? (c.sub1Op || '÷') : (c.sub2Op || '÷');
      const expA = part === 1 ? (c.sub1A ?? c.total) : (c.sub2A ?? c.total);
      const expB = part === 1 ? (c.sub1B ?? c.sides) : (c.sub2B ?? c.sub2Groups);
      const expected = part === 1 ? c.sub1Ans : c.sub2Ans;
      const unit = part === 1 ? (c.sub1Unit || c.groupUnit || '个') : (c.sub2Unit || c.itemUnit || '根');
      const comm = part === 1 ? Boolean(c.sub1Commutative) : Boolean(c.sub2Commutative);
      const keys = ['a', 'b', 'c', 'ans'].map(suffix => prefix + '_' + suffix);
      const correct = matchTwoOperands(a[keys[0]], a[keys[1]], expA, expB, comm) &&
        numberIs(a[keys[2]], expected) && numberIs(a[keys[3]], expected);
      const rawText = (part === 1 ? c.sub1Text : c.sub2Text || '').replace(/<[^>]+>/g, '');
      add(prefix, `第 17 题（${part}）`, `${rawText}（？${unit}）`,
        fields(keys, `${box(prefix + '_a')} ${op} ${box(prefix + '_b')} = ${box(prefix + '_c')}；答：${box(prefix + '_ans')}${unit}`),
        `${expA} ${op} ${expB} = ${expected}；答：${expected}${unit}`, correct, 12, c.explainDetail || '');
    }
    const c = p.q18Cfg;
    const op1 = c.sub1Op || '×', u18_1 = c.sub1Unit || '元', comm18_1 = c.sub1Commutative !== false && (op1 === '×' || op1 === '+');
    add('q18_1', '第 18 题（1）', c.sub1Prompt || `买${c.sub1Count}${c.unit || '枝'}${c.sub1Flower}需要多少钱？`,
      fields(['q18_1_a', 'q18_1_b', 'q18_1_c'], `${box('q18_1_a')} ${op1} ${box('q18_1_b')} = ${box('q18_1_c')}${u18_1}`),
      `${c.sub1Price} ${op1} ${c.sub1Count} = ${c.sub1Total}${u18_1}`,
      numberIs(a.q18_1_c, c.sub1Total) && matchTwoOperands(a.q18_1_a, a.q18_1_b, c.sub1Price, c.sub1Count, comm18_1), 12, c.explainDetail || '');

    const op2 = c.sub2Op || '÷', u18_2 = c.sub2Unit || c.unit || '枝';
    const choiceList = c.sub2ChoiceOptions || c.flowers;
    add('q18_2', '第 18 题（2）', c.sub2Prompt || `只买一种正好用完${c.sub2Budget}元，买哪种、几${u18_2}？`,
      fields(['q18_2_flower', 'q18_2_a', 'q18_2_b', 'q18_2_c'],
        `${choiceList.find(f => f.idx === Number(a.q18_2_flower))?.name || '未选'}；${hasAnswer(a.q18_2_a) ? box('q18_2_a') : c.sub2Budget} ${op2} ${box('q18_2_b')} = ${box('q18_2_c')}${u18_2}`),
      `${c.sub2FlowerName}；${c.sub2Budget} ${op2} ${c.sub2Price} = ${c.sub2Count}${u18_2}`,
      numberIs(a.q18_2_flower, c.sub2FlowerIdx) && numberIs(a.q18_2_c, c.sub2Count), 14, c.explainDetail || '');

    const t = p.q19Cfg, u19 = t.resultUnit || '', noun19 = t.resultNoun || '';
    add('q19', '第 19 题', t.prompt,
      fields(['q19_gaps', 'q19_trees'], `${t.step1Label}：${box('q19_gaps')}${t.step1Unit || ''}；最终得数：${box('q19_trees')}${u19}${noun19}`),
      t.correctMarkText || `${t.step1Label} = ${t.gaps}${t.step1Unit || ''}；最终 = ${t.trees}${u19}${noun19}`,
      numberIs(a.q19_trees, t.trees), 10, t.explainDetail || '');
    return items;
  }

  function reviewQuiz(record) {
    return record.questions.map((q, index) => ({id: q.id, label: `第 ${index + 1} 题`, prompt: q.prompt,
      yourAnswer: hasAnswer(record.userAnswers[q.id]) ? String(record.userAnswers[q.id]) + (q.unit || '') : '未作答',
      correctAnswer: String(q.answer) + (q.unit || ''),
      correct: hasAnswer(record.userAnswers[q.id]) && String(record.userAnswers[q.id]).trim() === String(q.answer).trim(),
      explanation: q.formula || '', question: q}));
  }

  window.PracticeRecords = {KEY, createStore, reviewPaper, reviewQuiz};
})();
