// 二年级上下册综合练习。保留试卷编号，方便打开已存答卷。
(() => {
  'use strict';

  const step = (title, desc, formulaHighlight) => ({title, desc, formulaHighlight});

  // 仅解析本文件中的四则运算；不执行表达式代码。保留运算树供分步讲解使用。
  function calculate(expression) {
    if (!/^[\d\s()+×÷-]+$/.test(expression)) throw new Error('不支持的计算式');
    const tokens = expression.match(/\d+|[()+×÷-]/g) || [];
    let position = 0;
    const combine = (left, op, right) => ({
      left, op, right, text: `${left.text} ${op} ${right.text}`,
      value: op === '+' ? left.value + right.value : op === '-' ? left.value - right.value : op === '×' ? left.value * right.value : left.value / right.value
    });
    function atom() {
      if (tokens[position] === '(') {
        position++;
        const node = sum();
        if (tokens[position++] !== ')') throw new Error('小括号不完整');
        return {...node, text: `(${node.text})`};
      }
      const token = tokens[position++];
      if (!/^\d+$/.test(token || '')) throw new Error('缺少计算数字');
      return {value: Number(token), text: token};
    }
    function product() {
      let node = atom();
      while (tokens[position] === '×' || tokens[position] === '÷') {
        const op = tokens[position++]; node = combine(node, op, atom());
      }
      return node;
    }
    function sum() {
      let node = product();
      while (tokens[position] === '+' || tokens[position] === '-') {
        const op = tokens[position++]; node = combine(node, op, product());
      }
      return node;
    }
    const node = sum();
    if (position !== tokens.length || !Number.isInteger(node.value) || node.value < 0) throw new Error('计算式必须得到非负整数');
    return node;
  }

  const calculationItem = expression => ({expr: expression + ' =', ans: calculate(expression).value});

  function collectionProblem(index) {
    // 两步中的每一步都对应题面直接给出的数量关系。
    const plans = [
      ['书架上有 18 本故事书、16 本绘本，借出 9 本后，还剩多少本？','先求书的总数','18 + 16','再减去借出的书','34 - 9','本'],
      ['每排有 6 张椅子，已经摆了 4 排，又搬来 3 张。一共有多少张？','先求四排椅子的总数','6 × 4','再加上搬来的椅子','24 + 3','张'],
      ['一条彩带长 50 厘米。上午剪去 12 厘米，下午剪去 8 厘米。还剩多少厘米？','先求两次剪去的长度','12 + 8','再求剩余长度','50 - 20','厘米'],
      ['有 30 个橘子，先留出 6 个，其余平均分给 4 组。每组分几个？','先求用来分的橘子数','30 - 6','再平均分给四组','24 ÷ 4','个'],
      ['小红收集了 15 张邮票，小文比她多 4 张。两人一共有多少张？','先求小文有多少张','15 + 4','再求两人的总数','15 + 19','张'],
      ['每盒彩笔 6 元，买了 3 盒，付给售货员 50 元。应找回多少元？','先求三盒彩笔的价钱','6 × 3','再算应找回的钱','50 - 18','元'],
      ['两篮鸡蛋分别有 16 个和 20 个。每 6 个装一盒，正好可以装几盒？','先求鸡蛋总数','16 + 20','再求盒数','36 ÷ 6','盒'],
      ['跳绳小组原有 27 人，5 人离开，又加入 8 人。现在有多少人？','先减去离开的人数','27 - 5','再加上新加入的人数','22 + 8','人'],
      ['借书卡每叠 8 张，有 7 叠，发出 20 张后还剩多少张？','先求卡片总数','8 × 7','再减去发出的张数','56 - 20','张'],
      ['把 48 支画笔平均分给 6 组，每组又领了 2 支。现在每组有多少支？','先求每组原有数量','48 ÷ 6','再加上新领的数量','8 + 2','支'],
      ['野餐有 5 盒饼干，每盒 9 块，另有 8 块散装饼干。一共有几块？','先算盒里的饼干','5 × 9','算上散装饼干','45 + 8','块'],
      ['园艺组备了 64 粒种子，留下 8 粒，其余平均种进 7 盆。每盆几粒？','先求用来播种的数量','64 - 8','再求每盆数量','56 ÷ 7','粒'],
      ['操场摆了 7 排椅子，每排 8 张。已有 49 人坐下，还空几张？','先算座位总数','7 × 8','再求空位','56 - 49','张'],
      ['两盒珠子分别有 28 颗和 35 颗，每 9 颗串一串，能串几串？','把两盒合起来','28 + 35','再算能串几串','63 ÷ 9','串'],
      ['果汁每瓶 7 元，买 9 瓶付 70 元，应找回多少元？','先求果汁总价','7 × 9','再算找回的钱','70 - 63','元'],
      ['把 72 支铅笔平均分给 8 组，一组用掉其中 3 支。这一组还剩几支？','先算每组分几支','72 ÷ 8','再算这组剩几支','9 - 3','支']
    ];
    const [prompt, firstLabel, firstExpr, lastLabel, lastExpr, unit] = plans[index];
    const first = calculationItem(firstExpr), last = calculationItem(lastExpr);
    const firstLine = `${first.expr} ${first.ans}`, lastLine = `${last.expr} ${last.ans}`;
    return {
      title: '两步生活题', prompt, step1Label: firstLabel, step1Expr: first.expr,
      step1Unit: ['本','张','厘米','个','张','元','个','人','张','支','块','粒','张','颗','元','支'][index], gaps: first.ans,
      step2Label: lastLabel, trees: last.ans, resultUnit: unit, resultNoun: '',
      animBtn: '查看分步解答', correctMarkText: lastLine, explainDetail: `${firstLine}，${lastLine}。`,
      animData: {type:'grade2_steps', steps:[step(firstLabel, firstLine, firstLine), step(lastLabel, lastLine, lastLine)]}
    };
  }

  // 同一份题目配置供卷面、批改和分步讲解使用。
  function packingQuestion(item, emoji, unit, groups, perGroup, used) {
    const total = groups * perGroup;
    const left = total - used;
    const first = `${groups} × ${perGroup} = ${total}`;
    const second = `${total} − ${used} = ${left}`;
    return {
      title: '先求总数，再求剩余', itemName: item, itemEmoji: emoji, total,
      headline: `有 ${groups} 盒${item}，每盒 ${perGroup} ${unit}。`,
      visualHtml: `<p class="paper-choices-row">${Array(groups).fill(`${emoji} 每盒${perGroup}${unit}`).join('　')}</p>`,
      sub1Text: '这些盒子里一共有', sub1A: groups, sub1B: perGroup, sub1Op: '×', sub1Ans: total, sub1Unit: unit, sub1Commutative: true,
      sub2Text: `从中取走 ${used} ${unit}，还剩`, sub2Suffix: unit, sub2A: total, sub2B: used, sub2Op: '-', sub2Ans: left, sub2Unit: unit,
      animBtn: '查看分步解答', explainDetail: `${first}，${second}`,
      animData: {type: 'grade2_steps', steps: [step('算出盒里的总数', '每盒数量相同，用乘法。', first), step('减去取走的数量', '从总数中减。', second)]}
    };
  }

  function sharingQuestion(item, emoji, unit, groups, share, used) {
    const total = groups * share;
    const first = `${total} ÷ ${groups} = ${share}`;
    const second = `${share} − ${used} = ${share-used}`;
    return {
      title: '平均分后还剩多少', total, itemName: item, itemEmoji: emoji,
      headline: `把 ${total} ${unit}${item}平均分给 ${groups} 个小组。`,
      sub1Text: '每组分到', sub1Unit: unit, sub1A: total, sub1Op: '÷', sub1B: groups, sub1Ans: share,
      sub2Text: `第一组用掉自己那份中的 ${used} ${unit}，第一组还剩`, sub2Suffix: unit, sub2Unit: unit,
      sub2A: share, sub2Op: '-', sub2B: used, sub2Ans: share-used,
      animBtn: '查看分步解答', explainDetail: `${first}，${second}`,
      animData: {type: 'grade2_steps', steps: [step('每组分得同样多', '总数除以组数。', first), step('只看第一组', '从这一组的数量中减去用掉的。', second)]}
    };
  }

  function marketQuestion(names, prices, count, portions) {
    const flowers = names.map((name, i) => ({idx: i+1, name, emoji: '🏷️', price: prices[i]}));
    const cheapest = flowers.reduce((a,b) => a.price < b.price ? a : b);
    const first = flowers[(cheapest.idx) % flowers.length];
    const budget = cheapest.price * portions;
    return {
      title: '购物与平均分', headline: '看价目表，算一算。', unit: '件', flowers, animBtn: '查看购物算式',
      sub1Prompt: `买 ${count} 件${first.name}要付多少元？`, sub1Flower: first.name, sub1Price: first.price,
      sub1Count: count, sub1Total: first.price * count, sub1Unit: '元',
      sub2Prompt: `选出单价最低的商品。用 ${budget} 元正好能买几件这样的商品？`,
      sub2Budget: budget, sub2FlowerIdx: cheapest.idx, sub2FlowerName: cheapest.name,
      sub2Price: cheapest.price, sub2Count: portions, sub2Unit: '件',
      explainDetail: `${first.price} × ${count} = ${first.price*count}（元）；${budget} ÷ ${cheapest.price} = ${portions}（件）`,
      animData: {type: 'grade2_steps', steps: [
        step('先求商品总价', `每件${first.price}元，买${count}件。`, `${first.price} × ${count} = ${first.price*count}`),
        step('再求能买几件', `${cheapest.name}最便宜，每件${cheapest.price}元。`, `${budget} ÷ ${cheapest.price} = ${portions}`)
      ]}
    };
  }

  const SEEDS = [
    {
      id: 'workbook', letter: 'A', label: 'A卷 · 口算与购物',
      title: '二年级数学《口算与购物》（A卷）',
      calculations: [
        '87 - 34', '17 + 42', '46 - 25', '3 × 3',
        '51 - 31', '50 + 36', '80 + 10', '2 × 4',
        '42 - 32', '70 + 20', '61 + 19', '3 × 2',
        '43 - 31', '64 - 43', '29 - 10', '1 × 6',
        '53 - 32', '45 - 15', '54 + 38', '2 × 5',
        '64 - 40', '87 - 77', '81 + 15', '5 × 3'
      ],
      mixed: ['3 × 4', '30 ÷ 5', '24 + 3 × 5', '(12 - 6) × 4'],
      q11Cfg: window.Grade2Math.paperChoice('muldiv', 11, 0),
      q12Cfg: window.Grade2Math.paperChoice('shape', 12, 0),
      q13Cfg: window.Grade2Math.paperChoice('shop_word', 2, 0),
      q14Cfg: window.Grade2Math.paperChoice('logic_grid', 14, 0),
      q17Cfg: {
        total: 20, sides: 4, shapeSymbol: '□', shapeName: '正方形',
        isMatchstick: true,
        headline: '用下面这些火柴棒 <b>|</b> 摆一摆，填一填。（共 20 根）',
        itemName: '火柴棒', itemUnit: '根', itemEmoji: 'Matches', groupUnit: '个',
        sub1Text: '如果摆成独立的 <span class="inline-block w-5 h-5 border-2 border-stone-800 align-middle mx-1"></span>，可以摆',
        sub1A: 20, sub1Op: '÷', sub1B: 4, sub1Ans: 5, sub1Unit: '个', sub1Commutative: false,
        sub2Text: '如果摆成 5 个同样的图形，那么每个图形用',
        sub2Groups: 5, sub2A: 20, sub2Op: '÷', sub2B: 5, sub2Ans: 4, sub2Unit: '根', sub2Commutative: false,
        animBtn: '🎬 火柴棒拼图动画',
        title: '火柴棒摆图形（包含除与平均分）',
        explainDetail: '(1) 1个正方形用4根：20÷4=5(个)；(2) 平均摆5个图形：20÷5=4(根)'
      },
      q18Cfg: {
        flowers: [
          {idx: 1, name: '玫瑰花', emoji: '🌹', price: 4},
          {idx: 2, name: '菊花', emoji: '🌼', price: 5},
          {idx: 3, name: '玉兰花', emoji: '🌷', price: 6},
          {idx: 4, name: '月季花', emoji: '🌺', price: 3}
        ],
        headline: '买花。（26 分）',
        buyer: '贝贝', itemCategory: '花', unit: '枝', animBtn: '🎬 花店买花动画',
        sub1Prompt: '买 5 枝月季花需要多少钱？（12 分）',
        sub1Flower: '月季花', sub1Price: 3, sub1Count: 5, sub1Op: '×', sub1Total: 15, sub1Unit: '元', sub1Commutative: true,
        sub2Prompt: '贝贝只买了一种花，正好用完 25 元，可能买了哪一种？买了几枝？（14 分）',
        sub2Step1Label: '第一步选择：',
        sub2Budget: 25, sub2FlowerIdx: 2, sub2FlowerName: '菊花', sub2Op: '÷', sub2Price: 5, sub2Count: 5, sub2Unit: '枝',
        title: '花店买花解决问题',
        explainDetail: '(1) 3×5=15(元)；(2) 正好用完25元的是菊花：25÷5=5(枝)'
      },
      q19Cfg: collectionProblem(0)
    },
    {
      id: 'final_b', letter: 'B', label: 'B卷 · 平均分与读数',
      title: '二年级数学《平均分与读数》（B卷）',
      calculations: [
        '76 - 24', '25 + 43', '68 - 35', '3 × 3',
        '62 - 42', '40 + 56', '30 + 60', '4 × 5',
        '58 - 28', '50 + 30', '47 + 23', '5 × 2',
        '85 - 51', '79 - 46', '24 ÷ 4', '12 ÷ 6',
        '36 + 47', '65 - 25', '12 ÷ 4', '24 ÷ 6',
        '30 + 40', '90 - 50', '5 × 3', '30 ÷ 5'
      ],
      mixed: ['6 × 5', '16 ÷ 4', '25 - 3 × 6', '(13 - 8) × 4'],
      q11Cfg: window.Grade2Math.paperChoice('rem_div', 1, 0),
      q12Cfg: window.Grade2Math.paperChoice('big_num', 15, 0),
      q13Cfg: window.Grade2Math.paperChoice('muldiv', 16, 1),
      q14Cfg: window.Grade2Math.paperChoice('clock_time', 0, 0),
      q17Cfg: packingQuestion('图书','📘','本',4,6,7),
      q18Cfg: marketQuestion(['车票','船票','门票'],[3,4,5],4,6),
      q19Cfg: collectionProblem(1)
    },
    {
      id: 'practice_c', letter: 'C', label: 'C卷 · 长度与时间',
      title: '二年级数学《长度与时间》（C卷）',
      calculations: [
        '78 - 26', '16 + 35', '64 - 22', '4 × 4',
        '52 - 31', '40 + 28', '70 + 20', '5 × 6',
        '49 - 19', '60 + 30', '36 + 24', '6 × 3',
        '86 - 54', '57 - 23', '10 ÷ 5', '6 ÷ 2',
        '27 + 46', '94 - 42', '20 ÷ 5', '10 ÷ 2',
        '20 + 50', '80 - 30', '6 × 4', '12 ÷ 6'
      ],
      mixed: ['5 × 3', '20 ÷ 4', '32 + 6 × 4', '24 ÷ (9 - 3)'],
      q11Cfg: window.Grade2Math.paperChoice('length_angle', 17, 0),
      q12Cfg: window.Grade2Math.paperChoice('shape', 18, 0),
      q13Cfg: window.Grade2Math.paperChoice('shop_word', 19, 0),
      q14Cfg: window.Grade2Math.paperChoice('clock_time', 20, 0),
      q17Cfg: {
        total: 28, sides: 9, shapeSymbol: '🍎', shapeName: '果筐',
        isMatchstick: false,
        headline: '果园丰收两步问题：果农伯伯上午摘了 <b>28 筐</b> 红苹果🍎，下午摘的黄香梨🍐比红苹果 <b>少 9 筐</b>。（24 分）',
        visualHtml: `
          <div class="flex flex-wrap items-center justify-center gap-4 my-3 py-2.5 px-4 bg-stone-50 rounded-xl border border-stone-200 text-xs sm:text-sm font-black text-stone-700">
            <span>🍎 红苹果：<b>28 筐</b></span>
            <span>🍐 黄香梨：比苹果<b>少 9 筐</b></span>
            <span>❓ 求：(1) 香梨几筐？ (2) 苹果和香梨共几筐？</span>
          </div>
        `,
        itemName: '水果', itemUnit: '筐', itemEmoji: '🍎', groupUnit: '筐',
        sub1Text: '果农伯伯下午摘了',
        sub1Suffix: '筐黄香梨',
        sub1A: 28, sub1Op: '-', sub1B: 9, sub1Ans: 19, sub1Unit: '筐', sub1Commutative: false,
        sub2Text: '上午摘的红苹果和下午摘的黄香梨一共摘了',
        sub2Suffix: '筐',
        sub2Groups: 19, sub2A: 28, sub2Op: '+', sub2B: 19, sub2Ans: 47, sub2Unit: '筐', sub2Commutative: true,
        animBtn: '🎬 比多少与求和动画',
        title: '比多少与求和两步应用题（先减后加）',
        explainDetail: '(1) 梨比苹果少9筐：28 - 9 = 19(筐)；(2) 苹果和梨一共：28 + 19 = 47(筐)',
        animData: {
          type: 'compare', a: 28, b: 19, ans: 47, aName: '红苹果(28筐)', aEmoji: '🍎', bName: '黄香梨(19筐)', bEmoji: '🍐',
          steps: [
            step('第一步：求比28少9的数用减法（算出香梨筐数）', '下午摘的香梨比苹果少 9 筐：28 - 9 = 19（筐）。', '28 - 9 = 19（筐）'),
            step('第二步：把苹果筐数和香梨筐数合起来', '苹果 28 筐加上香梨 19 筐：28 + 19 = 47（筐）！', '28 + 19 = 47（筐）')
          ]
        }
      },
      q18Cfg: {
        flowers: [
          {idx: 1, name: '护眼台灯', emoji: '💡', price: 28, desc: '每盏 28 元'},
          {idx: 2, name: '地球仪', emoji: '🌍', price: 26, desc: '每个 26 元'},
          {idx: 3, name: '科学画册', emoji: '📘', price: 18, desc: '每本 18 元'},
          {idx: 4, name: '文具礼盒', emoji: '✏️', price: 15, desc: '每盒 15 元'}
        ],
        headline: '六一商场“满 50 元立减 8 元”促销活动。（26 分）',
        buyer: '朵朵', itemCategory: '学习用品', unit: '件', animBtn: '🎬 满减购物精讲动画',
        sub1Prompt: '（1）朵朵买了一盏【护眼台灯💡（28元）】和一个【地球仪🌍（26元）】，优惠前原价一共多少元？（12 分）',
        sub1Flower: '台灯+地球仪', sub1Price: 28, sub1Count: 26, sub1Op: '+', sub1Total: 54, sub1Unit: '元', sub1Commutative: true,
        sub2Prompt: '（2）商场规定“满 50 元立减 8 元”，朵朵买这两件商品（原价 54 元）实际只需付多少元？（14 分）',
        sub2Step1Label: '第一步判断是否满减：',
        sub2ChoiceOptions: [
          {idx: 1, name: '已满50元，立减8元'},
          {idx: 2, name: '不满50元，原价付款'},
          {idx: 3, name: '立减26元'}
        ],
        sub2Budget: 54, sub2FlowerIdx: 1, sub2FlowerName: '已满50元，立减8元',
        sub2Op: '-', sub2Price: 8, sub2Count: 46, sub2Unit: '元',
        title: '商场满减促销购物问题（先加求总价、再减优惠额）',
        explainDetail: '(1) 原价总和：28 + 26 = 54(元)；(2) 54元已满50元，立减8元：54 - 8 = 46(元)',
        animData: {
          type: 'rmb', mode: 'change', toyName: '台灯+地球仪(满50减8)', toyEmoji: '💡', price: 8, paid: 54, ans: 46,
          steps: [
            step('第一步：先把两件商品的原价加起来', '台灯 28 元 + 地球仪 26 元 = 54（元）。', '28 + 26 = 54（元）'),
            step('第二步：54 元 > 50 元，触发“满50减8”优惠！', '用原价 54 元减去优惠的 8 元：54 - 8 = 46（元）！', '54 - 8 = 46（元）')
          ]
        }
      },
      q19Cfg: collectionProblem(2)
    },
    {
      id: 'practice_d', letter: 'D', label: 'D卷 · 乘法与分组',
      title: '二年级数学《乘法与分组》（D卷）',
      calculations: [
        '85 - 32', '28 + 34', '76 - 41', '5 × 5',
        '63 - 42', '20 + 58', '50 + 40', '6 × 2',
        '54 - 24', '70 + 10', '48 + 22', '2 × 4',
        '97 - 63', '68 - 35', '18 ÷ 6', '12 ÷ 3',
        '38 + 45', '86 - 26', '30 ÷ 6', '18 ÷ 3',
        '40 + 30', '90 - 60', '2 × 5', '6 ÷ 2'
      ],
      mixed: ['4 × 4', '18 ÷ 6', '6 × 5 - 9', '(8 - 5) × 4'],
      q11Cfg: window.Grade2Math.paperChoice('muldiv', 3, 1),
      q12Cfg: window.Grade2Math.paperChoice('big_num', 21, 0),
      q13Cfg: window.Grade2Math.paperChoice('word', 22, 0),
      q14Cfg: window.Grade2Math.paperChoice('rem_div', 2, 0),
      q17Cfg: {
        total: 24, sides: 4, sub2Groups: 6, shapeName: '正方形', itemName: '小棒', itemEmoji: '🥢', itemUnit: '根', groupUnit: '个',
        headline: '手工课上有 24 根同样长的小棒。',
        sub1Text: '每 4 根摆一个正方形，小棒不共用，可以摆', sub1Ans: 6,
        sub2Text: '把全部小棒平均分给 6 组，每组分到', sub2Ans: 4, sub2Suffix: '根',
        animBtn: '查看分组过程', title: '摆图形与平均分'
      },
      q18Cfg: marketQuestion(['钢笔','字帖','胶棒'],[6,5,3],5,4),
      q19Cfg: collectionProblem(3)
    },
    {
      id: 'practice_e', letter: 'E', label: 'E卷 · 图形与统计',
      title: '二年级数学《图形与统计》（E卷）',
      calculations: [
        '93 - 51', '19 + 46', '65 - 23', '6 × 6',
        '74 - 42', '30 + 46', '60 + 20', '2 × 3',
        '67 - 27', '80 + 10', '57 + 13', '3 × 5',
        '88 - 54', '76 - 43', '8 ÷ 2', '20 ÷ 4',
        '46 + 38', '95 - 35', '12 ÷ 2', '8 ÷ 4',
        '30 + 60', '80 - 50', '3 × 6', '12 ÷ 3'
      ],
      mixed: ['2 × 6', '15 ÷ 5', '14 + 4 × 5', '(21 - 9) ÷ 3'],
      q11Cfg: window.Grade2Math.paperChoice('mixed_ops', 2, 0),
      q12Cfg: window.Grade2Math.paperChoice('shape', 24, 0),
      q13Cfg: window.Grade2Math.paperChoice('word', 25, 0),
      q14Cfg: window.Grade2Math.paperChoice('logic_grid', 26, 0),
      q17Cfg: packingQuestion('彩旗','🚩','面',5,6,9),
      q18Cfg: {
        flowers: [
          {idx: 1, name: '花样跳绳', emoji: '🪢', price: 20, desc: '正正正正（4个正字）'},
          {idx: 2, name: '快乐篮球', emoji: '🏀', price: 15, desc: '正正正（3个正字）'},
          {idx: 3, name: '趣味踢毽', emoji: '🪶', price: 10, desc: '正正（2个正字）'},
          {idx: 4, name: '转呼啦圈', emoji: '⭕', price: 6, desc: '正一（1个正字加1笔）'}
        ],
        headline: '阳光体育“正”字统计表数据分析。（1个“正”字代表 5 票，共 26 分）',
        buyer: '统计员', itemCategory: '运动项目', unit: '人', animBtn: '🎬 正字统计表动画',
        sub1Prompt: '（1）喜欢【花样跳绳🪢】的得票是 4 个完整的“正”字（每个“正”字 5 笔），喜欢跳绳的有多少人？（12 分）',
        sub1Flower: '花样跳绳', sub1Price: 5, sub1Count: 4, sub1Op: '×', sub1Total: 20, sub1Unit: '人', sub1Commutative: true,
        sub2Prompt: '（2）全班最受欢迎的是哪项运动？喜欢【花样跳绳（20人）】的比喜欢【趣味踢毽（10人）】的多多少人？（14 分）',
        sub2Step1Label: '第一步选最受欢迎项目：',
        sub2Budget: 20, sub2FlowerIdx: 1, sub2FlowerName: '花样跳绳',
        sub2Op: '-', sub2Price: 10, sub2Count: 10, sub2Unit: '人',
        title: '“正”字统计表计算与比较问题',
        explainDetail: '(1) 4个“正”字：5 × 4 = 20(人)；(2) 最受欢迎的是花样跳绳，比踢毽多：20 - 10 = 10(人)',
        animData: {
          type: 'tally_chart', fullZheng: 4, extraStrokes: 0, ans: 20, who: '花样跳绳🪢',
          steps: [
            step('第一步：1个“正”字有5画，用5的乘法算人数', '跳绳有 4 个“正”字：5 × 4 = 20（人）；踢毽有 2 个“正”字：5 × 2 = 10（人）。', '跳绳：5 × 4 = 20（人）'),
            step('第二步：找出最高票数并用减法算相差人数', '跳绳票数最多（20人），比踢毽（10人）多：20 - 10 = 10（人）！', '20 - 10 = 10（人）')
          ]
        }
      },
      q19Cfg: collectionProblem(4)
    },
    {
      id: 'practice_f', letter: 'F', label: 'F卷 · 数位与借阅',
      title: '二年级数学《数位与借阅》（F卷）',
      calculations: [
        '64 - 21', '27 + 48', '86 - 34', '2 × 2',
        '82 - 52', '40 + 37', '30 + 50', '3 × 4',
        '78 - 28', '50 + 20', '38 + 32', '4 × 6',
        '96 - 61', '67 - 34', '15 ÷ 3', '30 ÷ 5',
        '56 + 27', '84 - 24', '6 ÷ 3', '15 ÷ 5',
        '50 + 23', '70 - 40', '4 × 2', '20 ÷ 4'
      ],
      mixed: ['6 × 6', '10 ÷ 5', '30 - 4 × 6', '18 ÷ (8 - 5)'],
      q11Cfg: window.Grade2Math.paperChoice('big_num', 26, 0),
      q12Cfg: window.Grade2Math.paperChoice('muldiv', 3, 1),
      q13Cfg: window.Grade2Math.paperChoice('shop_word', 4, 0),
      q14Cfg: window.Grade2Math.paperChoice('logic_grid', 29, 0),
      q17Cfg: packingQuestion('画笔','🖌️','支',4,5,8),
      q18Cfg: marketQuestion(['蛋糕','布丁','面包'],[5,3,4],4,5),
      q19Cfg: collectionProblem(5)
    },
    {
      id: 'practice_g', letter: 'G', label: 'G卷 · 运算与测量',
      title: '二年级数学《运算与测量》（G卷）',
      calculations: [
        '87 - 45', '36 + 29', '78 - 26', '3 × 3',
        '95 - 63', '20 + 57', '40 + 50', '4 × 5',
        '89 - 39', '60 + 20', '46 + 24', '5 × 2',
        '76 - 42', '97 - 54', '24 ÷ 4', '12 ÷ 6',
        '47 + 36', '93 - 43', '12 ÷ 4', '24 ÷ 6',
        '20 + 60', '90 - 20', '5 × 3', '30 ÷ 5'
      ],
      mixed: ['3 × 5', '24 ÷ 4', '16 + 6 × 6', '(17 - 5) ÷ 6'],
      q11Cfg: window.Grade2Math.paperChoice('length_angle', 29, 0),
      q12Cfg: window.Grade2Math.paperChoice('mixed_ops', 3, 0),
      q13Cfg: window.Grade2Math.paperChoice('word', 31, 1),
      q14Cfg: window.Grade2Math.paperChoice('rem_div', 32, 0),
      q17Cfg: packingQuestion('沙包','🟤','个',6,6,12),
      q18Cfg: marketQuestion(['水杯','雨衣','地图'],[5,6,4],3,6),
      q19Cfg: collectionProblem(6)
    },
    {
      id: 'practice_h', letter: 'H', label: 'H卷 · 生活应用',
      title: '二年级数学《生活应用》（H卷）',
      calculations: [
        '96 - 34', '48 + 27', '87 - 45', '4 × 4',
        '73 - 42', '30 + 56', '70 + 20', '5 × 6',
        '68 - 28', '40 + 30', '59 + 21', '6 × 3',
        '85 - 51', '79 - 46', '10 ÷ 5', '6 ÷ 2',
        '35 + 48', '92 - 32', '20 ÷ 5', '10 ÷ 2',
        '60 + 30', '80 - 20', '6 × 4', '12 ÷ 6'
      ],
      mixed: ['4 × 6', '30 ÷ 6', '5 × 5 + 18', '36 ÷ (9 - 3)'],
      q11Cfg: window.Grade2Math.paperChoice('clock_time', 32, 0),
      q12Cfg: window.Grade2Math.paperChoice('word', 33, 0),
      q13Cfg: window.Grade2Math.paperChoice('shop_word', 34, 0),
      q14Cfg: window.Grade2Math.paperChoice('length_angle', 35, 0),
      q17Cfg: {
        total: 80, sides: 28, shapeSymbol: '🍉', shapeName: '农场运瓜',
        isMatchstick: false,
        headline: '开心农场运西瓜问题：瓜田里一共摘了 <b>80 个</b> 大西瓜🍉，卡车上午运走了 <b>28 个</b>，下午运走了 <b>34 个</b>。（24 分）',
        visualHtml: `
          <div class="flex flex-wrap items-center justify-center gap-4 my-3 py-2.5 px-4 bg-stone-50 rounded-xl border border-stone-200 text-xs sm:text-sm font-black text-stone-700">
            <span>🍉 摘瓜总数：<b>80 个</b></span>
            <span>🚚 上午运走：<b>28 个</b></span>
            <span>🚛 下午运走：<b>34 个</b></span>
          </div>
        `,
        itemName: '大西瓜', itemUnit: '个', itemEmoji: '🍉', groupUnit: '个',
        sub1Text: '卡车上午和下午一共运走了',
        sub1Suffix: '个大西瓜',
        sub1A: 28, sub1Op: '+', sub1B: 34, sub1Ans: 62, sub1Unit: '个', sub1Commutative: true,
        sub2Text: '瓜田里现在还剩下',
        sub2Suffix: '个大西瓜没有运走',
        sub2Groups: 62, sub2A: 80, sub2Op: '-', sub2B: 62, sub2Ans: 18, sub2Unit: '个', sub2Commutative: false,
        animBtn: '🎬 先加后减运瓜动画',
        title: '农场运西瓜两步应用题（先加求共运走、再减求剩余）',
        explainDetail: '(1) 上午和下午共运走：28 + 34 = 62(个)；(2) 瓜田还剩：80 - 62 = 18(个)',
        animData: {
          type: 'mixed_ops', mode: 'brackets', display: '80 - (28 + 34)', exprLeft: '(28 + 34)', firstVal: 62, op2: '-', otherVal: 80, isRightBracket: true, ans: 18,
          ruleText: '先用加法算出上午和下午一共运走多少个，再用总数80减去运走的总数！',
          steps: [
            step('第一步：先把上午和下午运走的西瓜加起来', '28 + 34 = 62（个），一共运走了 62 个。', '28 + 34 = 62（个）'),
            step('第二步：用总数 80 个减去运走的 62 个', '80 - 62 = 18（个），还剩下 18 个大西瓜！', '80 - 62 = 18（个）')
          ]
        }
      },
      q18Cfg: marketQuestion(['挂件','贴纸','小旗'],[5,2,4],4,6),
      q19Cfg: collectionProblem(7)
    }
  ];

  // I–P 固定出卷。种类、顺序和数值稳定，重新打开同一套卷时可继续答题。
  const advancedThemes = [
    ['校园书市','书签','🔖','张',['字帖','画册','笔记本'],7,4,6],
    ['美术工坊','蜡笔','🖍️','支',['颜料','彩笔','贴纸'],8,5,9],
    ['春游准备','饼干','🍪','块',['面包','果汁','水杯'],9,3,5],
    ['花园义卖','种子','🌱','粒',['花盆','铲子','手套'],7,7,8],
    ['班级运动会','毽子','🏸','个',['跳绳','沙包','皮球'],8,6,7],
    ['手工小铺','珠子','📿','颗',['彩纸','胶棒','丝带'],9,5,4],
    ['水果集市','草莓','🍓','颗',['苹果袋','梨子袋','橙子袋'],8,8,9],
    ['文具采购','铅笔','✏️','支',['尺子','橡皮','铅笔盒'],9,7,8]
  ];
  function advancedPaper(theme, index) {
    const [name,item,emoji,unit,goods,a,b,used] = theme;
    const letter = String.fromCharCode(73 + index);
    const calculations = [];
    for (let row = 0; row < 6; row++) {
      const factor = 7 + (index + row) % 3;
      const other = 2 + (index + row) % 8;
      calculations.push(
        `${17+row+index} + ${26+2*row}`,
        `${81-index-row} - ${24+row}`,
        `${factor} × ${other}`,
        `${factor*(10-other)} ÷ ${factor}`
      );
    }
    const choice = window.Grade2Math.paperChoice;
    const prices = [[5,7,9],[8,6,9],[8,9,7]][index % 3];
    return {
      id: 'practice_'+letter.toLowerCase(), letter, label: `${letter}卷 · ${name}`,
      title: `二年级数学《${name}》（${letter}卷）`, calculations,
      mixed: [`${a} × ${b} + 5`, `${8*used} ÷ 8 + 6`, `(${a+5} - 5) × 4`, `${9*b} ÷ (${b+2} - 2)`],
      q11Cfg: choice(['clock_time','big_num','shape','length_angle'][index%4],index+3),
      q12Cfg: choice('rem_div',index+8),
      q13Cfg: choice('shop_word',index+5,index%2), q14Cfg: choice('logic_grid',index+2),
      q17Cfg: index % 2 === 0 ? packingQuestion(item, emoji, unit, a, b, used)
        : sharingQuestion(item, emoji, unit, b, a, 2 + index % 4),
      q18Cfg: marketQuestion(goods,prices,b,a), q19Cfg: collectionProblem(index+8)
    };
  }
  SEEDS.push(...advancedThemes.map(advancedPaper));

  const presets = SEEDS.map(seed => ({
    id: seed.id,
    letter: seed.letter,
    label: seed.label + (seed.letter <= 'H' ? ' · 1～6口诀' : ' · 九九口诀'),
    title: seed.title
  }));

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function create(mode = 'workbook', options = {}) {
    if (mode === 'random') {
      const pool = SEEDS.filter(seed => seed.id !== options.excludeMode);
      mode = pool[Math.floor(Math.random() * pool.length)].id;
    }
    const seed = SEEDS.find(item => item.id === mode) || SEEDS[0];

    return {
      mode: seed.id,
      letter: seed.letter,
      title: seed.title,
      graded: false,
      timeLimitSeconds: options.timeLimitSeconds === 1200 ? 1200 : 0,
      secondsElapsed: 0,
      q11Cfg: clone(seed.q11Cfg),
      q12Cfg: clone(seed.q12Cfg),
      q13Cfg: clone(seed.q13Cfg),
      q14Cfg: clone(seed.q14Cfg),
      q15Items: seed.calculations.map(calculationItem),
      q16Cfg: {items: seed.mixed.map(calculationItem)},
      q17Cfg: clone(seed.q17Cfg),
      q18Cfg: clone(seed.q18Cfg),
      q19Cfg: clone(seed.q19Cfg),
      answers: {}
    };
  }

  function explanation(paper, key) {
    let title, prompt, answer, animData;
    if (key === 'q11' || key === 'q12' || key === 'q13' || key === 'q14') {
      const c = paper[key + 'Cfg'];
      if (c.customMcq && c.animData) {
        title = c.title || '选择题精讲';
        const correctLabel = c.choices[c.correctIdx - 1];
        prompt = `${c.promptPrefix} ${correctLabel} ${c.promptSuffix}`;
        answer = correctLabel;
        animData = clone(c.animData);
      } else if (key === 'q11') {
        const times = c.total / c.perStep;
        title = c.title || `${c.item}包含除应用`;
        prompt = `${c.promptPrefix}${times}${c.promptSuffix}`;
        answer = times;
        animData = {
          type: 'bunny_div', total: c.total, perStep: c.perStep, ans: times, emoji: c.emoji, itemName: c.item, actor: c.actor, unit: c.unit,
          steps: [
            step('先找总数与每份数量', `总数是 ${c.total}${c.unit}，每份是 ${c.perStep}${c.unit}。`, `${c.total}${c.unit}，每份${c.perStep}${c.unit}`),
            step('用除法算包含几份', '求总数里面有几个每份数，用除法计算。', `${c.total} ÷ ${c.perStep} = ${times}（${c.unitLabel || '次'}）`)
          ]
        };
      } else if (key === 'q12') {
        title = c.title || '看图理解平均分';
        prompt = `${c.total} ÷ ${c.a} = ${c.b}，哪种分法不符合？`;
        answer = 3;
        animData = {
          type: 'div_meaning', ...c,
          steps: [
            step('两种摆法都要每份同样多', `可以分成${c.b}组，每组${c.a}个；也可以分成${c.a}组，每组${c.b}个。`, `${c.a} × ${c.b} = ${c.total}`),
            step('找出没有平均分的一项', `③的一组有${c.wrongA}个，另一组有${c.wrongB}个，每组数量不同。`, '不符合的是③')
          ]
        };
      } else if (key === 'q13') {
        const paidCount = c.budget / c.price, freeTotal = Math.floor(paidCount / c.buyN) * c.freeN;
        answer = paidCount + freeTotal;
        title = c.title || `${c.shopName}买赠问题`;
        prompt = `每${c.unit}${c.item}${c.price}元，买${c.buyN}${c.unit}送${c.freeN}${c.unit}，${c.budget}元得到几${c.unit}？`;
        animData = {
          type: 'promo_buy_get', price: c.price, buyN: c.buyN, freeN: c.freeN, money: c.budget, paidCount, freeTotal, ans: answer, item: c.item, emoji: c.emoji, unit: c.unit,
          steps: [
            step(`先算花钱买了几${c.unit}`, `用${c.budget}元买每${c.unit}${c.price}元的${c.item}。`, `${c.budget} ÷ ${c.price} = ${paidCount}（${c.unit}）`),
            step(`再算赠送了几${c.unit}`, `每买${c.buyN}${c.unit}送${c.freeN}${c.unit}，共送${freeTotal}${c.unit}。`, `赠送 ${freeTotal} ${c.unit}`),
            step('把购买和赠送的加起来', `送的${c.item}不用再付钱，但也要计入总数。`, `${paidCount} + ${freeTotal} = ${answer}（${c.unit}）`)
          ]
        };
      } else if (key === 'q14') {
        const target = c.items.find(item => item.idx === c.correctIdx);
        const packs = c.items.map(item => ({label: `${item.idx}号包装`, count: item.count, total: item.cost, unitPrice: item.unitPrice}));
        answer = c.correctIdx;
        title = c.title || `比较每${c.unit || '双'}${c.itemName || '袜子'}的单价`;
        prompt = `哪一种${c.itemName || '袜子'}平均每${c.unit || '双'}最便宜？`;
        animData = {
          type: 'unit_price', itemName: c.itemName || '袜子', emoji: c.emoji || '🧦', unit: c.unit || '双', packs, correctChoice: `${c.correctIdx}号`,
          steps: [
            step(`先分别算每${c.unit || '双'}几元`, '比较单价，要用总价除以数量。', packs.map(p => `${p.total}÷${p.count}=${p.unitPrice}`).join('；')),
            step('单价最小的最便宜', `第${c.correctIdx}种每${c.unit || '双'}只要${target.unitPrice}元。`, `第${c.correctIdx}种最便宜`)
          ]
        };
      }
    } else if (key === 'q15') {
      const item = paper.q15Items.find(it => /^\d+ \+ \d+ =$/.test(it.expr) && (Number(it.expr.split(' ')[0]) % 10 + Number(it.expr.split(' ')[2]) % 10 >= 10)) || paper.q15Items[0];
      const node = calculate(item.expr.replace(/\s*=$/, '')), a = node.left.value, b = node.right.value;
      const aTens = Math.floor(a / 10), aOnes = a % 10, bTens = Math.floor(b / 10), bOnes = b % 10;
      const onesResult = node.op === '+' ? aOnes + bOnes : aOnes - bOnes, carryVal = node.op === '+' && onesResult >= 10 ? 1 : 0;
      const tensResult = node.op === '+' ? aTens + bTens + carryVal : aTens - bTens;
      title = `本卷竖式示例：${a}${node.op}${b}`; prompt = `${item.expr} □`; answer = item.ans;
      animData = {
        type: 'vertical_calc', a, b, op: node.op, ans: answer, aTens, aOnes, bTens, bOnes, onesResult, carryVal, tensResult,
        steps: [
          step('相同数位对齐', '个位和个位对齐，十位和十位对齐。', `${a} ${node.op} ${b}`),
          step('先算个位', `个位算得${onesResult}${carryVal ? '，满十向十位进1' : ''}。`, `${aOnes} ${node.op} ${bOnes} = ${onesResult}`),
          step('再算十位', `十位算得${tensResult}，最后写出完整得数。`, `${a} ${node.op} ${b} = ${answer}`)
        ]
      };
    } else if (key === 'q16') {
      const item = paper.q16Cfg.items.find(it => it.expr.includes('(')), node = calculate(item.expr.replace(/\s*=$/, ''));
      const isRightBracket = Boolean(node.right.op), first = isRightBracket ? node.right : node.left, other = isRightBracket ? node.left : node.right;
      title = '本卷运算顺序示例'; prompt = item.expr; answer = item.ans;
      animData = {
        type: 'mixed_ops', mode: 'brackets', display: node.text, exprLeft: first.text, firstVal: first.value, op2: node.op, otherVal: other.value, isRightBracket, ans: answer, ruleText: '有小括号，先算小括号里面的。',
        steps: [
          step('找出小括号', '先计算括号里面的部分。', first.text),
          step('算出括号内的结果', '把这部分换成它的得数。', `${first.text} = ${first.value}`),
          step('再完成外面的运算', '按照原来的先后位置算出结果。', `${node.text} = ${answer}`)
        ]
      };
    } else if (key === 'q17') {
      const c = paper.q17Cfg;
      title = c.title || `${c.itemName}应用题`;
      prompt = c.headline.replace(/<[^>]+>/g, '');
      answer = c.sub2Ans;
      if (c.animData) {
        animData = clone(c.animData);
      } else {
        animData = {
          type: 'matchsticks', total: c.total, sides: 4, numShapes: c.sub1Ans, shapeName: `${c.shapeName}`, ans: c.sub1Ans, unit: c.groupUnit || '个',
          steps: [
            step(`每1${c.groupUnit || '个'}${c.shapeName}用4${c.itemUnit}`, `先看每份需要4${c.itemUnit}${c.itemName}。`, `每份 4 ${c.itemUnit}`),
            step(`求可以分成几${c.groupUnit || '个'}`, `总共有${c.total}${c.itemUnit}，每4${c.itemUnit}一份。`, `${c.total} ÷ 4 = ${c.sub1Ans}（${c.groupUnit || '个'}）`),
            step(`再求平均分给${c.sub2Groups}组每组几${c.itemUnit}`, `把${c.total}${c.itemUnit}平均分成${c.sub2Groups}份。`, `${c.total} ÷ ${c.sub2Groups} = ${c.sub2Ans}（${c.itemUnit}）`)
          ]
        };
      }
    } else if (key === 'q18') {
      const c = paper.q18Cfg;
      title = c.title || `${c.headline.replace(/（.*?）/g, '')}`;
      prompt = `${c.sub1Prompt || ''} ${c.sub2Prompt || ''}`.trim();
      answer = c.sub1Total;
      if (c.animData) {
        animData = clone(c.animData);
      } else {
        const purchaseCases = [
          {targetFlower: c.sub1Flower, unitPrice: c.sub1Price, qty: c.sub1Count, totalMoney: c.sub1Total},
          {targetFlower: c.sub2FlowerName, unitPrice: c.sub2Price, qty: c.sub2Count, totalMoney: c.sub2Budget}
        ];
        animData = {
          type: 'flower_shop', mode: 'buy_rose', ...purchaseCases[0], flowers: c.flowers, purchaseCases,
          steps: [
            step('先看价格表', c.flowers.map(f => `${f.name}每${c.unit || '件'}${f.price}元`).join('；'), `${c.sub1Flower}每${c.unit || '件'}${c.sub1Price}元`),
            step('求总价用乘法', `买${c.sub1Count}${c.unit || '件'}${c.sub1Flower}。`, `${c.sub1Price} × ${c.sub1Count} = ${c.sub1Total}（元）`),
            step('再找能正好用完钱的商品', `${c.sub2Budget}元能被${c.sub2Price}元整除，对应${c.sub2FlowerName}。`, `选择${c.sub2FlowerName}`),
            step('总钱数除以单价求数量', '检验单价乘数量，应该刚好等于总钱数。', `${c.sub2Budget} ÷ ${c.sub2Price} = ${c.sub2Count}（${c.unit || '件'}）`)
          ]
        };
      }
    } else if (key === 'q19') {
      const c = paper.q19Cfg;
      title = c.title || '思维附加题';
      prompt = c.prompt;
      answer = c.trees;
      animData = c.animData ? clone(c.animData) : {
        type: 'tree_planting', totalLen: c.lengthM, interval: c.stepM, gaps: c.gaps, ans: answer,
        steps: [
          step('先算有几个间隔', `每${c.stepM}米是一个间隔。`, `${c.lengthM} ÷ ${c.stepM} = ${c.gaps}（${c.step1Unit || '个'}）`),
          step('两端都算要比间隔数多1', '起点和终点两端都要算上，所以加1。', `${c.gaps} + 1 = ${c.trees}（${c.resultUnit || '棵'}）`)
        ]
      };
    } else return null;

    return {
      id: `paper_${paper.mode}_${key}`,
      categoryName: `${paper.letter}卷 · ${title}`,
      prompt,
      answer,
      unit: '',
      formula: animData.steps.at(-1).formulaHighlight,
      animData
    };
  }

  window.MathPapers = {presets, create, explanation};
})();
