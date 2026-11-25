import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {existsSync, readFileSync} from 'node:fs';

const root = new URL('../', import.meta.url);
const html = readFileSync(new URL('index.html', root), 'utf8');
function setup() {
  const context = vm.createContext({window: {}, Math});
  vm.runInContext(readFileSync(new URL('assets/grade2-math.js', root), 'utf8'), context);
  const path = new URL('assets/math-papers.js', root);
  if (existsSync(path)) vm.runInContext(readFileSync(path, 'utf8'), context);
  const api = context.window.MathPapers;
  assert.ok(api, 'the shared math paper bank is loaded');
  return {api, context};
}
const evaluate = expression => {
  const clean = expression.replace(/=\s*$/, '').replace(/×/g, '*').replace(/÷/g, '/');
  assert.match(clean, /^[\d\s()+*/-]+$/);
  return vm.runInNewContext(clean);
};
function answerAll(paper) {
  const a = {};
  for (const key of ['q11', 'q12', 'q13', 'q14']) a[key] = paper[key + 'Cfg'].correctIdx;
  paper.q15Items.forEach((item, index) => a['q15_' + index] = item.ans);
  paper.q16Cfg.items.forEach((item, index) => a['q16_' + index] = item.ans);
  Object.assign(a, {
    q17_1_ans: paper.q17Cfg.sub1Ans, q17_1_a: paper.q17Cfg.sub1A ?? paper.q17Cfg.total, q17_1_b: paper.q17Cfg.sub1B ?? paper.q17Cfg.sides, q17_1_c: paper.q17Cfg.sub1Ans,
    q17_2_ans: paper.q17Cfg.sub2Ans, q17_2_a: paper.q17Cfg.sub2A ?? paper.q17Cfg.total, q17_2_b: paper.q17Cfg.sub2B ?? paper.q17Cfg.sub2Groups, q17_2_c: paper.q17Cfg.sub2Ans,
    q18_1_a: paper.q18Cfg.sub1Price, q18_1_b: paper.q18Cfg.sub1Count, q18_1_c: paper.q18Cfg.sub1Total,
    q18_2_flower: paper.q18Cfg.sub2FlowerIdx, q18_2_a: paper.q18Cfg.sub2Budget, q18_2_b: paper.q18Cfg.sub2Price, q18_2_c: paper.q18Cfg.sub2Count,
    q19_gaps: paper.q19Cfg.gaps, q19_trees: paper.q19Cfg.trees
  });
  return a;
}

test('The sixteen A–P papers are distinct and keep the existing paper structure', () => {
  const {api} = setup();
  assert.equal(api.presets.length, 16);
  assert.equal(new Set(api.presets.map(item => item.id)).size, 16);
  const papers = api.presets.map(item => api.create(item.id));
  assert.equal(new Set(papers.map(p => JSON.stringify([p.q11Cfg, p.q15Items, p.q16Cfg, p.q18Cfg, p.q19Cfg]))).size, 16);
  papers.forEach(paper => {
    assert.equal(paper.q15Items.length, 24);
    assert.equal(paper.q16Cfg.items.length, 4);
    assert.equal(paper.timeLimitSeconds, 0);
    assert.equal(paper.graded, false);
    assert.deepEqual(Object.keys(paper.answers), []);
  });
  assert.equal(api.create('workbook').q15Items[0].expr, '87 - 34 =');
  assert.equal(api.create('final_b').q11Cfg.title, '分组后还剩几个');
  for (const letter of ['C', 'D', 'E', 'F', 'G', 'H']) assert.ok(papers.some(p => p.title.includes(`（${letter}卷）`)));
});

test('all displayed calculations have independently verified, nonnegative integer answers in the existing range', () => {
  const {api} = setup();
  for (const preset of api.presets) {
    const paper = api.create(preset.id);
    for (const item of [...paper.q15Items, ...paper.q16Cfg.items]) {
      assert.equal(item.ans, evaluate(item.expr), preset.id + ': ' + item.expr);
      assert.ok(Number.isInteger(item.ans) && item.ans >= 0 && item.ans <= 1000);
    }
    assert.ok(paper.q15Items.every(item => item.ans <= 100));
  }
});

test('paper choice keys agree with the quizzes, and every question has distinct options', () => {
  const {api,context} = setup();
  const bank = context.window.Grade2Math.practice('mixed', 10000);
  assert.ok(bank.length >= 400);
  for (const q of bank) {
    assert.ok(q.choices.includes(q.answer));
    assert.equal(new Set(q.choices).size, q.choices.length);
  }
  for (const preset of api.presets) {
    const p = api.create(preset.id);
    for (const key of ['q11','q12','q13','q14']) {
      const cfg = p[key+'Cfg'];
      const original = bank.find(q => q.prompt+'（' === cfg.promptPrefix);
      assert.equal(cfg.choices[cfg.correctIdx-1], original.answer);
    }
  }
});

test('random changes the whole paper, avoids the current preset and returns fresh answer state', () => {
  const {api} = setup();
  for (const preset of api.presets) {
    const next = api.create('random', {excludeMode: preset.id});
    assert.notEqual(next.mode, preset.id);
    assert.ok(api.presets.some(item => item.id === next.mode));
  }
  const first = api.create('practice_c');
  first.answers.q11 = 2; first.q15Items[0].ans = -1;
  const again = api.create('practice_c', {timeLimitSeconds: 1200});
  assert.deepEqual(Object.keys(again.answers), []);
  assert.equal(again.q15Items[0].ans, 52);
  assert.equal(again.timeLimitSeconds, 1200);
});

