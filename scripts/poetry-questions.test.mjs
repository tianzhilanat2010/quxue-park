import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { existsSync, readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const html = readFileSync(new URL('index.html', root), 'utf8');
const allowedIds = ['deng_guan_que_lou', 'wang_lu_shan_pu_bu', 'ye_su_shan_si', 'jiang_xue', 'chi_le_ge', 'mei_hua', 'xiao_er_chui_diao', 'cun_ju', 'yong_liu', 'jue_ju', 'xiao_chu_jing_ci_si', 'fu_de_gu_yuan_cao', 'min_nong_qi_yi', 'zhou_ye_shu_suo_jian'];

function setup() {
  const context = vm.createContext({ Math, window: {} });
  const modulePath = new URL('assets/poetry-questions.js', root);
  if (existsSync(modulePath)) vm.runInContext(readFileSync(modulePath, 'utf8'), context);
  vm.runInContext(html.slice(html.indexOf('    const POEM_LIBRARY ='), html.indexOf('    const PHONICS_ALPHABET =')), context);
  vm.runInContext(html.match(/    function generateQuizSet\([\s\S]*?\n    }\n/)[0], context);
  return code => vm.runInContext(code, context);
}

test('each of the 14 allowed poems has three distinct basic question types', () => {
  const run = setup();
  const questions = run('POEM_LIBRARY.flatMap((poem, index) => [0, 1, 2].map(kind => genCnPoemQuestion(index, kind)))');
  assert.equal(new Set(questions.map(q => q.poemQuestionKey)).size, 42);
  allowedIds.forEach(id => {
    const group = questions.filter(q => q.animData.poemId === id);
    assert.equal(group.length, 3, id);
    assert.deepEqual([...new Set(group.map(q => q.poemQuestionKind))].sort(), ['meaning', 'next_line', 'word']);
    group.forEach(q => {
      assert.equal(q.choices.length, 4);
      assert.equal(new Set(q.choices).size, 4);
      assert.ok(q.choices.includes(q.answer));
      assert.ok(q.poemGrade === '二年级上册' || q.poemGrade === '二年级下册');
      assert.ok(!/柴门闻犬吠|风雪夜归人/.test(JSON.stringify(q)));
    });
  });
});

test('every line-completion option is an exact verse from the same Grade 2 semester', () => {
  const run = setup();
  const poems = run('POEM_LIBRARY');
  poems.forEach((poem, index) => {
    const q = run(`genCnPoemQuestion(${index}, 0)`);
    assert.equal(q.poemQuestionKind, 'next_line');
    const verses = new Set(poems.filter(p => p.grade === poem.grade).flatMap(p => p.lines.flatMap(line => line.split(/[，。！？]/).filter(Boolean))));
    q.choices.forEach(choice => assert.ok(verses.has(choice), `${poem.title}: ${choice}`));
  });
});

test('poem-only papers cover every poem before repeating and all 42 questions before repeating', () => {
  const run = setup();
  const questions = run("generateQuizSet('cn_poem', 42)");
  assert.equal(new Set(questions.map(q => q.poemQuestionKey)).size, 42);
  assert.equal(new Set(questions.slice(0, 14).map(q => q.animData.poemId)).size, 14);
  assert.ok(questions.every(q => allowedIds.includes(q.animData.poemId)));
  for (const grade of ['upper', 'lower']) {
    const list = run(`generatePoemQuizSet(21, '${grade}')`);
    const label = grade === 'upper' ? '二年级上册' : '二年级下册';
    assert.equal(new Set(list.map(q => q.poemQuestionKey)).size, 21);
    assert.ok(list.every(q => q.poemGrade === label));
  }
});

test('Chinese comprehensive papers share the same allowed poem bank', () => {
  const run = setup();
  const questions = run("generateQuizSet('chinese_core', 12)").filter(q => q.category === 'cn_poem');
  assert.equal(questions.length, 2);
  assert.equal(new Set(questions.map(q => q.animData.poemId)).size, 2);
  questions.forEach(q => {
    assert.ok(allowedIds.includes(q.animData.poemId));
    assert.ok(q.poemQuestionKey);
  });
});

test('old out-of-scope poem questions are excluded and known poems are refreshed before retry', () => {
  const run = setup();
  assert.equal(run('typeof normalizePoemPracticeQuestions'), 'function');
  const questions = run(`normalizePoemPracticeQuestions([
    { id: 'cnp_old_outside', category: 'cn_poem', prompt: '柴门闻犬吠', animData: {poemId: 'feng_xue_ye_gui_ren'} },
    { id: 'cnp_old_inside', category: 'cn_poem', prompt: '江雪旧题', choices: ['风雪夜归人'], animData: {poemId: 'jiang_xue'} },
    { id: 'math_retained', category: 'num100', prompt: '2 + 3', answer: 5 }
  ])`);
  assert.equal(questions.length, 2);
  assert.equal(questions[0].animData.poemId, 'jiang_xue');
  assert.ok(questions[0].poemQuestionKey);
  assert.ok(!JSON.stringify(questions).includes('风雪夜归人'));
  assert.equal(questions[1].id, 'math_retained');
  const current = run('genCnPoemQuestion(13, 2)');
  const refreshed = run(`normalizePoemPracticeQuestions([${JSON.stringify(current)}])[0]`);
  assert.equal(refreshed.poemQuestionKey, current.poemQuestionKey);
  assert.equal(refreshed.answer, current.answer);
});

test('the grassland poem uses textbook wording and matching pronunciation', () => {
  const run = setup();
  const poem = run("POEM_LIBRARY.find(poem => poem.id === 'chi_le_ge')");
  assert.ok(poem.lines[0].includes('笼盖四野'));
  assert.ok(poem.pinyinLines[0].includes('lǒng gài sì yě'));
  assert.ok(poem.pinyinLines[1].includes('xiàn niú yáng'));
});
