// Reading room UI: a small book shelf, editable reading cards and a printable diary.
(() => {
  'use strict';
  function mount({root,onNavigate,onBack,speak,stopSpeech}) {
    const N=window.ReadingNotebook, L=window.ReadingLibrary, esc=N.escape;
    const store=N.createStore({getItem:key=>window.localStorage.getItem(key),setItem:(key,value)=>window.localStorage.setItem(key,value)});
    let mode='library', theme='all', recordFilter='all', active=null, dirty=false, timer=null;
    const entryWords=e=>e.words.filter(row=>row.text.trim());
    const entrySentences=e=>e.sentences.filter(row=>row.text.trim());
    const dateText=value=>String(value).replace(/-/g,'.');
    const themeOf=story=>L.themes.find(t=>t.id===story?.theme)||L.themes[0];
    const storageNotice=()=>`<p id="rr-storage-notice" class="rr-storage-error" role="status"${store.error?'':' hidden'}>${esc(store.error)}</p>`;
    const statusLabel=entry=>entry?.status==='complete'?'阅读卡已完成':entry?.read?'已读 · 记录待补充':entry?'阅读中':'还没读过';

    function updateEntrances() {
      const stats=store.stats();
      document.querySelectorAll('[data-reading-summary]').forEach(el=>{el.textContent=`已读 ${stats.read} 次 · ${stats.completed} 张阅读卡`;});
    }
    function feedback(text,isError=false) {
      const el=root.querySelector('#rr-feedback');
      if(el){el.textContent=text;el.classList.toggle('is-error',isError);}
    }
    function save() {
      clearTimeout(timer);
      if(!active||!dirty)return true;
      const ok=store.save(active);
      if(ok)dirty=false;
      const notice=root.querySelector('#rr-storage-notice');
      if(notice){notice.textContent=store.error;notice.hidden=!store.error;}
      const el=root.querySelector('#rr-save-state');
      if(el){el.textContent=ok?(active.status==='complete'?'已自动保存 · 阅读卡已完成':'已自动保存到当前浏览器'):store.error;el.classList.toggle('is-error',!ok);}
      if(!ok)feedback(store.error,true);
      updateEntrances();
      return ok;
    }
    function changed() {
      dirty=true; clearTimeout(timer);
      feedback('');
      const el=root.querySelector('#rr-save-state');if(el)el.textContent='正在保存…';
      timer=setTimeout(save,250);
    }
    function leave() {const ok=save();stopSpeech();return ok;}
    function topBar(backLabel,action='library') {
      return `<div class="rr-topbar"><button type="button" class="rr-back" data-rr-action="${action}">← ${backLabel}</button>
        <div><button type="button" class="rr-button rr-button-light" data-rr-action="records">📒 我的阅读本</button>
        <button type="button" class="rr-button rr-button-light" data-rr-action="paper">✎ 记录纸质书</button></div></div>`;
    }
    function renderLibrary() {
      mode='library'; active=null;
      const all=store.list(),stats=store.stats(),draft=all.find(e=>e.status!=='complete');
      const stories=L.stories.filter(s=>theme==='all'||s.theme===theme);
      root.innerHTML=`${topBar('返回语文乐园','chinese')}${storageNotice()}
        <section class="rr-hero"><div class="rr-hero-copy"><span class="rr-eyebrow">熊猫博士的阅读小书房 · 二年级</span>
          <h1>把故事读进心里，<br><em>把发现留在纸上。</em></h1>
          <p>读一个小故事，装进口袋里的好词，再写一写自己的想法。</p>
          <div class="rr-hero-stats"><span><b>${stats.read}</b> 次读完</span><span><b>${stats.completed}</b> 张阅读卡</span><span><b>${stats.words}</b> 个好词</span></div></div>
          <div class="rr-hero-art" aria-hidden="true"><span class="rr-art-star">✦</span><span class="rr-art-leaf">🌿</span><div class="rr-open-book"><i></i><i></i><span>把好奇心<br>翻到下一页</span></div><img src="assets/panda-wave-cover.webp" alt="" width="150" height="150"><span class="rr-art-flower">🌼</span></div></section>
        ${draft?`<button type="button" class="rr-continue" data-rr-entry="${esc(draft.id)}"><span>✎ 上次写到这里</span><strong>${esc(draft.bookTitle||'我的纸质书阅读记录')}</strong><span>接着写 →</span></button>`:''}
        <div class="rr-shelf-heading"><div><span class="rr-eyebrow">一本小书，一段新的发现</span><h2>故事书架 <small>12 篇原创短故事</small></h2></div>
          <label>故事分类 <select id="rr-theme" aria-label="故事分类"><option value="all">全部故事</option>${L.themes.map(t=>`<option value="${t.id}"${theme===t.id?' selected':''}>${t.label}</option>`).join('')}</select></label></div>
        <div class="rr-book-grid">${stories.map((story,index)=>{
          const t=themeOf(story),entry=all.find(e=>e.storyId===story.id);
          return `<button type="button" class="rr-book-card" data-rr-story="${story.id}" aria-label="阅读故事《${esc(story.title)}》">
            <div class="rr-book-cover rr-color-${t.color}"><span class="rr-cover-series">${t.label}</span><span class="rr-cover-drawing" aria-hidden="true">${story.emoji}</span><span class="rr-cover-ground" aria-hidden="true"></span><span class="rr-cover-no">小小故事集 / ${String(L.stories.indexOf(story)+1).padStart(2,'0')}</span><span class="rr-cover-spark" aria-hidden="true">✧</span></div>
            <div class="rr-book-copy"><div class="rr-book-meta"><span>${L.wordCount(story)} 字 · 二年级</span><span class="rr-read-state ${entry?.read?'is-read':''}">${statusLabel(entry)}</span></div>
            <h3>${esc(story.title)}</h3><p>${esc(story.summary)}</p><span class="rr-book-link">${entry?'打开故事与阅读卡':'翻开这个故事'} <b>↗</b></span></div></button>`;
        }).join('')}</div>
        <div class="rr-paper-invite"><span aria-hidden="true">📖</span><div><h3>手里的那本书，也能记在这里</h3><p>读完纸质书的一篇或一章，写下书名、喜欢的词句和自己的体会。</p></div><button type="button" class="rr-button" data-rr-action="paper">记一张阅读卡 →</button></div>
        <p class="rr-local-note">阅读卡保存在当前浏览器。清除网站数据或更换浏览器后，记录不会保留。</p>`;
    }
    function renderRecords() {
      mode='records';active=null;
      const all=store.list(),shown=all.filter(e=>recordFilter==='all'||e.status===recordFilter);
      root.innerHTML=`${topBar('返回故事书架')}${storageNotice()}<div class="rr-record-heading"><div><span class="rr-eyebrow">每次阅读，都有一点自己的收获</span><h1>我的阅读本</h1><p>故事里的好词好句，还有那天的想法，都记在这里。</p></div><span class="rr-record-count">${all.length}<small>张阅读卡</small></span></div>
        <div class="rr-record-filter" role="group" aria-label="阅读记录筛选">${[['all','全部记录'],['draft','接着写'],['complete','已完成']].map(([id,label])=>`<button type="button" data-rr-filter="${id}" aria-pressed="${recordFilter===id}">${label}</button>`).join('')}</div>
        <div class="rr-record-list">${shown.map(e=>{
          const story=L.find(e.storyId),t=themeOf(story);
          return `<button type="button" class="rr-record-card" data-rr-entry="${esc(e.id)}"><span class="rr-record-icon rr-color-${t.color}" aria-hidden="true">${story?.emoji||'📖'}</span><div><span class="rr-eyebrow">${dateText(e.date)} · ${e.source==='paper'?'纸质书 / 课外书':'书房原创故事'}</span><h2>${esc(e.bookTitle||'还没填写书名')}${e.chapter?`<small> · ${esc(e.chapter)}</small>`:''}</h2><p>${entryWords(e).length} 个好词 · ${entrySentences(e).length} 句摘录${e.reflection.trim()?` · ${esc(e.reflection.trim().slice(0,38))}${e.reflection.trim().length>38?'…':''}`:''}</p></div><span class="rr-record-tail"><span class="rr-read-state ${e.status==='complete'?'is-read':''}">${statusLabel(e)}</span><b>打开阅读卡 →</b></span></button>`;
        }).join('')||`<div class="rr-empty"><span>📒</span><h2>${all.length?'这里还没有这类记录':'阅读本，等着你的第一笔'}</h2><p>读一个故事，或记下手边那本书。没写完也可以下次继续。</p><button type="button" class="rr-button" data-rr-action="library">去挑一个故事 →</button></div>`}</div><p class="rr-local-note">会自动保存草稿，也可以重新打开已完成的阅读卡继续修改。</p>`;
    }

    function excerptRows(kind) {
      const label=kind==='words'?'好词':'好句';
      return active[kind].map((row,index)=>`<div class="rr-excerpt-row"><div class="rr-excerpt-number">${String(index+1).padStart(2,'0')}</div><div class="rr-excerpt-fields">
        <label class="rr-sr-only" for="rr-text-${esc(row.id)}">${label}第${index+1}条</label>
        ${kind==='words'?`<input id="rr-text-${esc(row.id)}" data-rr-kind="${kind}" data-rr-row="${esc(row.id)}" data-rr-field="text" maxlength="1200" placeholder="我发现的好词" value="${esc(row.text)}">`:
          `<textarea id="rr-text-${esc(row.id)}" rows="2" data-rr-kind="${kind}" data-rr-row="${esc(row.id)}" data-rr-field="text" maxlength="1200" placeholder="把喜欢的原句摘抄在这里">${esc(row.text)}</textarea>`}
        <label class="rr-sr-only" for="rr-note-${esc(row.id)}">${label}第${index+1}条的理解或想法（选填）</label>
        <input class="rr-excerpt-note" id="rr-note-${esc(row.id)}" data-rr-kind="${kind}" data-rr-row="${esc(row.id)}" data-rr-field="note" maxlength="1200" placeholder="${kind==='words'?'我的理解或造句（选填）':'我喜欢这句话，因为……（选填）'}" value="${esc(row.note)}"></div>
        <button type="button" class="rr-remove" data-rr-remove="${esc(row.id)}" data-rr-kind="${kind}" aria-label="移除${label}第${index+1}条">×</button></div>`).join('')||`<p class="rr-excerpt-empty">找到喜欢的${label}后，点下面的按钮加一条。</p>`;
    }
    function renderExcerptList(kind) {
      root.querySelector(`#rr-${kind}`).innerHTML=excerptRows(kind);
      root.querySelector(`#rr-${kind}-count`).textContent=(kind==='words'?entryWords(active):entrySentences(active)).length;
    }
    function readFlag() {
      return `<label class="rr-read-check"><input id="rr-read-flag" type="checkbox" data-rr-entry-field="read"${active.read?' checked':''}><span><strong>我已经读完这一篇 / 这一章</strong><small>给这次阅读做个小标记，再留下自己的发现。</small></span></label>`;
    }
    function renderEditor() {
      mode='editor';
      const story=L.find(active.storyId),t=themeOf(story);
      const prompts=story?.prompts||['书里哪个人物或片段，让你印象最深？为什么？','这次阅读让你想到了自己生活里的什么事？','你想对书里的人物说些什么？'];
      root.innerHTML=`${topBar('返回故事书架')}${storageNotice()}<div class="rr-editor-top"><span class="rr-eyebrow">${story?'一篇小故事，一张属于你的阅读卡':'读手边的书，记下自己的收获'}</span><div><button type="button" class="rr-text-button" data-rr-action="again">再记一张</button><button type="button" class="rr-button rr-button-light" data-rr-action="print">🖨 打印阅读卡</button></div></div>
        <div class="rr-reading-layout${story?'':' is-paper'}"><div class="rr-reading-column">
        ${story?`<article class="rr-story-paper"><div class="rr-story-paper-head"><span class="rr-story-emblem rr-color-${t.color}" aria-hidden="true">${story.emoji}</span><span class="rr-eyebrow">${t.label} · 约 ${L.wordCount(story)} 字</span><h1>${esc(story.title)}</h1><p>${esc(story.author)}</p></div>
          <div class="rr-audio-actions"><button type="button" class="rr-button" data-rr-action="speak">🔊 听老师读全文</button><button type="button" class="rr-text-button" data-rr-action="stop">停止朗读</button></div>
          <div class="rr-story-text">${story.paragraphs.map((paragraph,index)=>`<div class="rr-paragraph"><p>${esc(paragraph)}</p><button type="button" data-rr-paragraph="${index}" aria-label="朗读第${index+1}段" title="朗读这一段">🔊</button></div>`).join('')}</div>
          ${readFlag()}<button type="button" class="rr-mobile-notebook-link" data-rr-action="notebook">去写我的阅读卡 ↓</button></article>
          <details class="rr-hint-box"><summary>🌿 好词小提示 <small>看看拼音与意思，也可以自己找</small></summary><div class="rr-vocabulary">${story.words.map((word,index)=>`<div><ruby>${esc(word.text)}<rt>${esc(word.pinyin)}</rt></ruby><p>${esc(word.meaning)}</p><button type="button" data-rr-word="${index}" aria-label="收藏好词${esc(word.text)}">＋ 收进好词口袋</button></div>`).join('')}</div></details>
          <details class="rr-hint-box"><summary>✦ 读一读这些句子 <small>想想哪里写得好</small></summary><div class="rr-sentence-hints">${story.sentences.map((sentence,index)=>`<div><blockquote>${esc(sentence.text)}</blockquote><p>${esc(sentence.hint)}</p><button type="button" data-rr-sentence="${index}" aria-label="收藏好句第${index+1}句">＋ 收藏这句</button></div>`).join('')}</div></details>`:
          `<aside class="rr-paper-guide"><div class="rr-paper-guide-art" aria-hidden="true">📖<span>✦</span></div><span class="rr-eyebrow">纸上的故事，也能留下来</span><h2>把读过的那本书，<br>记进小小阅读本。</h2><p>先写书名和这次读的篇目，再翻一翻原书，摘下喜欢的词句。</p><ol><li><b>读一篇，或读一章</b><span>读到哪里，就记到哪里。</span></li><li><b>选自己喜欢的词句</b><span>数量随你，也可以补上页码。</span></li><li><b>说说自己的想法</b><span>写一两句也很好，慢慢写完整。</span></li></ol><img src="assets/panda-wave-cover.webp" width="110" height="110" alt="熊猫博士陪你读书"></aside>`}</div>
        <section class="rr-notebook" id="rr-notebook" aria-labelledby="rr-notebook-title"><div class="rr-notebook-heading"><span class="rr-eyebrow">留给自己的小小收获</span><h2 id="rr-notebook-title">我的阅读卡 <span aria-hidden="true">✎</span></h2><p>好词、好句想留几条都可以。没写完，下次接着写。</p></div>
          <div class="rr-book-info"><label class="rr-full">书名 / 故事名称<input id="rr-book-title" data-rr-entry-field="bookTitle" maxlength="180" placeholder="例如：《小鲤鱼跳龙门》" value="${esc(active.bookTitle)}"${story?' readonly':''}></label>
          <label>作者（选填）<input data-rr-entry-field="author" maxlength="100" placeholder="可以翻翻封面" value="${esc(active.author)}"${story?' readonly':''}></label>
          <label>阅读日期<input data-rr-entry-field="date" type="date" value="${esc(active.date)}"></label>
          <label class="rr-full">篇目 / 章节 / 页码（选填）<input data-rr-entry-field="chapter" maxlength="180" placeholder="例如：第一章，或第 12–18 页" value="${esc(active.chapter)}"></label></div>
          ${story?'':readFlag()}
          <div class="rr-notebook-section"><div class="rr-section-heading"><h3>好词口袋 <span id="rr-words-count">${entryWords(active).length}</span></h3><span>把喜欢的词留下</span></div><div id="rr-words">${excerptRows('words')}</div><button type="button" class="rr-add-row" data-rr-add="words">＋ 再添一个好词</button></div>
          <div class="rr-notebook-section"><div class="rr-section-heading"><h3>好句收藏 <span id="rr-sentences-count">${entrySentences(active).length}</span></h3><span>读到心里去的那一句</span></div><div id="rr-sentences">${excerptRows('sentences')}</div><button type="button" class="rr-add-row" data-rr-add="sentences">＋ 再添一句好句</button></div>
          <div class="rr-notebook-section"><div class="rr-section-heading"><h3><label for="rr-reflection">我的阅读体会</label></h3><span id="rr-reflection-count">${active.reflection.trim().length} 字</span></div>
          <details class="rr-reflection-prompts"><summary>一时不知道怎么写？从一个小问题想起</summary><ul>${prompts.map(prompt=>`<li>${esc(prompt)}</li>`).join('')}</ul><p>选一个最想说的，用自己的话写下来就好。</p></details>
          <textarea id="rr-reflection" data-rr-entry-field="reflection" rows="6" maxlength="6000" placeholder="读完后，我想说……">${esc(active.reflection)}</textarea></div>
          <div class="rr-notebook-footer"><p id="rr-save-state" class="rr-save-state" role="status">${store.get(active.id)?'已自动保存到当前浏览器':'写下第一笔，就会自动保存'}</p><div><button type="button" class="rr-button rr-button-light" data-rr-action="save">保存草稿</button><button type="button" class="rr-button" data-rr-action="complete">✓ 完成阅读卡</button></div><p id="rr-feedback" class="rr-feedback" role="status" aria-live="polite"></p></div></section></div>
        <p class="rr-local-note">记录保存在当前浏览器。可以随时从“我的阅读本”打开、补写或打印。</p>`;
    }
    function goLibrary() {if(!leave())return;renderLibrary();window.scrollTo({top:0,behavior:'smooth'});}
    function openEntry(id) {
      if(!leave())return;active=store.get(id);dirty=false;
      if(active){renderEditor();window.scrollTo({top:0,behavior:'smooth'});}else renderRecords();
    }
    function openStory(id,fresh=false) {
      if(!leave())return;const story=L.find(id);if(!story)return;
      active=(!fresh&&store.list().find(e=>e.storyId===id))||N.createEntry({story});dirty=false;
      renderEditor();window.scrollTo({top:0,behavior:'smooth'});
    }
    function paper() {if(!leave())return false;active=N.createEntry({source:'paper'});dirty=false;renderEditor();root.querySelector('#rr-book-title').focus();return true;}
    function printCard() {
      if(!active)return;
      if(!active.bookTitle.trim()){feedback('先写下书名或篇目，阅读卡才知道属于哪个故事。');root.querySelector('#rr-book-title').focus();return;}
      save();stopSpeech();
      const sheet=document.getElementById('readingPrintSheet');sheet.innerHTML=N.printHTML(active);
      document.body.classList.add('reading-print-mode');
      const restore=()=>{document.body.classList.remove('reading-print-mode');sheet.innerHTML='';};
      window.addEventListener('afterprint',restore,{once:true});window.print();
    }
    function handleInput(event) {
      if(!active)return;
      const target=event.target,field=target.dataset.rrEntryField;
      if(['bookTitle','author','chapter','date','read','reflection'].includes(field)) {
        active[field]=field==='read'?target.checked:target.value;
        if(field==='reflection')root.querySelector('#rr-reflection-count').textContent=target.value.trim().length+' 字';
        changed();
      }else if(['words','sentences'].includes(target.dataset.rrKind)&&['text','note'].includes(target.dataset.rrField)){
        const row=active[target.dataset.rrKind].find(row=>row.id===target.dataset.rrRow);
        if(row){row[target.dataset.rrField]=target.value;changed();root.querySelector(`#rr-${target.dataset.rrKind}-count`).textContent=active[target.dataset.rrKind].filter(r=>r.text.trim()).length;}
      }
    }
    root.addEventListener('input',handleInput);
    root.addEventListener('change',event=>{if(event.target.id==='rr-theme'){theme=event.target.value;renderLibrary();}else handleInput(event);});
    root.addEventListener('click',event=>{
      const button=event.target.closest('button');if(!button||!root.contains(button))return;
      const data=button.dataset;
      if(data.rrStory){openStory(data.rrStory);return;}
      if(data.rrEntry){openEntry(data.rrEntry);return;}
      if(data.rrFilter){recordFilter=data.rrFilter;renderRecords();return;}
      if(data.rrAction){
        const action=data.rrAction;
        if(action==='library'){goLibrary();return;}
        if(action==='chinese'){if(leave())onBack();return;}
        if(action==='records'){if(!leave())return;renderRecords();window.scrollTo({top:0,behavior:'smooth'});return;}
        if(action==='paper'){paper();return;}
        if(!active)return;
        if(action==='stop'){stopSpeech();return;}
        if(action==='speak'){const story=L.find(active.storyId);if(story)speak(story.title+'。'+story.paragraphs.join('\n'));return;}
        if(action==='notebook'){root.querySelector('#rr-notebook').scrollIntoView({behavior:'smooth',block:'start'});return;}
        if(action==='again'){if(active.storyId)openStory(active.storyId,true);else {const old={...active};if(paper()){Object.assign(active,{bookTitle:old.bookTitle,author:old.author,chapter:old.chapter});renderEditor();}}return;}
        if(action==='print'){printCard();return;}
        if(action==='save'){dirty=true;if(save())feedback('草稿已保存，随时可以回来接着写。');return;}
        if(action==='complete'){
          const missing=N.missingParts(active);active.status=missing.length?'draft':'complete';dirty=true;
          if(save())feedback(missing.length?`草稿已保存。还可以补充：${missing.join('、')}。`:'这张阅读卡完成啦！你的发现，已经好好留在阅读本里。');
          return;
        }
      }
      if(!active)return;
      const story=L.find(active.storyId);
      if(data.rrParagraph!==undefined){const paragraph=story?.paragraphs[Number(data.rrParagraph)];if(paragraph)speak(paragraph);return;}
      if(data.rrWord!==undefined||data.rrSentence!==undefined){
        const isWord=data.rrWord!==undefined,kind=isWord?'words':'sentences',item=isWord?story?.words[Number(data.rrWord)]:story?.sentences[Number(data.rrSentence)];
        if(!item)return;
        if(N.addExcerpt(active,kind,item.text)){dirty=true;save();renderExcerptList(kind);feedback(isWord?'好词已收进口袋。也可以写写自己的理解。':'好句已收藏。想一想，你为什么喜欢它？');}
        else feedback('这条摘录已经在阅读卡里啦。');
        return;
      }
      if(['words','sentences'].includes(data.rrAdd)){
        N.addExcerpt(active,data.rrAdd);dirty=true;save();renderExcerptList(data.rrAdd);
        const row=active[data.rrAdd].at(-1);document.getElementById('rr-text-'+row.id)?.focus();return;
      }
      if(data.rrRemove&&['words','sentences'].includes(data.rrKind)){
        active[data.rrKind]=active[data.rrKind].filter(row=>row.id!==data.rrRemove);dirty=true;save();renderExcerptList(data.rrKind);
      }
    });
    window.addEventListener('pagehide',save);
    document.addEventListener('visibilitychange',()=>{if(document.hidden)save();});
    window.addEventListener('storage',event=>{
      if(event.key!==N.KEY&&event.key!==null)return;
      updateEntrances();if(mode==='library')renderLibrary();else if(mode==='records')renderRecords();
    });
    updateEntrances();
    return {open(){if(!leave())return;onNavigate();renderLibrary();},leave};
  }
  window.ReadingRoom={mount};
})();