test('every paper explanation uses the actual selected paper numbers and prices', () => {
  const {api} = setup();
  for (const preset of api.presets) {
    const p = api.create(preset.id);
    for (let number = 11; number <= 19; number++) {
      const q = api.explanation(p, 'q' + number);
      assert.ok(q.animData.steps.length >= 2, preset.id + ': q' + number);
      assert.ok(q.animData.steps.every(step => step.title && step.desc && step.formulaHighlight));
      assert.ok(!JSON.stringify(q).includes('undefined'));
    }
    assert.equal(api.explanation(p,'q19').answer, p.q19Cfg.trees);
    assert.equal(api.explanation(p,'q11').answer, p.q11Cfg.choices[p.q11Cfg.correctIdx-1]);
  }
});

test('the live paper builder routes all sixteen presets and keeps the chosen time mode', () => {
  const {api, context} = setup();
  Object.assign(context, {mathPracticeTimeLimit: 1200, activePaperData: {mode: 'practice_h'}, pickOne: list => list[0]});
  vm.runInContext(html.slice(html.indexOf('    function buildRealPaperData('), html.indexOf('    function startMathExam(')), context);
  for (const preset of api.presets) {
    const actual = vm.runInContext(`buildRealPaperData('${preset.id}')`, context);
    assert.equal(actual.title, preset.title);
    assert.equal(actual.timeLimitSeconds, 1200);
    assert.equal(JSON.stringify(actual.q15Items), JSON.stringify(api.create(preset.id).q15Items));
    assert.equal(actual.q18Cfg.sub2Budget, api.create(preset.id).q18Cfg.sub2Budget);
  }
  const random = vm.runInContext("buildRealPaperData('random')", context);
  assert.ok(api.presets.some(preset => preset.id === random.mode));
  assert.notEqual(random.mode, 'practice_h');
});

test('the existing live grader gives 100 for correct papers, 0 for blanks and loses the right points for errors', () => {
  const {api, context} = setup();
  Object.assign(context, {
    document: {getElementById: () => null},
    playSound() {}, launchConfetti() {}, syncPaperDomInputs() {}, renderA4ExamPaper() {}, saveStats() {}, saveCompletedPaperRecord() {},
    getCircledNum: number => ['①', '②', '③'][number - 1],
    state: {stats: {exams: 0, stars: 0, bestScore: null}}, activePaperClock: {stop() {}},
  });
  context.window.scrollTo = () => {};
  vm.runInContext(html.slice(html.indexOf('    function matchPaperOperands('), html.indexOf('    function renderChineseA4ExamPaper(')), context);
  vm.runInContext(html.slice(html.indexOf('    function gradeA4ExamPaper('), html.indexOf('    function openPaperQuestionAnim(')), context);
  for (const preset of api.presets) {
    const p = api.create(preset.id); p.answers = answerAll(p); context.activePaperData = p;
    vm.runInContext('gradeA4ExamPaper()', context);
    assert.equal(p.totalScore, 100, preset.id);
    assert.deepEqual([p.sec3Score, p.sec4Score, p.sec5Score, p.sec6Score], [8, 32, 50, 10]);
    const blank = api.create(preset.id); context.activePaperData = blank;
    vm.runInContext('gradeA4ExamPaper()', context); assert.equal(blank.totalScore, 0);
    const wrong = api.create(preset.id); wrong.answers = answerAll(wrong);
    wrong.answers.q11 = wrong.q11Cfg.correctIdx % 3 + 1; wrong.answers.q15_0++;
    context.activePaperData = wrong;
    vm.runInContext('gradeA4ExamPaper()', context); assert.equal(wrong.totalScore, 97);
  }
});

test('all sixteen papers keep their multiplication and division within the indicated table', () => {
  const {api} = setup();
  for (const [index, preset] of api.presets.entries()) {
    const d = api.create(preset.id);
    const max = index < 8 ? 6 : 9;
    let usesHigherFact = false;
    function check(a, op, b) {
      if (op !== '×' && op !== '÷') return;
      const factors = op === '×' ? [a,b] : [b,Math.floor(a/b)];
      for (const n of factors) {
        assert.ok(n >= 1 && n <= max, `${preset.letter}: ${a} ${op} ${b}`);
        if (n > 6) usesHigherFact = true;
      }
    }
    function checkExpression(expr) {
      // Resolve the parenthesised operand before inspecting the table fact.
      const flat = expr.replace(/\(([^()]+)\)/g, (_,inner) => String(evaluate(inner)));
      for (const m of flat.matchAll(/(\d+)\s*([×÷])\s*(\d+)/g)) check(+m[1],m[2],+m[3]);
    }
    for (const q of [...d.q15Items,...d.q16Cfg.items]) checkExpression(q.expr);
    for (const key of ['q11','q12','q13','q14']) {
      const c = d[key+'Cfg'];
      checkExpression(c.promptPrefix);
      checkExpression(c.explainDetail);
    }
    const a = d.q17Cfg, b = d.q18Cfg;
    check(a.sub1A ?? a.total,a.sub1Op || '÷',a.sub1B ?? a.sides);
    check(a.sub2A ?? a.total,a.sub2Op || '÷',a.sub2B ?? a.sub2Groups);
    check(b.sub1Price,b.sub1Op || '×',b.sub1Count);
    check(b.sub2Budget,b.sub2Op || '÷',b.sub2Price);
    checkExpression(d.q19Cfg.step1Expr);
    checkExpression(d.q19Cfg.correctMarkText);
    assert.equal(usesHigherFact,index >= 8);
    assert.equal(new Set(d.q15Items.map(q => q.expr)).size,24);
  }
});
