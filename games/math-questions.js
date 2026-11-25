// 跳跳乐只练基础计算。奖励关、错题重排与普通关共用相同的范围。
(() => {
  'use strict';
  const defaultDifficulty = 'grade2';
  const profiles = [
    {id: 'grade2', label: '二年级基础', maxNumber: 100, maxFactor: 9, description: '100以内两数加减、1～9乘法口诀、表内整除。'},
    {id: 'starter', label: '入门练习', maxNumber: 20, maxFactor: 5, description: '20以内两数加减、1～5口诀乘除。'}
  ];
  const modes = ['mixed', 'add_sub', 'multiplication', 'division'];
  const integer = (min, max, random) => min + Math.floor(random() * (max - min + 1));
  function shuffle(items, random) {
    const copy = items.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = integer(0, i, random);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function createOptions(answer, maxValue = 100, random = Math.random) {
    if (!Number.isInteger(answer) || !Number.isInteger(maxValue) || maxValue < 4 || answer < 0 || answer > maxValue) {
      throw new Error('答案必须位于当前练习范围内');
    }
    const near = [-10, 10, -5, 5, -2, 2, -1, 1].map(offset => answer + offset)
      .filter(value => value >= 0 && value <= maxValue);
    const all = Array.from({length: maxValue + 1}, (_, index) => index).filter(value => value !== answer);
    // 使用有限候选池，边界答案和固定随机值也能生成五个不同选项。
    const candidates = [...new Set([...shuffle(near, random), ...shuffle(all, random)])];
    return shuffle([answer, ...candidates.slice(0, 4)], random);
  }

  function createProblem({difficulty = defaultDifficulty, mode = 'mixed', isBossStage = false, random = Math.random} = {}) {
    const profile = profiles.find(item => item.id === difficulty) || profiles[0];
    const safeMode = modes.includes(mode) ? mode : 'mixed';
    const allowed = safeMode === 'multiplication' ? ['×'] : safeMode === 'division' ? ['÷'] : safeMode === 'add_sub' ? ['+', '−'] : ['+', '−', '×', '÷'];
    const operation = allowed[integer(0, allowed.length - 1, random)];
    let a, b, answer, hint, label, optionMax;
    if (operation === '+') {
      a = integer(1, profile.maxNumber - 1, random);
      b = integer(1, profile.maxNumber - a, random);
      answer = a + b;
      label = `${profile.maxNumber}以内加法`;
      hint = `把两个数相加：${a} + ${b} = ${answer}。`;
      optionMax = profile.maxNumber;
    } else if (operation === '−') {
      a = integer(1, profile.maxNumber, random);
      b = integer(0, a, random);
      answer = a - b;
      label = `${profile.maxNumber}以内减法`;
      hint = `从${a}里面减去${b}：${a} − ${b} = ${answer}。`;
      optionMax = profile.maxNumber;
    } else if (operation === '×') {
      a = integer(1, profile.maxFactor, random);
      b = integer(1, profile.maxFactor, random);
      answer = a * b;
      label = profile.maxFactor === 9 ? '乘法口诀' : '1～5乘法口诀';
      hint = `想乘法口诀：${Math.min(a, b)} × ${Math.max(a, b)} = ${answer}。`;
      optionMax = profile.maxFactor * profile.maxFactor;
    } else {
      b = integer(2, profile.maxFactor, random);
      answer = integer(1, profile.maxFactor, random);
      a = b * answer;
      label = '简单整除';
      hint = `想乘法算除法：${b} × ${answer} = ${a}，所以${a} ÷ ${b} = ${answer}。`;
      optionMax = profile.maxFactor;
    }
    const options = createOptions(answer, optionMax, random);
    return {
      difficulty: profile.id, mode: safeMode, operation, optionMax,
      questionText: `${a} ${operation} ${b} = ?`, answer, options, correctIndex: options.indexOf(answer),
      modeLabel: (isBossStage ? '👑 宝箱关 · ' : '') + label,
      hint, isBossStage
    };
  }

  window.HopMath = {defaultDifficulty, profiles, modes, createProblem, createOptions};
})();
