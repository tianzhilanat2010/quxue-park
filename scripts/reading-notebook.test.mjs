import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {existsSync,readFileSync} from 'node:fs';

const root = new URL('../', import.meta.url);
function setup(map = new Map()) {
  const context = vm.createContext({window: {}, Date, Math});
  for (const file of ['assets/reading-library.js', 'assets/reading-notebook.js']) {
    const url = new URL(file, root);
    if (existsSync(url)) vm.runInContext(readFileSync(url, 'utf8'), context);
  }
  const library = context.window.ReadingLibrary, api = context.window.ReadingNotebook;
  assert.ok(library, 'the reading library is available');
  assert.ok(api, 'the reading notebook is available');
  const browser = {getItem: key => map.get(key) ?? null, setItem: (key, value) => map.set(key, value)};
  return {library, api, context, browser, map, store: api.createStore(browser)};
}

test('twelve original grade-two stories have complete readable text, four themes and genuine source excerpts', () => {
  const {library} = setup();
  assert.equal(library.stories.length, 12);
  assert.equal(new Set(library.stories.map(s => s.id)).size, 12);
  for (const theme of library.themes) assert.equal(library.stories.filter(s => s.theme === theme.id).length, 3);
  for (const story of library.stories) {
    const text = story.paragraphs.join('\n');
    assert.ok(story.title && story.author && story.summary && story.emoji);
    assert.ok(story.paragraphs.length >= 3);
    const count = library.wordCount(story);
    assert.ok(count >= 200 && count <= 350, `${story.title}: ${count} Han characters`);
    assert.ok(story.words.length >= 3 && story.sentences.length >= 2);
    for (const word of story.words) {
      assert.ok(text.includes(word.text), `${story.title}: ${word.text} occurs in the original story`);
      assert.ok(word.pinyin && word.meaning);
    }
    for (const sentence of story.sentences) assert.ok(text.includes(sentence.text), `${story.title}: quote is verbatim`);
    assert.equal(library.find(story.id).title, story.title);
  }
  assert.equal(library.find('unknown'), null);
});

test('paper-book and library records have independent identities and allow any number of excerpts', () => {
  const {api, library} = setup();
  const story = library.stories[0], first = api.createEntry({story}), paper = api.createEntry({source: 'paper'});
  assert.equal(first.bookTitle, story.title); assert.equal(first.storyId, story.id);
  assert.equal(paper.bookTitle, ''); assert.equal(paper.source, 'paper'); assert.notEqual(first.id, paper.id);
  assert.equal(first.status, 'draft'); assert.equal(first.read, false);
  assert.equal(first.words.filter(w => w.text).length, 0, 'sample excerpts are not filled in for the child');
  for (let i = 0; i < 7; i++) api.addExcerpt(first, 'words', `词语${i}`);
  assert.equal(first.words.filter(w => w.text).length, 7);
  api.addExcerpt(first, 'words', ' 词语0 ');
  assert.equal(first.words.filter(w => w.text).length, 7, 'the same collected word is not duplicated');
  api.addExcerpt(first, 'sentences', '这是我自己选的句子。');
  assert.equal(first.sentences.filter(s => s.text).length, 1);
  assert.equal(paper.words.filter(w => w.text).length, 0);
});

test('draft metadata, excerpt notes, reflection and read flag survive reopening without touching quiz history', () => {
  const {api, library, browser, map, store} = setup();
  map.set('panda_practice_records_v1', 'existing math records');
  const entry = api.createEntry({story: library.stories[0]});
  entry.chapter = '第一章'; entry.date = '2026-11-14'; entry.read = true;
  api.addExcerpt(entry, 'words', '认真', '我想认真地看一看。');
  entry.reflection = '我想接着写\n第二句体会。';
  assert.equal(store.save(entry), true);
  entry.reflection = 'changed only in memory';
  const loaded = api.createStore(browser).get(entry.id);
  assert.equal(loaded.chapter, '第一章'); assert.equal(loaded.read, true); assert.equal(loaded.date, '2026-11-14');
  assert.equal(loaded.words.find(w => w.text === '认真').note, '我想认真地看一看。');
  assert.equal(loaded.reflection, '我想接着写\n第二句体会。');
  assert.equal(map.get('panda_practice_records_v1'), 'existing math records');
});

