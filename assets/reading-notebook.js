// Separate, browser-only reading diary. Reading reflections are never auto-graded.
(() => {
  'use strict';
  const KEY = 'panda_reading_notebook_v1';
  const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,10)}`;
  const today = () => {const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
  const clean = (value, max = 6000) => typeof value === 'string' ? value.slice(0,max) : '';
  const escape = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const filled = rows => rows.filter(row => row.text.trim());
  const blank = () => ({id:uid(),text:'',note:''});
  function createEntry({story = null, source = 'paper'} = {}) {
    const now = new Date().toISOString();
    return {id:uid(),source:story?'library':source,storyId:story?.id || '',bookTitle:story?.title || '',author:story?.author || '',
      chapter:'',date:today(),read:false,words:[blank(),blank(),blank()],sentences:[blank(),blank()],reflection:'',status:'draft',createdAt:now,updatedAt:now,completedAt:null};
  }
  function normalize(entry) {
    const rows = list => Array.isArray(list) ? list.filter(row => row && typeof row === 'object').map(row =>
      ({id:clean(row.id,80)||uid(),text:clean(row.text,1200),note:clean(row.note,1200)})) : [];
    return {id:clean(entry.id,80)||uid(),source:entry.source==='library'?'library':'paper',storyId:clean(entry.storyId,80),
      bookTitle:clean(entry.bookTitle,180),author:clean(entry.author,100),chapter:clean(entry.chapter,180),
      date:/^\d{4}-\d{2}-\d{2}$/.test(entry.date)?entry.date:today(),read:entry.read===true,
      words:rows(entry.words),sentences:rows(entry.sentences),reflection:clean(entry.reflection),
      status:entry.status==='complete'?'complete':'draft',createdAt:clean(entry.createdAt,40),updatedAt:clean(entry.updatedAt,40),completedAt:entry.completedAt || null};
  }
  function addExcerpt(entry, kind, text = '', note = '') {
    if (!['words','sentences'].includes(kind)) return false;
    const value = clean(text,1200).trim();
    if (value && entry[kind].some(row => row.text.trim() === value)) return false;
    const row = value && entry[kind].find(row => !row.text.trim() && !row.note.trim());
    if (row) {row.text=value; row.note=clean(note,1200);} else entry[kind].push({...blank(),text:value,note:clean(note,1200)});
    return true;
  }
  function missingParts(entry) {
    return [!entry.bookTitle.trim() && '书名或篇目', !entry.read && '已读标记', !filled(entry.words).length && '好词',
      !filled(entry.sentences).length && '好句', !entry.reflection.trim() && '阅读体会'].filter(Boolean);
  }
  function createStore(storage) {
    let error = '';
    function read() {
      try {
        const raw = storage.getItem(KEY);
        if (raw === null) return {version:1,entries:[]};
        const data = JSON.parse(raw);
        if (data?.version !== 1 || !Array.isArray(data.entries) || data.entries.some(e => !e || typeof e.id !== 'string')) throw Error('invalid reading records');
        return {version:1,entries:data.entries.map(normalize)};
      } catch {error='暂时无法读取本浏览器的阅读记录，请保留当前页面。'; return null;}
    }
    const list = () => (read()?.entries || []).sort((a,b) => b.updatedAt.localeCompare(a.updatedAt));
    return {
      get error() {return error;}, list,
      get: id => list().find(entry => entry.id === id) || null,
      save(entry) {
        const data = read(); if (!data) return false;
        const record = normalize(entry), now = new Date().toISOString();
        record.createdAt ||= now; record.updatedAt=now;
        if (missingParts(record).length) record.status='draft';
        if (record.status==='complete') record.completedAt ||= now;
        else record.completedAt=null;
        const index = data.entries.findIndex(e => e.id === record.id);
        if (index < 0) data.entries.unshift(record); else data.entries[index]=record;
        try {storage.setItem(KEY,JSON.stringify(data)); Object.assign(entry,record); error=''; return true;}
        catch {error='阅读记录未能保存，浏览器存储可能已满或被禁用。请保留当前页面。'; return false;}
      },
      stats() {
        const entries=list(); return {read:entries.filter(e => e.read).length,completed:entries.filter(e => e.status==='complete').length,
          words:entries.reduce((n,e) => n+filled(e.words).length,0),sentences:entries.reduce((n,e) => n+filled(e.sentences).length,0)};
      }
    };
  }
  function printHTML(entry) {
    const e = normalize(entry);
    const rows = (list, label) => `<section><h2>${label}</h2>${filled(list).length ? `<ol>${filled(list).map(row => `<li><strong>${escape(row.text)}</strong>${row.note.trim()?`<p>${escape(row.note).replace(/\n/g,'<br>')}</p>`:''}</li>`).join('')}</ol>` : '<p class="reading-print-empty">留一处空白，下次再来补充。</p>'}</section>`;
    return `<header><span>趣学习乐园 · 我的小小阅读本</span><h1>阅读记录卡</h1><p class="reading-print-title">《${escape(e.bookTitle || '我的课外阅读')}》</p>
      <p>${escape(e.date)}${e.author?`　作者：${escape(e.author)}`:''}${e.chapter?`　篇目 / 章节：${escape(e.chapter)}`:''}</p><p>姓名：____________　班级：____________</p></header>
      ${rows(e.words,'好词口袋')}${rows(e.sentences,'好句收藏')}<section><h2>我的阅读体会</h2><p class="reading-print-reflection">${escape(e.reflection).replace(/\n/g,'<br>') || '我想写下……'}</p></section>
      <footer>把喜欢的词句留下，也把自己的想法留下。</footer>`;
  }
  window.ReadingNotebook = {KEY,createEntry,addExcerpt,missingParts,createStore,printHTML,escape,today,blank};
})();
