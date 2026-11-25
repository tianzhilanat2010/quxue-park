// 原创情境题。每个模板列出有限的数字组合，抽题无需靠重试去重。
(() => {
  const topics = {};
  function family(topic, title, make) {
    const questions = new Map();
    for (let n = 0; n < 32; n++) {
      const a = 2 + n % 8, b = 2 + Math.floor(n / 4) % 8;
      const [prompt, answer, unit, hint, formula] = make(n, a, b);
      questions.set(prompt, {id:title+n,topic, categoryName: title, prompt, answer, unit, hint, formula});
    }
    (topics[topic] ??= []).push([...questions.values()]);
  }

  family('num100', '两位数加法', n => {
    const a = 28 + n, b = 17 + n % 9;
    return [`${a} + ${b} = □`, a+b, '', '个位和个位相加，满十向十位进一。', `${a} + ${b} = ${a+b}`];
  });
  family('num100', '两位数减法', n => {
    const a = 61+n, b = 18+n%7;
    return [`${a} − ${b} = □`, a-b, '', '先算个位，不够减就向十位借一。', `${a} − ${b} = ${a-b}`];
  });
  family('muldiv', '看图列乘法', (n,a,b) => {
    const rows = 2+n%3, cols = 3+b%5;
    return [`每行的星星一样多。图中一共有多少颗星星？\n${Array(rows).fill('★ '.repeat(cols).trim()).join('\n')}`, rows*cols, '颗', '先数有几行，再数每行有几颗。', `${cols} × ${rows} = ${cols*rows}`];
  });
  family('muldiv', '平均分', (n,a,b) => [`把 ${a*b} 张书签平均分给 ${a} 名同学，每人分几张？`,b,'张','每人分得同样多，用总数除以人数。',`${a*b} ÷ ${a} = ${b}`]);
  family('rem_div', '分组后还剩几个', (n,a,b) => {
    const r = 1+n%(a-1), total=a*b+r;
    return [`${total} 个橘子，每袋装 ${a} 个。装满袋子后，还剩几个橘子？`,r,'个',`${b} 袋能装 ${a*b} 个，再看还剩几个。`,`${total} ÷ ${a} = ${b} …… ${r}`];
  });
  family('mixed_ops', '先乘后加', (n,a,b) => [`${a} × ${b} + 6 = □`,a*b+6,'','先算乘法，再加上 6。',`${a*b} + 6 = ${a*b+6}`]);
  family('mixed_ops', '先算括号', (n,a,b) => [`(${a*b+5} − 5) ÷ ${a} = □`,b,'',`先算括号，得到 ${a*b}。`,`${a*b} ÷ ${a} = ${b}`]);
  family('clock_time', '认识分针', (n,a) => {
    const hour = 1+n%11, mark=1+(a+n)%11;
    return [`钟面上，时针在 ${hour} 和 ${hour+1} 之间，分针指向 ${mark}。现在是 ${hour} 时多少分？`,mark*5,'分','从 12 开始，每走一大格是 5 分钟。',`分针走了 ${mark} 大格，每格 5 分，是 ${mark*5} 分。`];
  });
  family('length_angle', '用尺量长度', (n,a,b) => [`彩笔两端分别对着尺子的 ${a} 厘米和 ${a+b} 厘米刻度。彩笔长几厘米？`,b,'厘米','从终点刻度减去起点刻度。',`${a+b} − ${a} = ${b}`]);
  family('big_num', '认识质量单位', (n,a,b) => [`每袋大米重 1 千克，${a} 袋大米和 ${b} 袋大米合起来重几千克？`,a+b,'千克','把两组袋数相加，每袋都是 1 千克。',`${a} + ${b} = ${a+b}（千克）`]);
  family('length_angle', '测量彩带', (n,a,b) => [`一条彩带长 1 米，剪去 ${20+n} 厘米，还剩几厘米？`,80-n,'厘米','先把 1 米换成 100 厘米。',`100 − ${20+n} = ${80-n}（厘米）`]);
  family('shop_word', '按单价购物', (n,a,b) => [`一本画册 ${a} 元，买 ${b} 本一样的画册要付多少元？`,a*b,'元','每本价格一样，把单价乘本数。',`${a} × ${b} = ${a*b}`]);
  family('shop_word', '买文具找零', n => [`一盒蜡笔 ${12+n} 元，付 50 元，应找回多少元？`,38-n,'元','用付的钱减去蜡笔的价钱。',`50 − ${12+n} = ${38-n}`]);
  family('big_num', '认识数位', (n,a,b) => [`一个数有 ${a} 个百、${b} 个十和 3 个一。这个数是多少？`,100*a+10*b+3,'','按百位、十位、个位依次写。',`百位 ${a}，十位 ${b}，个位 3，写作 ${100*a+10*b+3}。`]);
  family('logic_grid', '读统计记录', (n,a,b) => [`体育用品登记表\n篮球　${a+10} 个\n足球　${b} 个\n篮球比足球多几个？`,a+10-b,'个','从篮球的数量里减去足球的数量。',`${a+10} − ${b} = ${a+10-b}`]);
  family('word', '图书角借还', n => [`图书角原有 ${30+n} 本书，借出 8 本，又还回 3 本。现在有几本？`,25+n,'本','先减去借出的书，再加上还回的书。',`${30+n} − 8 + 3 = ${25+n}`]);
  family('word', '比较两筐数量', (n,a,b) => [`第一筐有 ${18+a} 个苹果，第二筐比第一筐少 ${b} 个。第二筐有几个？`,18+a-b,'个','比第一筐少，用第一筐的数量减去少的个数。',`${18+a} − ${b} = ${18+a-b}`]);
  family('rmb', '认识元和角', (n,a,b) => [`${a} 元 ${b} 角一共是多少角？`,a*10+b,'角','1 元是 10 角，先把元换成角。',`${a*10} + ${b} = ${a*10+b}（角）`]);
  family('shape', '按顺序找图形', (n,a) => {
    const shapes=['○','△','□'], first=n%3, length=4+a;
    const row=Array.from({length},(_,i)=>shapes[(first+i)%3]);
    return [`照这样排下去，下一个是什么图形？\n${row.join('　')}　？`,shapes[(first+length)%3],'','每三个图形重复一次。',`下一组仍按 ${row.slice(0,3).join('、')} 的顺序排列。`];
  });
  family('sub20', '20以内退位减法', (n,a) => {
    const b=1+n%7, total=10+b, minus=b+1+a%(9-b);
    return [`${total} − ${minus} = □`,total-minus,'',`把 ${total} 拆成 10 和 ${b}，先从 10 里减。`,`10 − ${minus} + ${b} = ${total-minus}`];
  });

  function shuffled(items) {
    const result=items.slice();
    for(let i=result.length-1;i>0;i--) {
      const j=Math.floor(Math.random()*(i+1));
      [result[i],result[j]]=[result[j],result[i]];
    }
    return result;
  }
  function options(q) {
    if (q.topic==='shape') return [q.answer,...['○','△','□'].filter(shape => shape !== q.answer)];
    const candidates=[-1,1,-2,2,-3,3].map(d=>q.answer+d).filter(x=>x>=0);
    return [q.answer,...candidates.slice(0,3)];
  }
  function steps(q) {
    return [{title:'想一想',desc:q.hint,formulaHighlight:q.hint},{title:'核对答案',desc:q.formula,formulaHighlight:q.formula}];
  }
  function practice(topic,count) {
    const selected = topic === 'workbook' ? [...topics.num100, ...topics.muldiv, ...topics.shop_word, ...topics.word] : topics[topic];
    const families = shuffled(selected || Object.values(topics).flat()).map(shuffled);
    const result=[];
    while(result.length<count && families.some(f=>f.length)) {
      for(const family of families) {
        if (!family.length || result.length===count) continue;
        const q=family.pop();
        result.push({...q,id:'g2_'+q.topic+'_'+q.id,choices:shuffled(options(q)),inputType:typeof q.answer==='number'?'choice_and_numpad':'choice',animData:{type:'grade2_steps',steps:steps(q)}});
      }
    }
    return result;
  }
  function paperChoice(topic, index, family=0) {
    const pool=topics[topic][family], q=pool[index%pool.length];
    const choices=options(q).slice(1,3);
    const correctIdx=1+index%3;
    choices.splice(correctIdx-1, 0, q.answer);
    return {customMcq:true,promptPrefix:q.prompt+'（',promptSuffix:'）',title:q.categoryName,choices,correctIdx,
      explainDetail:q.formula,animData:{type:'grade2_steps',steps:steps(q)}};
  }
  window.Grade2Math={practice,paperChoice};
})();