test('completion tracks the reading card and can be edited without grading a personal reflection', () => {
  const {api, store, browser} = setup();
  const entry = api.createEntry({source: 'paper'});
  entry.bookTitle = '我自己的课外书'; entry.read = true;
  api.addExcerpt(entry, 'words', '安静'); api.addExcerpt(entry, 'sentences', '小路安静下来了。');
  assert.ok(api.missingParts(entry).includes('阅读体会'));
  entry.reflection = '我觉得这里很有趣。';
  assert.equal(api.missingParts(entry).length, 0);
  entry.status = 'complete'; assert.equal(store.save(entry), true); assert.equal(store.save(entry), true);
  assert.equal(api.createStore(browser).list().length, 1);
  assert.equal(store.stats().completed, 1); assert.equal(store.stats().read, 1); assert.equal(store.stats().words, 1);
  assert.ok(store.get(entry.id).completedAt);
  entry.reflection = ''; store.save(entry);
  assert.equal(store.get(entry.id).status, 'draft', 'unfinished edits remain an editable draft');
  assert.equal(store.stats().completed, 0);
});

test('saving another record merges latest browser data, preserves clears and isolates repeated readings', () => {
  const {api, library, store, browser} = setup();
  const other = api.createStore(browser), a = api.createEntry({story: library.stories[0]}), b = api.createEntry({story: library.stories[0]});
  a.reflection = '第一次读'; b.reflection = '第二次读';
  store.save(a); other.save(b);
  assert.equal(store.list().length, 2);
  a.reflection = ''; a.words = []; a.sentences = []; store.save(a);
  assert.equal(store.get(a.id).reflection, ''); assert.equal(store.get(a.id).words.length, 0);
  assert.equal(store.get(b.id).reflection, '第二次读');
});

test('unavailable, malformed or full browser storage reports failure while preserving existing data', () => {
  const {api, store, browser} = setup();
  const entry = api.createEntry({source: 'paper'}); entry.bookTitle = '一本书'; store.save(entry);
  const blocked = api.createStore({getItem() {throw Error('blocked');}, setItem() {throw Error('blocked');}});
  assert.equal(blocked.list().length, 0); assert.equal(blocked.save(entry), false); assert.ok(blocked.error);
  const corrupt = api.createStore({getItem: () => '{broken', setItem() {throw Error('should never overwrite unreadable records');}});
  assert.equal(corrupt.save(entry), false); assert.ok(corrupt.error);
  const full = api.createStore({...browser, setItem() {throw Error('quota');}});
  assert.equal(full.save(entry), false); assert.match(full.error, /未能保存/);
  assert.equal(store.list().length, 1);
});

test('printing includes exactly this card with escaped user text, line breaks and optional book details', () => {
  const {api} = setup();
  const entry = api.createEntry({source: 'paper'});
  entry.bookTitle = '<img src=x onerror=alert(1)>'; entry.chapter = '第 3 章'; entry.author = '某位作者'; entry.date = '2026-11-14';
  api.addExcerpt(entry, 'words', '认真', '这是我的造句。'); api.addExcerpt(entry, 'sentences', '“你好呀！”');
  entry.reflection = '我很喜欢它。\n还想再读一次。';
  const html = api.printHTML(entry);
  assert.ok(html.includes('&lt;img')); assert.ok(!html.includes('<img'));
  assert.ok(html.includes('第 3 章') && html.includes('某位作者') && html.includes('这是我的造句。'));
  assert.ok(html.includes('我很喜欢它。<br>还想再读一次。'));
  assert.ok(html.includes('好词') && html.includes('好句') && html.includes('阅读体会'));
  assert.ok(!html.includes('undefined'));
});

test('a storage failure keeps the current editor and blocks internal navigation from discarding unsaved writing', () => {
  const h=setup(),listeners=new Map(),elements=new Map();let navigations=0;
  const element=selector=>{if(!elements.has(selector))elements.set(selector,{textContent:'',hidden:false,classList:{toggle(){}},focus(){}});return elements.get(selector);};
  const root={innerHTML:'',contains:()=>true,querySelector:element,addEventListener:(event,fn)=>listeners.set(event,fn)};
  Object.assign(h.context,{document:{querySelectorAll:()=>[],addEventListener(){}},setTimeout:()=>1,clearTimeout(){}});
  Object.assign(h.context.window,{localStorage:{getItem:()=>null,setItem(){throw Error('quota');}},addEventListener(){},scrollTo(){}});
  vm.runInContext(readFileSync(new URL('assets/reading-room.js',new URL('../',import.meta.url)),'utf8'),h.context);
  const room=h.context.window.ReadingRoom.mount({root,onNavigate:()=>navigations++,onBack(){},speak(){},stopSpeech(){}});
  room.open();
  const button={dataset:{rrAction:'paper'}};
  listeners.get('click')({target:{closest:()=>button}});
  listeners.get('input')({target:{dataset:{rrEntryField:'bookTitle'},value:'还没保存成功的书名'}});
  const editor=root.innerHTML;
  assert.equal(room.leave(),false);
  room.open();
  assert.equal(navigations,1);assert.equal(root.innerHTML,editor);
  assert.match(element('#rr-save-state').textContent,/未能保存/);
});
