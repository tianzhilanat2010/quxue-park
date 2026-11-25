import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

const root = new URL('../', import.meta.url);
const source = file => readFileSync(new URL(file, root), 'utf8');
function setup(storage = new Map()) {
  const context = vm.createContext({window: {}, Date, Math});
  vm.runInContext(source('assets/grade2-math.js'), context);
  vm.runInContext(source('assets/math-papers.js'), context);
  vm.runInContext(source('assets/practice-records.js'), context);
  const api = context.window.PracticeRecords;
  const browser = {getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value)};
  return {context, api, store: api.createStore(browser), browser, storage, papers: context.window.MathPapers};
}
function correctAnswers(p) {
  const a = {};
  for (const key of ['q11', 'q12', 'q13', 'q14']) a[key] = p[key + 'Cfg'].correctIdx;
  p.q15Items.forEach((q, i) => a['q15_' + i] = String(q.ans));
  p.q16Cfg.items.forEach((q, i) => a['q16_' + i] = String(q.ans));
  Object.assign(a, {
    q17_1_ans: p.q17Cfg.sub1Ans, q17_1_a: p.q17Cfg.sub1A ?? p.q17Cfg.total, q17_1_b: p.q17Cfg.sub1B ?? p.q17Cfg.sides, q17_1_c: p.q17Cfg.sub1Ans,
    q17_2_ans: p.q17Cfg.sub2Ans, q17_2_a: p.q17Cfg.sub2A ?? p.q17Cfg.total, q17_2_b: p.q17Cfg.sub2B ?? p.q17Cfg.sub2Groups, q17_2_c: p.q17Cfg.sub2Ans,
    q18_1_a: p.q18Cfg.sub1Price, q18_1_b: p.q18Cfg.sub1Count, q18_1_c: p.q18Cfg.sub1Total,
    q18_2_flower: p.q18Cfg.sub2FlowerIdx, q18_2_c: p.q18Cfg.sub2Count,
    q19_gaps: p.q19Cfg.gaps, q19_trees: p.q19Cfg.trees
  });
  return a;
}

test('unfinished answers and timing survive a fresh store; opening an untouched paper creates no draft', () => {
  const h = setup(), p = h.papers.create('practice_c');
  h.store.saveDraft(p);
  assert.equal(h.store.draft(p.mode), null);
  p.answers = {q11: 2, q15_0: '0'}; p.secondsElapsed = 83; p.secondsRemaining = 1117; p.timeLimitSeconds = 1200;
  assert.equal(h.store.saveDraft(p), true);
  const restored = h.api.createStore(h.browser).draft(p.mode);
  assert.equal(restored.answers.q15_0, '0');
  assert.equal(restored.secondsElapsed, 83); assert.equal(restored.secondsRemaining, 1117);
  restored.answers.q11 = 1;
  assert.equal(h.store.draft(p.mode).answers.q11, 2, 'read results are independent copies');
});

test('completed papers are immutable snapshots; regrading is idempotent and a new attempt preserves the old attempt', () => {
  const h = setup(), p = h.papers.create('workbook');
  p.answers = correctAnswers(p); h.store.saveDraft(p);
  p.graded = true; p.totalScore = 100;
  assert.equal(h.store.completePaper(p), true); assert.equal(h.store.completePaper(p), true);
  assert.equal(h.store.list().length, 1); assert.equal(h.store.draft(p.mode), null);
  const staleTab = {...p, graded: false}; h.store.saveDraft(staleTab);
  assert.equal(h.store.draft(p.mode), null, 'a stale tab cannot recreate a draft for an already completed attempt');
  p.answers.q15_0 = '999';
  assert.equal(h.store.list()[0].paper.answers.q15_0, '53');
  const next = h.papers.create('workbook'); next.answers.q15_0 = '7'; h.store.saveDraft(next);
  next.graded = true; next.totalScore = 0; h.store.completePaper(next);
  const reopened = h.api.createStore(h.browser);
  assert.equal(reopened.summary('workbook').count, 2);
  assert.equal(reopened.summary('workbook').latestScore, 0);
  assert.equal(reopened.summary('workbook').bestScore, 100);
  assert.equal(reopened.list().length, 2);
});

test('clearing every answer removes that draft so a later visit cannot resurrect erased answers', () => {
  const h = setup(), p = h.papers.create('workbook');
  p.answers.q15_0 = '53'; h.store.saveDraft(p);
  p.answers.q15_0 = ''; assert.equal(h.store.saveDraft(p), true);
  assert.equal(h.api.createStore(h.browser).draft(p.mode), null);
  const other = h.papers.create('final_b'); other.answers.q11 = 1; h.store.saveDraft(other);
  h.store.saveDraft(h.papers.create('final_b'));
  assert.equal(h.store.draft('final_b').answers.q11, 1, 'an untouched paper in another tab must not clear an existing draft');
});

