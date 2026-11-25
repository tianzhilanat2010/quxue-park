'use strict';
const $=id=>document.getElementById(id);
const pages=[
 {title:'恐龙为什么灭绝了？',headline:'恐龙为什么<br><em>灭绝了？</em>',kicker:'地球往事 · 第一册',art:'forest',alt:'白垩纪河岸，一头三角龙站在蕨丛边。',text:'一块从太空飞来的石头，怎么会让远处森林里的恐龙也找不到食物？翻开这本书，回到约 6600 万年前，一起找线索。',label:'观察三角龙'},
 {title:'河岸上的三角龙',headline:'河岸上的<br><em>三角龙</em>',art:'forest',alt:'三角龙有宽大的头盾，眼睛上方有角，嘴巴像坚硬的喙。',text:'约 6600 万年前，三角龙生活在北美洲。它用像鸟喙一样的嘴咬下植物，再用嘴里的牙齿切碎。看似威风的庞然大物，每天的饭都得靠植物。',label:'放大看它的嘴'},
 {title:'天上来了一块石头',headline:'天上来了<br><em>一块石头</em>',art:'impact',alt:'一颗发光的小行星划过天空，飞向海岸。',text:'一颗宽约 10 千米的小行星撞上地球，落在今天墨西哥尤卡坦半岛附近。撞击把岩石击碎，让大量尘埃和其他微粒冲上高空。很远的地方，天空也渐渐暗了下来。',label:'观察撞击场景'},
 {title:'阳光去哪儿了？',headline:'阳光<br><em>去哪儿了？</em>',art:'shade',alt:'光线暗淡的白垩纪森林，地面有蕨类和觅食的小恐龙。',text:'植物要靠阳光制造养分。高空的微粒挡住一部分阳光，地面变冷，许多植物难以生长。吃植物的动物缺了食物，捕食它们的动物也跟着挨饿。',label:'观察林下光线'},
 {title:'谁留下来了？',headline:'谁<br><em>留下来了？</em>',art:'bird',alt:'阳光下，一只蓝橙色的小鸟栖在树枝上。',text:'这场大灭绝中，三角龙、霸王龙等非鸟恐龙消失了。有些鸟类活了下来，一代代繁衍。今天在窗边跳来跳去的麻雀，就是恐龙家族还活着的成员。',label:'观察现代鸟类'}
];
const iconPaths={book:'M3 5q5-2 9 1 4-3 9-1v13q-5-2-9 1-4-3-9-1z M12 6v13',note:'M6 3h13v18H6z M3 7h5 M3 12h5 M3 17h5 M11 8h5 M11 12h4',search:'M16 16l5 5 M18 10a7 7 0 1 1-14 0 7 7 0 1 1 14 0',play:'M7 4l12 8-12 8z',pause:'M8 5v14 M16 5v14'};
function icon(name){return '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="'+iconPaths[name]+'"/></svg>';}
document.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon));
const key='little-field-guide:dinosaurs:v1';
let saved={};
try{saved=JSON.parse(localStorage.getItem(key)||'{}')||{};}catch{}
let seen=new Set(Array.isArray(saved.seen)?saved.seen.filter(n=>Number.isInteger(n)&&n>=1&&n<=4):[]);
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
let paused=motionPreference.matches, current=0, light=65, quiz='', elapsed=0, frame=0, previous=0;
function persist(){saved.seen=[...seen];try{localStorage.setItem(key,JSON.stringify(saved));return true;}catch{return false;}}
function navigate(n){const hash=n?'p'+n:'cover';if(location.hash==='#'+hash)render();else location.hash=hash;}
function modal(title,body){$('dialogTitle').textContent=title;$('dialogBody').innerHTML=body;if(!$('dialog').open)$('dialog').showModal();}
$('close').onclick=()=>$('dialog').close();$('dialog').addEventListener('click',e=>{if(e.target===$('dialog')&&(e.clientX<$('dialog').getBoundingClientRect().left||e.clientX>$('dialog').getBoundingClientRect().right||e.clientY<$('dialog').getBoundingClientRect().top||e.clientY>$('dialog').getBoundingClientRect().bottom))$('dialog').close();});
$('contents').onclick=()=>{$('catalog').focus();$('catalog').scrollIntoView({block:'start',behavior:motionPreference.matches?'instant':'smooth'});};
function notes(){
 modal('我的观察手记','<p>关于恐龙灭绝，你最想记住什么？可以写一句发现，也可以留下一个新问题。</p><label for="memo">我的发现</label><textarea id="memo" maxlength="2000" placeholder="我发现……"></textarea><button class="primary" id="saveMemo">保存手记</button><p class="note-state" id="noteStatus" role="status"></p>');
 $('memo').value=typeof saved.note==='string'?saved.note:'';
 $('noteStatus').textContent=saved.note?'这是你上次留下的观察。':'手记保存在这个浏览器里。';
 $('saveMemo').onclick=()=>{saved.note=$('memo').value;$('noteStatus').textContent=persist()?'已经保存，下次打开还可以继续写。':'浏览器未能保存，请先复制你的文字。';};
}
$('notes').onclick=notes;
$('sources').onclick=()=>modal('资料与插图','<p>本册依据伦敦自然史博物馆的科普资料编写。撞击与食物链示意采用简化表达，画面是用 Gemini 制作的科学情境插画。</p><ul><li><a href="https://www.nhm.ac.uk/discover/dinosaur-extinction.html" target="_blank" rel="noopener">什么导致了恐龙灭绝？</a></li><li><a href="https://www.nhm.ac.uk/discover/how-an-asteroid-caused-extinction-of-dinosaurs.html" target="_blank" rel="noopener">小行星怎样改变了地球？</a></li><li><a href="https://www.nhm.ac.uk/discover/why-are-birds-the-only-surviving-dinosaurs.html" target="_blank" rel="noopener">哪些恐龙活到了今天？</a></li></ul>');
function showBeak(){
 modal('看三角龙的嘴','<div class="beak-detail"><img src="art/forest.webp" alt="三角龙脸部特写，嘴巴前端像一把弯弯的小剪刀。"></div><p>从角尖往下找。看到弯弯的硬嘴了吗？它能咬下枝叶，再用嘴巴深处的牙齿把食物切碎。</p>');
}
$('zoom').onclick=()=>{if(current===1)return showBeak();const p=pages[current];modal(p.label,'<img src="art/'+p.art+'.webp" alt="'+p.alt+'"><p>'+p.alt+'</p>');};
$('forward').onclick=()=>current===4?notes():navigate(current+1);
$('back').onclick=()=>navigate(Math.max(0,current-1));
$('tiles').innerHTML=pages.slice(1).map((p,i)=>'<button class="tile" data-page="'+(i+1)+'"><div class="thumb"><img alt="" src="art/'+p.art+'.webp"><span class="page-no">0'+(i+1)+'</span></div><h3>'+p.title+'</h3></button>').join('');
$('tiles').onclick=e=>{const card=e.target.closest('.tile');if(card)navigate(Number(card.dataset.page));};
function updateLight(){
 const shade=light<35?'微粒少，地面得到较多阳光，植物容易生长。':light<70?'微粒变多，透下来的阳光减少，植物生长变慢。':'阳光被大量遮挡，许多植物难以生长，食草动物能找到的食物也减少了。';
 $('scene').style.setProperty('--light',String(1.32-light*.008));
 $('scene').style.setProperty('--sat',String(1.35-light*.008));
 if($('lightResult').textContent!==shade)$('lightResult').textContent=shade;
 const energy=(100-light)/100;
 const growth=Math.min(1,energy*1.16);
 const food=Math.min(1,growth*1.12);
 [energy,growth,food].forEach((value,index)=>{
   $('chain').children[index].style.setProperty('--amount',String(.06+.94*value));
 });
}
function interaction(){
 const el=$('interaction');el.replaceChildren();
 if(current===1){el.innerHTML='<button class="line-btn" id="look">找一找：它用什么吃植物？</button>';$('look').onclick=showBeak;}
 if(current===2){el.innerHTML='<button class="line-btn" id="evidence">科学家怎么知道发生过撞击？</button>';$('evidence').onclick=()=>modal('藏在地下的线索','<p>在墨西哥尤卡坦半岛附近，科学家找到了埋在地下的巨大撞击坑，名叫希克苏鲁伯撞击坑。</p><p>世界上许多地方，还有一层来自那个年代的薄薄岩层，里面的铱比周围多。铱在地壳中很少见，在某些陨石中却更常见。这两条线索拼在了一起。</p>');}
 if(current===3){el.innerHTML='<div class="tool"><label for="dust">动手试试 · 改变高空微粒的多少</label><input type="range" id="dust" min="0" max="100" aria-label="高空微粒，从少到多"><div class="dust-ends" aria-hidden="true"><span>微粒少</span><span>微粒多</span></div><div id="chain" aria-hidden="true"><span>地面阳光</span><span>植物生长</span><span>动物食物</span></div><output for="dust" id="lightResult" aria-live="polite"></output></div>';$('dust').value=light;$('dust').oninput=e=>{light=Number(e.target.value);updateLight();draw();};updateLight();}
 if(current===4){el.innerHTML='<div class="tool"><strong>哪一种动物属于今天的恐龙家族？</strong><div class="answers"><button>蜥蜴</button><button>麻雀</button><button>鳄鱼</button></div><output id="quizResult" aria-live="polite"></output></div>';const respond=()=>{el.querySelectorAll('.answers button').forEach(b=>b.setAttribute('aria-pressed',b.textContent===quiz));$('quizResult').textContent=quiz?(quiz==='麻雀'?'答对了！麻雀是鸟，鸟类就是今天仍然存在的恐龙。':'再想想：哪一种有羽毛，属于鸟类？'):'';};el.querySelectorAll('.answers button').forEach(b=>b.onclick=()=>{quiz=b.textContent;respond();});respond();}
}
function render(){
 const match=location.hash.match(/^#p([1-4])$/);current=match?Number(match[1]):0;const p=pages[current];
 document.body.classList.toggle('reader',!!current);$('scene').dataset.page=current;
 if(current){seen.add(current);persist();}
 $('kicker').textContent=current?'地球往事　/　第 '+current+' 页，共 4 页':p.kicker;
 $('heading').innerHTML=p.headline;$('bodytext').textContent=p.text;$('art').src='art/'+p.art+'.webp';$('art').alt=p.alt;$('figlabel').textContent=p.label;
 $('forward').innerHTML=(current===4?icon('note'):icon('book'))+(current===4?'写下我的发现':current===0?'翻开绘本':'翻到下一页');$('back').hidden=!current;
 $('progress').textContent='已读 '+seen.size+' / 4 页';document.querySelectorAll('.tile').forEach(b=>b.setAttribute('aria-current',Number(b.dataset.page)===current));
 interaction();elapsed=0;$('scene').classList.remove('flip');void $('scene').offsetWidth;$('scene').classList.add('flip');restart();
}
const canvas=$('fx'),ctx=canvas.getContext('2d');
function draw(){
 const w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;
 const ratio=Math.min(devicePixelRatio||1,2);if(canvas.width!==Math.round(w*ratio)||canvas.height!==Math.round(h*ratio)){canvas.width=Math.round(w*ratio);canvas.height=Math.round(h*ratio);}
 ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,w,h);
 const t=elapsed;
 if(current===2){
   // Concentric pressure waves spread from one fixed point on the distant coast.
   for(let i=0;i<3;i++){const p=(t*.22+i/3)%1;ctx.beginPath();ctx.ellipse(w*.57,h*.66,w*(.015+.34*p),h*(.006+.05*p),0,0,Math.PI*2);ctx.strokeStyle='rgba(255,222,156,'+(.46*(1-p))+')';ctx.lineWidth=2;ctx.stroke();}
 } else if(current===3){
   for(let i=0;i<light*.53;i++){const x=((i*.618+t*.016)%1)*w,y=((i*.317+t*.013)%1)*h;ctx.fillStyle='rgba(220,210,182,.5)';ctx.beginPath();ctx.arc(x,y,1+i%2,0,Math.PI*2);ctx.fill();}
 } else {
   for(let i=0;i<8;i++){const x=((i*.161+t*.023)%1)*w,y=((i*.227+t*.032)%1)*h+Math.sin(t+i)*3;ctx.save();ctx.translate(x,y);ctx.rotate(t*.6+i);ctx.fillStyle=i%2?'rgba(242,205,107,.65)':'rgba(157,147,74,.62)';ctx.beginPath();ctx.ellipse(0,0,3.5+i%3,1.25,0,0,Math.PI*2);ctx.fill();ctx.restore();}
 }
}
function loop(now){if(previous)elapsed+=Math.min((now-previous)/1000,.1);previous=now;draw();frame=requestAnimationFrame(loop);}
function restart(){cancelAnimationFrame(frame);previous=0;draw();$('motion').innerHTML=icon(paused?'play':'pause')+(paused?'播放':'暂停');$('motion').setAttribute('aria-label',paused?'播放场景动画':'暂停场景动画');$('motion').setAttribute('aria-pressed',paused);if(!paused&&!document.hidden)frame=requestAnimationFrame(loop);}
$('motion').onclick=()=>{paused=!paused;restart();};motionPreference.addEventListener('change',e=>{paused=e.matches;restart();});document.addEventListener('visibilitychange',restart);window.addEventListener('resize',draw);
window.addEventListener('hashchange',()=>{render();$('heading').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});});render();
