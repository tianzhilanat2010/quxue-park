import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {existsSync, readFileSync} from 'node:fs';

const root = new URL('../', import.meta.url);
const html = readFileSync(new URL('games/cyberhop.html', root), 'utf8');
function setup() {
  const context = vm.createContext({window: {}, Math});
  const path = new URL('games/math-questions.js', root);
  if (existsSync(path)) vm.runInContext(readFileSync(path, 'utf8'), context);
  assert.ok(context.window.HopMath, 'the bounded game question bank is loaded');
  return {api: context.window.HopMath, context};
}
function seeded(seed = 23) {
  return () => {seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296;};
}
function check(q, maxNumber = 100, factor = 9) {
  const parsed = q.questionText.match(/^(\d+) ([+−×÷]) (\d+) = \?$/);
  assert.ok(parsed, q.questionText + ' is one simple operation');
  const [, left, operation, right] = parsed, a = Number(left), b = Number(right);
  let expected;
  if (operation === '+') {expected = a + b; assert.ok(a <= maxNumber && b <= maxNumber && expected <= maxNumber);}
  if (operation === '−') {expected = a - b; assert.ok(a <= maxNumber && b <= maxNumber && expected >= 0);}
  if (operation === '×') {expected = a * b; assert.ok(a >= 1 && a <= factor && b >= 1 && b <= factor);}
  if (operation === '÷') {expected = a / b; assert.ok(b >= 2 && b <= factor && a % b === 0 && expected >= 1 && expected <= factor);}
  assert.equal(q.answer, expected);
  assert.equal(q.operation, operation);
  assert.equal(q.options.length, 5);
  assert.equal(new Set(q.options).size, 5);
  assert.equal(q.options[q.correctIndex], q.answer);
  assert.ok(q.options.every(value => Number.isInteger(value) && value >= 0 && value <= q.optionMax));
  assert.ok(q.hint && !q.hint.includes('undefined'));
}

test('default games only contain 100-bound addition/subtraction and multiplication-table exact division', () => {
  const {api} = setup(), random = seeded(), types = new Set();
  assert.equal(api.defaultDifficulty, 'grade2');
  for (let index = 0; index < 2000; index++) {
    const q = api.createProblem({random, isBossStage: index % 5 === 4});
    check(q); types.add(q.operation); assert.equal(q.difficulty, 'grade2');
  }
  assert.deepEqual([...types].sort(), ['+', '×', '÷', '−'].sort());
});

test('starter games keep addition within 20 and both factors and division quotients within 5', () => {
  const {api} = setup(), random = seeded(44);
  for (let index = 0; index < 1000; index++) check(api.createProblem({difficulty: 'starter', random}), 20, 5);
});

test('special practice modes stay within their chosen operation, including treasure stages', () => {
  const {api} = setup(), random = seeded(91);
  for (const difficulty of ['starter', 'grade2']) {
    for (const [mode, allowed] of [['add_sub', ['+', '−']], ['multiplication', ['×']], ['division', ['÷']]]) {
      for (let i = 0; i < 120; i++) {
        const q = api.createProblem({difficulty, mode, isBossStage: true, random});
        check(q, difficulty === 'starter' ? 20 : 100, difficulty === 'starter' ? 5 : 9);
        assert.ok(allowed.includes(q.operation));
      }
    }
  }
});

test('treasure rewards never change the question difficulty or introduce harder mathematics', () => {
  const {api} = setup();
  for (const difficulty of ['starter', 'grade2']) {
    const normal = api.createProblem({difficulty, random: seeded(7)});
    const boss = api.createProblem({difficulty, isBossStage: true, random: seeded(7)});
    assert.equal(boss.questionText, normal.questionText);
    assert.equal(boss.answer, normal.answer);
    assert.equal(boss.difficulty, normal.difficulty);
    assert.equal(boss.isBossStage, true);
  }
});

test('answer options and retries stay in range even at zero, the upper edge and fixed random values', () => {
  const {api} = setup();
  for (const max of [5, 9, 20, 25, 81, 100]) {
    for (let answer = 0; answer <= max; answer++) {
      for (const value of [0, 0.5, 0.999999]) {
        const options = api.createOptions(answer, max, () => value);
        assert.equal(options.length, 5);
        assert.equal(new Set(options).size, 5);
        assert.ok(options.includes(answer));
        assert.ok(options.every(option => option >= 0 && option <= max));
      }
    }
  }
});

test('unknown or old complex settings fall back to the safe default', () => {
  const {api} = setup();
  for (const mode of ['grade2_all', 'rem_div', 'mixed_brackets', 'clock_length', 'word_life', 'logic_brain']) {
    for (let i = 0; i < 30; i++) check(api.createProblem({difficulty: 'unknown', mode, random: seeded(i)}));
  }
});

test('the actual game generator and option reshuffle use the selected scope', () => {
  const {context} = setup();
  vm.runInContext("var currentDifficulty='grade2', currentQuestion=null;", context);
  const code = html.slice(html.indexOf('    function buildSmartOptions('), html.indexOf('    /**************************************************************\n     * 3.'));
  vm.runInContext(code, context);
  for (const difficulty of ['starter', 'grade2']) {
    for (const mode of ['mixed', 'add_sub', 'multiplication', 'division']) {
      vm.runInContext(`currentDifficulty='${difficulty}'`, context);
      for (let i = 0; i < 40; i++) {
        const q = vm.runInContext(`currentQuestion=generateGrade2Problem('${mode}',true)`, context);
        check(q, difficulty === 'starter' ? 20 : 100, difficulty === 'starter' ? 5 : 9);
        const options = vm.runInContext('buildSmartOptions(currentQuestion.answer)', context);
        assert.ok(options.every(option => option >= 0 && option <= q.optionMax));
      }
    }
  }
});

test('game reading pronounces the displayed arithmetic minus sign in Chinese', async () => {
  let spoken;
  const context = vm.createContext({AbortController, sfx: {enabled: true}, window: {speechSynthesis: {cancel(){}, speak: value => spoken = value.text}}, SpeechSynthesisUtterance: class {constructor(text){this.text = text;}}});
  vm.runInContext(readFileSync(new URL('../assets/speech-client.js', import.meta.url), 'utf8'), context);
  const start = html.indexOf('    const gameSpeech =');
  vm.runInContext(html.slice(start, html.indexOf('\n    /**************************************************************', start)), context);
  await vm.runInContext("speakGameText('18 − 7 = ?')", context);
  assert.equal(spoken.replace(/\s/g, ''), '18减7等于几');
});
