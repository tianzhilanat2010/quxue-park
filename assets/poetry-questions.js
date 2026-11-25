// 二年级上下册课内古诗基础题。正文和接龙选项均取自 POEM_LIBRARY。
(() => {
  'use strict';

  const DETAILS = {
    deng_guan_que_lou: {
      next: 0, word: '欲', definition: '想要', wordChoices: ['已经', '不能', '正在'],
      question: '读“欲穷千里目，更上一层楼”，诗人怎样才能看得更远？',
      answer: '再登上一层楼', choices: ['闭上眼睛休息', '坐在原地不动', '转过身去不看'],
      tip: '“更上一层楼”就是再登上一层楼，站得高，可以看得更远。',
      scene: '夕阳靠近群山，黄河流向远方，诗人登楼望远。'
    },
    wang_lu_shan_pu_bu: {
      next: 2, word: '遥看', definition: '远远地看', wordChoices: ['闭着眼睛看', '低头看脚下', '走近了再看'],
      question: '读“疑是银河落九天”，诗人把瀑布想象成了什么？',
      answer: '从天上落下的银河', choices: ['一片飘落的树叶', '一群飞过的小鸟', '一座绿色的小山'],
      tip: '“疑是银河落九天”写瀑布从高处落下，像天上的银河落了下来。',
      scene: '阳光照着香炉峰，瀑布从高山上飞流而下。'
    },
    ye_su_shan_si: {
      next: 0, word: '危', definition: '高', wordChoices: ['危险', '弯曲', '矮小'],
      question: '读“不敢高声语，恐惊天上人”，诗人为什么不敢大声说话？',
      answer: '楼很高，好像会惊动天上的人', choices: ['因为正在上课', '因为嘴里含着食物', '因为听不见山下的声音'],
      tip: '诗人站在很高的楼上，觉得离天空很近，生怕说话声惊动了天上的人。',
      scene: '山寺的高楼靠近星空，伸手仿佛就能摘到星星。'
    },
    jiang_xue: {
      next: 2, word: '独', definition: '独自一个人', wordChoices: ['大家一起', '轮流着', '热热闹闹地'],
      question: '读“孤舟蓑笠翁，独钓寒江雪”，是谁在江上钓鱼？',
      answer: '一位披蓑衣、戴斗笠的老人', choices: ['一群放风筝的孩子', '一位赶着牛羊的牧人', '一群划船采莲的姑娘'],
      tip: '“翁”指老人。“孤舟”“独钓”写出了老人一个人在雪天的江上钓鱼。',
      scene: '大雪覆盖山川，一位老人坐在小船上独自钓鱼。'
    },
    chi_le_ge: {
      next: 2, word: '穹庐', definition: '圆顶帐篷', wordChoices: ['一把扇子', '一顶草帽', '一只木船'],
      question: '读“风吹草低见牛羊”，风吹过后，草丛里露出了什么动物？',
      answer: '牛和羊', choices: ['鸡和鸭', '猫和狗', '鱼和虾'],
      tip: '风把高高的草吹低了，藏在草丛里的牛和羊就显露出来了。',
      scene: '蓝天下草原宽广，风吹低牧草，露出成群的牛羊。'
    },
    mei_hua: {
      next: 2, word: '凌寒', definition: '冒着严寒', wordChoices: ['等到春天', '迎着酷暑', '躲开风雪'],
      question: '读“遥知不是雪，为有暗香来”，诗人为什么知道墙角白白的不是雪？',
      answer: '因为闻到了梅花的清香', choices: ['因为听到了下雨声', '因为看到了蝴蝶', '因为白色的东西会动'],
      tip: '雪没有梅花的香味。诗人闻到了清香，就知道那是梅花。',
      scene: '墙角的白梅在寒冷中开放，微风送来淡淡花香。'
    },
    xiao_er_chui_diao: {
      next: 2, word: '稚子', definition: '小孩子', wordChoices: ['老人', '老师', '过路人'],
      question: '读“怕得鱼惊不应人”，钓鱼的小孩子为什么不回答路人的问话？',
      answer: '怕说话声惊跑了鱼儿', choices: ['因为他正在睡觉', '因为他正在唱歌', '因为他想回家吃饭'],
      tip: '小孩子专心钓鱼，怕声音把鱼儿惊跑，所以远远摆手，没有出声回答。',
      scene: '草丛旁的小孩子安静地钓鱼，远远向问路的人摆手。'
    },
    cun_ju: {
      next: 2, word: '纸鸢', pronunciation: 'zhǐ yuān', definition: '风筝', wordChoices: ['纸飞机', '小木船', '竹蜻蜓'],
      question: '读“儿童散学归来早，忙趁东风放纸鸢”，孩子们放学后在做什么？',
      answer: '趁着春风放风筝', choices: ['在河里游泳', '在雪地里堆雪人', '在池塘里采荷花'],
      tip: '“散学”指放学，“纸鸢”就是风筝。孩子们放学后，趁着春风放风筝。',
      scene: '青草和杨柳迎着春风，放学的孩子们忙着放风筝。'
    },
    yong_liu: {
      next: 2, word: '丝绦', pronunciation: 'sī tāo', definition: '丝带', wordChoices: ['玉石', '剪刀', '树叶'],
      question: '读“二月春风似剪刀”，诗人把二月春风比作什么？',
      answer: '剪刀', choices: ['一把梳子', '一支毛笔', '一条小船'],
      tip: '诗人觉得春风像一把灵巧的剪刀，裁出了柳树细细的叶子。',
      scene: '柳枝像绿色丝带轻轻垂下，春风吹出了细细的柳叶。'
    },
    jue_ju: {
      next: 0, word: '鸣', definition: '叫', wordChoices: ['跳', '睡', '飞'],
      question: '读“一行白鹭上青天”，白鹭飞向了哪里？',
      answer: '蔚蓝的天空', choices: ['深深的河底', '高楼的屋子里', '黑黑的山洞里'],
      tip: '“青天”指蔚蓝的天空。一行白鹭正向着天空飞去。',
      scene: '黄鹂在绿柳间鸣叫，白鹭飞向天空，远处是雪山和江船。'
    },
    xiao_chu_jing_ci_si: {
      next: 2, word: '碧', definition: '碧绿色', wordChoices: ['火红色', '雪白色', '金黄色'],
      question: '读“毕竟西湖六月中”和满池的荷花，这首诗写的是哪个季节？',
      answer: '夏季', choices: ['春季', '秋季', '冬季'],
      tip: '诗里写的是六月的西湖，莲叶碧绿，荷花盛开，是夏季的景色。',
      scene: '夏日西湖莲叶碧绿，阳光下的荷花格外鲜红。'
    },
    fu_de_gu_yuan_cao: {
      next: 2, word: '一岁', definition: '一年', wordChoices: ['一天', '一个月', '一个夏天'],
      question: '读“野火烧不尽，春风吹又生”，春风吹来后，小草怎么样了？',
      answer: '又重新生长出来', choices: ['变成了石头', '再也长不出来', '飞到了天空中'],
      tip: '野火烧过地上的草，春风一吹，小草又长出来了。小草的生命力很顽强。',
      scene: '原野上的草经历枯萎和野火，春风一吹，又长出嫩绿的新芽。'
    },
    min_nong_qi_yi: {
      next: 0, word: '粟', pronunciation: 'sù', definition: '谷物', wordChoices: ['柳树', '露水', '萤火虫'],
      question: '读“四海无闲田，农夫犹饿死”，诗人同情的是谁？',
      answer: '辛勤劳动却仍然挨饿的农民', choices: ['正在放风筝的孩子', '在高楼上看风景的人', '河边问路的行人'],
      tip: '“犹”是仍然。农民辛苦种粮，却仍有人挨饿，诗人很同情他们。',
      scene: '从春天播下一粒种子，到秋天收获谷穗，体会农民的辛劳。'
    },
    zhou_ye_shu_suo_jian: {
      next: 2, word: '簇', pronunciation: 'cù', definition: '拥起，掀起细小的波浪', wordChoices: ['把灯吹灭', '让河面结冰', '让星星落下'],
      question: '读“微微风簇浪，散作满河星”，“满河星”是什么？',
      answer: '渔灯在水中被波浪打散的倒影', choices: ['天上的星星掉进水里', '萤火虫全部飞进河里', '河面放起了许多烟花'],
      tip: '微风吹起细浪，渔灯的倒影随波散开，看起来像河面布满了星星。',
      scene: '没有月光的河面上亮着一盏渔灯，微风把灯影散成满河星光。'
    }
  };

  const versesOf = poem => poem.lines.flatMap(line => line.split(/[，。！？]/).filter(Boolean));

  function createBank(library) {
    const poems = library.filter(poem => Object.hasOwn(DETAILS, poem.id) && ['二年级上册', '二年级下册'].includes(poem.grade));
    return poems.flatMap(poem => {
      const detail = DETAILS[poem.id];
      const verses = versesOf(poem);
      const cue = verses[detail.next];
      const answer = verses[detail.next + 1];
      const otherVerses = [...new Set(poems.filter(p => p.grade === poem.grade).flatMap(versesOf))]
        .filter(verse => verse !== cue && verse !== answer)
        .sort((a, b) => Math.abs(a.length - answer.length) - Math.abs(b.length - answer.length));
      const wordVerse = verses.find(verse => verse.includes(detail.word));
      const wordLabel = detail.word + (detail.pronunciation ? `（${detail.pronunciation}）` : '');
      const shared = {
        poemId: poem.id, grade: poem.grade,
        poemTitle: `《${poem.title}》· ${poem.dynasty}${poem.author === '佚名' ? '' : '·' + poem.author}`,
        verseTop: poem.lines[0], verseBottom: poem.lines.slice(1).join(''),
        sceneCaption: detail.scene
      };
      return [
        {
          kind: 'next_line',
          prompt: `📜 《${poem.title}》里，“${cue}”的下一句是？`,
          answer, distractors: otherVerses.slice(0, 3),
          tip: `把这两句连起来读：“${cue}，${answer}。”`
        },
        {
          kind: 'word',
          prompt: `📜 《${poem.title}》中，“${wordVerse}”的“${wordLabel}”是什么意思？`,
          answer: detail.definition, distractors: detail.wordChoices,
          tip: `“${wordLabel}”的意思是“${detail.definition}”。再读一读：“${wordVerse}”。`
        },
        {
          kind: 'meaning',
          prompt: `📜 《${poem.title}》：${detail.question}`,
          answer: detail.answer, distractors: detail.choices, tip: detail.tip
        }
      ].map(item => ({ ...shared, ...item, key: `${poem.id}:${item.kind}` }));
    });
  }

  window.PoetryQuestions = { createBank };
})();
