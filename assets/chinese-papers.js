// 二年级语文 A–H 八套图文并茂全真模拟试卷（统编版二年级上下册期末真题题型全覆盖）
(() => {
  'use strict';

  const step = (title, desc, formulaHighlight) => ({title, desc, formulaHighlight});

  // 精致SVG插画生成器（用于字词卡片、古诗意境、阅读理解插图、看图写话大幅画框）
  const SVG_SCENES = {
    // A卷阅读：《果园里的丰收会》（课本级手绘插图：小猴摘黄梨、松鼠摘红苹果、小熊装竹篮）
    monkeyGlasses: `<figure class="w-full max-w-[460px] rounded-2xl overflow-hidden border-2 border-amber-300/90 bg-[#fffdf7] shadow-md">
      <div class="relative overflow-hidden bg-amber-50">
        <img src="assets/orchard.jpg" alt="果园里的丰收会" class="w-full h-[195px] sm:h-[215px] object-cover object-center block transition-transform duration-500 hover:scale-[1.02]" loading="lazy" />
        <span class="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-amber-900/80 text-amber-50 text-[11px] font-black backdrop-blur-xs shadow-xs">课本精绘插图</span>
      </div>
      <figcaption class="px-3.5 py-2 bg-gradient-to-r from-amber-50 via-[#fffdf7] to-orange-50 border-t border-amber-200 flex items-center justify-between gap-2 text-xs font-bold text-amber-950">
        <span class="font-black text-rose-900">《果园里的丰收会》</span>
        <span class="text-slate-700 truncate">小猴摘黄梨 · 松鼠摘苹果 · 小熊装竹篮</span>
      </figcaption>
    </figure>`,

    // A卷看图写话：《春游放风筝》（课本水彩原画：杨柳拂堤、小桥流水、伙伴奔跑放燕子纸鸢）
    kiteSpring: `<figure class="w-full max-w-[460px] rounded-2xl overflow-hidden border-2 border-amber-300/90 bg-[#fffdf7] shadow-md">
      <div class="relative overflow-hidden bg-amber-50">
        <img src="assets/poetry/cun_ju.webp" alt="春游放风筝" class="w-full h-[225px] sm:h-[250px] object-cover object-center block transition-transform duration-500 hover:scale-[1.02]" loading="lazy" />
        <span class="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-amber-900/80 text-amber-50 text-[11px] font-black backdrop-blur-xs shadow-xs">统编课本水彩风</span>
      </div>
      <figcaption class="px-3.5 py-2 bg-gradient-to-r from-amber-50 via-[#fffdf7] to-orange-50 border-t border-amber-200 flex items-center justify-between gap-2 text-xs font-bold text-amber-950">
        <span class="font-black text-rose-900">《春游放风筝》</span>
        <span class="text-slate-700 truncate">草长莺飞二月天 · 迎着春风放飞燕子纸鸢</span>
      </figcaption>
    </figure>`,

    // B卷阅读：《小白兔的森林花店》（课本绘本原画：长耳白兔挎胡萝卜竹篮逛鲜花小屋）
    hedgehogApples: `<figure class="w-full max-w-[460px] rounded-2xl overflow-hidden border-2 border-amber-300/90 bg-[#fffdf7] shadow-md">
      <div class="relative overflow-hidden bg-amber-50">
        <img src="assets/flowershop.jpg" alt="小白兔的森林花店" class="w-full h-[195px] sm:h-[215px] object-cover object-center block transition-transform duration-500 hover:scale-[1.02]" loading="lazy" />
        <span class="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-amber-900/80 text-amber-50 text-[11px] font-black backdrop-blur-xs shadow-xs">课本精绘插图</span>
      </div>
      <figcaption class="px-3.5 py-2 bg-gradient-to-r from-amber-50 via-[#fffdf7] to-orange-50 border-t border-amber-200 flex items-center justify-between gap-2 text-xs font-bold text-amber-950">
        <span class="font-black text-rose-900">《小白兔的森林花店》</span>
        <span class="text-slate-700 truncate">红玫瑰 · 白雏菊 · 金向日葵 · 挎篮小白兔</span>
      </figcaption>
    </figure>`,

    // B卷看图写话：《溪边学钓鱼》（课本水彩原画：柳荫溪畔稚子垂钓、向问路老爷爷摆手）
    busSeat: `<figure class="w-full max-w-[460px] rounded-2xl overflow-hidden border-2 border-amber-300/90 bg-[#fffdf7] shadow-md">
      <div class="relative overflow-hidden bg-amber-50">
        <img src="assets/poetry/xiao_er_chui_diao.webp" alt="溪边学钓鱼" class="w-full h-[225px] sm:h-[250px] object-cover object-center block transition-transform duration-500 hover:scale-[1.02]" loading="lazy" />
        <span class="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-amber-900/80 text-amber-50 text-[11px] font-black backdrop-blur-xs shadow-xs">统编课本水彩风</span>
      </div>
      <figcaption class="px-3.5 py-2 bg-gradient-to-r from-amber-50 via-[#fffdf7] to-orange-50 border-t border-amber-200 flex items-center justify-between gap-2 text-xs font-bold text-amber-950">
        <span class="font-black text-rose-900">《溪边学钓鱼》</span>
        <span class="text-slate-700 truncate">柳荫荷塘专心垂钓 · 遥招手怕惊跑小鱼</span>
      </figcaption>
    </figure>`,

    // C卷阅读：《春江柳岸的鸟鸣画卷》（课本水彩原画：翠柳黄鹂对唱、一行白鹭飞上蓝天雪山）
    rainForest: `<figure class="w-full max-w-[460px] rounded-2xl overflow-hidden border-2 border-amber-300/90 bg-[#fffdf7] shadow-md">
      <div class="relative overflow-hidden bg-amber-50">
        <img src="assets/poetry/jue_ju.webp" alt="春江柳岸的鸟鸣画卷" class="w-full h-[195px] sm:h-[215px] object-cover object-center block transition-transform duration-500 hover:scale-[1.02]" loading="lazy" />
        <span class="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-amber-900/80 text-amber-50 text-[11px] font-black backdrop-blur-xs shadow-xs">统编课本水彩风</span>
      </div>
      <figcaption class="px-3.5 py-2 bg-gradient-to-r from-amber-50 via-[#fffdf7] to-orange-50 border-t border-amber-200 flex items-center justify-between gap-2 text-xs font-bold text-amber-950">
        <span class="font-black text-rose-900">《春江柳岸的鸟鸣画卷》</span>
        <span class="text-slate-700 truncate">翠柳黄鹂鸣唱 · 白鹭直上青天 · 雪山江船</span>
      </figcaption>
    </figure>`,

    // C卷看图写话：《春种与秋收》（课本水彩原画：左景春耕播种、右景秋收金黄稻谷）
    plantTrees: `<figure class="w-full max-w-[460px] rounded-2xl overflow-hidden border-2 border-amber-300/90 bg-[#fffdf7] shadow-md">
      <div class="relative overflow-hidden bg-amber-50">
        <img src="assets/poetry/min_nong_qi_yi.webp" alt="春种一粒粟，秋收万颗子" class="w-full h-[225px] sm:h-[250px] object-cover object-center block transition-transform duration-500 hover:scale-[1.02]" loading="lazy" />
        <span class="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-amber-900/80 text-amber-50 text-[11px] font-black backdrop-blur-xs shadow-xs">统编课本水彩风</span>
      </div>
      <figcaption class="px-3.5 py-2 bg-gradient-to-r from-amber-50 via-[#fffdf7] to-orange-50 border-t border-amber-200 flex items-center justify-between gap-2 text-xs font-bold text-amber-950">
        <span class="font-black text-rose-900">《春种一粒粟，秋收万颗子》</span>
        <span class="text-slate-700 truncate">春天弯腰播撒谷种 · 金秋收割沉甸甸谷穗</span>
      </figcaption>
    </figure>`,

    // D卷阅读：《小水滴的奇妙旅行》（双联课本水彩原画：左幅高山云雾升腾飞瀑直下，右幅荷叶滚水珠如闪亮珍珠）
    waterDropCycle: `<figure class="w-full max-w-[460px] rounded-2xl overflow-hidden border-2 border-sky-300/90 bg-[#fffdf7] shadow-md">
      <div class="grid grid-cols-2 gap-1 bg-sky-100 p-1">
        <div class="relative rounded-xl overflow-hidden">
          <img src="assets/poetry/wang_lu_shan_pu_bu.webp" alt="①太阳晒变汽升空 ➔ ②聚成云雾化雨飞泻" class="w-full h-[185px] object-cover object-center block" loading="lazy" />
          <span class="absolute bottom-1.5 left-1.5 right-1.5 px-2 py-0.5 rounded-lg bg-slate-900/75 text-white text-[10.5px] font-bold text-center backdrop-blur-xs">①太阳晒变汽升空 ➔ ②聚成云雾化雨飞泻</span>
        </div>
        <div class="relative rounded-xl overflow-hidden">
          <img src="assets/poetry/xiao_chu_jing_ci_si.webp" alt="③落在圆圆荷叶上滚来滚去，像闪亮珍珠" class="w-full h-[185px] object-cover object-center block" loading="lazy" />
          <span class="absolute bottom-1.5 left-1.5 right-1.5 px-2 py-0.5 rounded-lg bg-slate-900/75 text-white text-[10.5px] font-bold text-center backdrop-blur-xs">③落在圆圆荷叶上滚来滚去，像闪亮珍珠</span>
        </div>
      </div>
      <figcaption class="px-3.5 py-2 bg-gradient-to-r from-sky-50 via-[#fffdf7] to-emerald-50 border-t border-sky-200 flex items-center justify-between gap-2 text-xs font-bold text-sky-950">
        <span class="font-black text-sky-900">《小水滴的奇妙旅行》课本连环彩图</span>
        <span class="text-slate-700">太阳晒升空变云 ➔ 化雨落荷塘如珍珠</span>
      </figcaption>
    </figure>`,

    // D卷看图写话：《芳草古道送别好朋友》（课本水彩原画：蓝天白云翠绿春草、野花盛开、好友握手惜别）
    shareUmbrella: `<figure class="w-full max-w-[460px] rounded-2xl overflow-hidden border-2 border-amber-300/90 bg-[#fffdf7] shadow-md">
      <div class="relative overflow-hidden bg-amber-50">
        <img src="assets/poetry/fu_de_gu_yuan_cao.webp" alt="郊外踏青与好友惜别" class="w-full h-[225px] sm:h-[250px] object-cover object-center block transition-transform duration-500 hover:scale-[1.02]" loading="lazy" />
        <span class="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-amber-900/80 text-amber-50 text-[11px] font-black backdrop-blur-xs shadow-xs">统编课本水彩风</span>
      </div>
      <figcaption class="px-3.5 py-2 bg-gradient-to-r from-amber-50 via-[#fffdf7] to-orange-50 border-t border-amber-200 flex items-center justify-between gap-2 text-xs font-bold text-amber-950">
        <span class="font-black text-rose-900">《郊外踏青与好友惜别》</span>
        <span class="text-slate-700 truncate">晴空万里芳草萋萋 · 古道边双手紧握互道珍重</span>
      </figcaption>
    </figure>`,

    // E卷阅读：《夏夜河畔的渔火微光》（课本水彩原画：静谧夏夜芦苇小舟、温暖孤光倒映河面散作满河星）
    fireflyNight: `<figure class="w-full max-w-[460px] rounded-2xl overflow-hidden border-2 border-amber-300/90 bg-[#fffdf7] shadow-md">
      <div class="relative overflow-hidden bg-amber-50">
        <img src="assets/poetry/zhou_ye_shu_suo_jian.webp" alt="夏夜河畔的点点微光" class="w-full h-[195px] sm:h-[215px] object-cover object-center block transition-transform duration-500 hover:scale-[1.02]" loading="lazy" />
        <span class="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-amber-900/80 text-amber-50 text-[11px] font-black backdrop-blur-xs shadow-xs">统编课本水彩风</span>
      </div>
      <figcaption class="px-3.5 py-2 bg-gradient-to-r from-amber-50 via-[#fffdf7] to-orange-50 border-t border-amber-200 flex items-center justify-between gap-2 text-xs font-bold text-amber-950">
        <span class="font-black text-rose-900">《夏夜河畔的点点微光》</span>
        <span class="text-slate-700 truncate">夜色芦苇荡 · 温暖灯火随微风散作满河星光</span>
      </figcaption>
    </figure>`,

    // E卷看图写话：《山顶高楼望星河》（课本水彩原画：弯月繁星、云海苍松、高耸木楼灯火温暖）
    doDishes: `<figure class="w-full max-w-[460px] rounded-2xl overflow-hidden border-2 border-amber-300/90 bg-[#fffdf7] shadow-md">
      <div class="relative overflow-hidden bg-amber-50">
        <img src="assets/poetry/ye_su_shan_si.webp" alt="星夜登高楼" class="w-full h-[225px] sm:h-[250px] object-cover object-center block transition-transform duration-500 hover:scale-[1.02]" loading="lazy" />
        <span class="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-amber-900/80 text-amber-50 text-[11px] font-black backdrop-blur-xs shadow-xs">统编课本水彩风</span>
      </div>
      <figcaption class="px-3.5 py-2 bg-gradient-to-r from-amber-50 via-[#fffdf7] to-orange-50 border-t border-amber-200 flex items-center justify-between gap-2 text-xs font-bold text-amber-950">
        <span class="font-black text-rose-900">《星夜登高楼》</span>
        <span class="text-slate-700 truncate">危楼高耸入云端 · 弯月繁星闪烁似伸手可摘</span>
      </figcaption>
    </figure>`,

    // F卷阅读：《彩虹乐园里的好伙伴》（课本绘本原画：雨后七色彩虹、熊猫博士搭积木、小白兔拨算珠）
    woodenBridge: `<figure class="w-full max-w-[460px] rounded-2xl overflow-hidden border-2 border-amber-300/90 bg-[#fffdf7] shadow-md">
      <div class="relative overflow-hidden bg-amber-50">
        <img src="assets/hero.jpg" alt="彩虹乐园里的好伙伴" class="w-full h-[195px] sm:h-[215px] object-cover object-center block transition-transform duration-500 hover:scale-[1.02]" loading="lazy" />
        <span class="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-amber-900/80 text-amber-50 text-[11px] font-black backdrop-blur-xs shadow-xs">课本精绘插图</span>
      </div>
      <figcaption class="px-3.5 py-2 bg-gradient-to-r from-amber-50 via-[#fffdf7] to-orange-50 border-t border-amber-200 flex items-center justify-between gap-2 text-xs font-bold text-amber-950">
        <span class="font-black text-rose-900">《彩虹乐园里的好伙伴》</span>
        <span class="text-slate-700 truncate">雨后七色彩虹 · 熊猫博士搭积木 · 小白兔拨算珠</span>
      </figcaption>
    </figure>`,

    // F卷看图写话：《辽阔大草原上的牛羊》（课本水彩原画：阴山蓝天白云、风吹绿草野花、白羊黄牛成群）
    tugOfWar: `<figure class="w-full max-w-[460px] rounded-2xl overflow-hidden border-2 border-amber-300/90 bg-[#fffdf7] shadow-md">
      <div class="relative overflow-hidden bg-amber-50">
        <img src="assets/poetry/chi_le_ge.webp" alt="大草原上的牛羊画卷" class="w-full h-[225px] sm:h-[250px] object-cover object-center block transition-transform duration-500 hover:scale-[1.02]" loading="lazy" />
        <span class="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-amber-900/80 text-amber-50 text-[11px] font-black backdrop-blur-xs shadow-xs">统编课本水彩风</span>
      </div>
      <figcaption class="px-3.5 py-2 bg-gradient-to-r from-amber-50 via-[#fffdf7] to-orange-50 border-t border-amber-200 flex items-center justify-between gap-2 text-xs font-bold text-amber-950">
        <span class="font-black text-rose-900">《大草原上的牛羊画卷》</span>
        <span class="text-slate-700 truncate">天苍苍野茫茫 · 微风吹拂牧草露出成群牛羊</span>
      </figcaption>
    </figure>`,

    // G卷阅读：《春风里的翠柳丝带》（课本水彩原画：河畔古柳万条垂下绿丝绦、石桥白墙倒映春水）
    mimosaWeather: `<figure class="w-full max-w-[460px] rounded-2xl overflow-hidden border-2 border-amber-300/90 bg-[#fffdf7] shadow-md">
      <div class="relative overflow-hidden bg-amber-50">
        <img src="assets/poetry/yong_liu.webp" alt="春风里的翠柳丝带" class="w-full h-[195px] sm:h-[215px] object-cover object-center block transition-transform duration-500 hover:scale-[1.02]" loading="lazy" />
        <span class="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-amber-900/80 text-amber-50 text-[11px] font-black backdrop-blur-xs shadow-xs">统编课本水彩风</span>
      </div>
      <figcaption class="px-3.5 py-2 bg-gradient-to-r from-amber-50 via-[#fffdf7] to-orange-50 border-t border-amber-200 flex items-center justify-between gap-2 text-xs font-bold text-amber-950">
        <span class="font-black text-rose-900">《春风里的翠柳丝带》</span>
        <span class="text-slate-700 truncate">碧玉妆成一树高 · 万千柳条垂下如绿丝带</span>
      </figcaption>
    </figure>`,

    // G卷看图写话：《夕阳下的登楼远眺》（课本水彩原画：漫天红霞夕阳西沉、黄河奔流入海、登楼望远）
    lanternFestival: `<figure class="w-full max-w-[460px] rounded-2xl overflow-hidden border-2 border-amber-300/90 bg-[#fffdf7] shadow-md">
      <div class="relative overflow-hidden bg-amber-50">
        <img src="assets/poetry/deng_guan_que_lou.webp" alt="夕阳下登高望远" class="w-full h-[225px] sm:h-[250px] object-cover object-center block transition-transform duration-500 hover:scale-[1.02]" loading="lazy" />
        <span class="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-amber-900/80 text-amber-50 text-[11px] font-black backdrop-blur-xs shadow-xs">统编课本水彩风</span>
      </div>
      <figcaption class="px-3.5 py-2 bg-gradient-to-r from-amber-50 via-[#fffdf7] to-orange-50 border-t border-amber-200 flex items-center justify-between gap-2 text-xs font-bold text-amber-950">
        <span class="font-black text-rose-900">《夕阳下登高望远》</span>
        <span class="text-slate-700 truncate">白日依山尽 · 黄河入海流 · 更上一层楼</span>
      </figcaption>
    </figure>`,

    // H卷阅读：《墙角傲雪凌寒的白梅花》（课本水彩原画：白雪覆瓦、墙角数枝白梅凌寒盛开、暗香浮动）
    squirrelPinecones: `<figure class="w-full max-w-[460px] rounded-2xl overflow-hidden border-2 border-amber-300/90 bg-[#fffdf7] shadow-md">
      <div class="relative overflow-hidden bg-amber-50">
        <img src="assets/poetry/mei_hua.webp" alt="墙角傲雪的白梅花" class="w-full h-[195px] sm:h-[215px] object-cover object-center block transition-transform duration-500 hover:scale-[1.02]" loading="lazy" />
        <span class="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-amber-900/80 text-amber-50 text-[11px] font-black backdrop-blur-xs shadow-xs">统编课本水彩风</span>
      </div>
      <figcaption class="px-3.5 py-2 bg-gradient-to-r from-amber-50 via-[#fffdf7] to-orange-50 border-t border-amber-200 flex items-center justify-between gap-2 text-xs font-bold text-amber-950">
        <span class="font-black text-rose-900">《墙角傲雪的白梅花》</span>
        <span class="text-slate-700 truncate">墙角数枝梅 · 凌寒独自开 · 遥知不是雪为有暗香来</span>
      </figcaption>
    </figure>`,

    // H卷看图写话：《冬日漫天瑞雪与寒江独钓》（课本水彩原画：千山覆雪、青松披银装、老渔翁孤舟独钓）
    buildSnowman: `<figure class="w-full max-w-[460px] rounded-2xl overflow-hidden border-2 border-amber-300/90 bg-[#fffdf7] shadow-md">
      <div class="relative overflow-hidden bg-amber-50">
        <img src="assets/poetry/jiang_xue.webp" alt="漫天瑞雪中的寒江画卷" class="w-full h-[225px] sm:h-[250px] object-cover object-center block transition-transform duration-500 hover:scale-[1.02]" loading="lazy" />
        <span class="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-amber-900/80 text-amber-50 text-[11px] font-black backdrop-blur-xs shadow-xs">统编课本水彩风</span>
      </div>
      <figcaption class="px-3.5 py-2 bg-gradient-to-r from-amber-50 via-[#fffdf7] to-orange-50 border-t border-amber-200 flex items-center justify-between gap-2 text-xs font-bold text-amber-950">
        <span class="font-black text-rose-900">《漫天瑞雪中的寒江画卷》</span>
        <span class="text-slate-700 truncate">鹅毛大雪纷纷扬扬 · 青松远山银装素裹 · 寒江垂钓</span>
      </figcaption>
    </figure>`
  };

  // =========================================================================
  // 8套二年级语文全真模拟试卷种子数据（每套满分 100 分）
  // 结构：
  //   一、字音字形与查字典（24分）：q1~q4（每题6分）
  //   二、词语百花园与句子游乐园（28分）：q5~q8（每题7分）
  //   三、古诗名句与课文直通车（20分）：q9~q12（每题5分）
  //   四、开心阅读理解检阅台（16分）：短文 + 插图 + q13~q16（每题4分）
  //   五、看图写话大舞台（12分）：原创彩图 + q17_time, q17_who, q17_do, q17_feel（4空各3分）
  // =========================================================================
  const SEEDS = [
    // =========================================================================
    // 语文A卷：统编版二年级上册期末综合真题卷（一）
    // =========================================================================
    {
      id: 'cn_paper_a',
      letter: '语文A',
      label: '语文A卷 · 二上期末真题（一）',
      title: '统编版二年级语文上册期末全真模拟测试卷（A卷）',
      subtitle: '涵盖：多音字、青字族、部首查字典、量词的地得、反问句、古诗名句、《果园里的丰收会》阅读与放风筝写话',
      sec1Questions: [
        {
          key: 'q1', num: 1, points: 6,
          title: '多音字读音辨析',
          badge: '字音闯关',
          visualHtml: `<div class="inline-flex flex-wrap items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#fffbeb] border border-amber-300/90 shadow-2xs">
          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">mò/méi</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">没</span>
            </div>
          </div>

          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">wéi/wèi</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">为</span>
            </div>
          </div>
        <span class="ml-2 pl-2.5 border-l border-amber-300 text-xs font-bold text-amber-950">淹没田地 · 四海为家</span></div>`,
          promptPrefix: '在课文“大水淹没了田地”和“孩子如果已经长大，就得告别妈妈，四海为家”中，加点字“没”和“为”的正确读音依次是（',
          promptSuffix: '）。',
          choices: ['méi 、 wèi', 'mò 、 wéi', 'mò 、 wèi'],
          correctIdx: 2,
          explainDetail: '“淹没”表示漫过，读四声 mò；“四海为家”表示当作、变成，读二声 wéi，选 ②',
          animData: {
            type: 'cn_pinyin_tree', charText: '没 / 为', branchA: 'mò（淹没） / wéi（四海为家）', branchB: 'méi（没有） / wèi（因为）',
            tip: '根据词语意思定读音：水漫过去是“淹没（mò）”，当作四海是家读“四海为（wéi）家”！', ans: '② mò 、 wéi',
            steps: [
              step('第一步：辨析《我是什么》中的“淹没”', '表示大水漫过庄稼、沉没水中时，读四声 mò；表示“没有”时才读 méi。', '淹没（mò）'),
              step('第二步：辨析《植物妈妈有办法》中的“四海为家”', '表示“成为、当作”时读二声 wéi；表示“因为、为了”时读四声 wèi。', '四海为（wéi）家（选 ②）')
            ]
          }
        },
        {
          key: 'q2', num: 2, points: 6,
          title: '“青”字族看图选字填空',
          badge: '偏旁字族',
          visualHtml: `<div class="inline-flex flex-wrap items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#fffbeb] border border-amber-300/90 shadow-2xs">
          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">qíng 日+青</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">晴</span>
            </div>
          </div>

          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">jīng 目+青</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">睛</span>
            </div>
          </div>

          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">qīng 氵+青</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">清</span>
            </div>
          </div>
        <span class="ml-2 pl-2.5 border-l border-amber-300 text-xs font-bold text-amber-950">课本识字：青字族形声字</span></div>`,
          promptPrefix: '选字填空：“今天天（  ）朗，小青蛙瞪着大眼（  ），坐在（  ）澈的池塘边唱歌。”括号里依次应填入（',
          promptSuffix: '）。',
          choices: ['晴 、 睛 、 清', '清 、 睛 、 晴', '晴 、 情 、 清'],
          correctIdx: 1,
          explainDetail: '有日天晴朗（晴），有目大眼睛（睛），有水池水清（清），依次填“晴、睛、清”，选 ①',
          animData: {
            type: 'cn_char_split', radical: '日 / 目 / 氵', stem: '青 (qīng)', compound: '晴 / 睛 / 清',
            rule: '有日天晴朗（晴），有目大眼睛（睛），有水河水清（清）！', ans: '① 晴 、 睛 、 清',
            steps: [
              step('第一步：看形旁辨字义', '日字旁和太阳天气有关（晴朗），目字旁和眼睛有关（眼睛），三点水和清澈的水有关（清澈）。', '日➔晴 ｜ 目➔睛 ｜ 氵➔清'),
              step('第二步：按顺序填入句子', '天气晴朗 ➔ 大眼睛 ➔ 清澈的池塘，选 ①！', '答案：① 晴 、 睛 、 清')
            ]
          }
        },
        {
          key: 'q3', num: 3, points: 6,
          title: '部首查字法实战',
          badge: '查字典必考',
          visualHtml: `<div class="inline-flex flex-wrap items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#fffbeb] border border-amber-300/90 shadow-2xs">
          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">hú</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">狐</span>
            </div>
          </div>

          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">3画</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">犭</span>
            </div>
          </div>

          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">5画</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">瓜</span>
            </div>
          </div>
        <span class="ml-2 pl-2.5 border-l border-amber-300 text-xs font-bold text-amber-950">部首查字法：先查左偏旁犭</span></div>`,
          promptPrefix: '用“部首查字法”查《狐假虎威》的“狐”字，应该先查部首（  ），除去部首再查（  ）画。括号里应选（',
          promptSuffix: '）。',
          choices: ['“犭”部 ， 5 画', '“瓜”部 ， 3 画', '“犭”部 ， 6 画'],
          correctIdx: 1,
          explainDetail: '“狐”是左右结构，先查左边反犬旁“犭”（3画），右边“瓜”字共5画（撇、撇、竖提、点、捺），选 ①',
          animData: {
            type: 'cn_char_split', radical: '犭 (3画)', stem: '瓜 (5画)', compound: '狐 (hú)',
            rule: '左右结构取左偏旁“犭”，除去部首数右边“瓜”的笔画（共5画）！', ans: '① “犭”部 ， 5 画',
            steps: [
              step('第一步：确定“狐”字的部首', '“狐”是兽类名称，部首是左边的反犬旁“犭”。', '先查部首：犭'),
              step('第二步：仔细数右边“瓜”字的笔画数', '“瓜”的笔顺：平撇、竖撇、竖提、点、捺，一共 5 画！', '除去部首再查：5 画（选 ①）')
            ]
          }
        },
        {
          key: 'q4', num: 4, points: 6,
          title: '《场景歌》量词与“的地得”搭配',
          badge: '量词与语法',
          visualHtml: `<div class="inline-flex flex-wrap items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#fffbeb] border border-amber-300/90 shadow-2xs">
          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">sōu 军舰</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">艘</span>
            </div>
          </div>

          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">kǒng 石桥</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">孔</span>
            </div>
          </div>

          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">fāng 鱼塘</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">方</span>
            </div>
          </div>
        <span class="ml-2 pl-2.5 border-l border-amber-300 text-xs font-bold text-amber-950">《场景歌》专属量词卡片</span></div>`,
          promptPrefix: '按照课文《场景歌》填空：“一（  ）军舰，一（  ）石桥，一（  ）鱼塘。”括号里最恰当的量词依次是（',
          promptSuffix: '）。',
          choices: ['条 、 座 、 个', '艘 、 孔 、 方', '艘 、 道 、 块'],
          correctIdx: 2,
          explainDetail: '《场景歌》原文经典量词搭配：一艘军舰、一孔石桥、一方鱼塘，选 ②',
          animData: {
            type: 'cn_grammar_train', leftPart: '一艘军舰 · 一孔石桥', midWord: '《场景歌》专属量词', rightPart: '一方鱼塘 · 一丛翠竹',
            tip: '大型舰船用“一艘”，拱形石桥用“一孔”，四方鱼塘用“一方”！', ans: '② 艘 、 孔 、 方',
            steps: [
              step('第一步：回忆二年级上册识字第1课《场景歌》', '一只海鸥，一片沙滩。一艘军舰，一条帆船。', '一艘军舰'),
              step('第二步：核对田园与石桥量词', '一方鱼塘，一块稻田。一行垂柳，一座花园。一道小溪，一孔石桥。', '艘 、 孔 、 方（选 ②）')
            ]
          }
        }
      ],
      sec2Questions: [
        {
          key: 'q5', num: 5, points: 7,
          title: '成语寓言与四字词语积累',
          badge: '成语广角',
          promptPrefix: '在成语“狐假虎威”中，“假”字的意思是（',
          promptSuffix: '）。',
          choices: ['不真实，真假的“假”', '借用、利用（狐狸借着老虎的威风）', '放假、休假'],
          correctIdx: 2,
          explainDetail: '“狐假虎威”指狐狸借着老虎的威风把百兽吓跑，“假”是借用、利用的意思，选 ②',
          animData: {
            type: 'cn_scroll', poemTitle: '成语精讲 · 狐假虎威', verseTop: '🦊 狐狸摇摇摆摆走在前 ➔ 🐯 老虎东张西望跟在后', verseBottom: '“假” = 借用、凭借',
            tip: '百兽害怕的是身后的大老虎，狐狸只是“借”了老虎的威风！', ans: '② 借用、利用',
            steps: [
              step('第一步：回顾课文《狐假虎威》故事情节', '狐狸走在老虎前面，百兽看见狐狸身后的大老虎吓得逃跑了。', '百兽怕的是老虎'),
              step('第二步：理解关键字“假”的古义', '这里的“假”不是真假，而是“借用、凭借”的意思！', '假 = 借用、利用（选 ②）')
            ]
          }
        },
        {
          key: 'q6', num: 6, points: 7,
          title: '“的、地、得”语法小尾巴',
          badge: '的地得辨析',
          promptPrefix: '填入恰当的字：“温暖（  ）春风轻轻（  ）吹过来，花儿笑（  ）真甜呀！”依次应填（',
          promptSuffix: '）。',
          choices: ['的 、 地 、 得', '地 、 的 、 得', '的 、 得 、 地'],
          correctIdx: 1,
          explainDetail: '“春风”是名词前面用“白勺的”；“吹”是动词前面用“土也地”；“笑”后面补充程度“真甜”用“双人得”，选 ①',
          animData: {
            type: 'cn_grammar_train', leftPart: '温暖的春风(名词)', midWord: '轻轻地吹(动词)', rightPart: '笑得真甜(补语)',
            tip: '白勺“的”后面跟名词，土也“地”后面跟动作，双人“得”跟在动词后表程度！', ans: '① 的 、 地 、 得',
            steps: [
              step('第一步：看空后面的词是什么词性', '“春风”是事物名称（名词），前面用“的”；“吹”是动作（动词），前面用“地”。', '温暖的春风 ｜ 轻轻地吹'),
              step('第二步：看动作后面的补充说明', '“笑”得怎么样？“笑得真甜”，动词后面用双人“得”！', '的 、 地 、 得（选 ①）')
            ]
          }
        },
        {
          key: 'q7', num: 7, points: 7,
          title: '反问句改陈述句',
          badge: '句式转换',
          promptPrefix: '《我要的是葫芦》中那个人说：“叶子上的虫还用治？”这句话真正的意思是（',
          promptSuffix: '）。',
          choices: ['叶子上的虫必须要治。', '叶子上的虫不用治。', '叶子上到底有没有虫呢？'],
          correctIdx: 2,
          explainDetail: '反问句改陈述句：把“还用”改为“不用”，问号改为句号，即“叶子上的虫不用治。”选 ②',
          animData: {
            type: 'cn_grammar_train', leftPart: '叶子上的虫还用治？', midWord: '反问 ➔ 陈述', rightPart: '叶子上的虫不用治。',
            tip: '反问句答案就藏在问句里：肯定反问表否定（还用治？= 不用治。）！', ans: '② 叶子上的虫不用治。',
            steps: [
              step('第一步：读懂反问句的语气', '种葫芦的人觉得自己只要葫芦不要叶子，认为“还用治？”就是根本不需要治。', '还用治？ ➔ 不用治'),
              step('第二步：去掉反问词并把问号变句号', '变成陈述句：“叶子上的虫不用治。”', '选 ② 叶子上的虫不用治。')
            ]
          }
        },
        {
          key: 'q8', num: 8, points: 7,
          title: '标点符号小医生',
          badge: '标点闯关',
          promptPrefix: '给句子加上标点：“天无边无际，大得很哪（  ）你从哪儿飞来呀（  ）”括号里依次应填（',
          promptSuffix: '）。',
          choices: ['！   ？', '。   。', '？   ！'],
          correctIdx: 1,
          explainDetail: '第一句“大得很哪！”表达强烈的感叹语气用“！”；第二句“你从哪儿飞来呀？”是提问用“？”，选 ①',
          animData: {
            type: 'cn_grammar_train', leftPart: '大得很哪！', midWord: '感叹 vs 疑问', rightPart: '你从哪儿飞来呀？',
            tip: '句尾有“哪、呀、啊”表感叹赞叹用“！”；向别人发问用“？”！', ans: '① ！   ？',
            steps: [
              step('第一步：判断前半句语气', '“大得很哪”是小鸟感叹天空非常辽阔，用感叹号“！”。', '大得很哪！'),
              step('第二步：判断后半句语气', '“你从哪儿飞来呀”是提出问题，用问号“？”。', '！  ？（选 ①）')
            ]
          }
        }
      ],
      sec3Questions: [
        {
          key: 'q9', num: 9, points: 5,
          title: '古诗名句情景背诵：《登鹳雀楼》',
          badge: '必背古诗',
          visualHtml: `<div class="inline-flex items-center gap-3 p-2 pr-4 rounded-xl bg-[#fffbeb] border border-amber-300 shadow-2xs">
      <img src="assets/poetry/deng_guan_que_lou.webp" alt="唐·王之涣《登鹳雀楼》" class="w-20 h-12 rounded-lg object-cover border border-amber-200 shrink-0" loading="lazy" />
      <div class="text-xs">
        <div class="font-black text-amber-950">唐·王之涣《登鹳雀楼》</div>
        <div class="font-bold text-slate-700 mt-0.5">白日依山尽，黄河入海流。</div>
      </div>
    </div>`,
          promptPrefix: '想看得更远就要站得更高，王之涣在《登鹳雀楼》中写道：“欲穷千里目，（',
          promptSuffix: '）。”',
          choices: ['疑是银河落九天', '更上一层楼', '手可摘星辰'],
          correctIdx: 2,
          explainDetail: '《登鹳雀楼》后两句是“欲穷千里目，更上一层楼”，告诉我们不断进取的道理，选 ②',
          animData: {
            type: 'cn_scroll', poemId: 'deng_guan_que_lou', poemTitle: '唐·王之涣《登鹳雀楼》',
            verseTop: '白日依山尽，黄河入海流。', verseBottom: '欲穷千里目，更上一层楼。',
            tip: '“欲穷千里目，更上一层楼”既是写景，又蕴含着“站得高才能看得远”的哲理！', ans: '② 更上一层楼',
            steps: [
              step('第一步：朗读上联写景名句', '白日依山尽，黄河入海流。', '白日依山尽，黄河入海流'),
              step('第二步：接出下联千古哲理句', '想要看到千里之外的美景，就要再登上一层楼：欲穷千里目，更上一层楼！', '更上一层楼（选 ②）')
            ]
          }
        },
        {
          key: 'q10', num: 10, points: 5,
          title: '古诗字词精解：《敕勒歌》',
          badge: '古诗字义',
          promptPrefix: '北朝民歌《敕勒歌》“天苍苍，野茫茫，风吹草低见牛羊”中，“见”字的正确读音和意思是（',
          promptSuffix: '）。',
          choices: ['读 jiàn ，意思是看见', '读 xiàn ，意思是同“现”（显露、出现）', '读 kàn ，意思是观看'],
          correctIdx: 2,
          explainDetail: '“风吹草低见牛羊”的“见”读作 xiàn，意思是显露、出现（风吹过牧草低伏，牛羊显露出来），选 ②',
          animData: {
            type: 'cn_scroll', poemId: 'chi_le_ge', poemTitle: '北朝民歌《敕勒歌》',
            verseTop: '天苍苍，野茫茫，', verseBottom: '风吹草低见（xiàn）牛羊。',
            tip: '易错考点：“见”在这里通“现”，读 xiàn，表示草原上的牛羊在草低伏时显露出来！', ans: '② 读 xiàn ，同“现”',
            steps: [
              step('第一步：想象草原牧草茂盛的画面', '牧草长得很高，平时把牛羊遮住了；微风吹过牧草低伏，牛羊才“显现”出来。', '草低 ➔ 牛羊显露'),
              step('第二步：牢记特殊读音 xiàn', '“见”读 xiàn，同“现”（显露、出现）！', '读 xiàn（选 ②）')
            ]
          }
        },
        {
          key: 'q11', num: 11, points: 5,
          title: '课文梳理：《小蝌蚪找妈妈》',
          badge: '课文精读',
          promptPrefix: '按照课文《小蝌蚪找妈妈》，小蝌蚪长成青蛙的正确变化顺序是（',
          promptSuffix: '）。',
          choices: ['长出两条前腿 ➔ 长出两条后腿 ➔ 尾巴不见了', '长出两条后腿 ➔ 长出两条前腿 ➔ 尾巴变短 ➔ 尾巴不见了', '尾巴先消失 ➔ 长出四条腿'],
          correctIdx: 2,
          explainDetail: '小蝌蚪变成青蛙的顺序：先长出两条后腿，再长出两条前腿，尾巴变短，最后尾巴不见了，选 ②',
          animData: {
            type: 'cn_story_flow', flowTitle: '🐸 小蝌蚪变青蛙四步成长记',
            nodes: ['①大脑袋长尾巴', '②先长两条后腿', '③再长两条前腿', '④尾巴变短消失'],
            tip: '一定记准：小蝌蚪是“先长后腿，再长前腿”！', ans: '② 先长后腿 ➔ 再长前腿 ➔ 尾巴变短消失',
            steps: [
              step('第一步：区分“后腿”和“前腿”的先后顺序', '课文中写小蝌蚪游哇游，过了几天，“长出了两条后腿”，后来又“长出了两条前腿”。', '先长后腿 ➔ 再长前腿'),
              step('第二步：尾巴变化过程', '尾巴变短了 ➔ 不知什么时候，小青蛙的尾巴已经不见了！', '选 ②')
            ]
          }
        },
        {
          key: 'q12', num: 12, points: 5,
          title: '课文智慧：《曹冲称象》',
          badge: '课文思维',
          promptPrefix: '在《曹冲称象》一课中，曹冲称象的第一步和第二步依次是（',
          promptSuffix: '）。',
          choices: [
            '赶象上船在船舷沿水面画线 ➔ 赶象下船装石头到画线处',
            '先往船上装满石头画线 ➔ 再把大象赶上船',
            '把大象拉到岸上大秤上直接称'
          ],
          correctIdx: 1,
          explainDetail: '曹冲称象四步法：①赶象上船沿水面画线 ➔ ②赶象上岸 ➔ ③装石头直到船沉到画线处 ➔ ④称石头的重量，选 ①',
          animData: {
            type: 'cn_story_flow', flowTitle: '🐘 曹冲称象四步法',
            nodes: ['①赶象上船画线', '②赶象上岸下船', '③装石头至画线', '④分次称石头重量'],
            tip: '以船代秤、以石代象（等量代换），必须先赶象上船画出吃水线！', ans: '① 赶象上船画线 ➔ 赶象下船装石头',
            steps: [
              step('第一步：记录大象压船的下沉位置', '先把大象赶到船上，看船身下沉多少，沿着水面在船舷上画一条线。', '① 赶象上船画线'),
              step('第二步：用石头替换大象直到下沉到同一条线', '把大象赶上岸，往船上装石头，装到船下沉到画线的地方为止，再称石头！', '选 ①')
            ]
          }
        }
      ],
      readingPassage: {
        title: '果园里的丰收会',
        svg: SVG_SCENES.monkeyGlasses,
        paragraphs: [
          '① 金秋十月，阳光温暖地洒在碧绿的果园里。果树上挂满了成熟的果子，黄澄澄的鸭梨像一个个小葫芦，红彤彤的苹果像一盏盏喜庆的小灯笼，空气里到处飘着甜甜的果香。',
          '② 小动物们兴高采烈地来到果园摘果子。机灵的小猴子爬上左边的梨树枝头，伸长手臂摘下黄澄澄的大鸭梨；蓬松大尾巴的小松鼠蹲在右边的苹果树枝上，小心翼翼地摘下红苹果往下递。',
          '③ 力气最大的小熊站在树下的草地上，把大家摘下来的红苹果、黄鸭梨和金橘子分门别类地装进四个竹篮里。看着满满一篮篮丰收的果实，三个好朋友开心地笑弯了眉眼，懂得了“团结合作力量大”的道理。'
        ],
        questions: [
          {
            key: 'q13', num: 13, points: 4,
            title: '阅读理解（1）：自然段与比喻赏析',
            promptPrefix: '短文一共有（  ）个自然段。第①自然段中，作者把“红彤彤的苹果”比作了什么？（',
            promptSuffix: '）',
            choices: ['3 个自然段 ； 小葫芦', '3 个自然段 ； 喜庆的小灯笼', '2 个自然段 ； 红气球'],
            correctIdx: 2,
            explainDetail: '短文标有①②③共3个自然段；第①段写“黄澄澄的鸭梨像一个个小葫芦，红彤彤的苹果像一盏盏喜庆的小灯笼”，选 ②',
            animData: {
              type: 'cn_story_flow', flowTitle: '📖 阅读定位法：比喻配对',
              nodes: ['①共3个自然段', '🍐黄鸭梨 ➔ 像小葫芦', '🍎红苹果 ➔ 像小灯笼'],
              tip: '看清题目问的是“红彤彤的苹果”，回到第①段找到对应的喻体“小灯笼”！', ans: '② 3个自然段；喜庆的小灯笼',
              steps: [
                step('第一步：数自然段标号', '短文标有①、②、③，共 3 个自然段。', '共 3 个自然段'),
                step('第二步：找“红彤彤的苹果”后面的比喻', '“红彤彤的苹果像一盏盏喜庆的小灯笼”，选 ②！', '答案：②')
              ]
            }
          },
          {
            key: 'q14', num: 14, points: 4,
            title: '阅读理解（2）：图文角色动作对应',
            promptPrefix: '仔细观察左图并读第②自然段，爬上梨树摘鸭梨和蹲在苹果树枝上摘苹果的分别是谁？（',
            promptSuffix: '）',
            choices: ['小猴子 和 小松鼠', '小熊 和 小白兔', '小刺猬 和 小青蛙'],
            correctIdx: 1,
            explainDetail: '结合课本插图与第②段：“机灵的小猴子爬上左边的梨树枝头……蓬松大尾巴的小松鼠蹲在右边的苹果树枝上”，选 ①',
            animData: {
              type: 'cn_story_flow', flowTitle: '🐒🐿️ 果园分工对号入座',
              nodes: ['🐒小猴子：爬梨树摘鸭梨', '🐿️小松鼠：蹲树枝摘苹果', '🐻小熊：树下装满四个竹篮'],
              tip: '图文对照：树上左边是小猴，右边大尾巴是小松鼠，树下是小熊！', ans: '① 小猴子 和 小松鼠',
              steps: [
                step('第一步：观察插图中树上的两个小动物', '左边树枝上是小猴子，右边树枝上是小松鼠。', '小猴子 + 小松鼠'),
                step('第二步：核对第②段原文', '选 ①！', '答案：①')
              ]
            }
          },
          {
            key: 'q15', num: 15, points: 4,
            title: '阅读理解（3）：提取关键细节',
            promptPrefix: '根据第③自然段和插图，力气最大的小熊在树下负责做什么？（',
            promptSuffix: '）',
            choices: [
              '躺在草地上睡大觉',
              '把摘下来的果子分门别类地装进四个竹篮里',
              '把竹篮全都藏起来'
            ],
            correctIdx: 2,
            explainDetail: '第③段写：“力气最大的小熊站在树下的草地上，把大家摘下来的红苹果、黄鸭梨和金橘子分门别类地装进四个竹篮里。”选 ②',
            animData: {
              type: 'cn_story_flow', flowTitle: '🐻 小熊的任务',
              nodes: ['站在树下草地', '接住摘下的果实', '分门别类装进四个竹篮'],
              tip: '看图也能数出草地上整整齐齐放着 4 个装满果子的竹篮！', ans: '② 把摘下来的果子分门别类装进四个竹篮里',
              steps: [
                step('第一步：定位第③段第一句', '“把大家摘下来的红苹果、黄鸭梨和金橘子分门别类地装进四个竹篮里。”', '装进四个竹篮'),
                step('第二步：锁定答案', '选 ②！', '答案：②')
              ]
            }
          },
          {
            key: 'q16', num: 16, points: 4,
            title: '阅读理解（4）：短文主旨道理',
            promptPrefix: '这篇图文并茂的短文主要告诉了我们什么道理？（',
            promptSuffix: '）',
            choices: [
              '好朋友之间分工合作、团结互助，就能收获满满的快乐与成功',
              '摘果子只能靠小猴子一个人',
              '秋天果园里没有果子'
            ],
            correctIdx: 1,
            explainDetail: '短文最后一句点明中心：“懂得了‘团结合作力量大’的道理。”选 ①',
            animData: {
              type: 'cn_scroll', poemTitle: '《果园里的丰收会》中心主旨',
              verseTop: '小猴摘梨 · 松鼠递果 · 小熊装篮', verseBottom: '分工合作 · 团结力量大！',
              tip: '每个人发挥自己的长处（会爬树的摘果、力气大的装篮），就是团结合作！', ans: '① 分工合作、团结互助',
              steps: [
                step('第一步：读文末中心句', '“懂得了‘团结合作力量大’的道理。”', '团结合作力量大'),
                step('第二步：锁定答案', '选 ①！', '答案：①')
              ]
            }
          }
        ]
      },
      writingTask: {
        title: '看图写话：春游放风筝',
        svg: SVG_SCENES.kiteSpring,
        sceneDesc: '仔细观察左图：什么季节？天气怎样？谁和谁在哪里干什么？天上的风筝像什么？他们的心情如何？',
        wordBank: ['春暖花开', '万里无云', '碧绿的草地', '五颜六色', '欢呼雀跃', '越飞越高'],
        blanks: [
          {
            key: 'q17_time', label: '① 时间与天气', points: 3,
            prefix: '在一个（', suffix: '）的春天早晨，微风习习，柳条吐出嫩绿的新芽。',
            choices: ['春暖花开、阳光明媚', '大雪纷飞、寒风刺骨', '秋风习习、落叶飘飘'],
            correctIdx: 1
          },
          {
            key: 'q17_who', label: '② 地点与人物', points: 3,
            prefix: '小明和小红兴高采烈地来到（', suffix: '）放风筝。',
            choices: ['安静的图书馆里', '公园碧绿的草地上', '热闹的超市货架旁'],
            correctIdx: 2
          },
          {
            key: 'q17_do', label: '③ 动作与画面', points: 3,
            prefix: '小明一手拿着线轴，一手拉着风筝线迎风奔跑，美丽的燕子风筝（', suffix: '）。',
            choices: ['掉进水池里不见了', '乘着春风越飞越高，在蓝天白云间自由飞翔', '变成了厚厚的雪人'],
            correctIdx: 2
          },
          {
            key: 'q17_feel', label: '④ 心情与结尾', points: 3,
            prefix: '小红指着天空开心地欢呼起来，草地上回荡着他们（', suffix: '）！',
            choices: ['伤心的哭声', '银铃般欢快的笑声，今天真是快乐的一天呀', '焦急的叹气声'],
            correctIdx: 2
          }
        ],
        modelEssay: '在一个春暖花开、阳光明媚的春天早晨，微风习习，柳条吐出嫩绿的新芽。小明和小红兴高采烈地来到公园碧绿的草地上放风筝。小明一手拿着线轴，一手拉着风筝线迎风奔跑，美丽的燕子风筝乘着春风越飞越高，在蓝天白云间自由飞翔。小红指着天空开心地欢呼起来，草地上回荡着他们银铃般欢快的笑声，今天真是快乐的一天呀！',
        explainDetail: '看图写话四要素：①春天早晨（春暖花开）+ ②公园草地上（小明和小红）+ ③迎风奔跑放风筝（越飞越高）+ ④欢快笑声（快乐的一天）',
        animData: {
          type: 'cn_story_flow', flowTitle: '✍️ 看图写话满分四步法：春游放风筝',
          nodes: ['⏰时间：春暖花开的早晨', '🏞️地点：公园碧绿草地', '🪁经过：迎风奔跑放风筝', '😊心情：欢快的笑声'],
          tip: '先写时间地点人物，再写放风筝的动作和风筝飞上天的画面，最后加上愉快的心情！', ans: '满分范文已解锁',
          steps: [
            step('第一步：观察环境定时间与地点', '图中有嫩绿的柳条、盛开的春花和蓝天白云，是“春暖花开”的春天，“公园碧绿的草地上”。', '时间+地点+人物'),
            step('第二步：描写核心动作与风筝画面', '男孩拉线奔跑，燕子风筝“乘着春风越飞越高”，女孩手指天空欢呼。', '动作+景物细节'),
            step('第三步：点明愉快心情收尾', '草地上回荡着欢快的笑声，首尾呼应！', '心情结尾升华')
          ]
        }
      }
    },

    // =========================================================================
    // 语文B卷：统编版二年级上册期末综合真题卷（二）
    // =========================================================================
    {
      id: 'cn_paper_b',
      letter: '语文B',
      label: '语文B卷 · 二上期末真题（二）',
      title: '统编版二年级语文上册期末全真模拟测试卷（B卷）',
      subtitle: '涵盖：多音字号/好、戴/带辨析、音序查字法、动词搭配、把字句改被字句、《小白兔的森林花店》阅读与溪边垂钓写话',
      sec1Questions: [
        {
          key: 'q1', num: 1, points: 6,
          title: '多音字“好 / 号”读音辨析',
          badge: '字音闯关',
          visualHtml: `<div class="inline-flex flex-wrap items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#fffbeb] border border-amber-300/90 shadow-2xs">
          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">hào 好客</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">好</span>
            </div>
          </div>

          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">háo 寒号鸟</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">号</span>
            </div>
          </div>
        <span class="ml-2 pl-2.5 border-l border-amber-300 text-xs font-bold text-amber-950">多音字：据义定音</span></div>`,
          promptPrefix: '在《葡萄沟》“热情好客的维吾尔族老乡”和《寒号鸟》“寒号鸟冻得直叫”中，“好”和“号”的正确读音依次是（',
          promptSuffix: '）。',
          choices: ['hǎo 、 hào', 'hào 、 háo', 'hào 、 hào'],
          correctIdx: 2,
          explainDetail: '“好客”表示喜爱客人，读四声 hào；“寒号鸟”的“号”表示拖长声音大叫，读二声 háo，选 ②',
          animData: {
            type: 'cn_pinyin_tree', charText: '好 / 号', branchA: 'hào（好客、好奇） / háo（寒号鸟、哀号）', branchB: 'hǎo（好人） / hào（铜号、口号）',
            tip: '喜欢交朋友欢迎客人叫“好（hào）客”；寒冬里哭叫的鸟叫“寒号（háo）鸟”！', ans: '② hào 、 háo',
            steps: [
              step('第一步：辨析“热情好客”', '“好”表示喜爱时读四声 hào（好客、好奇、爱好）。', '好（hào）客'),
              step('第二步：辨析“寒号鸟”', '表示大声哭叫、呼啸时读二声 háo！', '寒号（háo）鸟（选 ②）')
            ]
          }
        },
        {
          key: 'q2', num: 2, points: 6,
          title: '“包”字族与易混字辨析',
          badge: '偏旁字族',
          visualHtml: `<div class="inline-flex flex-wrap items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#fffbeb] border border-amber-300/90 shadow-2xs">
          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">dài 红领巾</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">戴</span>
            </div>
          </div>

          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">dài 带领</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">带</span>
            </div>
          </div>
        <span class="ml-2 pl-2.5 border-l border-amber-300 text-xs font-bold text-amber-950">近义形近字辨析</span></div>`,
          promptPrefix: '选字填空：“早上上学，我（  ）上鲜艳的红领巾，妈妈（  ）着我去坐公交车。”括号里依次应填（',
          promptSuffix: '）。',
          choices: ['带 、 戴', '戴 、 带', '代 、 带'],
          correctIdx: 2,
          explainDetail: '穿戴在头、颈、胸前的物品用“戴”（戴红领巾、戴帽子）；随身拿着或引导率领用“带”（带着我），选 ②',
          animData: {
            type: 'cn_char_split', radical: '戴 (穿戴)', stem: '带 (携带/带领)', compound: '戴红领巾 / 带着我',
            rule: '搁在头脸脖胸用“戴”（戴红领巾、戴眼镜），拿在手里或领路用“带”（带雨伞、带领）！', ans: '② 戴 、 带',
            steps: [
              step('第一步：区分“戴”与“带”', '红领巾系在脖子上，属于穿戴用品，用“戴”。', '戴红领巾'),
              step('第二步：看后半句“妈妈（ ）着我”', '表示领着、率领，用“带”！', '戴 、 带（选 ②）')
            ]
          }
        },
        {
          key: 'q3', num: 3, points: 6,
          title: '音序查字法规则',
          badge: '查字典必考',
          visualHtml: `<div class="inline-flex flex-wrap items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#fffbeb] border border-amber-300/90 shadow-2xs">
          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">C · chuan</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">船</span>
            </div>
          </div>
        <span class="ml-2 pl-2.5 border-l border-amber-300 text-xs font-bold text-amber-950">音序查字法：先查大写字母 C，再查音节 chuan</span></div>`,
          promptPrefix: '用“音序查字法”查“船（chuán）”字，应先查大写字母（  ），再查音节（  ）。正确的是（',
          promptSuffix: '）。',
          choices: ['C  ， chuan', 'CH ， chuán', 'c  ， chuan'],
          correctIdx: 1,
          explainDetail: '音序查字法口诀：音序只取音节第一个字母的大写（C），查音节时不标声调（chuan），选 ①',
          animData: {
            type: 'cn_char_split', radical: '音序：C（大写首字母）', stem: '音节：chuan（不带调）', compound: '船 (chuán)',
            rule: '音序 = 第一个大写字母（C）；音节 = 不带声调的拼音（chuan）！', ans: '① C ， chuan',
            steps: [
              step('第一步：找音序（第一个字母大写）', 'chuán 的第一个字母是 c，大写是 C（不能写成 CH 或小写 c）。', '音序：C'),
              step('第二步：写音节（去掉声调）', '音节写作 chuan，选 ①！', '答案：① C ， chuan')
            ]
          }
        },
        {
          key: 'q4', num: 4, points: 6,
          title: '语文园地：动宾短语搭配',
          badge: '词语搭配',
          promptPrefix: '下面“动词 + 名词”搭配完全正确的一组课外活动词语是（',
          promptSuffix: '）。',
          choices: ['拉钢琴 、 跳京戏 、 拍秋千', '弹钢琴 、 唱京戏 、 荡秋千', '吹钢琴 、 练京戏 、 滚秋千'],
          correctIdx: 2,
          explainDetail: '二年级上册语文园地必背词组：弹钢琴、练舞蹈、唱京戏、画图画、捏泥人、下围棋、滚铁环、荡秋千、滑滑梯，选 ②',
          animData: {
            type: 'cn_grammar_train', leftPart: '🎹 弹钢琴 · 🎭 唱京戏', midWord: '园地必背词组', rightPart: '🎠 荡秋千 · ♟️ 下围棋',
            tip: '弹钢琴、唱京戏、荡秋千、滚铁环、捏泥人，每个动作都要和活动特点匹配！', ans: '② 弹钢琴 、 唱京戏 、 荡秋千',
            steps: [
              step('第一步：逐个核对乐器与戏曲动作', '手指按键叫“弹钢琴”，开口演唱叫“唱京戏”。', '弹钢琴 、 唱京戏'),
              step('第二步：核对游乐场动作', '坐在秋千上摆动叫“荡秋千”，选 ②！', '选 ②')
            ]
          }
        }
      ],
      sec2Questions: [
        {
          key: 'q5', num: 5, points: 7,
          title: '寓言故事道理：《坐井观天》',
          badge: '课文寓言',
          promptPrefix: '《坐井观天》中青蛙坐在井底认为“天不过井口那么大”，这个成语故事用来批评（',
          promptSuffix: '）的人。',
          choices: ['看问题全面、见多识广', '目光短浅、眼界狭隘，只看见眼前一小块地方', '勤劳刻苦、不怕困难'],
          correctIdx: 2,
          explainDetail: '“坐井观天”比喻眼界狭小、所见有限、目光短浅，选 ②',
          animData: {
            type: 'cn_scroll', poemTitle: '寓言精讲 · 坐井观天', verseTop: '🐸 青蛙：天不过井口那么大！', verseBottom: '🐦 小鸟：天无边无际，大得很哪！',
            tip: '认识事物要站得高、看得全面，不能像井底之蛙那样目光短浅！', ans: '② 目光短浅、眼界狭隘',
            steps: [
              step('第一步：对比青蛙和小鸟的位置', '青蛙坐在井底，被高高的井壁挡住了视线。', '井底之蛙'),
              step('第二步：提炼寓意', '比喻目光短浅、眼界狭隘，选 ②！', '选 ②')
            ]
          }
        },
        {
          key: 'q6', num: 6, points: 7,
          title: 'ABAC与AABB四字词语仿写',
          badge: '词语结构',
          promptPrefix: '照样子选一选：与“无边无际、自言自语”结构完全相同（ABAC式）的一个词语是（',
          promptSuffix: '）。',
          choices: ['干干净净（AABB）', '各种各样（ABAC）', '金光闪闪（ABCC）'],
          correctIdx: 2,
          explainDetail: '“无边无际、自言自语”第1字和第3字相同，属于ABAC式；“各种各样”（第1、3字都是“各”）也是ABAC式，选 ②',
          animData: {
            type: 'cn_grammar_train', leftPart: '无边无际 · 自言自语', midWord: 'ABAC 式词语', rightPart: '各种各样 · 自由自在',
            tip: '看清第1个字和第3个字是否相同：无_无_、自_自_、各_各_！', ans: '② 各种各样（ABAC）',
            steps: [
              step('第一步：分析题干词语规律', '“无边无际”第1、3字都是“无”，“自言自语”第1、3字都是“自”，属于 ABAC 式。', '规律：A B A C'),
              step('第二步：找出符合 ABAC 的选项', '“各种各样”第1、3字都是“各”，完全匹配！', '选 ② 各种各样')
            ]
          }
        },
        {
          key: 'q7', num: 7, points: 7,
          title: '把字句改被字句',
          badge: '句式转换',
          promptPrefix: '把“茂密的枝叶把火红的太阳挡住了”改为“被字句”，正确的一项是（',
          promptSuffix: '）。',
          choices: [
            '茂密的枝叶被火红的太阳挡住了。',
            '火红的太阳被茂密的枝叶挡住了。',
            '把火红的太阳被茂密的枝叶挡住了。'
          ],
          correctIdx: 2,
          explainDetail: '“把”字前后的“茂密的枝叶”和“火红的太阳”互换位置，“把”改成“被”：火红的太阳被茂密的枝叶挡住了，选 ②',
          animData: {
            type: 'cn_grammar_train', leftPart: '茂密的枝叶 把 太阳 挡住了', midWord: '前后主角互换', rightPart: '火红的太阳 被 茂密的枝叶 挡住了',
            tip: '把字句变被字句：谁被挡住了？火红的太阳被茂密的枝叶挡住了！', ans: '② 火红的太阳被茂密的枝叶挡住了。',
            steps: [
              step('第一步：找出施动者和受动者', '主动挡住的是“茂密的枝叶”，被挡住的是“火红的太阳”。', '太阳 ➔ 被挡住'),
              step('第二步：交换位置并把“把”换“被”', '火红的太阳被茂密的枝叶挡住了，选 ②！', '选 ②')
            ]
          }
        },
        {
          key: 'q8', num: 8, points: 7,
          title: '真假比喻句辨析',
          badge: '修辞手法',
          promptPrefix: '下面三个带“像”字的句子中，属于真正的【比喻句】的是（',
          promptSuffix: '）。',
          choices: [
            '梧桐树叶像手掌，松鼠尾巴像降落伞。',
            '小丽长得真像她的妈妈。',
            '天阴沉沉的，好像要下雨了。'
          ],
          correctIdx: 1,
          explainDetail: '把“梧桐树叶”比作“手掌”、把“松鼠尾巴”比作“降落伞”是不同类事物打比方，属于比喻句；②是长相比较，③是猜测，选 ①',
          animData: {
            type: 'cn_grammar_train', leftPart: '梧桐树叶（本体）', midWord: '像（比喻词）', rightPart: '手掌（喻体）',
            tip: '真比喻必须满足：两种不同类的事物 + 有相似特点！像妈妈（同类比较）、好像要下雨（推测）不是比喻。', ans: '① 梧桐树叶像手掌，松鼠尾巴像降落伞。',
            steps: [
              step('第一步：排除长相比较与天气猜测', '②小丽和妈妈都是人（同类比较）；③好像要下雨是猜测。', '排除 ②、③'),
              step('第二步：确认本体与喻体', '把梧桐叶比作手掌、松鼠尾巴比作降落伞，生动形象，选 ①！', '选 ①')
            ]
          }
        }
      ],
      sec3Questions: [
        {
          key: 'q9', num: 9, points: 5,
          title: '古诗名句背诵：《望庐山瀑布》',
          badge: '必背古诗',
          visualHtml: `<div class="inline-flex items-center gap-3 p-2 pr-4 rounded-xl bg-[#fffbeb] border border-amber-300 shadow-2xs">
      <img src="assets/poetry/wang_lu_shan_pu_bu.webp" alt="唐·李白《望庐山瀑布》" class="w-20 h-12 rounded-lg object-cover border border-amber-200 shrink-0" loading="lazy" />
      <div class="text-xs">
        <div class="font-black text-amber-950">唐·李白《望庐山瀑布》</div>
        <div class="font-bold text-slate-700 mt-0.5">日照香炉生紫烟，遥看瀑布挂前川。</div>
      </div>
    </div>`,
          promptPrefix: '李白用夸张和比喻写出庐山瀑布从高处飞泻而下的千古名句是：“飞流直下三千尺，（',
          promptSuffix: '）。”',
          choices: ['更上一层楼', '疑是银河落九天', '手可摘星辰'],
          correctIdx: 2,
          explainDetail: '《望庐山瀑布》后两句是“飞流直下三千尺，疑是银河落九天”，把瀑布比作天上落下的银河，选 ②',
          animData: {
            type: 'cn_scroll', poemId: 'wang_lu_shan_pu_bu', poemTitle: '唐·李白《望庐山瀑布》',
            verseTop: '日照香炉生紫烟，遥看瀑布挂前川。', verseBottom: '飞流直下三千尺，疑是银河落九天。',
            tip: '“三千尺”是夸张，“银河落九天”是奇妙的比喻！', ans: '② 疑是银河落九天',
            steps: [
              step('第一步：背诵《望庐山瀑布》全诗', '日照香炉生紫烟，遥看瀑布挂前川。飞流直下三千尺，疑是银河落九天。', '飞流直下三千尺'),
              step('第二步：锁定下句', '疑是银河落九天，选 ②！', '选 ②')
            ]
          }
        },
        {
          key: 'q10', num: 10, points: 5,
          title: '古诗字词精解：《夜宿山寺》',
          badge: '古诗字义',
          promptPrefix: '李白《夜宿山寺》“危楼高百尺，手可摘星辰”中，“危楼”的意思是（',
          promptSuffix: '）。',
          choices: ['快要倒塌的危险楼房', '高高的楼（“危”是高的意思）', '很小很矮的阁楼'],
          correctIdx: 2,
          explainDetail: '古诗中“危楼”的“危”意思是“高”，“危楼”就是高耸入云的楼，千万别理解成危险的楼，选 ②',
          animData: {
            type: 'cn_scroll', poemId: 'ye_su_shan_si', poemTitle: '唐·李白《夜宿山寺》',
            verseTop: '危楼高百尺，手可摘星辰。', verseBottom: '不敢高声语，恐惊天上人。',
            tip: '重点必考注释：“危”在古诗里指“高”，危楼 = 高楼！', ans: '② 高高的楼',
            steps: [
              step('第一步：结合下句“高百尺，手可摘星辰”理解', '伸手好像能摘到星星，说明这座山顶寺庙的楼非常高！', '高百尺 ➔ 楼极高'),
              step('第二步：牢记“危 = 高”', '危楼就是高高的楼，选 ②！', '选 ②')
            ]
          }
        },
        {
          key: 'q11', num: 11, points: 5,
          title: '课文梳理：《植物妈妈有办法》',
          badge: '课文科普',
          promptPrefix: '在《植物妈妈有办法》中，蒲公英、苍耳、豌豆三位植物妈妈分别靠什么传播种子？（',
          promptSuffix: '）',
          choices: [
            '蒲公英靠风吹 、 苍耳靠挂住动物皮毛 、 豌豆靠太阳晒豆荚炸开',
            '蒲公英靠水流 、 苍耳靠风吹 、 豌豆靠小鸟吃',
            '三种植物全部靠微风吹散'
          ],
          correctIdx: 1,
          explainDetail: '蒲公英有降落伞靠风吹，苍耳穿带刺铠甲挂住动物皮毛，豌豆在太阳底下晒裂豆荚蹦跳出去，选 ①',
          animData: {
            type: 'cn_story_flow', flowTitle: '🌱 植物妈妈传播种子妙招',
            nodes: ['🌬️蒲公英：风吹降落伞', '🐶苍耳：刺挂动物皮毛', '☀️豌豆：太阳晒炸开'],
            tip: '三种植物对应三种完全不同的传播方式，记准各自法宝！', ans: '① 蒲公英靠风吹、苍耳挂皮毛、豌豆太阳晒',
            steps: [
              step('第一步：核对蒲公英与苍耳', '蒲公英准备了降落伞，轻轻一吹就出发；苍耳穿上带刺的铠甲，挂住动物的皮毛。', '风吹 + 挂皮毛'),
              step('第二步：核对豌豆妈妈', '豌豆躺在阳光底下，啪的一声豆荚炸开，孩子们蹦着跳着离开妈妈，选 ①！', '选 ①')
            ]
          }
        },
        {
          key: 'q12', num: 12, points: 5,
          title: '日积月累：立志与读书名言',
          badge: '园地日积月累',
          promptPrefix: '《后汉书》中告诉我们“只要有远大志向，事情终究会成功”的名句是（',
          promptSuffix: '）。',
          choices: ['有志者事竟成。', '己所不欲，勿施于人。', '不以规矩，不能成方圆。'],
          correctIdx: 1,
          explainDetail: '“有志者事竟成”（《后汉书》）意思是有志向的人做事一定会成功，选 ①',
          animData: {
            type: 'cn_scroll', poemTitle: '日积月累 · 立志名言',
            verseTop: '有志者事竟成。——《后汉书》', verseBottom: '志当存高远。——《诫外生书》',
            tip: '“竟”是终于、最终的意思；有志气的人事情终究能成功！', ans: '① 有志者事竟成。',
            steps: [
              step('第一步：抓住题干关键词“有远大志向、事情成功”', '“志”对应志向，“成”对应成功。', '有志 ➔ 事竟成'),
              step('第二步：匹配名句', '有志者事竟成，选 ①！', '选 ①')
            ]
          }
        }
      ],
      readingPassage: {
        title: '小白兔的森林花店',
        svg: SVG_SCENES.hedgehogApples,
        paragraphs: [
          '① 春天到了，森林里阳光明媚，洁白的云朵像棉花糖一样飘在蓝天上。红白条纹屋顶的“森林花店”开张啦，木屋门前摆满了五颜六色的鲜花。',
          '② 你瞧，木箱和铁皮花桶里盛开着火红的玫瑰花、洁白的小雏菊、粉嫩的玉兰花，还有金灿灿的向日葵，引来美丽的紫蝴蝶在花丛间翩翩起舞，草地上还有几只可爱的七星瓢虫在散步呢！',
          '③ 长耳朵小白兔穿着蓝背心，挎着装满新鲜胡萝卜的小竹篮，蹦蹦跳跳地来到花店前。它笑眯眯地挑了一束最香的鲜花，准备送给生病住院的山羊公公，祝山羊公公早日康复！'
        ],
        questions: [
          {
            key: 'q13', num: 13, points: 4,
            title: '阅读理解（1）：比喻句赏析',
            promptPrefix: '第①自然段中“洁白的云朵像棉花糖一样飘在蓝天上”，这里把天上的“白云”比作了什么？（',
            promptSuffix: '）',
            choices: ['棉花糖', '白蘑菇', '小绵羊'],
            correctIdx: 1,
            explainDetail: '原文第一句：“洁白的云朵像棉花糖一样飘在蓝天上”，把白云比作棉花糖，选 ①',
            animData: {
              type: 'cn_grammar_train', leftPart: '洁白的云朵（本体）', midWord: '像', rightPart: '棉花糖（喻体）',
              tip: '直接从第①段第一句找“像”字后面的词语即可！', ans: '① 棉花糖',
              steps: [
                step('第一步：定位第①自然段比喻句', '“洁白的云朵像棉花糖一样飘在蓝天上。”', '像棉花糖'),
                step('第二步：锁定答案', '选 ① 棉花糖！', '答案：①')
              ]
            }
          },
          {
            key: 'q14', num: 14, points: 4,
            title: '阅读理解（2）：图文景物提取',
            promptPrefix: '仔细观察插图并读第②自然段，森林花店门前盛开的鲜花吸引来了谁在花间翩翩起舞？（',
            promptSuffix: '）',
            choices: ['凶猛的大老虎', '美丽的紫蝴蝶', '大海里的小鲸鱼'],
            correctIdx: 2,
            explainDetail: '第②段写：“引来美丽的紫蝴蝶在花丛间翩翩起舞”，插图中也能看到两只紫蝴蝶在飞舞，选 ②',
            animData: {
              type: 'cn_story_flow', flowTitle: '🦋 森林花店的热闹景象',
              nodes: ['🌹红玫瑰与白雏菊盛开', '🌻金黄向日葵迎着阳光', '🦋紫蝴蝶在花丛间起舞'],
              tip: '图文结合：看看花店屋檐旁飞舞的紫色小蝴蝶！', ans: '② 美丽的紫蝴蝶',
              steps: [
                step('第一步：定位第②段后半句', '“引来美丽的紫蝴蝶在花丛间翩翩起舞。”', '紫蝴蝶'),
                step('第二步：锁定答案', '选 ②！', '答案：②')
              ]
            }
          },
          {
            key: 'q15', num: 15, points: 4,
            title: '阅读理解（3）：观察插图细节',
            promptPrefix: '根据第③自然段和插图，小白兔手里的竹篮里装着什么？它来花店想买什么？（',
            promptSuffix: '）',
            choices: [
              '竹篮里装着胡萝卜 ； 来买一束鲜花送给山羊公公',
              '竹篮里装着小鱼 ； 来买玩具汽车',
              '竹篮里什么也没有'
            ],
            correctIdx: 1,
            explainDetail: '第③段写：“挎着装满新鲜胡萝卜的小竹篮……挑了一束最香的鲜花，准备送给生病住院的山羊公公”，选 ①',
            animData: {
              type: 'cn_story_flow', flowTitle: '🐰 小白兔的爱心行动',
              nodes: ['🥕挎着装满胡萝卜的竹篮', '💐来到花店挑选最香的鲜花', '🐐送给生病的山羊公公'],
              tip: '看图中小白兔竹篮里橙红色的胡萝卜，再结合第③段文字！', ans: '① 竹篮装胡萝卜；买鲜花送山羊公公',
              steps: [
                step('第一步：核对竹篮里的物品与买花目的', '装满胡萝卜的小竹篮 + 挑鲜花送给山羊公公。', '胡萝卜 + 买鲜花'),
                step('第二步：锁定答案', '选 ①！', '答案：①')
              ]
            }
          },
          {
            key: 'q16', num: 16, points: 4,
            title: '阅读理解（4）：人物品质评价',
            promptPrefix: '从短文中可以看出，这是一只怎样的小白兔？（',
            promptSuffix: '）',
            choices: ['懂礼貌、关心长辈、充满爱心', '自私自利、不讲卫生', '粗心大意'],
            correctIdx: 1,
            explainDetail: '小白兔特意挑选鲜花去看望生病住院的山羊公公，说明它非常关心长辈、充满爱心，选 ①',
            animData: {
              type: 'cn_scroll', poemTitle: '人物品质 · 爱心小白兔',
              verseTop: '挑选鲜花探望生病的山羊公公', verseBottom: '尊老爱幼 · 充满爱心',
              tip: '主动关心生病的长辈，是尊敬长辈、富有爱心的表现！', ans: '① 懂礼貌、关心长辈、充满爱心',
              steps: [
                step('第一步：分析小白兔买花的原因', '为了探望并祝福生病的山羊公公早日康复。', '关心长辈'),
                step('第二步：锁定答案', '选 ①！', '答案：①')
              ]
            }
          }
        ]
      },
      writingTask: {
        title: '看图写话：溪边学钓鱼',
        svg: SVG_SCENES.busSeat,
        sceneDesc: '仔细观察左图：柳绿花红的池塘边，小娃娃坐在青石上做什么？水里有什么？远处戴斗笠的老爷爷来问路，小娃娃为什么要向他摆手不出声？',
        wordBank: ['垂柳依依', '清澈见底', '专心致志', '竹鱼篓', '连连摆手', '怕惊鱼儿'],
        blanks: [
          {
            key: 'q17_time', label: '① 环境与垂钓位置', points: 3,
            prefix: '一个阳光明媚的上午，池塘边垂柳依依、荷花盛开。小娃娃带着竹鱼篓，侧坐在（', suffix: '）专心致志地学钓鱼。',
            choices: ['岸边长满青苔的大石头上', '热闹的马路中间', '高高的房顶上'],
            correctIdx: 1
          },
          {
            key: 'q17_who', label: '② 池中鱼儿的动态', points: 3,
            prefix: '池水清澈见底，几条欢快的小红鱼正（', suffix: '），小娃娃紧紧握着竹钓竿，眼睛一眨不眨地盯着水面。',
            choices: ['摇着尾巴游向水中的红白浮漂，眼看就要咬钩了', '飞到了高高的柳树枝头上', '在岸上晒太阳'],
            correctIdx: 1
          },
          {
            key: 'q17_do', label: '③ 老爷爷问路与机智摆手', points: 3,
            prefix: '就在这时，远处小路上走来一位戴斗笠、拄拐杖的老爷爷向他大声问路。小娃娃（', suffix: '），示意老爷爷千万别大声说话。',
            choices: ['吓得把钓竿扔进水里跑掉了', '急忙转过头，高高举起左手远远地向老爷爷摆手', '大声喊叫着跑过去'],
            correctIdx: 2
          },
          {
            key: 'q17_feel', label: '④ 原因揭示与童趣结尾', points: 3,
            prefix: '原来，聪明可爱的小娃娃是（', suffix: '）！这幅《小儿垂钓》的画面真有趣呀！',
            choices: ['生怕说话声惊跑了水里快要上钩的鱼儿', '不知道老爷爷在哪里', '想把小鱼全部赶走'],
            correctIdx: 1
          }
        ],
        modelEssay: '一个阳光明媚的上午，池塘边垂柳依依、荷花盛开。小娃娃带着竹鱼篓，侧坐在岸边长满青苔的大石头上专心致志地学钓鱼。池水清澈见底，几条欢快的小红鱼正摇着尾巴游向水中的红白浮漂，眼看就要咬钩了，小娃娃紧紧握着竹钓竿，眼睛一眨不眨地盯着水面。就在这时，远处小路上走来一位戴斗笠、拄拐杖的老爷爷向他大声问路。小娃娃急忙转过头，高高举起左手远远地向老爷爷摆手，示意老爷爷千万别大声说话。原来，聪明可爱的小娃娃是生怕说话声惊跑了水里快要上钩的鱼儿！这幅《小儿垂钓》的画面真有趣呀！',
        explainDetail: '看图写话四步：①柳荫池塘边坐青石学钓鱼 + ②小红鱼游向浮漂快咬钩 + ③远处老爷爷问路小娃忙摆手 + ④生怕说话声惊跑鱼儿！',
        animData: {
          type: 'cn_story_flow', flowTitle: '✍️ 看图写话满分四步法：溪边学钓鱼',
          nodes: ['🌿环境：柳荫荷塘坐石垂钓', '🐟细节：红鱼游近浮漂微动', '👋动作：老翁问路急忙摆手', '💡原因：怕得鱼惊不应人'],
          tip: '把画中近景（小娃钓鱼、竹篓、水中红鱼）和远景（老翁问路、小娃抬手示意）连起来写，故事既完整又生动！', ans: '满分范文已解锁',
          steps: [
            step('第一步：观察近景环境与人物动作', '柳树下小娃娃侧坐青石握竿钓鱼，身旁放着竹篓，水里红鱼游近浮漂。', '近景：专心垂钓'),
            step('第二步：观察远景人物互动', '远处戴斗笠的老爷爷拄杖问路，小娃娃抬起左手远远摆手。', '远景：摆手示意'),
            step('第三步：点明摆手不出声的原因', '生怕说话声吓跑快要咬钩的小鱼！', '童趣收尾')
          ]
        }
      }
    },

    // =========================================================================
    // 语文C卷：统编版二年级下册名校期末真题卷（一）
    // =========================================================================
    {
      id: 'cn_paper_c',
      letter: '语文C',
      label: '语文C卷 · 二下名校期末（一）',
      title: '统编版二年级语文下册名校期末全真测试卷（C卷）',
      subtitle: '涵盖：多音字盛、偏旁表意、亡羊补牢、比喻拟人仿写、《村居》《咏柳》、《春江柳岸的鸟鸣画卷》阅读与春种秋收写话',
      sec1Questions: [
        {
          key: 'q1', num: 1, points: 6,
          title: '多音字“盛 / 重”读音辨析',
          badge: '字音闯关',
          visualHtml: `<div class="inline-flex flex-wrap items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#fffbeb] border border-amber-300/90 shadow-2xs">
          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">chéng 盛饭</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">盛</span>
            </div>
          </div>

          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">shèng 盛开</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">盛</span>
            </div>
          </div>
        <span class="ml-2 pl-2.5 border-l border-amber-300 text-xs font-bold text-amber-950">多音字：动作与状态</span></div>`,
          promptPrefix: '在“妈妈给我盛了一碗香喷喷的米饭，窗外的桃花正盛开”这句话中，两个“盛”字的读音依次是（',
          promptSuffix: '）。',
          choices: ['shèng 、 chéng', 'chéng 、 shèng', 'chéng 、 chéng'],
          correctIdx: 2,
          explainDetail: '把饭装进碗里（动作）读二声 chéng（盛饭）；花朵繁茂开放读四声 shèng（盛开、茂盛），选 ②',
          animData: {
            type: 'cn_pinyin_tree', charText: '盛', branchA: 'chéng（盛饭、盛汤、盛满）', branchB: 'shèng（盛开、茂盛、丰盛）',
            tip: '用勺子把饭菜装碗里读二声 chéng；花开得旺、场面热闹读四声 shèng！', ans: '② chéng 、 shèng',
            steps: [
              step('第一步：看第一个“盛了一碗米饭”', '表示装饭的动作，读二声 chéng。', '盛（chéng）饭'),
              step('第二步：看第二个“桃花正盛开”', '表示花朵繁茂绽放，读四声 shèng，选 ②！', '盛（shèng）开（选 ②）')
            ]
          }
        },
        {
          key: 'q2', num: 2, points: 6,
          title: '偏旁部首表意规律（语文园地必考）',
          badge: '汉字奥秘',
          visualHtml: `<div class="inline-flex flex-wrap items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#fffbeb] border border-amber-300/90 shadow-2xs">
          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">cái</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">财</span>
            </div>
          </div>

          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">zhuàn</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">赚</span>
            </div>
          </div>

          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">gòu</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">购</span>
            </div>
          </div>
        <span class="ml-2 pl-2.5 border-l border-amber-300 text-xs font-bold text-amber-950">《“贝”的故事》：贝字旁与钱财有关</span></div>`,
          promptPrefix: '二年级下册《“贝”的故事》告诉我们，用“贝”作偏旁的字（如：财、赚、赔、购、贫），大多与什么有关？（',
          promptSuffix: '）',
          choices: ['钱财、商品交易', '海里的鱼虾', '天气冷暖'],
          correctIdx: 1,
          explainDetail: '古人曾把贝壳当作钱币使用，所以带“贝”字旁的字大多与钱财、买卖交易有关，选 ①',
          animData: {
            type: 'cn_char_split', radical: '贝（古人作钱币）', stem: '财 / 赚 / 赔 / 购', compound: '与钱财有关',
            rule: '古人把贝壳当钱币，所以“贝”字旁的字（财、购、赚、赔、货）大多与钱财有关！', ans: '① 钱财、商品交易',
            steps: [
              step('第一步：回顾课文《“贝”的故事》', '古时候人们觉得贝壳很漂亮、很珍贵，把贝壳当作钱币。', '贝壳 = 古代钱币'),
              step('第二步：推导偏旁含义', '用“贝”作偏旁的字大多与钱财有关，选 ①！', '选 ①')
            ]
          }
        },
        {
          key: 'q3', num: 3, points: 6,
          title: '部首查字法：全包围结构与特殊字',
          badge: '查字典必考',
          promptPrefix: '用“部首查字法”查“团、圆、围、国”这几个全包围结构的字，都应该先查部首（',
          promptSuffix: '）。',
          choices: ['“口”（小口字旁）', '“囗”（大口框，3画）', '里面的“才、员、韦、玉”'],
          correctIdx: 2,
          explainDetail: '全包围结构的字（团、圆、围、国、园）查字典时，部首都是外面的大口框“囗”（读 wéi，3画），选 ②',
          animData: {
            type: 'cn_char_split', radical: '囗（大口框，3画）', stem: '团 / 圆 / 围 / 国', compound: '全包围查外框',
            rule: '全包围结构汉字查部首口诀：查外不查内，统一先查大口框“囗”！', ans: '② “囗”（大口框，3画）',
            steps: [
              step('第一步：区分“口”与大口框“囗”', '把整个字包在里面的方框叫“大口框（囗）”，不是小口字旁。', '大口框：囗'),
              step('第二步：记住全包围查外框法则', '团、圆、围、国都先查“囗”部，选 ②！', '选 ②')
            ]
          }
        },
        {
          key: 'q4', num: 4, points: 6,
          title: '二下《中国美食》烹调方法与偏旁',
          badge: '识字专练',
          visualHtml: `<div class="inline-flex flex-wrap items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#fffbeb] border border-amber-300/90 shadow-2xs">
          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">kǎo 火旁</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">烤</span>
            </div>
          </div>

          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">zhēng 四点底</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">蒸</span>
            </div>
          </div>

          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">zhǔ 四点底</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">煮</span>
            </div>
          </div>
        <span class="ml-2 pl-2.5 border-l border-amber-300 text-xs font-bold text-amber-950">《中国美食》偏旁表意</span></div>`,
          promptPrefix: '在《中国美食》一课中，“炒、烤、烧”带“火字旁”，“煎、蒸、煮”带“四点底（灬）”，这些字的意思都与（',
          promptSuffix: '）有关。',
          choices: ['冰冷的河水', '火、加热烹调', '树木花草'],
          correctIdx: 2,
          explainDetail: '“火字旁（火）”和“四点底（灬）”都是由火演变而来的，带这两个偏旁的字大多与火、加热烹调有关，选 ②',
          animData: {
            type: 'cn_char_split', radical: '火 / 灬（四点底）', stem: '炒烤烧 / 煎蒸煮', compound: '都与“火”有关',
            rule: '四点底“灬”是“火”字在汉字底部的变形，所以“煎、蒸、煮、熟”都和火与加热有关！', ans: '② 火、加热烹调',
            steps: [
              step('第一步：认识“四点底（灬）”的来历', '汉字底部的四个点“灬”其实就是熊熊燃烧的火苗变形而来的！', '灬 = 火的变形'),
              step('第二步：总结共同点', '火字旁和四点底都与火、加热烹调有关，选 ②！', '选 ②')
            ]
          }
        }
      ],
      sec2Questions: [
        {
          key: 'q5', num: 5, points: 7,
          title: '二下《寓言二则》：《亡羊补牢》与《揠苗助长》',
          badge: '成语寓言',
          promptPrefix: '在《亡羊补牢》这个成语中，“亡”和“牢”的意思分别是（',
          promptSuffix: '）。',
          choices: ['死亡 、 坚固', '丢失 、 关牲口的圈（羊圈）', '逃跑 、 牢房'],
          correctIdx: 2,
          explainDetail: '“亡羊补牢”中“亡”是丢失，“牢”是关牲口的圈（羊圈），意思是丢了羊后及时修补羊圈还不算晚，选 ②',
          animData: {
            type: 'cn_scroll', poemTitle: '成语精解 · 亡羊补牢', verseTop: '亡 = 丢失 ｜ 牢 = 牲口圈（羊圈）', verseBottom: '出了问题及时想办法补救，就不算晚！',
            tip: '千万别把“亡”当成死亡、“牢”当成结实哦！亡羊=丢了羊，补牢=修补羊圈！', ans: '② 丢失 、 关牲口的圈（羊圈）',
            steps: [
              step('第一步：结合课文故事理解字义', '养羊人的羊圈破了个窟窿，夜里狼叼走了一只羊（丢了羊），他赶紧修补羊圈。', '丢羊 ➔ 修羊圈'),
              step('第二步：对应古汉语字义', '亡 = 丢失，牢 = 羊圈，选 ②！', '选 ②')
            ]
          }
        },
        {
          key: 'q6', num: 6, points: 7,
          title: '形容心情的四字词语分类',
          badge: '词语归类',
          promptPrefix: '二年级语文园地积累了许多描写心情的词语，下面全部表示【开心、快乐】的一组词语是（',
          promptSuffix: '）。',
          choices: [
            '兴高采烈 、 眉开眼笑 、 欢蹦乱跳',
            '怒气冲冲 、 火冒三丈 、 咬牙切齿',
            '悲痛欲绝 、 泪流满面 、 垂头丧气'
          ],
          correctIdx: 1,
          explainDetail: '①是开心快乐；②是生气愤怒；③是难过伤心，选 ①',
          animData: {
            type: 'cn_grammar_train', leftPart: '😊 高兴：兴高采烈·眉开眼笑', midWord: '心情词语归类', rightPart: '😠 生气：火冒三丈 ｜ 😢 难过：悲痛欲绝',
            tip: '二下园地四必考：高兴（兴高采烈、眉开眼笑）、生气（怒气冲冲、火冒三丈）、难过（悲痛欲绝）！', ans: '① 兴高采烈 、 眉开眼笑 、 欢蹦乱跳',
            steps: [
              step('第一步：区分三类心情词', '看到“笑、欢、兴”是开心；看到“怒、火”是生气；看到“悲、泪”是难过。', '看关键字辨心情'),
              step('第二步：锁定全部开心的一组', '兴高采烈、眉开眼笑、欢蹦乱跳，选 ①！', '选 ①')
            ]
          }
        },
        {
          key: 'q7', num: 7, points: 7,
          title: '拟人句赏析与仿写',
          badge: '修辞手法',
          promptPrefix: '“小草从地下探出头来，那是春天的眉毛吧？”这句话中“探出头来”运用了什么修辞手法？（',
          promptSuffix: '）',
          choices: ['拟人（把小草当作调皮好奇的孩子来写）', '反问（无疑而问）', '夸张（故意夸大）'],
          correctIdx: 1,
          explainDetail: '“探出头来”是人的动作，把小草当成人来写，生动写出小草刚发芽时好奇可爱的样子，属于拟人，选 ①',
          animData: {
            type: 'cn_grammar_train', leftPart: '🌱 小草', midWord: '拟人（赋予人的动作）', rightPart: '从地下探出头来',
            tip: '把花草鸟虫当成“人”，会探头、唱歌、跳舞、害羞，就是拟人手法！', ans: '① 拟人',
            steps: [
              step('第一步：抓住动词“探出头来”', '只有人才会“探出头来”张望，这里把小草当成可爱的小朋友来写。', '赋予人的动作 = 拟人'),
              step('第二步：锁定答案', '选 ① 拟人！', '选 ①')
            ]
          }
        },
        {
          key: 'q8', num: 8, points: 7,
          title: '《传统节日》时间顺序排列',
          badge: '传统文化',
          promptPrefix: '按照一年从头到尾的先后顺序，下面传统节日排列完全正确的一项是（',
          promptSuffix: '）。',
          choices: [
            '春节 ➔ 元宵节 ➔ 清明节 ➔ 端午节 ➔ 中秋节 ➔ 重阳节',
            '春节 ➔ 端午节 ➔ 元宵节 ➔ 清明节 ➔ 中秋节',
            '元宵节 ➔ 春节 ➔ 清明节 ➔ 中秋节 ➔ 端午节'
          ],
          correctIdx: 1,
          explainDetail: '正月初一春节 ➔ 正月十五元宵节 ➔ 4月清明节 ➔ 五月初五端午节 ➔ 八月十五中秋节 ➔ 九月初九重阳节，选 ①',
          animData: {
            type: 'cn_story_flow', flowTitle: '🏮 中华传统节日时间轴',
            nodes: ['🧧正月初一春节', '🏮正月十五元宵', '🌿清明/五月初五端午', '🥮八月十五中秋/九九重阳'],
            tip: '按农历月份排：正月初一(春节) ➔ 正月十五(元宵) ➔ 清明 ➔ 五月初五(端午) ➔ 八月十五(中秋) ➔ 九月初九(重阳)！', ans: '① 春节➔元宵节➔清明节➔端午节➔中秋节➔重阳节',
            steps: [
              step('第一步：回忆《传统节日》课文顺序', '春节到，人欢笑，贴窗花，放鞭炮。元宵节，看花灯……清明节，雨纷纷……过端午，赛龙舟……', '春节➔元宵➔清明➔端午'),
              step('第二步：核对秋季节日', '八月十五中秋节吃月饼，九月初九重阳节要敬老，选 ①！', '选 ①')
            ]
          }
        }
      ],
      sec3Questions: [
        {
          key: 'q9', num: 9, points: 5,
          title: '古诗修辞与名句：《咏柳》',
          badge: '必背古诗',
          visualHtml: `<div class="inline-flex items-center gap-3 p-2 pr-4 rounded-xl bg-[#fffbeb] border border-amber-300 shadow-2xs">
      <img src="assets/poetry/yong_liu.webp" alt="唐·贺知章《咏柳》" class="w-20 h-12 rounded-lg object-cover border border-amber-200 shrink-0" loading="lazy" />
      <div class="text-xs">
        <div class="font-black text-amber-950">唐·贺知章《咏柳》</div>
        <div class="font-bold text-slate-700 mt-0.5">碧玉妆成一树高，万条垂下绿丝绦。</div>
      </div>
    </div>`,
          promptPrefix: '贺知章在《咏柳》“不知细叶谁裁出，二月春风似剪刀”中，把什么比作了“剪刀”？（',
          promptSuffix: '）',
          choices: ['细细的柳叶', '二月的春风', '高高的柳树'],
          correctIdx: 2,
          explainDetail: '“二月春风似剪刀”意思是二月的春风就像一把灵巧的剪刀，裁出了细巧的柳叶，选 ②',
          animData: {
            type: 'cn_scroll', poemId: 'yong_liu', poemTitle: '唐·贺知章《咏柳》',
            verseTop: '碧玉妆成一树高，万条垂下绿丝绦。', verseBottom: '不知细叶谁裁出，二月春风似剪刀。',
            tip: '“似”就是“像”，二月春风似剪刀 = 二月春风像剪刀！', ans: '② 二月的春风',
            steps: [
              step('第一步：读准最后一句“二月春风似剪刀”', '“似”是好像、如同的意思。', '二月春风 ➔ 似 ➔ 剪刀'),
              step('第二步：锁定本体', '把“二月的春风”比作剪刀，选 ②！', '选 ②')
            ]
          }
        },
        {
          key: 'q10', num: 10, points: 5,
          title: '古诗名句与字义：《村居》',
          badge: '必背古诗',
          promptPrefix: '清代高鼎《村居》“儿童散学归来早，忙趁东风放纸鸢”中，“纸鸢（zhǐ yuān）”指的是（',
          promptSuffix: '）。',
          choices: ['纸折的小船', '风筝', '会飞的黄莺鸟'],
          correctIdx: 2,
          explainDetail: '古时候人们把风筝叫做“纸鸢”，孩子们放学早早归来，趁着春风放风筝，选 ②',
          animData: {
            type: 'cn_scroll', poemId: 'cun_ju', poemTitle: '清·高鼎《村居》',
            verseTop: '草长莺飞二月天，拂堤杨柳醉春烟。', verseBottom: '儿童散学归来早，忙趁东风放纸鸢。',
            tip: '重点古诗注释：散学 = 放学；东风 = 春风；纸鸢 = 风筝！', ans: '② 风筝',
            steps: [
              step('第一步：结合“忙趁东风放……”的动作思考', '借着春风放到天上去的是风筝。', '趁东风 ➔ 放风筝'),
              step('第二步：牢记“纸鸢 = 风筝”', '选 ② 风筝！', '选 ②')
            ]
          }
        },
        {
          key: 'q11', num: 11, points: 5,
          title: '课文科普：《要是你在野外迷了路》',
          badge: '课文科普',
          promptPrefix: '《要是你在野外迷了路》介绍了四种“天然的指南针”。如果在晴朗的夜晚迷了路，可以靠谁辨别北方？（',
          promptSuffix: '）',
          choices: ['太阳（中午在南方）', '北极星（永远高挂在北方）', '大树枝叶（稠的一面是南方）'],
          correctIdx: 2,
          explainDetail: '晴朗的中午看太阳，晴朗的夜晚看北极星（北极星永远高挂在北方），阴雨天看大树，下雪天看沟渠积雪，选 ②',
          animData: {
            type: 'cn_story_flow', flowTitle: '🧭 四种大自然天然指南针',
            nodes: ['☀️中午太阳：南阳北影', '⭐晴朗夜晚：北极星指北', '🌳阴雨天大树：南稠北稀', '❄️沟渠积雪：北化快南化慢'],
            tip: '看清题目问的是“晴朗的夜晚”，夜晚看天上的北极星！', ans: '② 北极星（永远高挂在北方）',
            steps: [
              step('第一步：圈出题干时间条件“晴朗的夜晚”', '夜晚没有太阳，但夜空中有明亮的北极星。', '夜晚 ➔ 北极星'),
              step('第二步：回忆课文原句', '“北极星是盏指路灯，它永远高挂在北方。”选 ②！', '选 ②')
            ]
          }
        },
        {
          key: 'q12', num: 12, points: 5,
          title: '课文哲理：《小毛虫》',
          badge: '课文精读',
          promptPrefix: '《小毛虫》一课中，笨拙的小毛虫没有悲观失望，而是尽心竭力地织成牢固的茧屋，最后变成了（',
          promptSuffix: '）。',
          choices: ['勤劳的小蜜蜂', '色彩斑斓、轻盈飞舞的蝴蝶', '会唱歌的纺织娘'],
          correctIdx: 2,
          explainDetail: '小毛虫在茧屋里耐心等待，时辰到了，它破茧而出，变成了长着轻盈翅膀、色彩斑斓的蝴蝶，选 ②',
          animData: {
            type: 'cn_story_flow', flowTitle: '🦋 《小毛虫》破茧成蝶记',
            nodes: ['🐛笨拙小毛虫', '🧶尽心竭力织茧屋', '⏳万事万物有规律', '🦋变成美丽的蝴蝶'],
            tip: '“每个人都有自己该做的事情”，小毛虫做好织茧的事，最终变成了美丽的蝴蝶！', ans: '② 色彩斑斓、轻盈飞舞的蝴蝶',
            steps: [
              step('第一步：回顾《小毛虫》结局', '时辰到了，它清醒了过来，再也不是以前那条笨手笨脚的小毛虫，它灵巧地从茧子里挣脱出来，长出一对轻盈的翅膀。', '破茧而出'),
              step('第二步：锁定答案', '变成了美丽的蝴蝶，选 ②！', '选 ②')
            ]
          }
        }
      ],
      readingPassage: {
        title: '春江柳岸的鸟鸣画卷',
        svg: SVG_SCENES.rainForest,
        paragraphs: [
          '① 温暖的春风吹绿了江南的河岸，高大的柳树垂下万千条嫩绿的枝丝。两只羽毛金黄的黄鹂鸟站在翠绿的柳枝上，欢快地对唱着动听的春之歌。',
          '② 抬起头向晴朗的蓝天望去，一行洁白的白鹭排成整齐的队伍，扇动着翅膀直飞向高远的青天。远方连绵起伏的雪山在阳光下闪耀着银白的光芒，山脚下林木葱茏，粉红的桃花灿烂盛开。',
          '③ 清澈的江水静静流淌，岸边的小木桥旁停泊着一艘乌篷小木船。草堂书房的木窗敞开着，桌上的毛笔和书卷散发着淡淡的墨香，把这幅有声有色的春日美景全都装进了窗户里！'
        ],
        questions: [
          {
            key: 'q13', num: 13, points: 4,
            title: '阅读理解（1）：图文动物与色彩提取',
            promptPrefix: '结合插图与第①、②自然段，站在翠绿柳枝上唱歌和排成一队飞上蓝天的分别是哪两种鸟？（',
            promptSuffix: '）',
            choices: ['两只黄鹂 和 一行白鹭', '两只孔雀 和 一群大雁', '两只燕子 和 一只老鹰'],
            correctIdx: 1,
            explainDetail: '第①段写“两只羽毛金黄的黄鹂鸟站在翠绿的柳枝上”，第②段写“一行洁白的白鹭排成整齐的队伍……直飞向高远的青天”，选 ①',
            animData: {
              type: 'cn_story_flow', flowTitle: '🐦 图文对照：春江飞鸟',
              nodes: ['🌿柳枝近景：两只金黄的黄鹂唱歌', '🌌蓝天远景：一行洁白的白鹭高飞'],
              tip: '观察插图左上角的两只黄鸟和天空中的一排白鸟，正对应杜甫《绝句》！', ans: '① 两只黄鹂 和 一行白鹭',
              steps: [
                step('第一步：看图左上方柳枝与天空', '柳枝上有两只黄鹂，蓝天上有一行白鹭。', '黄鹂 + 白鹭'),
                step('第二步：锁定答案', '选 ①！', '答案：①')
              ]
            }
          },
          {
            key: 'q14', num: 14, points: 4,
            title: '阅读理解（2）：远景与近景方位理解',
            promptPrefix: '根据第②、③自然段和插图，远方闪耀着银白光芒的是什么？江岸木桥旁停泊着什么？（',
            promptSuffix: '）',
            choices: [
              '连绵起伏的雪山 ； 一艘乌篷小木船',
              '高高的摩天大楼 ； 一辆公交车',
              '金黄的沙漠 ； 一架大飞机'
            ],
            correctIdx: 1,
            explainDetail: '第②段写“远方连绵起伏的雪山在阳光下闪耀着银白的光芒”，第③段写“岸边的小木桥旁停泊着一艘乌篷小木船”，选 ①',
            animData: {
              type: 'cn_story_flow', flowTitle: '🏔️🚣 远景与近景配对',
              nodes: ['🏔️远方：连绵起伏的雪山', '🌸中景：粉红盛开的桃花', '🚣近景：停泊的乌篷小木船'],
              tip: '正好对应“窗含西岭千秋雪，门泊东吴万里船”！', ans: '① 连绵起伏的雪山 ； 一艘乌篷小木船',
              steps: [
                step('第一步：观察插图中间远处的白色山峰与水面小船', '远处是皑皑雪山，水面停着乌篷小船。', '雪山 + 小木船'),
                step('第二步：锁定答案', '选 ①！', '答案：①')
              ]
            }
          },
          {
            key: 'q15', num: 15, points: 4,
            title: '阅读理解（3）：观察插图细节',
            promptPrefix: '仔细看插图右侧和第③自然段，敞开的草堂木窗里摆放着什么物品？（',
            promptSuffix: '）',
            choices: ['毛笔、笔筒和整齐的书卷', '电视机和电冰箱', '足球和篮球'],
            correctIdx: 1,
            explainDetail: '第③段写：“草堂书房的木窗敞开着，桌上的毛笔和书卷散发着淡淡的墨香”，插图右侧木窗内清晰可见书架与笔筒毛笔，选 ①',
            animData: {
              type: 'cn_story_flow', flowTitle: '🪟 草堂书窗细节',
              nodes: ['🪟敞开的雕花木窗', '🖌️桌上的青瓷笔筒与毛笔', '📚书架上整齐的书卷'],
              tip: '仔细观察插图右边窗户里面的书桌与书架！', ans: '① 毛笔、笔筒和整齐的书卷',
              steps: [
                step('第一步：定位第③段最后一句与插图右侧', '“桌上的毛笔和书卷散发着淡淡的墨香。”', '毛笔和书卷'),
                step('第二步：锁定答案', '选 ①！', '答案：①')
              ]
            }
          },
          {
            key: 'q16', num: 16, points: 4,
            title: '阅读理解（4）：短文情感体会',
            promptPrefix: '读完这篇优美的写景短文，我们可以感受到作者对春天大自然怀着怎样的感情？（',
            promptSuffix: '）',
            choices: ['害怕和厌烦', '热爱、喜悦与赞美之情', '悲伤和难过'],
            correctIdx: 2,
            explainDetail: '短文通过描写翠柳、黄鹂、白鹭、雪山、桃花等明丽春景，表达了对春天大自然的无限热爱与赞美，选 ②',
            animData: {
              type: 'cn_scroll', poemTitle: '《春江柳岸》情感主旨',
              verseTop: '有声（黄鹂欢唱） · 有色（黄翠白青粉）', verseBottom: '热爱自然 · 赞美明媚春光',
              tip: '凡是描写万物复苏、鸟语花香的春景美文，都表达了喜爱与赞美之情！', ans: '② 热爱、喜悦与赞美之情',
              steps: [
                step('第一步：体会文中欢快明丽的景物描写', '“欢快地对唱”、“灿烂盛开”、“有声有色的春日美景”。', '喜悦与赞美'),
                step('第二步：锁定答案', '选 ②！', '答案：②')
              ]
            }
          }
        ]
      },
      writingTask: {
        title: '看图写话：春种与秋收（珍惜粮食）',
        svg: SVG_SCENES.plantTrees,
        sceneDesc: '仔细观察左图：左边春天时老农伯伯在田里做什么？右边到了秋天，庄稼发生了什么变化？老农伯伯又是怎么收割的？我们应该怎样对待粮食？',
        wordBank: ['春暖花开', '辛勤耕耘', '春种秋收', '金黄饱满', '汗流浃背', '爱惜粮食'],
        blanks: [
          {
            key: 'q17_time', label: '① 春天弯腰播种', points: 3,
            prefix: '春天到了，桃花盛开，头戴斗笠的老农伯伯背着种子篓，赤着脚踩在翻耕好的泥土里，（', suffix: '），田垄间很快长出了嫩绿的小禾苗。',
            choices: ['弯着腰把一粒粒谷种小心地播撒进泥土里', '坐在树下睡大觉', '在冰面上滑冰'],
            correctIdx: 1
          },
          {
            key: 'q17_who', label: '② 夏日辛勤照料与秋日丰收', points: 3,
            prefix: '经过一整个夏天的浇水除草，转眼到了金秋时节，田野里（', suffix: '），沉甸甸的谷穗笑弯了腰。',
            choices: ['光秃秃的一片什么也没有', '到处是一片金黄的丰收景象', '下起了鹅毛大雪'],
            correctIdx: 2
          },
          {
            key: 'q17_do', label: '③ 收割稻谷装满竹筐', points: 3,
            prefix: '老农伯伯不顾劳累，在金黄的田野里（', suffix: '），身旁的大竹筐里装满了金灿灿的粮食。',
            choices: ['把成熟的谷穗一把把收割下来放进竹筐里', '把庄稼全都拔掉扔进河里', '在草地上放风筝'],
            correctIdx: 1
          },
          {
            key: 'q17_feel', label: '④ 懂得感恩与珍惜粮食', points: 3,
            prefix: '看着老农伯伯辛勤劳作的身影，我想起了《悯农》里的诗句，懂得了（', suffix: '）！',
            choices: ['每一粒粮食都来之不易，我们一定要珍惜粮食、绝不浪费', '米饭是从树上自己掉下来的', '吃不完的饭菜可以随便倒掉'],
            correctIdx: 1
          }
        ],
        modelEssay: '春天到了，桃花盛开，头戴斗笠的老农伯伯背着种子篓，赤着脚踩在翻耕好的泥土里，弯着腰把一粒粒谷种小心地播撒进泥土里，田垄间很快长出了嫩绿的小禾苗。经过一整个夏天的浇水除草，转眼到了金秋时节，田野里到处是一片金黄的丰收景象，沉甸甸的谷穗笑弯了腰。老农伯伯不顾劳累，在金黄的田野里把成熟的谷穗一把把收割下来放进竹筐里，身旁的大竹筐里装满了金灿灿的粮食。看着老农伯伯辛勤劳作的身影，我想起了《悯农》里的诗句，懂得了每一粒粮食都来之不易，我们一定要珍惜粮食、绝不浪费！',
        explainDetail: '春种秋收写话四步：①春天弯腰撒种长出绿苗 + ②金秋谷穗金黄饱满 + ③老农收割谷穗装满竹筐 + ④懂得粮食来之不易要珍惜！',
        animData: {
          type: 'cn_story_flow', flowTitle: '✍️ 看图写话对比观察法：春种与秋收',
          nodes: ['🌱左图春耕：弯腰撒种育青苗', '🌾右图秋收：谷穗金黄装满筐', '💧辛勤汗水：春种一粒秋收万颗', '🍚感悟升华：爱惜粮食不浪费'],
          tip: '左半幅画的是春天播种，右半幅画的是秋天收获，按时间推移把两幅画面连起来写！', ans: '满分范文已解锁',
          steps: [
            step('第一步：观察左半幅春耕图', '春天果树开花，老农戴斗笠背竹篓，弯腰撒下谷种，嫩苗破土。', '春种一粒粟'),
            step('第二步：观察右半幅秋收图', '秋天漫山金黄，老农双手捧起沉甸甸的谷穗收进大竹筐。', '秋收万颗子'),
            step('第三步：联系生活升华主题', '一粥一饭来之不易，我们要养成爱惜粮食的好习惯！', '珍惜粮食')
          ]
        }
      }
    },

    // =========================================================================
    // 语文D卷：统编版二年级下册名校期末真题卷（二）
    // =========================================================================
    {
      id: 'cn_paper_d',
      letter: '语文D',
      label: '语文D卷 · 二下名校期末（二）',
      title: '统编版二年级语文下册名校期末全真测试卷（D卷）',
      subtitle: '涵盖：多音字扇、形近字辨析、《绝句》《晓出净慈寺》、《雷雨》顺序、《小水滴的奇妙旅行》阅读与古道送别写话',
      sec1Questions: [
        {
          key: 'q1', num: 1, points: 6,
          title: '多音字“扇 / 坊”读音辨析',
          badge: '字音闯关',
          visualHtml: `<div class="inline-flex flex-wrap items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#fffbeb] border border-amber-300/90 shadow-2xs">
          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">shàn 扇子</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">扇</span>
            </div>
          </div>

          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">shān 扇风</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">扇</span>
            </div>
          </div>
        <span class="ml-2 pl-2.5 border-l border-amber-300 text-xs font-bold text-amber-950">《大象的耳朵》多音字</span></div>`,
          promptPrefix: '在《大象的耳朵》“大象有一对大耳朵，像扇子似的，耷拉着。有虫子来的话，大象只要把他的大耳朵一扇，就能把他们赶跑”中，两个“扇”字依次读（',
          promptSuffix: '）。',
          choices: ['shān 、 shàn', 'shàn 、 shān', 'shàn 、 shàn'],
          correctIdx: 2,
          explainDetail: '名词“扇子、一扇门”读四声 shàn；动词“扇风、一扇”读一声 shān，选 ②',
          animData: {
            type: 'cn_pinyin_tree', charText: '扇', branchA: 'shàn（名词：扇子、电扇、一扇门）', branchB: 'shān（动词：扇风、扇动、把耳朵一扇）',
            tip: '表示物品名称“扇子”读四声 shàn；表示摇动生风的动作“扇风、一扇”读一声 shān！', ans: '② shàn 、 shān',
            steps: [
              step('第一步：看第一个“像扇子似的”', '“扇子”是物品名称（名词），读四声 shàn。', '扇（shàn）子'),
              step('第二步：看第二个“把大耳朵一扇”', '表示扇动的动作（动词），读一声 shān，选 ②！', '一扇（shān）（选 ②）')
            ]
          }
        },
        {
          key: 'q2', num: 2, points: 6,
          title: '二下高频形近字辨析（幸/辛、植/值）',
          badge: '字形辨析',
          visualHtml: `<div class="inline-flex flex-wrap items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#fffbeb] border border-amber-300/90 shadow-2xs">
          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">xīn 辛勤</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">辛</span>
            </div>
          </div>

          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">xìng 幸福</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">幸</span>
            </div>
          </div>
        <span class="ml-2 pl-2.5 border-l border-amber-300 text-xs font-bold text-amber-950">易混形近字对比</span></div>`,
          promptPrefix: '选字填空：“蜜蜂（  ）勤采蜜，酿出甜美的蜂蜜，我们的生活真（  ）福！”括号里依次应填（',
          promptSuffix: '）。',
          choices: ['幸 、 辛', '辛 、 幸', '新 、 幸'],
          correctIdx: 2,
          explainDetail: '“辛苦、辛勤”上面是“立”，读 xīn；“幸福、幸运”上面是“土”，读 xìng，选 ②',
          animData: {
            type: 'cn_char_split', radical: '辛 (xīn 辛苦/辛勤)', stem: '幸 (xìng 幸福/幸运)', compound: '辛勤采蜜 / 幸福生活',
            rule: '立十“辛”（辛苦、辛勤劳动），土羊少一横是“幸”（幸福、幸运）！', ans: '② 辛 、 幸',
            steps: [
              step('第一步：区分“辛”和“幸”的字形与读音', '辛（xīn）：辛苦、辛勤；幸（xìng）：幸福、万幸。', '辛勤 vs 幸福'),
              step('第二步：按语境填入', '蜜蜂辛勤采蜜，生活真幸福，选 ②！', '选 ② 辛 、 幸')
            ]
          }
        },
        {
          key: 'q3', num: 3, points: 6,
          title: '部首查字法：“鹿、金、黑、衣”本身就是部首',
          badge: '查字典必考',
          promptPrefix: '二年级下册语文园地告诉我们，在查“麝（shè）、鉴（jiàn）、默（mò）”这三个字时，它们各自的部首分别是（',
          promptSuffix: '）。',
          choices: ['广 、 皿 、 犬', '鹿 、 金 、 黑', '射 、 竹 、 灬'],
          correctIdx: 2,
          explainDetail: '“鹿、金、黑、高、音、衣、辛、鱼”本身就是部首！所以“麝”查“鹿”部，“鉴”查“金”部，“默”查“黑”部，选 ②',
          animData: {
            type: 'cn_char_split', radical: '鹿 / 金 / 黑', stem: '本身就是部首字', compound: '麝(鹿) · 鉴(金) · 默(黑)',
            rule: '园地八重点：鹿、金、高、音、黑、衣、辛、鱼本身就是部首，合体字里有它们时优先查它们！', ans: '② 鹿 、 金 、 黑',
            steps: [
              step('第一步：回忆语文园地八“我的发现”', '鹿—麝，金—鉴，高—敲，音—章，黑—默，衣—装。', '整字作部首'),
              step('第二步：锁定答案', '分别查“鹿、金、黑”部，选 ②！', '选 ②')
            ]
          }
        },
        {
          key: 'q4', num: 4, points: 6,
          title: '近义词与叠词积累（一瞬间 / 慢吞吞）',
          badge: '词语积累',
          promptPrefix: '下面哪一组词语的意思都表示“时间非常短、非常快”（与“立刻、马上”近义）？（',
          promptSuffix: '）',
          choices: [
            '一眨眼 、 一瞬间 、 霎时 、 忽然',
            '慢吞吞 、 慢悠悠 、 缓缓地',
            '很久很久 、 千秋万代 、 日复一日'
          ],
          correctIdx: 1,
          explainDetail: '二年级下册园地必背：表示时间极短极快的词有“忽然、突然、立刻、马上、一瞬间、一眨眼、转眼间、霎时”，选 ①',
          animData: {
            type: 'cn_grammar_train', leftPart: '⚡ 快：一眨眼·一瞬间·霎时', midWord: '时间快慢近义词', rightPart: '🐢 慢：慢吞吞·慢悠悠·徐徐',
            tip: '一眨眼、一瞬间、转眼间、霎时，都形容一刹那间发生，快极了！', ans: '① 一眨眼 、 一瞬间 、 霎时 、 忽然',
            steps: [
              step('第一步：对比“快”与“慢”的词群', '①组全部形容一眨眼的功夫（极快）；②组形容很慢；③组形容时间漫长。', '一瞬间 = 极快'),
              step('第二步：锁定答案', '选 ①！', '选 ①')
            ]
          }
        }
      ],
      sec2Questions: [
        {
          key: 'q5', num: 5, points: 7,
          title: '寓言故事道理：《揠苗助长》',
          badge: '课文寓言',
          promptPrefix: '《揠苗助长》中那个农夫把禾苗一棵一棵往高里拔，结果禾苗全枯死了。这个故事告诉我们（',
          promptSuffix: '）。',
          choices: [
            '拔禾苗的时候力气要小一点',
            '做事情要遵循客观规律，不能急于求成，否则反而会把事情弄糟',
            '种庄稼不需要下地劳动'
          ],
          correctIdx: 2,
          explainDetail: '“揠苗助长”告诉我们：违反事物发展的客观规律，急于求成，反而会把事情办坏，选 ②',
          animData: {
            type: 'cn_scroll', poemTitle: '寓言精讲 · 揠苗助长', verseTop: '🌾 急忙把禾苗往高里拔 ➔ 🥀 禾苗全部枯死', verseBottom: '违背规律、急于求成，反而坏事！',
            tip: '“揠（yà）”是拔的意思。植物生长和我们学习一样，要一步一个脚印，不能急于求成！', ans: '② 遵循规律，不能急于求成',
            steps: [
              step('第一步：分析禾苗枯死的原因', '把禾苗往上拔断了根系，违背了植物自然生长的规律。', '急于求成 ➔ 适得其反'),
              step('第二步：锁定寓意', '选 ②！', '选 ②')
            ]
          }
        },
        {
          key: 'q6', num: 6, points: 7,
          title: '关联词“一会儿……一会儿……”造句',
          badge: '句式运用',
          promptPrefix: '下面用“一会儿……一会儿……”造的句子中，最恰当、通顺的一句是（',
          promptSuffix: '）。',
          choices: [
            '天上的白云变化多端，一会儿变成奔跑的骏马，一会儿变成可爱的小白兔。',
            '我一会儿在三年级上学，一会儿在一百岁退休。',
            '太阳一会儿从西边出来，一会儿变成大冰块。'
          ],
          correctIdx: 1,
          explainDetail: '“一会儿……一会儿……”表示短时间内交替变化的动作或形态，天上的白云一会儿变骏马、一会儿变白兔最生动合理，选 ①',
          animData: {
            type: 'cn_grammar_train', leftPart: '☁️ 一会儿变成骏马', midWord: '短时间交替变化', rightPart: '🐰 一会儿变成小白兔',
            tip: '“一会儿……一会儿……”常用来写小动物的动作（小猴一会儿爬树一会儿荡秋千）或云朵的变化！', ans: '① 天上的白云……',
            steps: [
              step('第一步：理解“一会儿……一会儿……”的用法', '表示短时间内接连发生的不同变化。', '交替变化'),
              step('第二步：判断合理性', '白云随风变幻成骏马和小白兔既优美又合乎常理，选 ①！', '选 ①')
            ]
          }
        },
        {
          key: 'q7', num: 7, points: 7,
          title: '《雷雨》写作顺序梳理',
          badge: '课文结构',
          promptPrefix: '二年级下册名篇《雷雨》是按照什么顺序来描写夏日雷雨景象的？（',
          promptSuffix: '）',
          choices: [
            '雷雨前 ➔ 雷雨中 ➔ 雷雨后（时间顺序）',
            '春天 ➔ 夏天 ➔ 秋天 ➔ 冬天（四季顺序）',
            '雷雨后 ➔ 雷雨前 ➔ 雷雨中'
          ],
          correctIdx: 1,
          explainDetail: '《雷雨》第1~3段写“雷雨前”（乌云压下来、蝉不叫、蜘蛛逃走），第4~6段写“雷雨中”（哗哗下），第7~8段写“雷雨后”（彩虹挂天空、青蛙叫），选 ①',
          animData: {
            type: 'cn_story_flow', flowTitle: '⛈️ 《雷雨》三部曲时间轴',
            nodes: ['🌑雷雨前：满天乌云蝉不叫', '🌧️雷雨中：哗哗大雨看不清', '🌈雷雨后：太阳出来彩虹挂'],
            tip: '记住《雷雨》三步曲：雷雨前 ➔ 雷雨中 ➔ 雷雨后！', ans: '① 雷雨前 ➔ 雷雨中 ➔ 雷雨后',
            steps: [
              step('第一步：回顾课文景物变化', '乌云大风（雨前）➔ 雨哗哗下（雨中）➔ 天亮了彩虹出来（雨后）。', '时间先后顺序'),
              step('第二步：锁定答案', '选 ①！', '选 ①')
            ]
          }
        },
        {
          key: 'q8', num: 8, points: 7,
          title: '日积月累：助人为乐名言',
          badge: '园地日积月累',
          promptPrefix: '二年级下册语文园地二中，“予人玫瑰，（',
          promptSuffix: '）”告诉我们帮助别人自己也会收获快乐。',
          choices: ['手有余香', '春风吹又生', '更上一层楼'],
          correctIdx: 1,
          explainDetail: '助人名言三句：①予人玫瑰，手有余香；②平时肯帮人，急时有人帮；③与其锦上添花，不如雪中送炭，选 ①',
          animData: {
            type: 'cn_scroll', poemTitle: '日积月累 · 关爱与助人名言',
            verseTop: '🌹 予人玫瑰，手有余香。', verseBottom: '🤝 平时肯帮人，急时有人帮。',
            tip: '把玫瑰花送给别人，自己的手上也会留下花香，比喻助人者自助、乐人者自乐！', ans: '① 手有余香',
            steps: [
              step('第一步：理解“予人玫瑰”的含义', '“予”是送给的意思，送给别人玫瑰花，手上会留下芳香。', '予人玫瑰 ➔ 手有余香'),
              step('第二步：锁定答案', '选 ① 手有余香！', '选 ①')
            ]
          }
        }
      ],
      sec3Questions: [
        {
          key: 'q9', num: 9, points: 5,
          title: '古诗色彩与对仗：《绝句》',
          badge: '必背古诗',
          visualHtml: `<div class="inline-flex items-center gap-3 p-2 pr-4 rounded-xl bg-[#fffbeb] border border-amber-300 shadow-2xs">
      <img src="assets/poetry/jue_ju.webp" alt="唐·杜甫《绝句》" class="w-20 h-12 rounded-lg object-cover border border-amber-200 shrink-0" loading="lazy" />
      <div class="text-xs">
        <div class="font-black text-amber-950">唐·杜甫《绝句》</div>
        <div class="font-bold text-slate-700 mt-0.5">两个黄鹂鸣翠柳，一行白鹭上青天。</div>
      </div>
    </div>`,
          promptPrefix: '杜甫《绝句》前两句“两个黄鹂鸣翠柳，一行白鹭上青天”一共写到了哪四种颜色？（',
          promptSuffix: '）',
          choices: ['红 、 黄 、 蓝 、 紫', '黄 、 翠（绿） 、 白 、 青', '黑 、 白 、 金 、 绿'],
          correctIdx: 2,
          explainDetail: '黄鹂（黄）、翠柳（翠绿）、白鹭（白）、青天（青蓝），短短两句诗包含了“黄、翠、白、青”四种鲜明色彩，选 ②',
          animData: {
            type: 'cn_scroll', poemId: 'jue_ju', poemTitle: '唐·杜甫《绝句》',
            verseTop: '两个【黄】鹂鸣【翠】柳，一行【白】鹭上【青】天。', verseBottom: '窗含西岭千秋雪，门泊东吴万里船。',
            tip: '圈出每种景物前面的颜色字：黄鹂、翠柳、白鹭、青天！', ans: '② 黄 、 翠（绿） 、 白 、 青',
            steps: [
              step('第一步：在诗句中圈出表示颜色的字', '黄（黄鹂）、翠（翠柳）、白（白鹭）、青（青天）。', '黄 · 翠 · 白 · 青'),
              step('第二步：锁定选项', '选 ②！', '选 ②')
            ]
          }
        },
        {
          key: 'q10', num: 10, points: 5,
          title: '古诗名句与季节：《晓出净慈寺送林子方》',
          badge: '必背古诗',
          promptPrefix: '宋代杨万里《晓出净慈寺送林子方》“接天莲叶无穷碧，（  ）”描写的是西湖什么季节的美景？（',
          promptSuffix: '）',
          choices: ['映日荷花别样红 ； 夏季（六月）', '春风吹又生 ； 春季', '凌寒独自开 ； 冬季'],
          correctIdx: 1,
          explainDetail: '“毕竟西湖六月中……接天莲叶无穷碧，映日荷花别样红”描写的是夏季（六月）杭州西湖莲叶碧绿、荷花火红的盛夏风光，选 ①',
          animData: {
            type: 'cn_scroll', poemId: 'xiao_chu_jing_ci_si', poemTitle: '宋·杨万里《晓出净慈寺送林子方》',
            verseTop: '毕竟西湖六月中，风光不与四时同。', verseBottom: '接天莲叶无穷碧，映日荷花别样红。',
            tip: '“六月中”和“莲叶、荷花”都是夏天（盛夏）的标志性景物！', ans: '① 映日荷花别样红 ； 夏季（六月）',
            steps: [
              step('第一步：接出名句下联', '接天莲叶无穷碧，映日荷花别样红。', '映日荷花别样红'),
              step('第二步：根据“西湖六月中”和“荷花”判断季节', '六月荷花盛开是夏季，选 ①！', '选 ①')
            ]
          }
        },
        {
          key: 'q11', num: 11, points: 5,
          title: '古诗反义词与精神：《赋得古原草送别》',
          badge: '必背古诗',
          promptPrefix: '白居易《赋得古原草送别》“离离原上草，一岁一枯荣。野火烧不尽，春风吹又生”中，包含哪一对反义词？（',
          promptSuffix: '）',
          choices: ['离 — 原', '枯（枯萎） — 荣（茂盛）', '春 — 风'],
          correctIdx: 2,
          explainDetail: '“一岁一枯荣”意思是野草每年秋冬枯萎一次、春天茂盛生长一次，“枯”和“荣”是一对反义词，选 ②',
          animData: {
            type: 'cn_scroll', poemId: 'fu_de_gu_yuan_cao', poemTitle: '唐·白居易《赋得古原草送别》',
            verseTop: '离离原上草，一岁一【枯】【荣】。', verseBottom: '野火烧不尽，春风吹又生。',
            tip: '“枯”指秋冬草木干枯，“荣”指春天草木茂盛，一枯一荣正好相反！', ans: '② 枯（枯萎） — 荣（茂盛）',
            steps: [
              step('第一步：理解“一岁一枯荣”的字义', '岁=年；枯=枯萎；荣=茂盛。', '枯 ⇄ 荣'),
              step('第二步：锁定反义词选项', '选 ②！', '选 ②')
            ]
          }
        },
        {
          key: 'q12', num: 12, points: 5,
          title: '古诗意境理解：《舟夜书所见》',
          badge: '必背古诗',
          promptPrefix: '清代查慎行《舟夜书所见》“月黑见渔灯，孤光一点萤。微微风簇浪，散作满河星”中，“满河星”实际上指的是（',
          promptSuffix: '）。',
          choices: ['天上的星星掉进了河水里', '微风吹起波浪，渔灯在水面散开的无数光影倒影', '河里游着许多发光的萤火虫'],
          correctIdx: 2,
          explainDetail: '漆黑的夜晚没有月亮（月黑），微风吹起细浪，那一盏如萤火般的渔船灯光在水面上散开，倒影就像洒满河面的星星，选 ②',
          animData: {
            type: 'cn_scroll', poemId: 'zhou_ye_shu_suo_jian', poemTitle: '清·查慎行《舟夜书所见》',
            verseTop: '月黑见渔灯，孤光一点萤。', verseBottom: '微微风簇浪，散作满河星。',
            tip: '诗眼解析：静时渔灯像“一点萤”，微风起浪时灯光倒影散开像“满河星”！', ans: '② 渔灯在水面散开的光影倒影',
            steps: [
              step('第一步：看前两句“月黑见渔灯，孤光一点萤”', '月黑之夜只有渔船上的一盏孤灯，像一点萤火虫的光。', '一盏渔灯'),
              step('第二步：看后两句“微微风簇浪，散作满河星”', '微风吹动河浪，水中的一点灯光倒影随波散开，变成满河星光，选 ②！', '选 ②')
            ]
          }
        }
      ],
      readingPassage: {
        title: '小水滴的奇妙旅行',
        svg: SVG_SCENES.waterDropCycle,
        paragraphs: [
          '① 我是一颗透明的小水滴，本来在大海妈妈温暖的怀抱里和浪花弟弟做游戏。',
          '② 晴朗的早晨，太阳公公笑眯眯地照着大海，我的身体变得越来越轻，变成了亮晶晶的水汽，摇摇晃晃地升上了蓝天。在空中，无数小水汽手拉手聚在一起，变成了一朵洁白的云。',
          '③ 后来，一阵凉风吹来，我们觉得好冷呀，身体又越聚越重，变成一颗颗小雨点，“沙沙沙”地落下来。有的落进小溪里唱歌，有的落进麦田里帮庄稼解渴，还有的落进荷塘里，在圆圆的荷叶上滚来滚去，像一颗颗闪亮的珍珠！'
        ],
        questions: [
          {
            key: 'q13', num: 13, points: 4,
            title: '阅读理解（1）：自然变化过程梳理',
            promptPrefix: '根据第①、②、③自然段，小水滴在旅行中依次变成了什么？（',
            promptSuffix: '）',
            choices: [
              '小水滴 ➔ 水汽 ➔ 白云 ➔ 小雨点',
              '小水滴 ➔ 石头 ➔ 荷叶 ➔ 庄稼',
              '白云 ➔ 太阳 ➔ 大海 ➔ 水汽'
            ],
            correctIdx: 1,
            explainDetail: '大海里的小水滴被太阳晒变成“水汽”，升空聚在一起变成“白云”，遇凉风变重落下来变成“小雨点”，选 ①',
            animData: {
              type: 'cn_story_flow', flowTitle: '💧 小水滴旅行变身记',
              nodes: ['🌊大海小水滴', '☀️晒成水汽升空', '☁️聚成洁白云朵', '🌧️遇冷化作小雨点'],
              tip: '与课文《我是什么》完全呼应：水 ➔ 汽 ➔ 云 ➔ 雨！', ans: '① 小水滴 ➔ 水汽 ➔ 白云 ➔ 小雨点',
              steps: [
                step('第一步：按段落顺序圈出变化形态', '第①段“小水滴” ➔ 第②段“水汽”、“云” ➔ 第③段“小雨点”。', '水滴➔水汽➔白云➔雨点'),
                step('第二步：锁定答案', '选 ①！', '答案：①')
              ]
            }
          },
          {
            key: 'q14', num: 14, points: 4,
            title: '阅读理解（2）：科学原因提取',
            promptPrefix: '第②自然段中，小水滴是因为谁的照耀才变轻升上蓝天的？（',
            promptSuffix: '）',
            choices: ['月亮姐姐', '太阳公公', '北极星'],
            correctIdx: 2,
            explainDetail: '第②段写：“太阳公公笑眯眯地照着大海，我的身体变得越来越轻，变成了亮晶晶的水汽……升上了蓝天。”选 ②',
            animData: {
              type: 'cn_story_flow', flowTitle: '☀️ 蒸发升空的原因',
              nodes: ['☀️太阳公公照耀加热', '💧水滴变轻成水汽', '⬆️摇摇晃晃升上蓝天'],
              tip: '太阳一晒，水就蒸发变成水汽升到空中！', ans: '② 太阳公公',
              steps: [
                step('第一步：定位第②段第一句', '“太阳公公笑眯眯地照着大海……”', '太阳公公'),
                step('第二步：锁定答案', '选 ②！', '答案：②')
              ]
            }
          },
          {
            key: 'q15', num: 15, points: 4,
            title: '阅读理解（3）：排比与去向理解',
            promptPrefix: '第③自然段中，小雨点落进【麦田】里做了什么好事？（',
            promptSuffix: '）',
            choices: ['在小溪里唱歌', '帮庄稼解渴（浇灌庄稼）', '把庄稼冲走了'],
            correctIdx: 2,
            explainDetail: '原文：“有的落进小溪里唱歌，有的落进麦田里帮庄稼解渴”，注意题目问的是落进“麦田”里，选 ②',
            animData: {
              type: 'cn_story_flow', flowTitle: '🌧️ 小雨点的三个去向',
              nodes: ['🏞️落进小溪 ➔ 唱歌', '🌾落进麦田 ➔ 帮庄稼解渴', '🪷落进荷塘 ➔ 像闪亮珍珠'],
              tip: '看清题目问的是“麦田”，对号入座找到“帮庄稼解渴”！', ans: '② 帮庄稼解渴',
              steps: [
                step('第一步：区分三个“有的……”', '小溪=唱歌；麦田=帮庄稼解渴；荷塘=荷叶上滚来滚去。', '麦田 ➔ 帮庄稼解渴'),
                step('第二步：锁定答案', '选 ②！', '答案：②')
              ]
            }
          },
          {
            key: 'q16', num: 16, points: 4,
            title: '阅读理解（4）：比喻句赏析',
            promptPrefix: '短文最后一句“在圆圆的荷叶上滚来滚去，像一颗颗闪亮的珍珠”，这里把荷叶上的【小雨点】比作了什么？（',
            promptSuffix: '）',
            choices: ['绿玉盘', '闪亮的珍珠', '洁白的云朵'],
            correctIdx: 2,
            explainDetail: '圆圆透明的小雨点在荷叶上滚动，晶莹剔透，就像“一颗颗闪亮的珍珠”，选 ②',
            animData: {
              type: 'cn_grammar_train', leftPart: '荷叶上的小雨点（本体）', midWord: '像', rightPart: '闪亮的珍珠（喻体）',
              tip: '小雨点圆溜溜、亮晶晶，和珍珠的形状光泽一模一样！', ans: '② 闪亮的珍珠',
              steps: [
                step('第一步：读文末比喻句', '“在圆圆的荷叶上滚来滚去，像一颗颗闪亮的珍珠！”', '像闪亮的珍珠'),
                step('第二步：锁定答案', '选 ②！', '答案：②')
              ]
            }
          }
        ]
      },
      writingTask: {
        title: '看图写话：郊外踏青送别好朋友',
        svg: SVG_SCENES.shareUmbrella,
        sceneDesc: '仔细观察左图：晴朗的春天里，原野上的小草和野花长得怎样？古道上两位好朋友在做什么？他们会互相说什么祝福的话？',
        wordBank: ['晴空万里', '芳草萋萋', '野花盛开', '依依不舍', '双手紧握', '深厚友谊'],
        blanks: [
          {
            key: 'q17_time', label: '① 春日原野美景', points: 3,
            prefix: '阳春三月，晴空万里，大朵大朵的白云飘浮在蓝天上。辽阔的原野上（', suffix: '），洁白和金黄的野花在春风中摇曳。',
            choices: ['长满了茂盛翠绿的春草，一直铺向远方的青山', '到处是白茫茫的积雪和冰块', '一片荒凉什么植物也没有'],
            correctIdx: 1
          },
          {
            key: 'q17_who', label: '② 古道边的送别场景', points: 3,
            prefix: '蜿蜒的乡间小路上，好朋友即将远行，书童牵着骏马静静等候，两位好朋友面对面站着，（', suffix: '）。',
            choices: ['紧紧握着彼此的双手，眼神里充满了依依不舍之情', '背对着背互相不理睬', '在河里划龙舟比赛'],
            correctIdx: 1
          },
          {
            key: 'q17_do', label: '③ 温暖真挚的临别赠言', points: 3,
            prefix: '身穿蓝衣的友人望着满眼生机勃勃的春草，真挚地祝福道：“（', suffix: '）”',
            choices: ['愿我们的友谊就像这原野上的春草一样，岁岁常青，祝你一路顺风！', '我再也不想见到你了！', '快把你的雨伞借给我！'],
            correctIdx: 1
          },
          {
            key: 'q17_feel', label: '④ 挥手道别与美好期盼', points: 3,
            prefix: '微风拂过绿茵茵的草地，他们互道珍重，（', suffix: '）！',
            choices: ['约定学有所成后再相聚，真挚的友情在春光里格外温暖', '伤心地把书本都扔掉了', '气的转身就跑'],
            correctIdx: 1
          }
        ],
        modelEssay: '阳春三月，晴空万里，大朵大朵的白云飘浮在蓝天上。辽阔的原野上长满了茂盛翠绿的春草，一直铺向远方的青山，洁白和金黄的野花在春风中摇曳。蜿蜒的乡间小路上，好朋友即将远行，书童牵着骏马静静等候，两位好朋友面对面站着，紧紧握着彼此的双手，眼神里充满了依依不舍之情。身穿蓝衣的友人望着满眼生机勃勃的春草，真挚地祝福道：“愿我们的友谊就像这原野上的春草一样，岁岁常青，祝你一路顺风！”微风拂过绿茵茵的草地，他们互道珍重，约定学有所成后再相聚，真挚的友情在春光里格外温暖！',
        explainDetail: '踏青送别写话四步：①蓝天白云春草茂盛野花开 + ②古道边双手紧握依依惜别 + ③借春草送上真挚祝福 + ④互道珍重期盼再相聚！',
        animData: {
          type: 'cn_story_flow', flowTitle: '✍️ 看图写话借景抒情法：古道送别好友',
          nodes: ['🌿环境：碧草连天野花盛开', '🤝动作：古道驻足双手紧握', '💬语言：借春草祝友谊常青', '🌈结尾：互道珍重期盼重逢'],
          tip: '先写画中美丽的春草与蓝天白云，再写两个人物“双手紧握”的动作和祝福的话语！', ans: '满分范文已解锁',
          steps: [
            step('第一步：描写春日草原的开阔美景', '蓝天白云、翠绿春草、白黄野花、蜿蜒古道。', '优美环境铺垫'),
            step('第二步：聚焦画面中心人物动作', '两位友人双手紧握、依依惜别，骏马与书童在旁等候。', '细节动作描写'),
            step('第三步：加上祝福话语升华友谊', '愿友谊像春草一样常青，祝一路顺风！', '借景抒情收尾')
          ]
        }
      }
    },

    // =========================================================================
    // 语文E卷：字词句与古诗专项提优卷（E卷）
    // =========================================================================
    {
      id: 'cn_paper_e',
      letter: '语文E',
      label: '语文E卷 · 字词句古诗提优',
      title: '统编版二年级语文《字词句与古诗日积月累》提优卷（E卷）',
      subtitle: '涵盖：多音字转、少字族、独体字查字典、留言条格式、《江雪》《梅花》、《夏夜河畔的点点微光》阅读与星夜高楼写话',
      sec1Questions: [
        {
          key: 'q1', num: 1, points: 6,
          title: '多音字“转 / 分”读音辨析',
          badge: '字音闯关',
          visualHtml: `<div class="inline-flex flex-wrap items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#fffbeb] border border-amber-300/90 shadow-2xs">
          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">zhuǎn 转身</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">转</span>
            </div>
          </div>

          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">zhuàn 转动</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">转</span>
            </div>
          </div>
        <span class="ml-2 pl-2.5 border-l border-amber-300 text-xs font-bold text-amber-950">多音字：改方向 vs 绕圈转</span></div>`,
          promptPrefix: '在“小明转过身去，看见大风车转得飞快”这句话中，两个“转”字的正确读音依次是（',
          promptSuffix: '）。',
          choices: ['zhuàn 、 zhuǎn', 'zhuǎn 、 zhuàn', 'zhuǎn 、 zhuǎn'],
          correctIdx: 2,
          explainDetail: '改变方向（转身、转弯）读三声 zhuǎn；绕着中心转圈（转动、风车转）读四声 zhuàn，选 ②',
          animData: {
            type: 'cn_pinyin_tree', charText: '转', branchA: 'zhuǎn（改变方向：转身、转弯、转学）', branchB: 'zhuàn（绕圈旋转：转动、转圈、风车转）',
            tip: '身体改变方向是“转（zhuǎn）身”，车轮风车绕轴转圈是“转（zhuàn）得飞快”！', ans: '② zhuǎn 、 zhuàn',
            steps: [
              step('第一步：判断“转过身去”', '方向改变，读三声 zhuǎn。', '转（zhuǎn）身'),
              step('第二步：判断“风车转得飞快”', '绕着中心轴旋转，读四声 zhuàn，选 ②！', '选 ②')
            ]
          }
        },
        {
          key: 'q2', num: 2, points: 6,
          title: '“少”字族与“方”字族选字填空',
          badge: '偏旁字族',
          visualHtml: `<div class="inline-flex flex-wrap items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#fffbeb] border border-amber-300/90 shadow-2xs">
          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">chǎo 火+少</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">炒</span>
            </div>
          </div>

          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">chǎo 口+少</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">吵</span>
            </div>
          </div>

          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">chāo 扌+少</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">抄</span>
            </div>
          </div>
        <span class="ml-2 pl-2.5 border-l border-amber-300 text-xs font-bold text-amber-950">“少”字族形声字</span></div>`,
          promptPrefix: '选字填空：“妈妈在厨房里（  ）菜，妹妹在客厅里大（  ）大闹，哥哥正在认认真真地（  ）写生字。”依次应填（',
          promptSuffix: '）。',
          choices: ['炒 、 吵 、 抄', '吵 、 炒 、 抄', '抄 、 吵 、 炒'],
          correctIdx: 1,
          explainDetail: '有火能炒菜（炒），有口大声吵（吵），有手抄写字（抄），依次填“炒、吵、抄”，选 ①',
          animData: {
            type: 'cn_char_split', radical: '火 / 口 / 扌', stem: '少 (shǎo)', compound: '炒菜 / 吵闹 / 抄写',
            rule: '有火能炒菜（炒），有口大声吵（吵），有手抄写字（抄），有水沙子多（沙）！', ans: '① 炒 、 吵 、 抄',
            steps: [
              step('第一步：看偏旁配动作', '做菜需要火（炒），大喊大闹需要嘴（吵），写字需要手（抄）。', '火➔炒 ｜ 口➔吵 ｜ 扌➔抄'),
              step('第二步：锁定答案', '选 ①！', '选 ①')
            ]
          }
        },
        {
          key: 'q3', num: 3, points: 6,
          title: '独体字部首查字法（申 / 亏 / 丹）',
          badge: '查字典必考',
          promptPrefix: '用“部首查字法”查独体字“申（shēn）”时，因为独体字不能拆分，应该先查它的（',
          promptSuffix: '）。',
          choices: ['第一笔（起笔）竖“丨” ， 再查 4 画', '最后一笔竖“丨” ， 再查 5 画', '中间的“日”字 ， 再查 1 画'],
          correctIdx: 1,
          explainDetail: '二年级查字典重要规则：独体字本身不是部首时，就查它的第一笔（起笔）！“申”共5画，第一笔是“丨”，除去部首再查4画，选 ①',
          animData: {
            type: 'cn_char_split', radical: '起笔：丨（1画）', stem: '剩余：4画', compound: '申（共5画）',
            rule: '独体字查字典黄金法则：本身不是部首的独体字，一律查它的第一笔（起笔）！', ans: '① 第一笔竖“丨”，再查 4 画',
            steps: [
              step('第一步：确定独体字“申”的第一笔', '“申”的笔顺：竖（丨）、横折、横、横、竖，共5画，第一笔是“丨”。', '先查起笔：丨'),
              step('第二步：用总笔画5减去1画', '5 - 1 = 4（画），选 ①！', '选 ①')
            ]
          }
        },
        {
          key: 'q4', num: 4, points: 6,
          title: '二年级应用文必考：《留言条》格式',
          badge: '写话应用文',
          visualHtml: `<div class="inline-flex flex-wrap items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#fffbeb] border border-amber-300/90 shadow-2xs">
          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">liú</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">留</span>
            </div>
          </div>

          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">yán</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">言</span>
            </div>
          </div>

          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">tiáo</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">条</span>
            </div>
          </div>
        <span class="ml-2 pl-2.5 border-l border-amber-300 text-xs font-bold text-amber-950">格式：称呼顶格 · 正文空两格 · 右下角署名日期</span></div>`,
          promptPrefix: '二年级写《留言条》时，正确的格式顺序是（',
          promptSuffix: '）。',
          choices: [
            '先写称呼（顶格写） ➔ 再写正文（空两格） ➔ 最后在右下角写署名和日期',
            '先在右下角写日期 ➔ 再写正文 ➔ 最后写称呼',
            '不用写给谁，也不用写自己的名字'
          ],
          correctIdx: 1,
          explainDetail: '留言条标准格式：①第一行顶格写称呼加冒号；②下一行空两格写清楚什么事；③右下角先写自己的名字（署名），下一行写日期，选 ①',
          animData: {
            type: 'cn_story_flow', flowTitle: '📝 二年级《留言条》满分格式',
            nodes: ['①顶格写称呼：妈妈：', '②换行空两格写正文', '③右下角写自己的名字', '④名字下方写日期'],
            tip: '记住口诀：称呼顶格加冒号，正文换行空两格，署名日期右下角（先名字后日期）！', ans: '① 称呼顶格 ➔ 正文空两格 ➔ 右下角署名和日期',
            steps: [
              step('第一步：看开头称呼位置', '写给谁就把谁写在第一行最左边（顶格），后面加上冒号。', '顶格写称呼'),
              step('第二步：看正文与落款位置', '正文另起一行空两格；右下角先写署名、再写日期，选 ①！', '选 ①')
            ]
          }
        }
      ],
      sec2Questions: [
        {
          key: 'q5', num: 5, points: 7,
          title: '含有动物名称的成语积累（二上园地八）',
          badge: '成语广角',
          promptPrefix: '二年级上册语文园地八积累了许多带有动物的成语，下面成语书写完全正确的一组是（',
          promptSuffix: '）。',
          choices: [
            '狼吞虎咽 、 惊弓之鸟 、 龙飞凤舞 、 如鱼得水',
            '胆小如猫 、 害群之牛 、 漏网之虾',
            '鸡鸣猫叫 、 狐假狼威'
          ],
          correctIdx: 1,
          explainDetail: '园地八必背动物成语：狼吞虎咽、龙飞凤舞、鸡鸣狗吠、惊弓之鸟、漏网之鱼、害群之马、胆小如鼠、如鱼得水、如虎添翼，选 ①',
          animData: {
            type: 'cn_scroll', poemTitle: '园地必背 · 动物成语宝库',
            verseTop: '🐺🐯 狼吞虎咽 · 🐉🦚 龙飞凤舞 · 🐔🐶 鸡鸣狗吠', verseBottom: '🐦 惊弓之鸟 · 🐟 漏网之鱼 · 🐴 害群之马 · 🐭 胆小如鼠',
            tip: '注意固定搭配：胆小如【鼠】、害群之【马】、漏网之【鱼】、鸡鸣【狗】吠！', ans: '① 狼吞虎咽、惊弓之鸟、龙飞凤舞、如鱼得水',
            steps: [
              step('第一步：纠正错误选项中的动物', '应该是胆小如鼠、害群之马、漏网之鱼、鸡鸣狗吠、狐假虎威。', '排除 ②、③'),
              step('第二步：锁定完全正确的一组', '选 ①！', '选 ①')
            ]
          }
        },
        {
          key: 'q6', num: 6, points: 7,
          title: '特殊颜色词（雪白 / 火红 / 金黄）',
          badge: '词语妙用',
          promptPrefix: '像“雪白、火红、桃红、金黄、碧绿”这样由“事物名称 + 颜色”组成的词语，如果用来形容【晴朗无云的蓝天】，最恰当的是（',
          promptSuffix: '）。',
          choices: ['草绿 / 翠绿', '天蓝 / 蔚蓝', '柠檬黄 / 橘黄'],
          correctIdx: 2,
          explainDetail: '形容晴朗天空的蓝色，用“天蓝、蔚蓝、瓦蓝”；草绿形容小草，柠檬黄形容黄色水果，选 ②',
          animData: {
            type: 'cn_grammar_train', leftPart: '❄️雪白 · 🔥火红 · 🌾金黄', midWord: '事物+颜色词', rightPart: '🌌天蓝 · 🌿草绿 · 🍋柠檬黄',
            tip: '用典型事物的颜色来命名色彩，晴朗的天空当然是“天蓝 / 蔚蓝”！', ans: '② 天蓝 / 蔚蓝',
            steps: [
              step('第一步：看题干要求形容的对象', '“晴朗无云的蓝天”属于蓝色系。', '对象：蓝天'),
              step('第二步：锁定蓝色系词汇', '选 ② 天蓝 / 蔚蓝！', '选 ②')
            ]
          }
        },
        {
          key: 'q7', num: 7, points: 7,
          title: '扩写句子（加上修饰词让句子更生动）',
          badge: '句子升级',
          promptPrefix: '把简单句“小鱼游来游去”扩写得更具体、更生动，最好的一句是（',
          promptSuffix: '）。',
          choices: [
            '小鱼在水里。',
            '快活的小鱼在清澈见底的小河里自由自在地游来游去。',
            '小鱼游走了。'
          ],
          correctIdx: 2,
          explainDetail: '扩句秘籍：加上“什么样的（快活的）+ 在哪里（清澈见底的小河里）+ 怎么样地（自由自在地）”，句子立刻丰富生动，选 ②',
          animData: {
            type: 'cn_grammar_train', leftPart: '快活的小鱼（什么样的）', midWord: '在清澈见底的小河里（哪里）', rightPart: '自由自在地游来游去（怎样游）',
            tip: '扩句三步法：加形容词 + 加地点 + 加动作状态！', ans: '② 快活的小鱼在清澈见底的小河里自由自在地游来游去。',
            steps: [
              step('第一步：看原句“小鱼游来游去”', '原句只有主语和动作，缺少细节。', '基础句：小鱼游来游去'),
              step('第二步：加上修饰成分', '快活的小鱼 + 在清澈见底的小河里 + 自由自在地游来游去，选 ②！', '选 ②')
            ]
          }
        },
        {
          key: 'q8', num: 8, points: 7,
          title: '《十二生肖》顺序排列（二下园地三必背）',
          badge: '传统文化',
          promptPrefix: '二年级下册语文园地三《十二生肖》中，“子鼠、丑牛、寅虎、卯兔”后面紧接着的两个生肖是（',
          promptSuffix: '）。',
          choices: ['辰龙 、 巳蛇', '午马 、 未羊', '申猴 、 酉鸡'],
          correctIdx: 1,
          explainDetail: '十二生肖完整顺序：子鼠、丑牛、寅虎、卯兔、辰龙、巳蛇、午马、未羊、申猴、酉鸡、戌狗、亥猪，卯兔后面是“辰龙、巳蛇”，选 ①',
          animData: {
            type: 'cn_story_flow', flowTitle: '🐲 十二生肖顺序歌',
            nodes: ['🐭🐮🐯🐰 鼠牛虎兔', '🐲🐍🐴🐑 龙蛇马羊', '🐵🐔🐶🐷 猴鸡狗猪'],
            tip: '四字一组最好背：鼠牛虎兔 ➔ 龙蛇马羊 ➔ 猴鸡狗猪！', ans: '① 辰龙 、 巳蛇',
            steps: [
              step('第一步：背诵第一组“子鼠、丑牛、寅虎、卯兔”', '前四个是鼠、牛、虎、兔。', '鼠牛虎兔'),
              step('第二步：接出第二组开头两个', '辰龙、巳蛇，选 ①！', '选 ① 辰龙 、 巳蛇')
            ]
          }
        }
      ],
      sec3Questions: [
        {
          key: 'q9', num: 9, points: 5,
          title: '古诗意境与品格：《江雪》',
          badge: '必背古诗',
          visualHtml: `<div class="inline-flex items-center gap-3 p-2 pr-4 rounded-xl bg-[#fffbeb] border border-amber-300 shadow-2xs">
      <img src="assets/poetry/jiang_xue.webp" alt="唐·柳宗元《江雪》" class="w-20 h-12 rounded-lg object-cover border border-amber-200 shrink-0" loading="lazy" />
      <div class="text-xs">
        <div class="font-black text-amber-950">唐·柳宗元《江雪》</div>
        <div class="font-bold text-slate-700 mt-0.5">千山鸟飞绝，万径人踪灭。</div>
      </div>
    </div>`,
          promptPrefix: '柳宗元在《江雪》中描写老渔翁独自在漫天风雪的寒江上钓鱼的名句是：“孤舟蓑笠翁，（',
          promptSuffix: '）。”',
          choices: ['独钓寒江雪', '风吹草低见牛羊', '凌寒独自开'],
          correctIdx: 1,
          explainDetail: '《江雪》全诗：“千山鸟飞绝，万径人踪灭。孤舟蓑笠翁，独钓寒江雪。”选 ①',
          animData: {
            type: 'cn_scroll', poemId: 'jiang_xue', poemTitle: '唐·柳宗元《江雪》',
            verseTop: '千山鸟飞绝，万径人踪灭。', verseBottom: '孤舟蓑笠翁，独钓寒江雪。',
            tip: '前四句每一句开头第一个字连起来正是“千万孤独”！', ans: '① 独钓寒江雪',
            steps: [
              step('第一步：朗读前三句', '千山鸟飞绝，万径人踪灭。孤舟蓑笠翁……', '孤舟蓑笠翁'),
              step('第二步：接出末句', '独钓寒江雪，选 ①！', '选 ①')
            ]
          }
        },
        {
          key: 'q10', num: 10, points: 5,
          title: '古诗名句理解：《梅花》',
          badge: '必背古诗',
          promptPrefix: '宋代王安石《梅花》“墙角数枝梅，凌寒独自开。遥知不是雪，为有暗香来”中，诗人远远就知道那洁白的花朵不是雪，是因为（',
          promptSuffix: '）。',
          choices: ['太阳出来把雪晒化了', '有一阵阵幽雅的梅花清香飘过来（为有暗香来）', '梅花是五颜六色的'],
          correctIdx: 2,
          explainDetail: '“遥知不是雪，为有暗香来”意思是远远望去就知道那不是白雪，因为有一股幽香飘过来（雪是没有香味的），选 ②',
          animData: {
            type: 'cn_scroll', poemId: 'mei_hua', poemTitle: '宋·王安石《梅花》',
            verseTop: '墙角数枝梅，凌寒独自开。', verseBottom: '遥知不是雪，为（wèi）有暗香来。',
            tip: '白梅和白雪颜色一样白，但梅花有幽香而雪无香，所以“为有暗香来”！', ans: '② 有一阵阵幽雅的梅花清香飘过来',
            steps: [
              step('第一步：理解“为有暗香来”', '“为”读 wèi（因为），“暗香”指梅花幽雅的清香。', '因为有暗香飘来'),
              step('第二步：锁定答案', '选 ②！', '选 ②')
            ]
          }
        },
        {
          key: 'q11', num: 11, points: 5,
          title: '古诗童趣理解：《小儿垂钓》',
          badge: '必背古诗',
          promptPrefix: '唐代胡令能《小儿垂钓》“路人借问遥招手，怕得鱼惊不应人”中，小娃娃向问路的过路人远远摆手不出声，是因为（',
          promptSuffix: '）。',
          choices: ['他不认识路，不想理别人', '他生怕说话声惊跑了水里的鱼儿', '他在向好朋友挥手打招呼'],
          correctIdx: 2,
          explainDetail: '“怕得鱼惊不应人”写出了钓鱼小娃专心致志，怕说话声吓跑水里的鱼儿，所以远远摆手示意路人别出声，选 ②',
          animData: {
            type: 'cn_scroll', poemId: 'xiao_er_chui_diao', poemTitle: '唐·胡令能《小儿垂钓》',
            verseTop: '蓬头稚子学垂纶，侧坐莓苔草映身。', verseBottom: '路人借问遥招手，怕得鱼惊不应人。',
            tip: '“遥招手”在这里是摇手、摆手示意别出声，原因就在最后一句“怕得鱼惊不应人”！', ans: '② 他生怕说话声惊跑了水里的鱼儿',
            steps: [
              step('第一步：读最后一句“怕得鱼惊不应人”', '“鱼惊”指鱼儿受惊逃跑，“不应人”指不敢出声回答路人。', '怕得鱼惊'),
              step('第二步：锁定答案', '选 ②！', '选 ②')
            ]
          }
        },
        {
          key: 'q12', num: 12, points: 5,
          title: '古诗珍惜粮食：《悯农（其一）》',
          badge: '必背古诗',
          promptPrefix: '唐代李绅《悯农（其一）》“春种一粒粟，秋收万颗子。四海无闲田，农夫犹饿死”表达了诗人对农民怎样的情感？（',
          promptSuffix: '）',
          choices: ['对辛勤劳作农民的深切同情，提醒我们要珍惜粮食', '认为种田非常轻松容易', '描写秋游的快乐'],
          correctIdx: 1,
          explainDetail: '“悯”就是怜悯、同情的意思。诗人用丰收（万颗子、无闲田）与农夫“犹饿死”作强烈对比，表达对农民的深切同情，选 ①',
          animData: {
            type: 'cn_scroll', poemId: 'min_nong_qi_yi', poemTitle: '唐·李绅《悯农（其一）》',
            verseTop: '春种一粒粟，秋收万颗子。', verseBottom: '四海无闲田，农夫犹饿死。',
            tip: '“悯农”= 同情农民！读完这首诗，我们要懂得一粥一饭来之不易，爱惜粮食。', ans: '① 对辛勤劳作农民的深切同情，珍惜粮食',
            steps: [
              step('第一步：理解题目“悯农”的“悯”字', '“悯”是同情、怜悯的意思。', '悯 = 同情'),
              step('第二步：锁定答案', '选 ①！', '选 ①')
            ]
          }
        }
      ],
      readingPassage: {
        title: '夏夜河畔的点点微光',
        svg: SVG_SCENES.fireflyNight,
        paragraphs: [
          '① 夏天的夜晚，热气渐渐散去，没有月亮的夜空深邃而又宁静。远处的青山隐没在淡淡的夜雾里，河岸边的芦苇在晚风中轻轻摇曳。',
          '② 宽阔的河面上停着一艘小巧的乌篷木船，船头挂着一盏温暖的琥珀色渔灯。在漆黑的夜色里，那一星亮光静静闪烁，就像草丛里飞出的一点萤火虫微光。老渔翁戴着斗笠坐在船头，正专心地整理着渔网。',
          '③ 忽然，一阵清凉的夜风吹过河面，漾起层层细小的波浪。水中的渔灯倒影随着波浪摇晃、散开，瞬间化作了无数闪闪烁烁的金色光点，远远望去，就好像满天的星星全都落进了河水里一样迷人！'
        ],
        questions: [
          {
            key: 'q13', num: 13, points: 4,
            title: '阅读理解（1）：时间与环境特点',
            promptPrefix: '第①自然段描写的是什么季节、什么时候的景色？当时的夜空有什么特点？（',
            promptSuffix: '）',
            choices: ['春天的早晨 ； 阳光灿烂', '夏天的夜晚 ； 没有月亮，深邃宁静', '冬天的中午 ； 大雪纷飞'],
            correctIdx: 2,
            explainDetail: '第①段开头写：“夏天的夜晚，热气渐渐散去，没有月亮的夜空深邃而又宁静。”选 ②',
            animData: {
              type: 'cn_story_flow', flowTitle: '🌙 夏夜河畔环境提取',
              nodes: ['⏰时间：夏天的夜晚', '🌌夜空：没有月亮（月黑）', '🌾岸边：芦苇轻轻摇曳'],
              tip: '直接看第①自然段第一句话即可锁定答案！', ans: '② 夏天的夜晚 ； 没有月亮，深邃宁静',
              steps: [
                step('第一步：读第①段第一句', '“夏天的夜晚，热气渐渐散去，没有月亮的夜空深邃而又宁静。”', '夏夜 · 无月宁静'),
                step('第二步：锁定答案', '选 ②！', '答案：②')
              ]
            }
          },
          {
            key: 'q14', num: 14, points: 4,
            title: '阅读理解（2）：比喻句赏析',
            promptPrefix: '第②自然段中，船头挂着的那一盏温暖的渔灯，在黑夜里远远看去像什么？（',
            promptSuffix: '）',
            choices: ['像一轮火红的大太阳', '像一点小小的萤火虫微光', '像一座高大的山峰'],
            correctIdx: 2,
            explainDetail: '第②段写：“在漆黑的夜色里，那一星亮光静静闪烁，就像草丛里飞出的一点萤火虫微光。”对应《舟夜书所见》“孤光一点萤”，选 ②',
            animData: {
              type: 'cn_grammar_train', leftPart: '船头一星渔灯（本体）', midWord: '像', rightPart: '一点萤火虫微光（喻体）',
              tip: '观察插图中小船船头那盏温暖的黄灯，在夜色里正像一点萤火！', ans: '② 像一点小小的萤火虫微光',
              steps: [
                step('第一步：定位第②段第2句', '“就像草丛里飞出的一点萤火虫微光。”', '一点萤火虫微光'),
                step('第二步：锁定答案', '选 ②！', '答案：②')
              ]
            }
          },
          {
            key: 'q15', num: 15, points: 4,
            title: '阅读理解（3）：动态变化原因',
            promptPrefix: '根据第③自然段和插图，为什么平静水面上的灯光倒影会突然变成“满河闪烁的金色星光”？（',
            promptSuffix: '）',
            choices: [
              '因为天上的星星真的掉进河里了',
              '因为夜风吹起层层细浪，渔灯的倒影随水波摇晃散开了',
              '因为河里有许多金鱼在吐泡泡'
            ],
            correctIdx: 2,
            explainDetail: '第③段写：“一阵清凉的夜风吹过河面，漾起层层细小的波浪。水中的渔灯倒影随着波浪摇晃、散开，瞬间化作了无数闪闪烁烁的金色光点”，选 ②',
            animData: {
              type: 'cn_story_flow', flowTitle: '✨ 散作满河星的奥秘',
              nodes: ['🌬️夜风吹拂河面', '🌊漾起层层细浪', '🏮渔灯倒影随波散开', '⭐化作满河金色星光'],
              tip: '看插图下半部分水面上金光闪闪的波纹，那是渔灯在水浪里的倒影！', ans: '② 夜风吹起细浪，渔灯倒影随波散开',
              steps: [
                step('第一步：定位第③段原因描写', '夜风吹起细浪 ➔ 渔灯倒影随波散开。', '风吹浪起灯影散'),
                step('第二步：锁定答案', '选 ②！', '答案：②')
              ]
            }
          },
          {
            key: 'q16', num: 16, points: 4,
            title: '阅读理解（4）：诗文对应',
            promptPrefix: '这篇短文和插图描绘的正是清代诗人查慎行哪首古诗的意境？（',
            promptSuffix: '）',
            choices: [
              '《舟夜书所见》（月黑见渔灯，孤光一点萤。微微风簇浪，散作满河星）',
              '《登鹳雀楼》（白日依山尽，黄河入海流）',
              '《咏柳》（碧玉妆成一树高，万条垂下绿丝绦）'
            ],
            correctIdx: 1,
            explainDetail: '无月黑夜、渔船孤灯如萤、微风簇浪散作满河星，正是二年级下册古诗《舟夜书所见》的画面，选 ①',
            animData: {
              type: 'cn_scroll', poemId: 'zhou_ye_shu_suo_jian', poemTitle: '清·查慎行《舟夜书所见》',
              verseTop: '月黑见渔灯，孤光一点萤。', verseBottom: '微微风簇浪，散作满河星。',
              tip: '以画学诗、以文解诗，诗画合一印象最深！', ans: '① 《舟夜书所见》',
              steps: [
                step('第一步：核对诗句意象', '月黑、渔灯、一点萤、风簇浪、满河星。', '完全对应《舟夜书所见》'),
                step('第二步：锁定答案', '选 ①！', '答案：①')
              ]
            }
          }
        ]
      },
      writingTask: {
        title: '看图写话：星夜登上山顶高楼',
        svg: SVG_SCENES.doDishes,
        sceneDesc: '仔细观察左图：夜晚的山顶高楼有多高？天空中有什么？山腰间飘着什么？站在高楼走廊上仰望星空的人心情怎样？',
        wordBank: ['繁星点点', '弯月如钩', '云海翻涌', '高耸入云', '伸手摘星', '静谧迷人'],
        blanks: [
          {
            key: 'q17_time', label: '① 星夜与山寺位置', points: 3,
            prefix: '静谧的夜晚，一轮弯弯的明月挂在深蓝色的夜空，漫天繁星一眨一眨地闪着银光。陡峭的高山顶上矗立着一座（', suffix: '）。',
            choices: ['高耸入云、灯火温暖的古老木楼', '矮小破旧的草棚', '热闹的地下超市'],
            correctIdx: 1
          },
          {
            key: 'q17_who', label: '② 俯瞰云海与仰望星空', points: 3,
            prefix: '洁白如纱的云雾在半山腰间翻涌缭绕，诗人独自站在高高的木楼栏杆旁，抬头仰望，只觉得（', suffix: '）。',
            choices: ['头顶的闪亮星星离自己近极了，只要轻轻一伸手好像就能摘下来', '天上正在下倾盆大雨', '太阳晒得人满头大汗'],
            correctIdx: 1
          },
          {
            key: 'q17_do', label: '③ 静夜不敢高声语', points: 3,
            prefix: '山顶的夜色是那样宁静优美，窗户里透出柔和的橘黄灯光，诗人（', suffix: '）。',
            choices: ['屏住呼吸、不敢大声说话，生怕惊动了住在天宫里的仙人', '敲锣打鼓大声喊叫', '在走廊上踢足球'],
            correctIdx: 1
          },
          {
            key: 'q17_feel', label: '④ 梦幻意境结尾', points: 3,
            prefix: '微风拂过崖边的苍松，（', suffix: '），真是一个奇妙而又梦幻的星夜呀！',
            choices: ['这云端之上的山顶高楼仿佛让人置身于美丽的童话仙境之中', '大家都急着去上学了', '池塘里的青蛙呱呱叫'],
            correctIdx: 1
          }
        ],
        modelEssay: '静谧的夜晚，一轮弯弯的明月挂在深蓝色的夜空，漫天繁星一眨一眨地闪着银光。陡峭的高山顶上矗立着一座高耸入云、灯火温暖的古老木楼。洁白如纱的云雾在半山腰间翻涌缭绕，诗人独自站在高高的木楼栏杆旁，抬头仰望，只觉得头顶的闪亮星星离自己近极了，只要轻轻一伸手好像就能摘下来。山顶的夜色是那样宁静优美，窗户里透出柔和的橘黄灯光，诗人屏住呼吸、不敢大声说话，生怕惊动了住在天宫里的仙人。微风拂过崖边的苍松，这云端之上的山顶高楼仿佛让人置身于美丽的童话仙境之中，真是一个奇妙而又梦幻的星夜呀！',
        explainDetail: '星夜高楼写话四步：①弯月繁星下山顶高楼灯火温暖 + ②云海在脚下翻涌、伸手仿佛可摘星 + ③屏住呼吸不敢大声说话 + ④宛如置身童话仙境！',
        animData: {
          type: 'cn_story_flow', flowTitle: '✍️ 看图写话空间想象法：星夜登高楼',
          nodes: ['🌙天空：弯月高悬繁星闪烁', '☁️山腰：紫色云海苍松环绕', '🏯高楼：凭栏远眺伸手摘星', '🤫想象：轻声细语恐惊仙人'],
          tip: '按照“从上到下、由景及人”的顺序观察插图，再加上奇妙的想象，写话立刻生动优美！', ans: '满分范文已解锁',
          steps: [
            step('第一步：描写夜空与高山楼阁', '弯弯月牙、点点繁星、半山云海与窗透暖光的高楼。', '写景：星月云海高楼'),
            step('第二步：写楼上人物的感受与想象', '星星近在咫尺，伸手仿佛可摘；不敢大声说话怕惊动天上仙人。', '写人：夸张与想象'),
            step('第三步：总结梦幻感受收尾', '宛如置身美丽的云端仙境！', '意境升华')
          ]
        }
      }
    },

    // =========================================================================
    // 语文F卷：寓言道理与阅读拔高卷（F卷）
    // =========================================================================
    {
      id: 'cn_paper_f',
      letter: '语文F',
      label: '语文F卷 · 寓言与阅读拔高',
      title: '统编版二年级语文《课内名篇、寓言与阅读理解》拔高卷（F卷）',
      subtitle: '涵盖：多音字漂、同音字己/已/以、《寒号鸟》《小马过河》、《彩虹乐园里的好伙伴》阅读与大草原牛羊写话',
      sec1Questions: [
        {
          key: 'q1', num: 1, points: 6,
          title: '多音字“漂 / 尽”读音辨析',
          badge: '字音闯关',
          visualHtml: `<div class="inline-flex flex-wrap items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#fffbeb] border border-amber-300/90 shadow-2xs">
          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">piāo 漂流</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">漂</span>
            </div>
          </div>

          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">piào 漂亮</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">漂</span>
            </div>
          </div>
        <span class="ml-2 pl-2.5 border-l border-amber-300 text-xs font-bold text-amber-950">《纸船和风筝》多音字</span></div>`,
          promptPrefix: '在《纸船和风筝》“纸船漂哇漂，漂到了小熊家门口，小熊看着漂亮的纸船乐坏了”中，两个“漂”字依次读（',
          promptSuffix: '）。',
          choices: ['piào 、 piāo', 'piāo 、 piào', 'piāo 、 piāo'],
          correctIdx: 2,
          explainDetail: '顺水流动“漂流、漂哇漂”读一声 piāo；好看美丽“漂亮”读四声 piào，选 ②',
          animData: {
            type: 'cn_pinyin_tree', charText: '漂', branchA: 'piāo（顺水浮流：漂流、漂浮、漂哇漂）', branchB: 'piào（美丽好看：漂亮）',
            tip: '纸船在水面上浮着走读一声 piāo（漂哇漂）；夸赞好看读四声 piào（漂亮）！', ans: '② piāo 、 piào',
            steps: [
              step('第一步：看“漂到了小熊家门口”', '表示纸船顺水漂流，读一声 piāo。', '漂（piāo）流'),
              step('第二步：看“漂亮的纸船”', '表示美丽好看，读四声 piào，选 ②！', '漂（piào）亮（选 ②）')
            ]
          }
        },
        {
          key: 'q2', num: 2, points: 6,
          title: '易混字“已 / 以 / 己”精准辨析',
          badge: '字形辨析',
          visualHtml: `<div class="inline-flex flex-wrap items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#fffbeb] border border-amber-300/90 shadow-2xs">
          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">jǐ 自己</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">己</span>
            </div>
          </div>

          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">yǐ 已经</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">已</span>
            </div>
          </div>

          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">yǐ 以后</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">以</span>
            </div>
          </div>
        <span class="ml-2 pl-2.5 border-l border-amber-300 text-xs font-bold text-amber-950">张口己 · 半封已 · 竖提点人以</span></div>`,
          promptPrefix: '选字填空：“自（  ）的事情自（  ）做，我现在（  ）经二年级了，（  ）后会更加努力！”依次应填（',
          promptSuffix: '）。',
          choices: ['己 、 己 、 已 、 以', '已 、 已 、 己 、 以', '己 、 已 、 以 、 已'],
          correctIdx: 1,
          explainDetail: '全开口是“自己”（己），半封口是“已经”（已），“以后、可以”用“以”，依次填“己、己、已、以”，选 ①',
          animData: {
            type: 'cn_char_split', radical: '己 (jǐ 自己)', stem: '已 (yǐ 已经) / 以 (yǐ 以后)', compound: '自己 · 已经 · 以后',
            rule: '顺口溜：张大口是自己（己），半封口是已经（已），竖提点人是以（以后、可以）！', ans: '① 己 、 己 、 已 、 以',
            steps: [
              step('第一步：区分“己”和“已”', '“自己”用全开口的“己”；“已经”用半封口的“已”。', '自己 vs 已经'),
              step('第二步：填入“以后”', '“以后”用“以”，选 ①！', '选 ① 己 、 己 、 已 、 以')
            ]
          }
        },
        {
          key: 'q3', num: 3, points: 6,
          title: '部首查字法：“巨 / 匹 / 医”三包围结构',
          badge: '查字典必考',
          promptPrefix: '用“部首查字法”查“匹（pǐ）”和“医（yī）”这两个三包围结构的字，应该先查部首（',
          promptSuffix: '）。',
          choices: ['“匚”（三框儿，2画）', '“儿”和“矢”', '“口”（3画）'],
          correctIdx: 1,
          explainDetail: '“匹、医、巨、区”都是三面包围结构，外面的三框儿“匚”（2画）就是它们的部首，选 ①',
          animData: {
            type: 'cn_char_split', radical: '匚（三框儿，2画）', stem: '儿(2画) / 矢(5画)', compound: '匹 / 医',
            rule: '三面包围结构（匹、医、区、巨）统一先查外面的三框儿“匚”（共2画）！', ans: '① “匚”（三框儿，2画）',
            steps: [
              step('第一步：观察“匹、医”的外框', '左边、上边、下边三面合围的部首叫“三框儿（匚）”。', '部首：匚（2画）'),
              step('第二步：锁定答案', '选 ①！', '选 ①')
            ]
          }
        },
        {
          key: 'q4', num: 4, points: 6,
          title: '近义词与反义词构成的成语（出生入死 / 深入浅出）',
          badge: '词语规律',
          promptPrefix: '观察词语特点：“黑白、冷暖、深浅、生死”都是由一对反义词组成的。下面哪个四字成语里包含【两对反义词】？（',
          promptSuffix: '）',
          choices: ['惊天动地 、 欢天喜地', '左顾右盼 、 前因后果 、 大惊小怪', '一心一意 、 十全十美'],
          correctIdx: 2,
          explainDetail: '“左顾右盼”（左—右）、“前因后果”（前—后、因—果）、“大惊小怪”（大—小）都含有反义词，选 ②',
          animData: {
            type: 'cn_grammar_train', leftPart: '左 ⇄ 右（左顾右盼）', midWord: '含反义词的成语', rightPart: '前 ⇄ 后 · 大 ⇄ 小（大惊小怪）',
            tip: '找出成语里意思相反的字：左—右、前—后、大—小、南—北（南辕北辙）！', ans: '② 左顾右盼 、 前因后果 、 大惊小怪',
            steps: [
              step('第一步：圈出各选项中的反义词', '左⇄右、前⇄后、大⇄小。', '反义词配对'),
              step('第二步：锁定答案', '选 ②！', '选 ②')
            ]
          }
        }
      ],
      sec2Questions: [
        {
          key: 'q5', num: 5, points: 7,
          title: '课文主旨：《小马过河》',
          badge: '课文精读',
          promptPrefix: '二年级下册《小马过河》中，老牛说河水很浅（才没小腿），松鼠却说河水很深（会淹死人）。小马自己试过才知道河水既不像老牛说的那么浅，也不像松鼠说的那么深。这个故事告诉我们（',
          promptSuffix: '）。',
          choices: [
            '遇到河水千万不能过去',
            '光听别人说，自己不动脑筋、不去试试，是不行的；遇事要多动脑筋并亲自尝试',
            '老牛和松鼠都在故意骗小马'
          ],
          correctIdx: 2,
          explainDetail: '老牛个子高觉得水浅，松鼠个子矮觉得水深。老马妈妈的话点明主题：“孩子，光听别人说，自己不动脑筋，不去试试，是不行的。”选 ②',
          animData: {
            type: 'cn_story_flow', flowTitle: '🐴 《小马过河》思辨道理',
            nodes: ['🐮老牛高大：水很浅', '🐿️松鼠娇小：水很深', '🐴妈妈教导：动脑去试', '🌊亲自下河：深浅适中'],
            tip: '每个人的身材条件不同，看法也不同；遇事要既听取意见，又动脑筋亲自去试一试！', ans: '② 遇事要多动脑筋并亲自尝试',
            steps: [
              step('第一步：分析为什么老牛和松鼠说法相反', '老牛身材高大，松鼠身材矮小，小马身高介于两者之间。', '身材不同 ➔ 感受不同'),
              step('第二步：记住老马妈妈的中心句', '光听别人说，自己不动脑筋，不去试试，是不行的，选 ②！', '选 ②')
            ]
          }
        },
        {
          key: 'q6', num: 6, points: 7,
          title: '课文警示：《寒号鸟》',
          badge: '课文寓言',
          promptPrefix: '在《寒号鸟》一课中，喜鹊趁着秋高气爽早早修好了温暖的窝，而寒号鸟总是说“今天天气暖和，明天再做窝”，结果寒冬来临冻死了。这告诫我们（',
          promptSuffix: '）。',
          choices: [
            '美好生活要靠勤劳创造，不能像寒号鸟那样懒惰、得过且过（明日复明日）',
            '冬天应该到树洞外面去睡觉',
            '做窝是一件非常容易的事'
          ],
          correctIdx: 1,
          explainDetail: '“现在懒惰，将来难过。”《寒号鸟》告诫我们做事要有远见、勤劳踏实，不能得过且过、拖延懒惰，选 ①',
          animData: {
            type: 'cn_story_flow', flowTitle: '🐦 喜鹊与寒号鸟对比',
            nodes: ['🐦喜鹊：晴天勤劳筑暖窝', '🥶寒号鸟：得过且过拖明天', '❄️寒冬：喜鹊安眠寒号冻死', '💡道理：勤劳勿拖延'],
            tip: '课文中喜鹊的话就是中心：“现在懒惰，将来难过！”', ans: '① 美好生活靠勤劳，不能懒惰得过且过',
            steps: [
              step('第一步：对比喜鹊和寒号鸟的做法', '喜鹊勤劳早做准备，寒号鸟贪玩懒惰总拖到明天。', '勤劳 vs 懒惰拖延'),
              step('第二步：锁定寓意', '选 ①！', '选 ①')
            ]
          }
        },
        {
          key: 'q7', num: 7, points: 7,
          title: '用“像……又像……”或“有的……有的……还有的……”写排比句',
          badge: '句式仿写',
          promptPrefix: '《黄山奇石》和《葡萄沟》常常用“有的……有的……还有的……”描写丰富多彩的景象。下面句子使用最恰当的是（',
          promptSuffix: '）。',
          choices: [
            '下课了，操场上的同学们真热闹：有的在跳绳，有的在踢毽子，还有的在打乒乓球。',
            '天上只有一个太阳：有的在东边，有的在西边，还有的在南边。',
            '我今天早上：有的吃了一个鸡蛋，有的背起一个书包。'
          ],
          correctIdx: 1,
          explainDetail: '“有的……有的……还有的……”用于描写许多同类人或事物在同一场景下的不同表现（如许多同学在操场活动），选 ①',
          animData: {
            type: 'cn_grammar_train', leftPart: '有的在跳绳🪢', midWord: '有的在踢毽子🪶', rightPart: '还有的在打乒乓球🏓',
            tip: '用“有的……有的……还有的……”时，前面要先写一个总体复数对象（如：下课了同学们、公园里的菊花、天上的云朵）！', ans: '① 下课了，操场上的同学们真热闹……',
            steps: [
              step('第一步：检查主语是否为多个对象', '“操场上的同学们”是许多人，可以分成“有的……有的……还有的……”。', '复数主体 + 三种活动'),
              step('第二步：锁定答案', '选 ①！', '选 ①')
            ]
          }
        },
        {
          key: 'q8', num: 8, points: 7,
          title: '诚信名言积累（二下园地三必背）',
          badge: '园地日积月累',
          promptPrefix: '《左传》和《韩非子》中都强调做人要讲诚信。下面哪一句名言意思是“微小的信用如果不建立，大的事情就很难做成”？（',
          promptSuffix: '）',
          choices: [
            '小信成则大信立。——《韩非子》',
            '飞流直下三千尺，疑是银河落九天。',
            '不知细叶谁裁出，二月春风似剪刀。'
          ],
          correctIdx: 1,
          explainDetail: '二下园地三诚信名言三句：①轻诺必寡信（《老子》）；②失信不立（《左传》）；③小信成则大信立（《韩非子》），选 ①',
          animData: {
            type: 'cn_scroll', poemTitle: '日积月累 · 中华诚信名言',
            verseTop: '失信不立。——《左传》 ｜ 轻诺必寡信。——《老子》', verseBottom: '小信成则大信立。——《韩非子》',
            tip: '在小事上讲信用，就能建立起大信用，这就是“小信成则大信立”！', ans: '① 小信成则大信立。——《韩非子》',
            steps: [
              step('第一步：抓住题干“小信用 ➔ 大信用”', '小信成（小信用做好了）则大信立（大信用就能确立）。', '小信成则大信立'),
              step('第二步：锁定答案', '选 ①！', '选 ①')
            ]
          }
        }
      ],
      sec3Questions: [
        {
          key: 'q9', num: 9, points: 5,
          title: '古诗对比背诵：李白两首名诗',
          badge: '必背古诗',
          promptPrefix: '同样是唐代大诗人李白的诗，写山顶高楼的是“危楼高百尺，手可摘星辰”；写庐山瀑布的是“（',
          promptSuffix: '），疑是银河落九天”。',
          choices: ['白日依山尽', '飞流直下三千尺', '万条垂下绿丝绦'],
          correctIdx: 2,
          explainDetail: '《望庐山瀑布》后两句：“飞流直下三千尺，疑是银河落九天。”选 ②',
          animData: {
            type: 'cn_scroll', poemId: 'wang_lu_shan_pu_bu', poemTitle: '李白山水名句对比',
            verseTop: '《夜宿山寺》：危楼高百尺，手可摘星辰。', verseBottom: '《望庐山瀑布》：飞流直下三千尺，疑是银河落九天。',
            tip: '李白被称为“诗仙”，最擅长用浪漫夸张的手法写高山与飞瀑！', ans: '② 飞流直下三千尺',
            steps: [
              step('第一步：根据下句“疑是银河落九天”配对', '上句是“飞流直下三千尺”。', '飞流直下三千尺'),
              step('第二步：锁定答案', '选 ②！', '选 ②')
            ]
          }
        },
        {
          key: 'q10', num: 10, points: 5,
          title: '古诗画面配对：春天与冬天的诗句',
          badge: '古诗四季',
          promptPrefix: '下面诗句中，描写【春天】杨柳与黄莺美景的一句是（',
          promptSuffix: '）。',
          choices: [
            '千山鸟飞绝，万径人踪灭。（冬雪）',
            '草长莺飞二月天，拂堤杨柳醉春烟。（春景）',
            '墙角数枝梅，凌寒独自开。（冬梅）'
          ],
          correctIdx: 2,
          explainDetail: '“草长莺飞二月天，拂堤杨柳醉春烟”出自清代高鼎《村居》，描写农历二月早春草木萌发、黄莺飞舞、杨柳拂堤的春景，选 ②',
          animData: {
            type: 'cn_scroll', poemId: 'cun_ju', poemTitle: '四季古诗辨析 · 《村居》',
            verseTop: '草长莺飞二月天，拂堤杨柳醉春烟。', verseBottom: '二月天 + 莺飞 + 杨柳 + 春烟 = 春天！',
            tip: '看到“二月天、杨柳、春烟、春风”就是春天；看到“寒江雪、凌寒”就是冬天！', ans: '② 草长莺飞二月天，拂堤杨柳醉春烟。',
            steps: [
              step('第一步：抓季节关键词', '①“寒江雪”是冬天；②“二月天、杨柳、春烟”是春天；③“凌寒”梅花是冬天。', '锁定春天诗句'),
              step('第二步：选出正确答案', '选 ②！', '选 ②')
            ]
          }
        },
        {
          key: 'q11', num: 11, points: 5,
          title: '课文细节：《狐假虎威》百兽反应',
          badge: '课文精读',
          promptPrefix: '在《狐假虎威》中，森林里的百兽看见狐狸和老虎走过来，为什么全都吓得撒腿就跑？（',
          promptSuffix: '）',
          choices: [
            '因为百兽真正害怕的是跟在狐狸身后的大老虎',
            '因为狐狸变成了一只大恐龙',
            '因为百兽在进行跑步比赛'
          ],
          correctIdx: 1,
          explainDetail: '原来，狐狸是借着老虎的威风把百兽吓跑的，百兽真正害怕的是狐狸身后的大老虎，选 ①',
          animData: {
            type: 'cn_story_flow', flowTitle: '🦊🐯 狐假虎威真相揭秘',
            nodes: ['🦊狐狸在前神气活现', '🐯老虎在后半信半疑', '🦌百兽看见身后老虎', '🏃吓得撒腿就跑'],
            tip: '老虎受骗了，以为百兽怕狐狸，其实百兽怕的是它自己！', ans: '① 因为百兽真正害怕的是跟在狐狸身后的大老虎',
            steps: [
              step('第一步：看狐狸和老虎的站位', '狐狸走在前头，老虎跟在狐狸身后。', '前狐后虎'),
              step('第二步：点明真相', '百兽怕的是狐狸身后的大老虎，选 ①！', '选 ①')
            ]
          }
        },
        {
          key: 'q12', num: 12, points: 5,
          title: '课文景点：《日月潭》与《葡萄沟》',
          badge: '祖国山河',
          promptPrefix: '二年级上册课文中，被群山环绕、中间有个美丽小岛（光华岛）分成“日潭”和“月潭”的宝岛台湾名胜是（  ）；盛产五光十色葡萄的新疆吐鲁番好地方是（  ）。依次应填（',
          promptSuffix: '）。',
          choices: ['日月潭 、 葡萄沟', '黄山奇石 、 西湖', '天安门 、 长城'],
          correctIdx: 1,
          explainDetail: '我国台湾省最大的一个湖是“日月潭”（北边像圆圆的太阳叫日潭，南边像弯弯的月亮叫月潭）；新疆吐鲁番有个盛产水果的“葡萄沟”，选 ①',
          animData: {
            type: 'cn_story_flow', flowTitle: '🏞️ 祖国大好河山名胜卡',
            nodes: ['🏞️安徽：黄山奇石', '🌊中国台湾：日月潭(光华岛)', '🍇新疆吐鲁番：葡萄沟(五光十色)'],
            tip: '光华岛分日潭月潭 = 日月潭；茂密枝叶搭起绿色凉棚、葡萄五光十色 = 葡萄沟！', ans: '① 日月潭 、 葡萄沟',
            steps: [
              step('第一步：匹配台湾省的光华岛名胜', '日潭和月潭合称“日月潭”。', '日月潭'),
              step('第二步：匹配新疆吐鲁番的水果产地', '“葡萄沟”，选 ①！', '选 ① 日月潭 、 葡萄沟')
            ]
          }
        }
      ],
      readingPassage: {
        title: '彩虹乐园里的好伙伴',
        svg: SVG_SCENES.woodenBridge,
        paragraphs: [
          '① 一场春雨过后，天空放晴了，一道绚丽多彩的七色彩虹像一座美丽的天桥，横跨在蔚蓝的天空上。阳光洒在开满鲜花的绿草地上，空气清新极了。',
          '② 熊猫博士和小白兔来到草地中央的数字游乐园里做游戏。远处有粉红色的滑梯、木制秋千，还有挂着数字卡片的大树；草地小路上铺着写有“1、2、3、5、7”的跳格子石板。',
          '③ 熊猫博士坐在草地上，专心致志地用红、黄、蓝、绿四种颜色的积木搭起了一座小巧的城堡；背着小书包的小白兔站在大木架旁，开心地拨动着五彩缤纷的大算珠。几颗金黄色的星星小精灵在他们身边欢快地眨着眼睛，夸他们都是爱动脑筋的好孩子！'
        ],
        questions: [
          {
            key: 'q13', num: 13, points: 4,
            title: '阅读理解（1）：比喻句赏析',
            promptPrefix: '第①自然段中“一道绚丽多彩的七色彩虹像一座美丽的天桥”，这里把雨后的“七色彩虹”比作了什么？（',
            promptSuffix: '）',
            choices: ['一座美丽的天桥', '一条丝带', '一把大雨伞'],
            correctIdx: 1,
            explainDetail: '第①段第一句：“一道绚丽多彩的七色彩虹像一座美丽的天桥，横跨在蔚蓝的天空上。”选 ①',
            animData: {
              type: 'cn_grammar_train', leftPart: '七色彩虹（本体）', midWord: '像', rightPart: '一座美丽的天桥（喻体）',
              tip: '看插图上方横跨天空的弯弯彩虹，正像一座七彩天桥！', ans: '① 一座美丽的天桥',
              steps: [
                step('第一步：定位第①段第一句', '“一道绚丽多彩的七色彩虹像一座美丽的天桥。”', '像一座美丽的天桥'),
                step('第二步：锁定答案', '选 ①！', '答案：①')
              ]
            }
          },
          {
            key: 'q14', num: 14, points: 4,
            title: '阅读理解（2）：图文人物动作对应',
            promptPrefix: '仔细观察插图并读第③自然段，熊猫博士和背书包的小白兔分别在玩什么益智玩具？（',
            promptSuffix: '）',
            choices: [
              '熊猫博士在搭彩色积木城堡 ； 小白兔在拨动木架上的五彩大算珠',
              '两个都在滑滑梯',
              '熊猫博士在钓鱼 ； 小白兔在放风筝'
            ],
            correctIdx: 1,
            explainDetail: '观察插图前景并读第③段：“熊猫博士坐在草地上，专心致志地用红、黄、蓝、绿四种颜色的积木搭起了一座小巧的城堡；背着小书包的小白兔站在大木架旁，开心地拨动着五彩缤纷的大算珠。”选 ①',
            animData: {
              type: 'cn_story_flow', flowTitle: '🐼🐰 彩虹乐园伙伴分工',
              nodes: ['🐼熊猫博士：搭彩色积木城堡', '🐰小白兔：拨木架五彩算珠', '⭐星星精灵：围绕身旁微笑'],
              tip: '图文完全对应：左边熊猫搭积木，右边白兔拨算珠！', ans: '① 熊猫搭彩色积木；白兔拨五彩算珠',
              steps: [
                step('第一步：观察插图左右两个主角', '左边熊猫博士手拿蓝色三角形积木，右边小白兔手指彩色算珠架。', '搭积木 + 拨算珠'),
                step('第二步：锁定答案', '选 ①！', '答案：①')
              ]
            }
          },
          {
            key: 'q15', num: 15, points: 4,
            title: '阅读理解（3）：背景细节发现',
            promptPrefix: '根据第②自然段和插图背景，草地遠处有哪些游乐设施？小路上铺着什么？（',
            promptSuffix: '）',
            choices: [
              '远处有滑梯和秋千 ； 小路上铺着写有数字的跳格子石板',
              '远处有大海和轮船 ； 小路上全是白雪',
              '远处只有高楼大厦'
            ],
            correctIdx: 1,
            explainDetail: '第②段写：“远处有粉红色的滑梯、木制秋千……草地小路上铺着写有‘1、2、3、5、7’的跳格子石板。”插图中清晰可见，选 ①',
            animData: {
              type: 'cn_story_flow', flowTitle: '🌈 乐园背景景物清单',
              nodes: ['🛝左后方：粉红滑梯', '🎠中后方：木制秋千与数字树', '🔢脚下小路：数字跳格子石板'],
              tip: '按由远及近的顺序观察插图背景，每一处细节都在图画里！', ans: '① 远处有滑梯和秋千；小路铺着数字石板',
              steps: [
                step('第一步：核对第②段与图画背景', '滑梯、秋千、数字跳格子石板一应俱全。', '滑梯·秋千·数字石板'),
                step('第二步：锁定答案', '选 ①！', '答案：①')
              ]
            }
          },
          {
            key: 'q16', num: 16, points: 4,
            title: '阅读理解（4）：短文中心体会',
            promptPrefix: '星星小精灵为什么夸熊猫博士和小白兔是好孩子？（',
            promptSuffix: '）',
            choices: [
              '因为他们友好相处、专心致志，在游戏中爱动脑筋学习本领',
              '因为他们把玩具全都弄坏了',
              '因为他们不爱学习只爱睡懒觉'
            ],
            correctIdx: 1,
            explainDetail: '短文最后一句：“夸他们都是爱动脑筋的好孩子！”他们在游戏中专心搭积木、学算数，既快乐又爱动脑筋，选 ①',
            animData: {
              type: 'cn_scroll', poemTitle: '《彩虹乐园》成长启示',
              verseTop: '在游戏中动手又动脑', verseBottom: '友爱互助 · 快乐学习本领',
              tip: '边玩边学、专心致志动脑筋，就能收获智慧的金星星！', ans: '① 友好相处、专心致志、爱动脑筋',
              steps: [
                step('第一步：读文末最后一句', '“夸他们都是爱动脑筋的好孩子！”', '爱动脑筋'),
                step('第二步：锁定答案', '选 ①！', '答案：①')
              ]
            }
          }
        ]
      },
      writingTask: {
        title: '看图写话：大草原上的牛羊画卷',
        svg: SVG_SCENES.tugOfWar,
        sceneDesc: '仔细观察左图：大草原的天空和远山是什么样的？微风吹过草地，谁从草丛间显露出来了？远处还有什么？',
        wordBank: ['天苍苍', '野茫茫', '一望无际', '白云朵朵', '成群结队', '肥美健壮'],
        blanks: [
          {
            key: 'q17_time', label: '① 蓝天白云与巍峨阴山', points: 3,
            prefix: '晴朗的夏日，阴山脚下是一片（', suffix: '）的大草原。蔚蓝的天空像巨大的圆顶帐篷，飘浮着大朵大朵洁白的云彩。',
            choices: ['一望无际、碧绿辽阔', '狭窄拥挤、寸草不生', '高楼林立、车水马龙'],
            correctIdx: 1
          },
          {
            key: 'q17_who', label: '② 风吹草低见牛羊', points: 3,
            prefix: '微风轻轻吹过，茂盛的牧草和五颜六色的野花弯下了腰，草丛间显露出（', suffix: '）。',
            choices: ['成群结队洁白的绵羊和健壮的棕黄大牛，正悠闲地低头吃着青草', '几条在大海里游泳的大鲨鱼', '满地的冰块和雪人'],
            correctIdx: 1
          },
          {
            key: 'q17_do', label: '③ 远景蒙古包与炊烟', points: 3,
            prefix: '向草原远处望去，连绵的青山脚下立着（', suffix: '），红旗在风中飘扬，一切都显得那样宁静祥和。',
            choices: ['两座洁白的蒙古包，屋顶正袅袅升起做饭的炊烟', '一座高耸的灯塔和轮船', '一排排红绿灯'],
            correctIdx: 1
          },
          {
            key: 'q17_feel', label: '④ 赞美草原美景收尾', points: 3,
            prefix: '看着这幅“天苍苍，野茫茫，风吹草低见牛羊”的壮美画卷，我情不自禁地赞叹道：“（', suffix: '）”',
            choices: ['祖国的大草原真是太美丽、太辽阔啦！', '这里的冬天真是太冷了！', '我今天忘带雨伞了！'],
            correctIdx: 1
          }
        ],
        modelEssay: '晴朗的夏日，阴山脚下是一片一望无际、碧绿辽阔的大草原。蔚蓝的天空像巨大的圆顶帐篷，飘浮着大朵大朵洁白的云彩。微风轻轻吹过，茂盛的牧草和五颜六色的野花弯下了腰，草丛间显露出成群结队洁白的绵羊和健壮的棕黄大牛，正悠闲地低头吃着青草。向草原远处望去，连绵的青山脚下立着两座洁白的蒙古包，屋顶正袅袅升起做饭的炊烟，红旗在风中飘扬，一切都显得那样宁静祥和。看着这幅“天苍苍，野茫茫，风吹草低见牛羊”的壮美画卷，我情不自禁地赞叹道：“祖国的大草原真是太美丽、太辽阔啦！”',
        explainDetail: '草原写话四步：①蓝天白云下碧绿辽阔的大草原 + ②微风吹草露出成群白羊与黄牛 + ③远处白色蒙古包升起炊烟 + ④引用《敕勒歌》赞美祖国大草原！',
        animData: {
          type: 'cn_story_flow', flowTitle: '✍️ 看图写话由远及近法：草原牛羊画卷',
          nodes: ['☁️天空远山：蓝天白云阴山连绵', '🐑近景草地：风吹草低见牛羊', '⛺远景牧居：洁白毡房炊烟袅袅', '💖抒情结尾：赞美壮丽大草原'],
          tip: '写风景图时，按照“天空远山 ➔ 近处草地牛羊 ➔ 远处蒙古包”的顺序写，层次最分明！', ans: '满分范文已解锁',
          steps: [
            step('第一步：观察天空与远山', '蓝天如穹庐、白云朵朵、阴山连绵，草原一望无际。', '天空 + 远山'),
            step('第二步：观察近景草丛里的牛羊与远景蒙古包', '风吹牧草野花，白绵羊和黄牛低头吃草；远处蒙古包炊烟袅袅。', '牛羊 + 蒙古包'),
            step('第三步：引用诗句抒发赞美之情', '引用《敕勒歌》，赞美祖国大草原！', '诗句点睛收尾')
          ]
        }
      }
    },

    // =========================================================================
    // 语文G卷：传统文化、二十四节气与自然科普卷（G卷）
    // =========================================================================
    {
      id: 'cn_paper_g',
      letter: '语文G',
      label: '语文G卷 · 传统文化与科普',
      title: '统编版二年级语文《传统文化、节气歌与自然科普》测试卷（G卷）',
      subtitle: '涵盖：二十四节气歌、神州谣、心理偏旁、拟声词与病句、《树之歌》、《春风里的翠柳丝带》阅读与夕阳登楼写话',
      sec1Questions: [
        {
          key: 'q1', num: 1, points: 6,
          title: '多音字“行 / 朝”读音辨析',
          badge: '字音闯关',
          visualHtml: `<div class="inline-flex flex-wrap items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#fffbeb] border border-amber-300/90 shadow-2xs">
          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">háng 一行</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">行</span>
            </div>
          </div>

          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">xíng 行走</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">行</span>
            </div>
          </div>
        <span class="ml-2 pl-2.5 border-l border-amber-300 text-xs font-bold text-amber-950">《绝句》多音字</span></div>`,
          promptPrefix: '在杜甫《绝句》“两个黄鹂鸣翠柳，一行白鹭上青天”和日常词语“银行、人行道”中，“一行白鹭”的“行”应读（',
          promptSuffix: '）。',
          choices: ['xíng（行走）', 'háng（排、列，一行白鹭）', 'hàng'],
          correctIdx: 2,
          explainDetail: '表示排成行列时读 háng（一行白鹭、一行垂柳、银行）；表示走路行动时读 xíng（人行道、流行），选 ②',
          animData: {
            type: 'cn_pinyin_tree', charText: '行', branchA: 'háng（行列、银行：一行白鹭、一行垂柳）', branchB: 'xíng（行走、可以：行人、自行车）',
            tip: '排成整齐的一队叫“一行（háng）”，千万别读成 xíng 哦！', ans: '② háng（排、列，一行白鹭）',
            steps: [
              step('第一步：理解“一行白鹭”的含义', '指白鹭排成整齐的一列飞上蓝天。', '一列/一排 = háng'),
              step('第二步：锁定读音', '读 háng，选 ②！', '选 ②')
            ]
          }
        },
        {
          key: 'q2', num: 2, points: 6,
          title: '偏旁奥秘：心字底/竖心旁 vs 提手旁',
          badge: '汉字规律',
          promptPrefix: '观察汉字偏旁：“怒、恋、感、慌、惊、怕”都带有“心字底（心）”或“竖心旁（忄）”，它们的意思都与什么有关？（',
          promptSuffix: '）',
          choices: ['手部的动作', '心情、心理活动与情感', '金属工具'],
          correctIdx: 2,
          explainDetail: '“心字底”和“竖心旁”都代表人的心，所以带这两个偏旁的字（怒、感、慌、惊、怕）都与心情、心理活动有关，选 ②',
          animData: {
            type: 'cn_char_split', radical: '心（心字底） / 忄（竖心旁）', stem: '怒、感 / 慌、惊、怕', compound: '与心情心理有关',
            rule: '心字底和竖心旁都是“心”，看到它们就想到心情与情绪！', ans: '② 心情、心理活动与情感',
            steps: [
              step('第一步：观察“怒、慌、惊、怕”的词义', '愤怒、慌张、惊奇、害怕都是人的情绪心理。', '情绪与心情'),
              step('第二步：锁定答案', '选 ②！', '选 ②')
            ]
          }
        },
        {
          key: 'q3', num: 3, points: 6,
          title: '二下《神州谣》经典课文填空',
          badge: '祖国颂歌',
          promptPrefix: '二年级下册识字《神州谣》写道：“我神州，称中华，山川美，可入画。（  ）奔，（  ）涌，（  ）长，（  ）耸。”括号里依次是（',
          promptSuffix: '）。',
          choices: [
            '黄河 、 长江 、 长城 、 珠峰',
            '西湖 、 泰山 、 黄山 、 日月潭',
            '长江 、 黄河 、 泰山 、 华山'
          ],
          correctIdx: 1,
          explainDetail: '《神州谣》原文：“黄河奔，长江涌，长城长，珠峰耸。”必须严格按课文顺序记忆，选 ①',
          animData: {
            type: 'cn_scroll', poemTitle: '《神州谣》山川四地标',
            verseTop: '🌊 黄河奔 ， 长江涌 ，', verseBottom: '🧱 长城长 ， 🏔️ 珠峰耸 。',
            tip: '先写两条母亲河（黄河奔、长江涌），再写万里长城与世界最高峰（长城长、珠峰耸）！', ans: '① 黄河 、 长江 、 长城 、 珠峰',
            steps: [
              step('第一步：背诵《神州谣》第二小节', '黄河奔，长江涌，长城长，珠峰耸。', '奔·涌·长·耸'),
              step('第二步：锁定答案', '选 ①！', '选 ①')
            ]
          }
        },
        {
          key: 'q4', num: 4, points: 6,
          title: '《二十四节气歌》背诵与理解（二下园地八必背）',
          badge: '传统文化',
          visualHtml: `<div class="inline-flex flex-wrap items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#fffbeb] border border-amber-300/90 shadow-2xs">
          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">立春/春分</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">春</span>
            </div>
          </div>

          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">清明</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">清</span>
            </div>
          </div>

          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">谷雨</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">谷</span>
            </div>
          </div>
        <span class="ml-2 pl-2.5 border-l border-amber-300 text-xs font-bold text-amber-950">《二十四节气歌》：春雨惊春清谷天</span></div>`,
          promptPrefix: '《二十四节气歌》第一句“春雨惊春清谷天”中，包含了立春、雨水、惊蛰、（  ）、清明、（  ）六个春季的节气。括号里是（',
          promptSuffix: '）。',
          choices: ['春分 、 谷雨', '夏满 、 芒夏', '秋处 、 露秋'],
          correctIdx: 1,
          explainDetail: '“春雨惊春清谷天”依次对应春季6个节气：立春、雨水、惊蛰、春分、清明、谷雨，选 ①',
          animData: {
            type: 'cn_scroll', poemTitle: '《二十四节气歌》春季六节气',
            verseTop: '春（立春） 雨（雨水） 惊（惊蛰）', verseBottom: '春（春分） 清（清明） 谷天（谷雨）',
            tip: '第一个“春”是立春，第二个“春”是春分，“谷天”合指谷雨！', ans: '① 春分 、 谷雨',
            steps: [
              step('第一步：拆解“春雨惊春清谷天”7个字', '春(立春)、雨(雨水)、惊(惊蛰)、春(春分)、清(清明)、谷天(谷雨)。', '立春·雨水·惊蛰·春分·清明·谷雨'),
              step('第二步：锁定答案', '选 ① 春分 、 谷雨！', '选 ①')
            ]
          }
        }
      ],
      sec2Questions: [
        {
          key: 'q5', num: 5, points: 7,
          title: '《树之歌》树木习性匹配',
          badge: '课文科普',
          promptPrefix: '在二年级上册《树之歌》中，被称为“活化石”的两种珍贵树木是（  ），“秋季叶儿红”的是（  ）。括号里应选（',
          promptSuffix: '）。',
          choices: [
            '银杏和水杉 ； 枫树',
            '杨树和柳树 ； 松柏',
            '木棉和桦树 ； 金桂'
          ],
          correctIdx: 1,
          explainDetail: '《树之歌》原文：“梧桐树叶像手掌，枫树秋天叶儿红，松柏四季披绿装……银杏水杉活化石，金桂开花满院香。”选 ①',
          animData: {
            type: 'cn_story_flow', flowTitle: '🌳 《树之歌》名木档案',
            nodes: ['🍁枫树：秋天叶儿红', '🌲松柏：四季披绿装', '🌿银杏水杉：活化石', '🌼金桂：开花满院香'],
            tip: '“银杏水杉活化石，枫树秋天叶儿红”，背熟儿歌秒拿分！', ans: '① 银杏和水杉 ； 枫树',
            steps: [
              step('第一步：背诵《树之歌》关键句', '“枫树秋天叶儿红……银杏水杉活化石。”', '活化石=银杏水杉'),
              step('第二步：锁定答案', '选 ①！', '选 ①')
            ]
          }
        },
        {
          key: 'q6', num: 6, points: 7,
          title: '拟声词巧妙运用（哗啦啦 / 叽叽喳喳 / 滴答滴答）',
          badge: '声音模拟',
          promptPrefix: '给句子填入恰当的拟声词：“小闹钟（  ）地走着，小鸟在枝头（  ）地唱歌，小河水（  ）地流向远方。”依次应填（',
          promptSuffix: '）。',
          choices: [
            '滴答滴答 、 叽叽喳喳 、 哗啦啦',
            '哗啦啦 、 滴答滴答 、 叽叽喳喳',
            '轰隆隆 、 喵喵喵 、 叮叮当当'
          ],
          correctIdx: 1,
          explainDetail: '钟表走动是“滴答滴答”，小鸟唱歌是“叽叽喳喳”，河水流淌是“哗啦啦”，选 ①',
          animData: {
            type: 'cn_grammar_train', leftPart: '⏰ 闹钟：滴答滴答', midWord: '🐦 小鸟：叽叽喳喳', rightPart: '🌊 河水：哗啦啦',
            tip: '拟声词模仿自然界的声音，对号入座最准确！', ans: '① 滴答滴答 、 叽叽喳喳 、 哗啦啦',
            steps: [
              step('第一步：匹配闹钟与小鸟的声音', '闹钟指针是“滴答滴答”，小鸟鸣叫是“叽叽喳喳”。', '滴答滴答 · 叽叽喳喳'),
              step('第二步：匹配河水流动声', '“哗啦啦”，选 ①！', '选 ①')
            ]
          }
        },
        {
          key: 'q7', num: 7, points: 7,
          title: '病句修改小医生',
          badge: '句子规范',
          promptPrefix: '下面三句话中，没有语病、表达完全通顺合理的一句是（',
          promptSuffix: '）。',
          choices: [
            '果园里结满了红通通的苹果和五颜六色的黄梨。',
            '春天到了，花园里盛开着五颜六色的鲜花，美丽极了！',
            '我昨天去公园玩了一整天明天才回来。'
          ],
          correctIdx: 2,
          explainDetail: '①“五颜六色”和“黄梨”（只有黄色）矛盾；③“昨天”和“明天”时间矛盾；只有②“盛开着五颜六色的鲜花”完全通顺合理，选 ②',
          animData: {
            type: 'cn_grammar_train', leftPart: '❌ 五颜六色的黄梨（前后矛盾）', midWord: '病句诊断', rightPart: '✅ 五颜六色的鲜花（通顺合理）',
            tip: '“五颜六色”只能搭配“鲜花、气球、彩旗”，不能搭配单一颜色的“红花、黄梨”！', ans: '② 春天到了，花园里盛开着五颜六色的鲜花，美丽极了！',
            steps: [
              step('第一步：找出①和③的前后矛盾处', '①黄梨只有一种颜色，不能说五颜六色；③昨天和明天矛盾。', '排除 ①、③'),
              step('第二步：锁定正确句子', '选 ②！', '选 ②')
            ]
          }
        },
        {
          key: 'q8', num: 8, points: 7,
          title: '图书角《借阅公约》礼仪（口语交际）',
          badge: '口语交际',
          promptPrefix: '班级建设“快乐图书角”制定《图书借阅公约》时，下面哪一条做法是不正确的？（',
          promptSuffix: '）',
          choices: [
            '借阅图书要登记，看完按时归还，摆放整齐',
            '爱护图书，不在书上乱涂乱画，不撕扯书页',
            '看到喜欢的插图可以直接用剪刀剪下来带回家'
          ],
          correctIdx: 3,
          explainDetail: '班级图书角的书是大家共同阅读的，要爱护图书、不乱涂乱画、不撕页剪画，所以③用剪刀剪下来是不正确的，选 ③',
          animData: {
            type: 'cn_story_flow', flowTitle: '📚 班级《图书借阅公约》',
            nodes: ['✅按时借还做好登记', '✅轻翻书页不乱涂画', '❌禁止撕页剪裁插图'],
            tip: '看清题目问的是“哪一条做法是不正确的”！', ans: '③ 看到喜欢的插图直接剪下来（不正确）',
            steps: [
              step('第一步：审清题目要求选“不正确”的一项', '①和②都是爱护公物的文明借阅行为。', '找错误做法'),
              step('第二步：锁定破坏图书的选项', '选 ③！', '选 ③')
            ]
          }
        }
      ],
      sec3Questions: [
        {
          key: 'q9', num: 9, points: 5,
          title: '古诗名句背诵：《赋得古原草送别》',
          badge: '必背古诗',
          promptPrefix: '白居易赞美小草即使被烈火焚烧，只要春风一吹又会顽强生长的千古名句是：“野火烧不尽，（',
          promptSuffix: '）。”',
          choices: ['春风吹又生', '二月春风似剪刀', '忙趁东风放纸鸢'],
          correctIdx: 1,
          explainDetail: '“野火烧不尽，春风吹又生”赞美了原上小草顽强不屈的生命力，选 ①',
          animData: {
            type: 'cn_scroll', poemId: 'fu_de_gu_yuan_cao', poemTitle: '唐·白居易《赋得古原草送别》',
            verseTop: '离离原上草，一岁一枯荣。', verseBottom: '野火烧不尽，春风吹又生。',
            tip: '“野火烧不尽，春风吹又生”是赞美顽强生命力最著名的诗句！', ans: '① 春风吹又生',
            steps: [
              step('第一步：背诵后两句', '野火烧不尽，春风吹又生。', '春风吹又生'),
              step('第二步：锁定答案', '选 ①！', '选 ①')
            ]
          }
        },
        {
          key: 'q10', num: 10, points: 5,
          title: '课文科学常识：《太空生活趣事多》',
          badge: '课文科普',
          promptPrefix: '二年级下册《太空生活趣事多》告诉我们，宇航员在太空中睡觉、喝水、走路、洗澡都和地球上不一样，主要是因为太空中（',
          promptSuffix: '）。',
          choices: ['处于失重状态（水会飘浮、人也会飘起来）', '风太大了', '没有灯光'],
          correctIdx: 1,
          explainDetail: '在宇宙飞船里没有地球引力（失重状态），人和物品都会飘浮起来，所以睡觉要钻进固定睡袋，喝水要用带吸管的饮水袋，选 ①',
          animData: {
            type: 'cn_story_flow', flowTitle: '🚀 《太空生活趣事多》奥秘',
            nodes: ['🛌睡觉：钻进固定睡袋', '🥤喝水：用带吸管饮水袋', '👟走路：穿带钩鞋踩网格', '🌌原因：太空失重易飘浮'],
            tip: '宇航员在太空里轻飘飘的，一切趣事都是因为“失重”！', ans: '① 处于失重状态',
            steps: [
              step('第一步：回顾宇航员为什么会飘起来', '在太空中失去了重力的束缚（失重）。', '太空失重'),
              step('第二步：锁定答案', '选 ①！', '选 ①')
            ]
          }
        },
        {
          key: 'q11', num: 11, points: 5,
          title: '课文道理：《大象的耳朵》',
          badge: '课文哲理',
          promptPrefix: '在《大象的耳朵》一课中，大象把耳朵撑起来后，小虫子飞进去吵得它又头痛又心烦，最后大象还是把耳朵放了下来，并说了一句充满哲理的话：（',
          promptSuffix: '）。',
          choices: [
            '“人家是人家，我是我。”',
            '“我的耳朵太难看了。”',
            '“以后我再也不出门了。”'
          ],
          correctIdx: 1,
          explainDetail: '大象大耳朵耷拉着正好能扇风赶走小虫子，各有各的用处，所以大象说：“人家是人家，我是我。”选 ①',
          animData: {
            type: 'cn_scroll', poemTitle: '《大象的耳朵》中心名句',
            verseTop: '大耳朵耷拉着 ➔ 扇风赶走小虫子', verseBottom: '“人家是人家，我是我。”',
            tip: '每个人都有自己的特点和长处，适合自己的才是最好的，“人家是人家，我是我”！', ans: '① “人家是人家，我是我。”',
            steps: [
              step('第一步：回忆大象最后的决定和原话', '大象决定还是让自己的耳朵耷拉着，说：“人家是人家，我是我。”', '人家是人家，我是我'),
              step('第二步：锁定答案', '选 ①！', '选 ①')
            ]
          }
        },
        {
          key: 'q12', num: 12, points: 5,
          title: '课文细节：《蜘蛛开店》',
          badge: '童话故事',
          promptPrefix: '在《蜘蛛开店》一课中，蜘蛛先后开了三次店：卖口罩、卖围巾、卖袜子，分别遇到了哪三位让它忙不过来的顾客？（',
          promptSuffix: '）',
          choices: [
            '河马（嘴巴大） ➔ 长颈鹿（脖子长） ➔ 蜈蚣（四十二只脚）',
            '小蚂蚁 ➔ 小蝴蝶 ➔ 小金鱼',
            '大象 ➔ 小白兔 ➔ 小花猫'
          ],
          correctIdx: 1,
          explainDetail: '蜘蛛卖口罩遇到大嘴巴河马（织了一整天），改卖围巾遇到长脖子长颈鹿（织了一个星期），改卖袜子遇到四十二只脚的蜈蚣（吓得匆忙跑回网上），选 ①',
          animData: {
            type: 'cn_story_flow', flowTitle: '🕷️ 《蜘蛛开店》三次奇遇',
            nodes: ['😷卖口罩 ➔ 河马嘴巴大', '🧣卖围巾 ➔ 长颈鹿脖子长', '🧦卖袜子 ➔ 蜈蚣42只脚'],
            tip: '蜘蛛只图简单，按“每位顾客付一元”统一定价，没想到来的都是最费工夫的特殊顾客！', ans: '① 河马 ➔ 长颈鹿 ➔ 蜈蚣',
            steps: [
              step('第一步：按商品特点对应顾客特征', '口罩配大嘴河马，围巾配长脖长颈鹿，袜子配多脚蜈蚣。', '河马➔长颈鹿➔蜈蚣'),
              step('第二步：锁定答案', '选 ①！', '选 ①')
            ]
          }
        }
      ],
      readingPassage: {
        title: '春风里的翠柳丝带',
        svg: SVG_SCENES.mimosaWeather,
        paragraphs: [
          '① 二月的江南，春意融融。清澈的春江岸边长着一棵高大粗壮的古柳树，它全身披上了嫩绿的新装，远远望去，就像用晶莹的碧玉装扮成的一样翠绿迷人。',
          '② 从高高的树冠上，成千上万条柔长的柳枝垂落下来，就像一条条飘逸的绿色丝带，在春风中轻轻摇摆，温柔地拂过清澈见底的河水，岸边的石头旁还盛开着洁白和淡紫色的小野花。',
          '③ 看着柳枝上那一片片又细又巧的嫩绿柳叶，我不禁好奇地想：“究竟是哪位心灵手巧的裁缝，把柳叶裁剪得这么精致呢？”哈哈，原来是温暖的二月春风呀！二月的春风就像一把灵巧的剪刀，裁出了满树动人的春光。'
        ],
        questions: [
          {
            key: 'q13', num: 13, points: 4,
            title: '阅读理解（1）：比喻意象提取',
            promptPrefix: '第①、②自然段中，作者把高大翠绿的柳树比作什么？把垂落下来的万千柳枝比作了什么？（',
            promptSuffix: '）',
            choices: [
              '把柳树比作碧玉 ； 把万千柳枝比作绿色的丝带',
              '把柳树比作大石头 ； 把柳枝比作铁丝',
              '把柳树比作白云 ； 把柳枝比作彩虹'
            ],
            correctIdx: 1,
            explainDetail: '第①段写“就像用晶莹的碧玉装扮成的一样”，第②段写“成千上万条柔长的柳枝垂落下来，就像一条条飘逸的绿色丝带”，对应“碧玉妆成一树高，万条垂下绿丝绦”，选 ①',
            animData: {
              type: 'cn_story_flow', flowTitle: '🌿 《春风翠柳》三大奇妙比喻',
              nodes: ['🌳满树新绿 ➔ 像晶莹碧玉', '🎀万千柳条 ➔ 像绿色丝带', '✂️二月春风 ➔ 像灵巧剪刀'],
              tip: '观察插图左侧垂挂下来的翠绿柳条，真的像一条条绿丝带！', ans: '① 柳树比作碧玉；柳枝比作绿色丝带',
              steps: [
                step('第一步：找第①段和第②段的比喻词“像”', '晶莹的碧玉 + 绿色的丝带。', '碧玉 · 绿丝带'),
                step('第二步：锁定答案', '选 ①！', '答案：①')
              ]
            }
          },
          {
            key: 'q14', num: 14, points: 4,
            title: '阅读理解（2）：插图景物观察',
            promptPrefix: '仔细观察插图并读第②自然段，古柳树树根的石头旁盛开着什么颜色的小野花？远处河面上有什么？（',
            promptSuffix: '）',
            choices: [
              '洁白和淡紫色的小野花 ； 弯弯的石拱桥与白墙黛瓦的水乡房屋',
              '火红的玫瑰花 ； 高大的摩天轮',
              '什么花也没有 ； 只有沙漠'
            ],
            correctIdx: 1,
            explainDetail: '观察插图左下角和右后方，树根岩石旁开着白色和淡紫色的野花，远处河面上架着石拱桥，岸边是白墙黛瓦的江南民居，选 ①',
            animData: {
              type: 'cn_story_flow', flowTitle: '🏞️ 江南春水画卷细节',
              nodes: ['🌼左下近景：白花与紫花盛开', '🌉中景水面：弯弯石拱桥', '🏡远景岸边：粉墙黛瓦桃花开'],
              tip: '图文结合，插图左下角和右侧远景画得清清楚楚！', ans: '① 洁白和淡紫色野花；石拱桥与水乡房屋',
              steps: [
                step('第一步：观察插图左下角与右侧远景', '左下角是白紫野花，右侧是石拱桥与白墙黑瓦房屋。', '野花 + 石拱桥'),
                step('第二步：锁定答案', '选 ①！', '答案：①')
              ]
            }
          },
          {
            key: 'q15', num: 15, points: 4,
            title: '阅读理解（3）：设问与修辞理解',
            promptPrefix: '第③自然段中，是谁像“一把灵巧的剪刀”裁出了满树细巧的柳叶？（',
            promptSuffix: '）',
            choices: ['真正的铁剪刀', '温暖的二月春风', '寒冷的北风'],
            correctIdx: 2,
            explainDetail: '第③段写：“原来是温暖的二月春风呀！二月的春风就像一把灵巧的剪刀，裁出了满树动人的春光。”选 ②',
            animData: {
              type: 'cn_grammar_train', leftPart: '温暖的二月春风（本体）', midWord: '像', rightPart: '一把灵巧的剪刀（喻体）',
              tip: '正对应贺知章《咏柳》名句：“不知细叶谁裁出，二月春风似剪刀”！', ans: '② 温暖的二月春风',
              steps: [
                step('第一步：读第③段最后一句', '“二月的春风就像一把灵巧的剪刀。”', '二月春风'),
                step('第二步：锁定答案', '选 ②！', '答案：②')
              ]
            }
          },
          {
            key: 'q16', num: 16, points: 4,
            title: '阅读理解（4）：古诗配对',
            promptPrefix: '这篇短文和插图是由唐代诗人贺知章的哪首古诗改写而来的？（',
            promptSuffix: '）',
            choices: ['《咏柳》', '《江雪》', '《梅花》'],
            correctIdx: 1,
            explainDetail: '碧玉妆成、绿丝绦、细叶裁出、二月春风似剪刀，全部源自唐代贺知章的《咏柳》，选 ①',
            animData: {
              type: 'cn_scroll', poemId: 'yong_liu', poemTitle: '唐·贺知章《咏柳》',
              verseTop: '碧玉妆成一树高，万条垂下绿丝绦。', verseBottom: '不知细叶谁裁出，二月春风似剪刀。',
              tip: '读懂散文版《咏柳》，古诗背诵和默写再也不会忘！', ans: '① 《咏柳》',
              steps: [
                step('第一步：匹配古诗关键词', '碧玉、绿丝绦、二月春风似剪刀 ➔ 《咏柳》。', '《咏柳》'),
                step('第二步：锁定答案', '选 ①！', '答案：①')
              ]
            }
          }
        ]
      },
      writingTask: {
        title: '看图写话：夕阳下的登楼远眺',
        svg: SVG_SCENES.lanternFestival,
        sceneDesc: '仔细观察左图：傍晚时分，太阳落向哪里？宽阔的黄河水怎样流淌？右侧的高楼上谁在远眺？这让你想到了什么哲理？',
        wordBank: ['夕阳西下', '晚霞似火', '波光粼粼', '奔流不息', '极目远眺', '更上一层楼'],
        blanks: [
          {
            key: 'q17_time', label: '① 落日与晚霞美景', points: 3,
            prefix: '傍晚时分，漫天晚霞染成了绚丽的橙红色。一轮金灿灿的夕阳（', suffix: '），给层层叠叠的远山披上了一层金纱。',
            choices: ['正挨着连绵起伏的群山缓缓沉落下去', '刚从海底升到正空中', '被乌云遮得下起暴风雪'],
            correctIdx: 1
          },
          {
            key: 'q17_who', label: '② 黄河奔流入海', points: 3,
            prefix: '山脚下，宽阔壮丽的黄河水映着夕阳的金光，（', suffix: '），浩浩荡荡地朝着远方的大海奔流而去。',
            choices: ['波光粼粼、川流不息地蜿蜒向前', '已经干涸见底没有水了', '结成了厚厚的冰块'],
            correctIdx: 1
          },
          {
            key: 'q17_do', label: '③ 登上鹳雀楼远眺', points: 3,
            prefix: '悬崖旁雄伟的鹳雀楼上，诗人凭栏而立，迎着晚风（', suffix: '），将祖国壮丽的山河美景尽收眼底。',
            choices: ['向着远方极目远眺', '低着头在房间里睡觉', '在草地上捉蝴蝶'],
            correctIdx: 1
          },
          {
            key: 'q17_feel', label: '④ 千古哲理升华', points: 3,
            prefix: '看着眼前壮阔的景象，诗人心中涌起豪情，写下了千古名句：“（', suffix: '）”激励我们不断努力进步！',
            choices: ['欲穷千里目，更上一层楼！', '路人借问遥招手，怕得鱼惊不应人。', '春种一粒粟，秋收万颗子。'],
            correctIdx: 1
          }
        ],
        modelEssay: '傍晚时分，漫天晚霞染成了绚丽的橙红色。一轮金灿灿的夕阳正挨着连绵起伏的群山缓缓沉落下去，给层层叠叠的远山披上了一层金纱。山脚下，宽阔壮丽的黄河水映着夕阳的金光，波光粼粼、川流不息地蜿蜒向前，浩浩荡荡地朝着远方的大海奔流而去。悬崖旁雄伟的鹳雀楼上，诗人凭栏而立，迎着晚风向着远方极目远眺，将祖国壮丽的山河美景尽收眼底。看着眼前壮阔的景象，诗人心中涌起豪情，写下了千古名句：“欲穷千里目，更上一层楼！”激励我们不断努力进步！',
        explainDetail: '登高写话四步：①夕阳依着群山缓缓西沉 + ②黄河波光粼粼奔流入海 + ③诗人登高楼极目远眺 + ④感悟“欲穷千里目，更上一层楼”！',
        animData: {
          type: 'cn_story_flow', flowTitle: '✍️ 看图写话诗画融合法：夕阳登高望远',
          nodes: ['🌅远景夕阳：白日依山尽', '🌊中景长河：黄河入海流', '🏯近景高楼：诗人凭栏远眺', '🚀哲理升华：更上一层楼'],
          tip: '把画面的远景（落日群山）、中景（金色黄河）和近景（高楼诗人）按顺序展开，最后用名句收尾！', ans: '满分范文已解锁',
          steps: [
            step('第一步：描写左边远处的夕阳与群山', '漫天橙红晚霞，金色夕阳挨着远山缓缓落下。', '白日依山尽'),
            step('第二步：描写金色黄河与右侧鹳雀楼上的诗人', '黄河波光粼粼奔流向海，诗人登楼极目远眺。', '黄河入海流'),
            step('第三步：点明“更上一层楼”的进取哲理', '站得更高才能看得更远！', '哲理点睛收尾')
          ]
        }
      }
    },

    // =========================================================================
    // 语文H卷：期末冲刺全真压轴卷（H卷）
    // =========================================================================
    {
      id: 'cn_paper_h',
      letter: '语文H',
      label: '语文H卷 · 期末冲刺压轴卷',
      title: '统编版二年级语文期末冲刺全真压轴测试卷（H卷）',
      subtitle: '涵盖：全册高频多音字、尧字族、一字多义、14首古诗综合、《墙角傲雪凌寒的白梅花》阅读与寒江瑞雪写话',
      sec1Questions: [
        {
          key: 'q1', num: 1, points: 6,
          title: '多音字“的 / 喝”读音辨析',
          badge: '字音闯关',
          visualHtml: `<div class="inline-flex flex-wrap items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#fffbeb] border border-amber-300/90 shadow-2xs">
          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">dí 的确</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">的</span>
            </div>
          </div>

          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">hè 喝彩</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">喝</span>
            </div>
          </div>
        <span class="ml-2 pl-2.5 border-l border-amber-300 text-xs font-bold text-amber-950">常考多音字</span></div>`,
          promptPrefix: '在“这的（  ）确是一朵美丽的花”和“大家为运动员大声喝（  ）彩”中，加点字的正确读音依次是（',
          promptSuffix: '）。',
          choices: ['de 、 hē', 'dí 、 hè', 'dì 、 hē'],
          correctIdx: 2,
          explainDetail: '“的确”（真实、实在）的“的”读二声 dí；“喝彩”（大声叫好）的“喝”读四声 hè，选 ②',
          animData: {
            type: 'cn_pinyin_tree', charText: '的 / 喝', branchA: 'dí（的确） / hè（喝彩、吆喝）', branchB: 'de（美丽的花） / hē（喝水）',
            tip: '“的确”读 dí què；大声叫好助威叫“喝（hè）彩”！', ans: '② dí 、 hè',
            steps: [
              step('第一步：辨析“的确”', '表示实在、果真时读二声 dí（的确）。', '的（dí）确'),
              step('第二步：辨析“喝彩”', '表示大声叫好时读四声 hè（喝彩），喝水才读 hē，选 ②！', '喝（hè）彩（选 ②）')
            ]
          }
        },
        {
          key: 'q2', num: 2, points: 6,
          title: '“尧”字族偏旁辨字（浇 / 烧 / 绕 / 晓）',
          badge: '偏旁字族',
          visualHtml: `<div class="inline-flex flex-wrap items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#fffbeb] border border-amber-300/90 shadow-2xs">
          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">jiāo 氵+尧</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">浇</span>
            </div>
          </div>

          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">shāo 火+尧</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">烧</span>
            </div>
          </div>

          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">xiǎo 日+尧</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">晓</span>
            </div>
          </div>

          <div class="inline-flex flex-col items-center">
            <span class="text-[11px] font-bold text-rose-800 leading-tight mb-0.5 font-mono">rào 纟+尧</span>
            <div class="relative w-10 h-10 bg-[#fffdf7] border-2 border-rose-700/80 rounded-xs flex items-center justify-center shadow-2xs">
              <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%), linear-gradient(to bottom, transparent 48%, rgba(225,29,72,0.28) 49%, rgba(225,29,72,0.28) 51%, transparent 52%);"></div>
              <span class="relative z-10 text-xl font-black text-slate-900" style="font-family:'KaiTi','STKaiti','Songti SC',serif">绕</span>
            </div>
          </div>
        <span class="ml-2 pl-2.5 border-l border-amber-300 text-xs font-bold text-amber-950">“尧”字族形声字</span></div>`,
          promptPrefix: '记顺口溜选字填空：“有水把花（  ），有火把柴（  ），有日天破（  ），有丝线缠（  ）。”括号里依次是（',
          promptSuffix: '）。',
          choices: ['浇 、 烧 、 晓 、 绕', '烧 、 浇 、 绕 、 晓', '浇 、 晓 、 烧 、 绕'],
          correctIdx: 1,
          explainDetail: '三点水是“浇”（浇花），火字旁是“烧”（烧柴），日字旁是“晓”（春晓、破晓），绞丝旁是“绕”（缠绕、围绕），选 ①',
          animData: {
            type: 'cn_char_split', radical: '氵 / 火 / 日 / 纟', stem: '尧 (yáo)', compound: '浇 · 烧 · 晓 · 绕',
            rule: '有水把花浇（浇），有火把柴烧（烧），有日天破晓（晓），有丝线缠绕（绕）！', ans: '① 浇 、 烧 、 晓 、 绕',
            steps: [
              step('第一步：按形旁锁定四个汉字', '水➔浇，火➔烧，日➔晓，丝➔绕。', '浇 · 烧 · 晓 · 绕'),
              step('第二步：锁定答案', '选 ①！', '选 ①')
            ]
          }
        },
        {
          key: 'q3', num: 3, points: 6,
          title: '字典选择字义（一字多义必考题）',
          badge: '字义辨析',
          promptPrefix: '“深”在字典里有三种解释：①从上到下或从外到里的距离大（跟“浅”相对）；②颜色浓；③距离开始的时间久。在“海水真深呀”和“他穿了一件深蓝色的衣服”中，“深”分别选哪种解释？（',
          promptSuffix: '）',
          choices: ['① 和 ②', '② 和 ③', '① 和 ③'],
          correctIdx: 1,
          explainDetail: '“海水真深”与“水浅”相对，选①；“深蓝色”指颜色浓（与浅蓝相对），选②，所以依次是①和②，选 ①',
          animData: {
            type: 'cn_grammar_train', leftPart: '🌊 海水真深 ➔ ①距离大', midWord: '一字多义对号入座', rightPart: '👕 深蓝色 ➔ ②颜色浓',
            tip: '把字典里的解释代回词语里试一试：海水距离海底大（①），深蓝色是颜色浓（②），夜深了是时间久（③）！', ans: '① ① 和 ②',
            steps: [
              step('第一步：判断“海水真深”', '从水面到海底距离大，对应解释①。', '海水深 ➔ ①'),
              step('第二步：判断“深蓝色”', '指蓝色很浓，对应解释②，选 ①！', '深蓝色 ➔ ②（选 ①）')
            ]
          }
        },
        {
          key: 'q4', num: 4, points: 6,
          title: '近义词“笑”的家族积累（二下园地七）',
          badge: '词语积累',
          promptPrefix: '二年级下册语文园地七积累了许多表示“笑”的词语。如果形容全家人聚在一起，每个人脸上都带着幸福欢快的笑容，最恰当的四字词语是（',
          promptSuffix: '）。',
          choices: ['眉开眼笑 / 哈哈大笑', '哭笑不得', '破涕为笑'],
          correctIdx: 1,
          explainDetail: '“眉开眼笑、哈哈大笑、捧腹大笑”形容非常开心快乐的笑；“哭笑不得”形容又好气又好笑；“破涕为笑”形容停止哭泣笑起来，选 ①',
          animData: {
            type: 'cn_grammar_train', leftPart: '😄 微笑 · 欢笑 · 哈哈大笑', midWord: '“笑”的百花园', rightPart: '😊 眉开眼笑 · 破涕为笑 · 捧腹大笑',
            tip: '眉头舒展、眼含笑意叫“眉开眼笑”；先哭后笑叫“破涕为笑”！', ans: '① 眉开眼笑 / 哈哈大笑',
            steps: [
              step('第一步：区分不同情境下的“笑”', '全家人幸福欢快地笑，没有哭也没有无奈，所以用“眉开眼笑 / 哈哈大笑”。', '眉开眼笑'),
              step('第二步：锁定答案', '选 ①！', '选 ①')
            ]
          }
        }
      ],
      sec2Questions: [
        {
          key: 'q5', num: 5, points: 7,
          title: '神话故事与传统文化：《羿射九日》',
          badge: '神话故事',
          promptPrefix: '在二年级下册中国古代神话故事《羿射九日》中，天上同时出现十个太阳，炙烤得大地禾苗晒枯、河水蒸干。神箭手羿射下了（  ）个太阳，留下了（  ）个太阳造福人间。（',
          promptSuffix: '）',
          choices: ['9 个 、 1 个', '10 个 、 0 个', '8 个 、 2 个'],
          correctIdx: 1,
          explainDetail: '题目《羿射九日》已经点明：羿射下了 9 个太阳，留下最后 1 个太阳，从此大地重新现出了勃勃生机，选 ①',
          animData: {
            type: 'cn_story_flow', flowTitle: '🏹 《羿射九日》神话传奇',
            nodes: ['☀️十日当空大地乾涸', '🏹神箭手羿翻山越岭', '🎯射下九个火球太阳', '🌍留下一个造福万物'],
            tip: '如果把十个太阳全射下来，世界就会一片黑暗寒冷，所以留下1个太阳！', ans: '① 9 个 、 1 个',
            steps: [
              step('第一步：看课题《羿射九日》', '“射九日”就是射下了 9 个太阳。', '射下 9 个'),
              step('第二步：10 - 9 = 1', '留下 1 个太阳，选 ①！', '选 ① 9 个 、 1 个')
            ]
          }
        },
        {
          key: 'q6', num: 6, points: 7,
          title: '关联词“如果……就……”与“只要……就……”',
          badge: '句式运用',
          promptPrefix: '在句子“（  ）我们平时认真复习、仔细检查，期末考试（  ）一定能取得好成绩！”中，最恰当的一组关联词是（',
          promptSuffix: '）。',
          choices: ['只要 …… 就 ……', '虽然 …… 但是 ……', '一边 …… 一边 ……'],
          correctIdx: 1,
          explainDetail: '“只要……就……”表示具备充足条件就会产生好结果；“虽然……但是……”表示转折；“一边……一边……”表示同时做两件事，选 ①',
          animData: {
            type: 'cn_grammar_train', leftPart: '只要 认真复习仔细检查', midWord: '条件 ➔ 结果', rightPart: '就 一定能取得好成绩',
            tip: '前半句是条件，后半句是结果，用“只要……就……”连接最顺畅！', ans: '① 只要 …… 就 ……',
            steps: [
              step('第一步：分析前后半句的关系', '“认真复习”是条件，“取得好成绩”是结果。', '条件关系'),
              step('第二步：锁定答案', '选 ① 只要……就……！', '选 ①')
            ]
          }
        },
        {
          key: 'q7', num: 7, points: 7,
          title: '看图仿写：把景物写得“有声有色”',
          badge: '句子升级',
          promptPrefix: '照样子把句子写具体：例句“小鸟在枝头【欢快地】唱歌”。如果仿写“雪花从天空中【            】飘落下来”，横线上最优美恰当的词是（',
          promptSuffix: '）。',
          choices: ['愤怒地 / 大声地', '轻轻地 / 慢悠悠地 / 纷纷扬扬地', '飞快地奔跑着'],
          correctIdx: 2,
          explainDetail: '雪花很轻柔，从空中飘落时用“轻轻地、慢悠悠地、纷纷扬扬地”最符合雪花的姿态，选 ②',
          animData: {
            type: 'cn_grammar_train', leftPart: '❄️ 洁白的雪花', midWord: '纷纷扬扬地 / 轻轻地', rightPart: '从天空中飘落下来',
            tip: '修饰动作的词（土也“地”前面）要符合事物的真实特点，雪花轻盈飘落用“轻轻地、纷纷扬扬地”！', ans: '② 轻轻地 / 慢悠悠地 / 纷纷扬扬地',
            steps: [
              step('第一步：想象雪花飘落的轻盈画面', '雪花轻飘飘的，不会愤怒也不会大声。', '轻柔飘落'),
              step('第二步：锁定优美修饰词', '选 ②！', '选 ②')
            ]
          }
        },
        {
          key: 'q8', num: 8, points: 7,
          title: '古今读书名言积累',
          badge: '园地日积月累',
          promptPrefix: '高尔基说：“书籍是人类进步的阶梯。”清代袁枚也写过一句鼓励少年趁早读书的名言：“少年不知勤学苦，（',
          promptSuffix: '）。”',
          choices: ['老来方知读书迟', '欲穷千里目', '手有余香'],
          correctIdx: 1,
          explainDetail: '“少年不知勤学苦，老来方知读书迟”劝勉我们年少时要珍惜时光勤奋学习，选 ①',
          animData: {
            type: 'cn_scroll', poemTitle: '日积月累 · 惜时勤学名句',
            verseTop: '少年不知勤学苦，', verseBottom: '老来方知读书迟。',
            tip: '“少年”对“老来”，“不知勤学苦”对“方知读书迟”！', ans: '① 老来方知读书迟',
            steps: [
              step('第一步：看上句“少年不知勤学苦”', '少年时不勤奋学习，老了才后悔读书太晚。', '少年 ⇄ 老来'),
              step('第二步：锁定答案', '选 ① 老来方知读书迟！', '选 ①')
            ]
          }
        }
      ],
      sec3Questions: [
        {
          key: 'q9', num: 9, points: 5,
          title: '古诗诗人朝代配对（全册必考汇总）',
          badge: '必背古诗',
          promptPrefix: '下面古诗、朝代与作者配对完全正确的一项是（',
          promptSuffix: '）。',
          choices: [
            '《登鹳雀楼》—— 唐·王之涣 ； 《咏柳》—— 唐·贺知章',
            '《望庐山瀑布》—— 宋·苏轼 ； 《梅花》—— 唐·杜甫',
            '《绝句》—— 清·高鼎 ； 《村居》—— 唐·李白'
          ],
          correctIdx: 1,
          explainDetail: '《登鹳雀楼》是唐代王之涣，《咏柳》是唐代贺知章；《望庐山瀑布》是唐代李白，《梅花》是宋代王安石，《绝句》是唐代杜甫，《村居》是清代高鼎，选 ①',
          animData: {
            type: 'cn_scroll', poemTitle: '二年级必背古诗作者榜',
            verseTop: '《登鹳雀楼》唐·王之涣 ｜ 《望庐山瀑布》唐·李白', verseBottom: '《咏柳》唐·贺知章 ｜ 《绝句》唐·杜甫 ｜ 《村居》清·高鼎',
            tip: '背古诗一定要连同“朝代 + 作者”一起记牢！', ans: '① 《登鹳雀楼》唐·王之涣 ； 《咏柳》唐·贺知章',
            steps: [
              step('第一步：核对各选项作者', '②《望庐山瀑布》是李白，《梅花》是王安石；③《绝句》是杜甫，《村居》是高鼎。', '排除 ②、③'),
              step('第二步：锁定完全正确的一项', '选 ①！', '选 ①')
            ]
          }
        },
        {
          key: 'q10', num: 10, points: 5,
          title: '古诗名句填动物：《敕勒歌》与《绝句》',
          badge: '必背古诗',
          promptPrefix: '填古诗里的动物：“两个（  ）鸣翠柳，一行（  ）上青天。”“天苍苍，野茫茫，风吹草低见（  ）。”括号里依次是（',
          promptSuffix: '）。',
          choices: ['黄鹂 、 白鹭 、 牛羊', '白鹭 、 黄鹂 、 骏马', '燕子 、 雄鹰 、 牛羊'],
          correctIdx: 1,
          explainDetail: '《绝句》：“两个黄鹂鸣翠柳，一行白鹭上青天”；《敕勒歌》：“风吹草低见牛羊”，依次是黄鹂、白鹭、牛羊，选 ①',
          animData: {
            type: 'cn_scroll', poemTitle: '古诗里的动物精灵',
            verseTop: '两个【黄鹂】鸣翠柳，一行【白鹭】上青天。', verseBottom: '天苍苍，野茫茫，风吹草低见【牛羊】。',
            tip: '两个黄鹂 + 一行白鹭 + 草原牛羊，画面栩栩如生！', ans: '① 黄鹂 、 白鹭 、 牛羊',
            steps: [
              step('第一步：核对《绝句》中的两种鸟', '两个黄鹂、一行白鹭。', '黄鹂 · 白鹭'),
              step('第二步：核对《敕勒歌》中的草原动物', '风吹草低见牛羊，选 ①！', '选 ①')
            ]
          }
        },
        {
          key: 'q11', num: 11, points: 5,
          title: '课文细节：《黄山奇石》',
          badge: '祖国山河',
          promptPrefix: '在二年级上册《黄山奇石》一课中，作者详细描写了哪四块奇形怪状、趣味横生的岩石？（',
          promptSuffix: '）',
          choices: [
            '“仙桃石” 、 “猴子观海” 、 “仙人指路” 、 “金鸡叫天都”',
            '“日月潭” 、 “香炉峰” 、 “鹳雀楼” 、 “敬亭山”',
            '“珊瑚石” 、 “鹅卵石” 、 “雨花石” 、 “大理石”'
          ],
          correctIdx: 1,
          explainDetail: '《黄山奇石》第2~5自然段依次详写了“仙桃石”、“猴子观海”、“仙人指路”和“金鸡叫天都”四块著名奇石，最后一自然段略写了“天狗望月、狮子抢球、仙女弹琴”，选 ①',
          animData: {
            type: 'cn_story_flow', flowTitle: '🪨 《黄山奇石》四大主角',
            nodes: ['🍑仙桃石：飞落山顶石盘', '🐒猴子观海：蹲在山头望云海', '👉仙人指路：伸手指向前方', '🐓金鸡叫天都：金光闪闪啼叫'],
            tip: '黄山奇石名字都和它们的形状一模一样：仙桃、猴子、仙人、金鸡！', ans: '① “仙桃石”、“猴子观海”、“仙人指路”、“金鸡叫天都”',
            steps: [
              step('第一步：回忆《黄山奇石》详写的四块巨石名称', '仙桃石、猴子观海、仙人指路、金鸡叫天都。', '四大奇石'),
              step('第二步：锁定答案', '选 ①！', '选 ①')
            ]
          }
        },
        {
          key: 'q12', num: 12, points: 5,
          title: '课文道理：《开满鲜花的小路》',
          badge: '课文哲理',
          promptPrefix: '二年级下册《开满鲜花的小路》中，长颈鹿大叔寄给鼹鼠先生的包裹破了个洞，掉在路上的其实是（  ），春天变成了一路的鲜花，被大家称为“美好的礼物”。（',
          promptSuffix: '）',
          choices: ['花籽（鲜花的种子）', '五颜六色的糖果', '彩色的小石子'],
          correctIdx: 1,
          explainDetail: '长颈鹿大叔寄来的是花籽，包裹破了漏在路上，到了春天长出了绚丽多彩的鲜花，给所有小动物带来了快乐，选 ①',
          animData: {
            type: 'cn_story_flow', flowTitle: '🌸 《开满鲜花的小路》探秘',
            nodes: ['📦长颈鹿寄来包裹', '🕳️包裹破洞洒满小路', '🌱原来是一包花籽', '🌺春天开满一路鲜花'],
            tip: '能给身边所有人带来美丽和快乐的东西，才是最“美好的礼物”！', ans: '① 花籽（鲜花的种子）',
            steps: [
              step('第一步：推理什么颗粒洒在土里春天会变成鲜花', '当然是花籽（鲜花的种子）！', '花籽 ➔ 鲜花'),
              step('第二步：锁定答案', '选 ①！', '选 ①')
            ]
          }
        }
      ],
      readingPassage: {
        title: '墙角傲雪凌寒的白梅花',
        svg: SVG_SCENES.squirrelPinecones,
        paragraphs: [
          '① 隆冬时节，北风呼啸，一场大雪过后，庭院里的青瓦屋檐、白粉墙头和青翠竹叶上，全都盖上了一层厚厚的白雪，到处银装素裹。',
          '② 百花早已凋谢，可是在庭院静静的墙角边，几枝苍劲古朴的梅花枝干却伸展着手臂，迎着刺骨的严寒独自绽放！一朵朵白里透粉的梅花缀满枝头，吐露着金黄色的花蕊，显得格外高洁美丽。',
          '③ 远远望去，枝头洁白的梅花和白雪融为一体。可是诗人不用走近，远远地就知道那枝头上的不是白雪，而是盛开的梅花，因为微风吹过，有一阵阵清幽淡雅的梅花香气正悄悄飘过来呢！'
        ],
        questions: [
          {
            key: 'q13', num: 13, points: 4,
            title: '阅读理解（1）：季节与生长位置提取',
            promptPrefix: '根据第①、②自然段和插图，梅花是在什么季节、什么地方独自开放的？（',
            promptSuffix: '）',
            choices: ['炎热的夏天 ； 池塘中央', '寒冷的冬天（隆冬时节） ； 庭院的墙角边', '温暖的春天 ； 柳树枝头'],
            correctIdx: 2,
            explainDetail: '第①段写“隆冬时节”，第②段写“在庭院静静的墙角边……迎着刺骨的严寒独自绽放”，对应“墙角数枝梅，凌寒独自开”，选 ②',
            animData: {
              type: 'cn_story_flow', flowTitle: '🌸 寒梅傲雪档案',
              nodes: ['❄️季节：隆冬大雪过后', '🧱地点：庭院白墙墙角边', '💪品格：迎着严寒独自绽放'],
              tip: '看插图中覆雪的青瓦白墙与虬曲梅枝，正是“墙角数枝梅，凌寒独自开”！', ans: '② 寒冷的冬天 ； 庭院的墙角边',
              steps: [
                step('第一步：圈出时间与地点关键词', '“隆冬时节”、“庭院静静的墙角边”。', '冬天 · 墙角'),
                step('第二步：锁定答案', '选 ②！', '答案：②')
              ]
            }
          },
          {
            key: 'q14', num: 14, points: 4,
            title: '阅读理解（2）：图文色彩观察',
            promptPrefix: '仔细观察插图并读第②自然段，傲雪盛开的梅花花瓣和花蕊分别是什么颜色的？（',
            promptSuffix: '）',
            choices: [
              '花瓣是白里透粉的，花蕊是金黄色的',
              '花瓣是深蓝色的，花蕊是黑色的',
              '花瓣和花蕊全都是绿色的'
            ],
            correctIdx: 1,
            explainDetail: '第②段写：“一朵朵白里透粉的梅花缀满枝头，吐露着金黄色的花蕊”，与插图中的梅花色彩完全一致，选 ①',
            animData: {
              type: 'cn_story_flow', flowTitle: '🎨 梅花色彩细观察',
              nodes: ['🌸花瓣：洁白与淡粉相映', '✨花心花蕊：点点金黄', '❄️背景：青瓦白墙覆瑞雪'],
              tip: '放大看插图中间那几朵盛开的梅花：白粉花瓣配金黄花心！', ans: '① 花瓣白里透粉，花蕊金黄色',
              steps: [
                step('第一步：观察插图梅花特写并核对第②段末句', '“白里透粉的梅花……吐露着金黄色的花蕊。”', '白里透粉 + 金黄花蕊'),
                step('第二步：锁定答案', '选 ①！', '答案：①')
              ]
            }
          },
          {
            key: 'q15', num: 15, points: 4,
            title: '阅读理解（3）：因果逻辑理解',
            promptPrefix: '根据第③自然段，梅花和白雪颜色那么像，为什么诗人远远地就知道那不是雪？（',
            promptSuffix: '）',
            choices: [
              '因为太阳出来把雪全晒化了',
              '因为有一阵阵清幽淡雅的梅花香气飘过来（雪是没有香味的）',
              '因为小鸟站在枝头告诉了他'
            ],
            correctIdx: 2,
            explainDetail: '第③段写：“远远地就知道那枝头上的不是白雪，而是盛开的梅花，因为微风吹过，有一阵阵清幽淡雅的梅花香气正悄悄飘过来呢！”对应“遥知不是雪，为有暗香来”，选 ②',
            animData: {
              type: 'cn_scroll', poemId: 'mei_hua', poemTitle: '宋·王安石《梅花》',
              verseTop: '墙角数枝梅，凌寒独自开。', verseBottom: '遥知不是雪，为有暗香来。',
              tip: '梅花虽白似雪，但梅有幽香而雪无香！', ans: '② 因为有清幽淡雅的梅花香气飘过来',
              steps: [
                step('第一步：定位第③段“因为……”后面的句子', '“因为微风吹过，有一阵阵清幽淡雅的梅花香气正悄悄飘过来呢！”', '为有暗香来'),
                step('第二步：锁定答案', '选 ②！', '答案：②')
              ]
            }
          },
          {
            key: 'q16', num: 16, points: 4,
            title: '阅读理解（4）：象征品格体会',
            promptPrefix: '作者通过描写在严寒大雪中独自盛开的梅花，赞美了梅花怎样的品格？（',
            promptSuffix: '）',
            choices: [
              '不畏严寒、坚强高洁的品格',
              '胆小怕冷、贪图安逸',
              '喜欢炫耀、骄傲自满'
            ],
            correctIdx: 1,
            explainDetail: '梅花在百花凋零的寒冬里迎着风雪独自开放、幽香高洁，象征着不畏严寒、坚韧顽强、高洁傲岸的品格，选 ①',
            animData: {
              type: 'cn_scroll', poemTitle: '《梅花》精神品格',
              verseTop: '凌寒独自开 · 暗香浮动', verseBottom: '不畏严寒 · 坚强高洁',
              tip: '梅、兰、竹、菊并称“四君子”，梅花最突出的品格就是“不畏严寒、坚强高洁”！', ans: '① 不畏严寒、坚强高洁的品格',
              steps: [
                step('第一步：抓关键词“迎着刺骨的严寒独自绽放”、“高洁美丽”', '体现不畏严寒、坚强高洁。', '不畏严寒 · 坚强高洁'),
                step('第二步：锁定答案', '选 ①！', '答案：①')
              ]
            }
          }
        ]
      },
      writingTask: {
        title: '看图写话：漫天瑞雪中的寒江垂钓',
        svg: SVG_SCENES.buildSnowman,
        sceneDesc: '仔细观察左图：冬天下起了大雪，远山、岸边的松树和岩石变成了什么样？冰冷的江面上停着什么？老渔翁穿着什么在做什么？',
        wordBank: ['鹅毛大雪', '银装素裹', '千山鸟飞绝', '白雪皑皑', '孤舟蓑笠翁', '独钓寒江雪'],
        blanks: [
          {
            key: 'q17_time', label: '① 漫天大雪与千山覆雪', points: 3,
            prefix: '寒冬腊月，天空中纷纷扬扬地下起了鹅毛大雪。连绵的远山、岸边的岩石和苍翠的松树全都盖上了厚厚的白雪，（', suffix: '）。',
            choices: ['整个天地白茫茫一片，变成了银装素裹的冰雪世界', '到处盛开着火红的荷花', '知了在树枝上不停地叫着'],
            correctIdx: 1
          },
          {
            key: 'q17_who', label: '② 飞鸟与行人绝迹', points: 3,
            prefix: '风雪越来越大，空旷的群山间（', suffix: '），所有的山路小径都被白雪覆盖，看不见一个行人的脚印。',
            choices: ['看不见一只飞鸟的踪影，四周静悄悄的', '到处是放风筝的小朋友', '飞满了金黄的黄鹂鸟'],
            correctIdx: 1
          },
          {
            key: 'q17_do', label: '③ 寒江孤舟老翁独钓', points: 3,
            prefix: '然而，在冰冷空阔的江面上，却停着一叶落满白雪的乌篷小木舟。一位白胡子老渔翁（', suffix: '）。',
            choices: ['头戴斗笠、身披蓑衣，独自坐在船头静静地握着钓竿垂钓', '穿着短袖在河里游泳', '在船上大声唱歌跳舞'],
            correctIdx: 1
          },
          {
            key: 'q17_feel', label: '④ 坚毅品格与画境升华', points: 3,
            prefix: '江面上泛起圈圈细微的涟漪，这位老渔翁（', suffix: '），构成了一幅宁静而又震撼人心的《江雪》水墨画卷！',
            choices: ['丝毫不畏惧漫天风雪与严寒，神情是那样专注、从容与坚毅', '冻得哇哇大哭着跑回家了', '把鱼竿扔进了火炉里'],
            correctIdx: 1
          }
        ],
        modelEssay: '寒冬腊月，天空中纷纷扬扬地下起了鹅毛大雪。连绵的远山、岸边的岩石和苍翠的松树全都盖上了厚厚的白雪，整个天地白茫茫一片，变成了银装素裹的冰雪世界。风雪越来越大，空旷的群山间看不见一只飞鸟的踪影，四周静悄悄的，所有的山路小径都被白雪覆盖，看不见一个行人的脚印。然而，在冰冷空阔的江面上，却停着一叶落满白雪的乌篷小木舟。一位白胡子老渔翁头戴斗笠、身披蓑衣，独自坐在船头静静地握着钓竿垂钓。江面上泛起圈圈细微的涟漪，这位老渔翁丝毫不畏惧漫天风雪与严寒，神情是那样专注、从容与坚毅，构成了一幅宁静而又震撼人心的《江雪》水墨画卷！',
        explainDetail: '寒江雪写话四步：①鹅毛大雪下远山青松银装素裹 + ②千山无飞鸟、小路无脚印 + ③孤舟上老渔翁戴斗笠披蓑衣独钓 + ④不畏严寒从容坚毅！',
        animData: {
          type: 'cn_story_flow', flowTitle: '✍️ 看图写话环境烘托法：寒江瑞雪独钓',
          nodes: ['❄️天地雪景：远山青松银装素裹', '🏔️万籁俱寂：飞鸟绝迹人踪灭', '🚣画眼中心：蓑笠老翁孤舟独钓', '💪精神升华：不畏风雪从容坚毅'],
          tip: '先用漫天风雪、飞鸟行人都看不见来烘托寒冷与安静，再引出江心小船上独钓的老渔翁，画面对比感最强！', ans: '满分范文已解锁',
          steps: [
            step('第一步：描写漫天大雪与远山青松', '鹅毛大雪纷纷扬扬，群山、青松、岸石银装素裹，飞鸟与行人都不见了。', '环境烘托：千山万径'),
            step('第二步：聚焦画面右下方江面孤舟', '小木船篷顶积满白雪，老渔翁戴斗笠、披蓑衣，手握钓竿静静垂钓。', '人物特写：孤舟蓑笠翁'),
            step('第三步：赞美老渔翁不畏严寒的从容气度', '不畏风雪、专注坚毅，构成绝美《江雪》画卷！', '画境升华')
          ]
        }
      }
    }
  ];

  const presets = SEEDS.map(seed => ({
    id: seed.id,
    letter: seed.letter,
    label: seed.label,
    title: seed.title,
    subtitle: seed.subtitle,
    subject: 'chinese'
  }));

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function create(mode = 'cn_paper_a', options = {}) {
    if (mode === 'random') {
      const pool = SEEDS.filter(seed => seed.id !== options.excludeMode);
      mode = pool[Math.floor(Math.random() * pool.length)].id;
    }
    const seed = SEEDS.find(item => item.id === mode) || SEEDS[0];
    return {
      subject: 'chinese',
      mode: seed.id,
      letter: seed.letter,
      title: seed.title,
      subtitle: seed.subtitle,
      graded: false,
      timeLimitSeconds: options.timeLimitSeconds === 1200 ? 1200 : 0,
      secondsElapsed: 0,
      sec1Questions: clone(seed.sec1Questions),
      sec2Questions: clone(seed.sec2Questions),
      sec3Questions: clone(seed.sec3Questions),
      readingPassage: clone(seed.readingPassage),
      writingTask: clone(seed.writingTask),
      answers: {}
    };
  }

  function allQuestions(paper) {
    if (!paper) return [];
    return [
      ...(paper.sec1Questions || []),
      ...(paper.sec2Questions || []),
      ...(paper.sec3Questions || []),
      ...(paper.readingPassage?.questions || [])
    ];
  }

  function explanation(paper, key) {
    if (!paper) return null;
    if (key === 'q17' || key.startsWith('q17_')) {
      const w = paper.writingTask;
      return {
        id: `paper_${paper.mode}_q17`,
        categoryName: `${paper.letter} · ${w.title}`,
        prompt: w.sceneDesc,
        answer: '满分范文',
        unit: '',
        formula: w.modelEssay,
        animData: clone(w.animData)
      };
    }
    const q = allQuestions(paper).find(item => item.key === key);
    if (!q) return null;
    const correctLabel = q.choices[q.correctIdx - 1];
    return {
      id: `paper_${paper.mode}_${q.key}`,
      categoryName: `${paper.letter} · 第${q.num}题 ${q.title}`,
      prompt: `${q.promptPrefix}${correctLabel}${q.promptSuffix}`,
      answer: correctLabel,
      unit: '',
      formula: q.explainDetail,
      animData: clone(q.animData)
    };
  }

  window.ChinesePapers = {presets, create, explanation, allQuestions};
})();