test('review lists each wrong or unanswered subquestion, includes original answers and agrees with live grading for A–H', () => {
  const h = setup();
  Object.assign(h.context, {
    document: {getElementById: () => null}, playSound() {}, launchConfetti() {}, syncPaperDomInputs() {},
    renderA4ExamPaper() {}, saveStats() {}, saveCompletedPaperRecord() {},
    getCircledNum: n => ['①', '②', '③'][n - 1], state: {stats: {exams: 0, stars: 0, bestScore: null}}, activePaperClock: {stop() {}}
  });
  h.context.window.scrollTo = () => {};
  const html = source('index.html');
  vm.runInContext(html.slice(html.indexOf('    function matchPaperOperands('), html.indexOf('    function renderChineseA4ExamPaper(')), h.context);
  vm.runInContext(html.slice(html.indexOf('    function gradeA4ExamPaper('), html.indexOf('    function openPaperQuestionAnim(')), h.context);
  for (const preset of h.papers.presets) {
    const p = h.papers.create(preset.id); p.answers = correctAnswers(p);
    p.answers.q15_0 = '0'; delete p.answers.q16_1; p.answers.q17_2_ans = '99';
    h.context.activePaperData = p; vm.runInContext('gradeA4ExamPaper()', h.context);
    const review = h.api.reviewPaper(p), wrongs = review.filter(q => !q.correct);
    assert.equal(review.reduce((sum, q) => sum + (q.correct ? q.points : 0), 0), p.totalScore);
    assert.equal(wrongs.length, 3);
    assert.equal(wrongs[0].yourAnswer, '0'); assert.equal(wrongs[0].correctAnswer, String(p.q15Items[0].ans));
    assert.equal(wrongs[1].yourAnswer, '未作答');
    assert.ok(wrongs.every(q => q.prompt && q.correctAnswer && q.animKey));
    assert.ok(wrongs[2].yourAnswer.includes('99'));
  }
});

test('quiz history saves actual randomized questions, old answers and formula for later wrong-answer review', () => {
  const h = setup();
  const quiz = {topic: 'cn_poem', title: '二年级古诗', score: 50, secondsElapsed: 21,
    questions: [{id: 'one', prompt: '黄河入海流的上一句？', answer: '白日依山尽', formula: '《登鹳雀楼》'},
      {id: 'two', prompt: '2 × 3 = ?', answer: 6, formula: '二三得六'}],
    userAnswers: {one: '白日依山尽', two: '5'}};
  assert.equal(h.store.completeQuiz(quiz), true);
  quiz.userAnswers.two = '6';
  const record = h.api.createStore(h.browser).list()[0];
  const wrong = h.api.reviewQuiz(record).filter(q => !q.correct);
  assert.equal(wrong.length, 1); assert.equal(wrong[0].yourAnswer, '5'); assert.equal(wrong[0].correctAnswer, '6');
  assert.equal(wrong[0].explanation, '二三得六');
});

test('live submission writes the completed paper once and repeated submission cannot award extra stars', () => {
  const h = setup(), p = h.papers.create('practice_d');
  p.answers = correctAnswers(p);
  Object.assign(h.context, {activePaperData: p, activePaperClock: {stop() {}}, document: {getElementById: () => null},
    playSound() {}, launchConfetti() {}, syncPaperDomInputs() {}, renderA4ExamPaper() {}, saveStats() {},
    getCircledNum: n => String(n), state: {stats: {exams: 0, stars: 0, bestScore: null}},
    saveCompletedPaperRecord: () => h.store.completePaper(h.context.activePaperData)});
  h.context.window.scrollTo = () => {};
  const html = source('index.html');
  vm.runInContext(html.slice(html.indexOf('    function matchPaperOperands('), html.indexOf('    function renderChineseA4ExamPaper(')), h.context);
  vm.runInContext(html.slice(html.indexOf('    function gradeA4ExamPaper('), html.indexOf('    function openPaperQuestionAnim(')), h.context);
  vm.runInContext('gradeA4ExamPaper(); gradeA4ExamPaper();', h.context);
  assert.equal(h.api.createStore(h.browser).list().length, 1);
  assert.equal(h.context.state.stats.exams, 1); assert.equal(h.context.state.stats.stars, 3);
});

test('independent stores merge current records; malformed storage and write failures do not crash practice or claim success', () => {
  const h = setup(), other = h.api.createStore(h.browser);
  for (const [store, mode] of [[h.store, 'workbook'], [other, 'final_b']]) {
    const p = h.papers.create(mode); p.graded = true; p.totalScore = 0; store.completePaper(p);
  }
  assert.equal(h.store.list().length, 2);
  const unavailable = h.api.createStore({getItem() {throw new Error('blocked');}, setItem() {throw new Error('blocked');}});
  assert.equal(unavailable.list().length, 0);
  const p = h.papers.create('practice_h'); p.answers.q15_0 = '6';
  assert.equal(unavailable.saveDraft(p), false); assert.ok(unavailable.error);
  const corrupt = h.api.createStore({getItem: () => '{broken', setItem() {throw new Error('must not overwrite');}});
  assert.equal(corrupt.list().length, 0); assert.ok(corrupt.error);
  assert.equal(corrupt.saveDraft(p), false);
  const full = h.api.createStore({getItem: key => h.storage.get(key) ?? null, setItem() {throw new Error('quota exceeded');}});
  assert.equal(full.saveDraft(p), false); assert.match(full.error, /未能保存/);
  assert.equal(h.store.list().length, 2, 'a quota failure preserves previously stored attempts');
});
