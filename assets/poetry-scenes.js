/* Illustrated poetry scenes. Artwork stays still; water, weather and plants move locally. */
(() => {
  const scenes = {
    deng_guan_que_lou: {title:'登鹳雀楼', mood:'落日 · 山河', palette:['#e9a46f','#684b59'], water:[0,.59,.62,.41], weather:'sunset', hints:['夕阳缓缓落向群山，黄河闪着金光奔向远方。','登上更高一层楼，远处的山河也看得更清楚。']},
    wang_lu_shan_pu_bu: {title:'望庐山瀑布', mood:'紫烟 · 飞瀑', palette:['#d6dfea','#568c9b'], water:[.42,.85,.58,.15], weather:'waterfall', hints:['阳光照着香炉峰，山间升起一片淡紫色云烟。','瀑布飞流直下，像天上的银河倾泻到山谷。']},
    ye_su_shan_si: {title:'夜宿山寺', mood:'山寺 · 星河', palette:['#26396a','#617da3'], weather:'stars', hints:['山寺高楼直入云端，伸手仿佛就能碰到星星。','夜色这么安静，连说话都要轻轻的。']},
    jiang_xue: {title:'江雪', mood:'暮雪 · 孤舟', palette:['#dfe7e9','#9eafbb'], water:[.2,.65,.8,.35], weather:'snow', hints:['千山覆雪，飞鸟和行人的踪迹都不见了。','一叶小舟停在寒江上，老翁独自静静垂钓。']},
    chi_le_ge: {title:'敕勒歌', mood:'长风 · 草原', palette:['#b9dce9','#89a75a'], plants:[0,.64,1,.36], weather:'meadow', hints:['阴山脚下，辽阔的草原和天空连在一起。','风吹过，草低下了头，牛羊从草间露出来。','看！风过草地，成群的牛羊正在吃草。']},
    mei_hua: {title:'梅花', mood:'寒枝 · 暗香', palette:['#dce3e7','#b7a2ab'], weather:'plum', hints:['墙角几枝梅花，在寒冷中悄悄开放。','那不是白雪呀，风里还有梅花淡淡的香气。']},
    xiao_er_chui_diao: {title:'小儿垂钓', mood:'柳荫 · 清溪', palette:['#d2e5d6','#649589'], water:[.54,.45,.46,.55], plants:[0,0,.6,.35], weather:'pond', hints:['小朋友侧坐在草地上，专心地学着钓鱼。','远处有人问路，他只招招手，怕说话把鱼吓跑。']},
    cun_ju: {title:'村居', mood:'东风 · 纸鸢', palette:['#d7e8e4','#a2b967'], water:[.58,.48,.42,.3], plants:[0,0,.44,.45], weather:'spring', hints:['早春的杨柳轻拂河堤，草长了，黄莺也来了。','散学的小伙伴们趁着东风，开心地放起风筝。']},
    yong_liu: {title:'咏柳', mood:'碧玉 · 春风', palette:['#d6e6dd','#74a281'], water:[.44,.59,.56,.41], plants:[0,0,.57,.77], weather:'willow', hints:['高高的柳树披着新绿，万千柳条垂下，像丝带。','是谁把柳叶裁得这样细巧？原来是二月的春风。']},
    jue_ju: {title:'绝句', mood:'黄鹂 · 白鹭', palette:['#c8e4ee','#8bb2a4'], water:[.4,.69,.6,.31], plants:[0,0,.4,.58], weather:'birds', hints:['黄鹂在翠柳间鸣叫，一行白鹭正飞向蓝天。','远处的雪山映入窗中，门前停着远行的船。']},
    xiao_chu_jing_ci_si: {title:'晓出净慈寺送林子方', mood:'莲叶 · 荷香', palette:['#e4e9cb','#588b6c'], water:[0,.63,1,.37], plants:[0,.43,1,.57], weather:'lotus', hints:['六月的西湖，碧绿荷叶一直铺到了天边。','朝阳照着荷花，花瓣比平时更加鲜红。']},
    fu_de_gu_yuan_cao: {title:'赋得古原草送别', mood:'春草 · 新生', palette:['#dae2cb','#90ac6b'], plants:[0,.51,1,.49], weather:'meadow', hints:['原野上的草，每年都会枯萎，又长出一片新绿。','春风一来，顽强的小草又蓬蓬勃勃地生长。']},
    min_nong_qi_yi: {title:'悯农（其一）', mood:'春种 · 秋收', palette:['#e4dfbf','#b79750'], plants:[.51,.64,.49,.36], weather:'grain', hints:['春天播下一粒种子，秋天就能收获许多粮食，离不开农民的辛勤劳动。','田地都种满了庄稼，农民却仍有人挨饿。诗人表达了对农民的深切同情。']},
    zhou_ye_shu_suo_jian: {title:'舟夜书所见', mood:'渔灯 · 星影', palette:['#22384e','#526b73'], water:[.08,.58,.84,.42], weather:'lantern', hints:['没有月光的夜里，远处一盏渔灯，像一点小小的萤火。','微风吹起细浪，灯影随水波散开，好像星星洒满了河面。']},
  };
  const images = new Map(), sessions = new Map();
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const fract = n => n - Math.floor(n);
  const seed = n => fract(Math.sin(n * 127.1 + 311.7) * 43758.5453);
  const getScene = id => scenes[id] || scenes.deng_guan_que_lou;
  function preload(id) {
    if (!scenes[id]) id = 'deng_guan_que_lou';
    if (images.has(id)) return images.get(id);
    const image = new Image();
    const entry = {image, state:'loading', listeners:new Set()};
    images.set(id, entry);
    const finish = state => {entry.state=state;for(const fn of entry.listeners)fn();};
    image.onload = () => finish('ready');
    image.onerror = () => finish('error');
    image.src = `assets/poetry/${id}.webp`;
    return entry;
  }

  // Copy a narrow painted region with a tiny travelling distortion. The surrounding
  // landscape remains perfectly fixed, and the soft edge avoids a rectangular seam.
  function breatheRegion(ctx, image, region, t, water=false) {
    const [rx,ry,rw,rh] = region;
    const x=rx*960, y=ry*540, w=rw*960, h=rh*540;
    ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();
    const strips = Math.ceil((water ? h : w)/5);
    for(let i=0;i<strips;i++){
      const p=i/strips, soft=Math.sin(Math.PI*p);
      const phase=t*(water?1.9:1.1)+p*(water?22:4);
      const shift=Math.sin(phase)*soft*(water?1.6:2.4);
      ctx.globalAlpha=.82*soft;
      if(water){
        const dy=y+p*h, sh=Math.min(h/strips+1,540-dy);
        ctx.drawImage(image,x/960*image.naturalWidth,dy/540*image.naturalHeight,w/960*image.naturalWidth,sh/540*image.naturalHeight,x+shift,dy,w,sh);
      }else{
        const dx=x+p*w, sw=Math.min(w/strips+1,960-dx);
        const bend=shift*(.5+.5*Math.sin(t*.8+p*6));
        ctx.drawImage(image,dx/960*image.naturalWidth,y/540*image.naturalHeight,sw/960*image.naturalWidth,h/540*image.naturalHeight,dx,y+bend,sw,h);
      }
    }
    ctx.restore();
  }
  function ripples(ctx, region, t, color='255,255,237'){
    const [x,y,w,h]=region;
    ctx.save();ctx.beginPath();ctx.rect(x*960,y*540,w*960,h*540);ctx.clip();
    for(let i=0;i<15;i++){
      const px=(x+seed(i+2)*w)*960;
      const py=(y+seed(i+26)*h)*540;
      const life=fract(t*.15+seed(i+39));
      ctx.strokeStyle=`rgba(${color},${Math.sin(life*Math.PI)*.18})`;
      ctx.lineWidth=.8;
      ctx.beginPath();ctx.ellipse(px,py,8+life*24,1+life*3,0,0,Math.PI*2);ctx.stroke();
    }ctx.restore();
  }
  function mist(ctx,t,purple=false){
    for(let i=0;i<5;i++){
      const cx=100+i*205+Math.sin(t*.09+i)*25, cy=310+Math.cos(t*.12+i)*28;
      const g=ctx.createRadialGradient(cx,cy,0,cx,cy,135);
      g.addColorStop(0,purple?'rgba(208,188,238,.075)':'rgba(235,245,250,.07)');g.addColorStop(1,'rgba(230,240,250,0)');
      ctx.fillStyle=g;ctx.fillRect(cx-135,cy-135,270,270);
    }
  }
  function flakes(ctx,t,plum=false){
    for(let i=0;i<(plum?32:68);i++){
      const depth=.35+seed(i+1)*.65, speed=plum?12:17;
      const px=fract(seed(i+7)+t*.008*depth+Math.sin(t*.5+i)*.009)*1000-20;
      const py=fract(seed(i+97)+t*speed*depth/580)*580-20;
      ctx.fillStyle=`rgba(255,255,255,${.25+depth*.5})`;
      ctx.beginPath();ctx.ellipse(px,py,.6+depth*1.7,1+depth*1.3,.2,0,Math.PI*2);ctx.fill();
    }
  }
  function petals(ctx,t,count=12,green=false){
    for(let i=0;i<count;i++){
      const p=fract(seed(i+48)+t*(.018+seed(i+9)*.01));
      const px=seed(i+11)*850+p*130+Math.sin(t*.7+i)*18;
      const py=p*610-40;
      ctx.save();ctx.translate(px,py);ctx.rotate(t*.8+i);
      ctx.globalAlpha=.35+Math.sin(p*Math.PI)*.3;
      ctx.fillStyle=green?'#a4c879':i%2?'#f0cad5':'#fff1ee';
      ctx.beginPath();ctx.ellipse(0,0,2.7,1.3+Math.abs(Math.sin(t+i)),0,0,Math.PI*2);ctx.fill();ctx.restore();
    }
  }
  function birds(ctx,t,white=false){
    // A wing folds about its shoulder on each stroke; flight follows a steady path.
    for(let i=0;i<(white?4:2);i++){
      const progress=fract(t*.019+i*.085);
      const px=-70+progress*1100-i*14, py=120+i*17+Math.sin(progress*Math.PI)*-30;
      const flap=Math.sin(t*5+i*.65), span=white?9:6;
      ctx.save();ctx.translate(px,py);ctx.scale(white?1:0.85,1);
      ctx.fillStyle=white?'#f6f7ef':'#6c6359';ctx.globalAlpha=.85;
      ctx.beginPath();ctx.ellipse(0,0,span*.45,1.4,.12,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(-span*.6,flap*span*.85,-span,flap*span);ctx.quadraticCurveTo(-span*.55,flap*span*.45,2,1);ctx.fill();
      ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(span*.6,flap*span*.85,span,flap*span);ctx.quadraticCurveTo(span*.55,flap*span*.45,-2,1);ctx.fill();ctx.restore();
    }
  }
  function waterfall(ctx,t){
    ctx.save();ctx.beginPath();
    ctx.moveTo(743,85);ctx.lineTo(836,85);ctx.lineTo(785,440);ctx.lineTo(673,440);ctx.closePath();ctx.clip();
    for(let i=0;i<62;i++){
      const travel=fract(t*(.24+seed(i+18)*.14)+seed(i+12));
      const y=90+travel*347, x=744+seed(i+36)*84-travel*63;
      ctx.strokeStyle=`rgba(245,252,255,${.10+seed(i)*.20})`;ctx.lineWidth=.6+seed(i+51)*1.7;
      ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x-1,y+9,x-3,y+17+seed(i+5)*13);ctx.stroke();
    }ctx.restore();
    for(let i=0;i<12;i++){
      const p=fract(t*.16+seed(i+13));
      ctx.fillStyle=`rgba(235,250,253,${Math.sin(p*Math.PI)*.12})`;
      ctx.beginPath();ctx.ellipse(718+Math.sin(i*1.7)*65,438-p*26,12+p*21,2+p*4,0,0,Math.PI*2);ctx.fill();
    }
  }
  function stars(ctx,t){
    for(let i=0;i<34;i++){
      const px=seed(i+12)*640,py=seed(i+121)*260;
      const a=.12+Math.pow((Math.sin(t*.8+i*2)+1)/2,3)*.55;
      ctx.fillStyle=`rgba(244,242,210,${a})`;ctx.beginPath();ctx.arc(px,py,.65+seed(i)*1.25,0,Math.PI*2);ctx.fill();
    }
    mist(ctx,t);
  }
  function pollen(ctx,t){
    for(let i=0;i<17;i++){
      const x=fract(seed(i+4)+t*.004)*980;
      const y=320+seed(i+53)*210-Math.sin(t*.4+i)*8;
      ctx.fillStyle=`rgba(255,251,207,${.1+Math.sin(t*.7+i)**2*.28})`;
      ctx.beginPath();ctx.arc(x,y,.8+seed(i+7),0,Math.PI*2);ctx.fill();
    }
  }
  function lanternReflection(ctx,t,focus){
    // The glitter is reflected lamplight on the river, never stars falling from the sky.
    const lampX=645,lampY=227;
    const glow=ctx.createRadialGradient(lampX,lampY,0,lampX,lampY,20);
    glow.addColorStop(0,`rgba(255,205,106,${.08+Math.sin(t*1.3)**2*.04})`);
    glow.addColorStop(1,'rgba(255,201,101,0)');ctx.fillStyle=glow;ctx.fillRect(lampX-20,lampY-20,40,40);
    for(let i=0;i<66;i++){
      const depth=seed(i+4),wave=Math.sin(t*1.6+i*2.1);
      const x=lampX+(seed(i+39)-.5)*(24+depth*390)+wave*(1+depth*3);
      const y=300+depth*230+Math.sin(t*.9+i)*1.5;
      const alpha=(.03+Math.sin(t*.9+i*1.9)**4*.2)*(focus>0?1.2:1);
      ctx.fillStyle=`rgba(255,220,151,${alpha})`;
      ctx.beginPath();ctx.ellipse(x,y,1+depth*5,.5+depth*.6,0,0,Math.PI*2);ctx.fill();
    }
  }
  function draw(ctx,x,y,w,h,id,t=0,focus=0){
    const scene=getScene(id), entry=preload(id);
    ctx.save();ctx.translate(x,y);ctx.scale(w/960,h/540);
    ctx.beginPath();ctx.rect(0,0,960,540);ctx.clip();
    if(entry.state!=='ready'){
      const g=ctx.createLinearGradient(0,0,960,540);g.addColorStop(0,scene.palette[0]);g.addColorStop(1,scene.palette[1]);
      ctx.fillStyle=g;ctx.fillRect(0,0,960,540);ctx.fillStyle='rgba(255,255,255,.9)';
      ctx.textAlign='center';ctx.font='28px serif';ctx.fillText(scene.title,480,252);
      ctx.font='16px sans-serif';ctx.fillText(entry.state==='error'?'画卷暂时未能加载，请重新打开这首诗':'画卷正在展开…',480,292);
    }else{
      ctx.drawImage(entry.image,0,0,960,540);
      if(t>0){
        if(scene.water){breatheRegion(ctx,entry.image,scene.water,t,true);ripples(ctx,scene.water,t);}
        if(scene.plants)breatheRegion(ctx,entry.image,scene.plants,t,false);
        switch(scene.weather){
          case 'waterfall':waterfall(ctx,t);mist(ctx,t,true);break;
          case 'stars':stars(ctx,t);break;
          case 'snow':flakes(ctx,t);break;
          case 'plum':flakes(ctx,t,true);petals(ctx,t,7);break;
          case 'willow':petals(ctx,t,8,true);break;
          case 'birds':birds(ctx,t,true);break;
          case 'sunset':birds(ctx,t);break;
          case 'spring':petals(ctx,t,9);break;
          case 'lotus':pollen(ctx,t);break;
          case 'meadow':pollen(ctx,t);break;
          case 'grain':pollen(ctx,t);break;
          case 'lantern':lanternReflection(ctx,t,focus);break;
        }
      }
    }
    ctx.restore();return entry.state;
  }
  function mount(canvas,id,options={}){
    sessions.get(canvas)?.stop();
    const entry=preload(id),ctx=canvas.getContext('2d');
    const width=Math.min(1440,Math.max(800,(canvas.clientWidth||800)*Math.min(window.devicePixelRatio||1,2)));
    canvas.width=Math.round(width);canvas.height=Math.round(width*9/16);
    canvas.setAttribute('role','img');canvas.setAttribute('aria-label',`${getScene(id).title}：${getScene(id).mood}，国风动态画卷`);
    let userPaused = motionQuery.matches;
    try { userPaused = userPaused || localStorage.getItem('park_motion_paused') === 'true'; } catch {}
    let raf=null, stopped=false, paused=userPaused, last=null, elapsed=0, focus=0, lastPaint=null;
    function cancel(){if(raf!==null)cancelAnimationFrame(raf);raf=null;last=null;lastPaint=null;}
    function paint(){
      const state=draw(ctx,0,0,canvas.width,canvas.height,id,elapsed,focus);
      canvas.dataset.sceneState=state;
      options.onState?.(state);
    }
    function visible(){return canvas.isConnected!==false && (!options.isActive || options.isActive());}
    function schedule(){
      if(stopped||paused||document.hidden||raf!==null||entry.state==='error')return;
      if(!visible()){session.stop();return;}
      raf=requestAnimationFrame(tick);
    }
    function tick(now){
      raf=null;
      if(stopped||paused||document.hidden)return;
      if(!visible()){session.stop();return;}
      if(last!==null)elapsed+=Math.min((now-last)/1000,.1);
      last=now;
      // 30 painted frames/sec is ample for slow natural movement, including phones.
      if(lastPaint===null||now-lastPaint>=32){paint();lastPaint=now;}
      schedule();
    }
    const session={
      setPaused(value){paused=!!value;cancel();if(!paused)schedule();return paused;},
      setFocus(value){focus=Number(value)||0;paint();},
      stop(){stopped=true;cancel();entry.listeners.delete(loaded);sessions.delete(canvas);},
      refresh(){cancel();if(!visible()){session.stop();return;}if(!document.hidden){paint();schedule();}},
      get paused(){return paused;},
    };
    function loaded(){if(!stopped){paint();if(entry.state==='error')cancel();else schedule();}}
    sessions.set(canvas,session);entry.listeners.add(loaded);paint();schedule();return session;
  }
  function stopAll(){for(const session of [...sessions.values()])session.stop();}
  document.addEventListener('visibilitychange',()=>{for(const session of [...sessions.values()])session.refresh();});
  window.addEventListener('pagehide',stopAll);
  motionQuery.addEventListener?.('change',event=>{for(const session of sessions.values())session.setPaused(event.matches);});
  const escape = value => String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  function readingRoom(poem,reciteText){
    const scene=getScene(poem.id);
    return `
      <div class="poetry-book">
        <div class="poetry-art-column">
          <div class="poetry-art-heading"><span>一诗一境</span><span>${scene.mood}</span></div>
          <div class="poetry-canvas-shell">
            <canvas id="poemSceneCanvas" class="poetry-art-canvas"></canvas>
            <span id="poemArtStatus" class="poetry-art-status" role="status">画卷正在展开…</span>
          </div>
          <div class="poetry-scene-note">
            <span class="poetry-seal" aria-hidden="true">诗境</span>
            <p id="poemSceneHint">${escape(scene.hints[0])}</p>
          </div>
          <div class="poetry-scene-tools">
            <span>看画面，想一想诗里说了什么</span>
            <button id="poemMotionBtn" data-poem-motion-toggle aria-pressed="false">Ⅱ 暂停画面</button>
          </div>
        </div>
        <div class="poetry-verse-column">
          <div class="poetry-eyebrow">${escape(poem.grade)} · 古诗诵读</div>
          <h4>${escape(poem.title)}</h4>
          <p class="poetry-author">〔${escape(poem.dynasty)}〕${escape(poem.author)}</p>
          <div class="poetry-verses" aria-label="点击诗句查看诗意">
            ${poem.lines.map((line,i)=>`
              <button class="poetry-verse${i===0?' is-active':''}" data-poem-line="${i}" aria-pressed="${i===0}">
                <span class="poetry-pinyin">${escape(poem.pinyinLines[i]||'')}</span>
                <span class="poetry-line">${escape(line)}</span>
              </button>`).join('')}
          </div>
          <div class="poetry-listen-buttons">
            <button data-recite-poem="${encodeURIComponent(poem.title+'，'+poem.dynasty+'，'+poem.author+'。'+poem.lines.join(''))}" class="recite-poem-btn poetry-listen-primary">♫ 听古诗朗诵</button>
            <button data-recite-poem="${encodeURIComponent(reciteText)}" class="recite-poem-btn poetry-listen-secondary">听诗意讲解</button>
          </div>
          <p class="poetry-reading-tip">轻点诗句，跟着画卷读懂诗意</p>
        </div>
      </div>
      <div class="poetry-explain-grid">
        <div class="poetry-explain"><h5>把古诗讲给你听</h5><p>${escape(poem.meaning)}</p></div>
        <div class="poetry-explain poetry-remember"><h5>读一读，记一记</h5><p>${escape(poem.keyPoint)}</p></div>
      </div>`;
  }
  window.PoetryScenes={scenes,preload,draw,mount,stopAll,readingRoom};
})();
