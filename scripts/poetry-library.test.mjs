import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {existsSync,readFileSync} from 'node:fs';

const root=new URL('../',import.meta.url);
const html=readFileSync(new URL('index.html',root),'utf8');
function library(){
  const code=html.slice(html.indexOf('    const POEM_LIBRARY ='),html.indexOf('    function genCnCharQuestion('));
  const context=vm.createContext({Math,window:{}});
  vm.runInContext(readFileSync(new URL('assets/poetry-questions.js',root),'utf8'),context);
  vm.runInContext(code,context);
  return code=>vm.runInContext(code,context);
}

test('all 14 poems contain matching text, pinyin, interpretation and 7+7 semester coverage',()=>{
  const run=library(),poems=run('POEM_LIBRARY');
  assert.equal(poems.length,14);assert.equal(new Set(poems.map(p=>p.id)).size,14);
  for(const grade of ['二年级上册','二年级下册'])assert.equal(poems.filter(p=>p.grade===grade).length,7);
  for(const poem of poems){
    assert.equal(poem.lines.length,poem.pinyinLines.length,poem.title);
    for(const field of ['author','dynasty','meaning','keyPoint'])assert.ok(poem[field]?.trim(),poem.title+' '+field);
  }
  const farmer=poems.find(p=>p.id==='min_nong_qi_yi');
  const boat=poems.find(p=>p.id==='zhou_ye_shu_suo_jian');
  assert.equal(farmer.lines.join(''),'春种一粒粟，秋收万颗子。四海无闲田，农夫犹饿死。');
  assert.equal(boat.lines.join(''),'月黑见渔灯，孤光一点萤。微微风簇浪，散作满河星。');
  assert.equal(boat.author,'查慎行');
});

test('every poem has matching animated artwork and a reachable question with the correct option',()=>{
  const run=library(),poems=run('POEM_LIBRARY');
  const window={matchMedia:()=>({matches:true,addEventListener(){}}),addEventListener(){}};
  vm.runInNewContext(readFileSync(new URL('assets/poetry-scenes.js',root),'utf8'),{window,document:{addEventListener(){}},Math});
  const scenes=window.PoetryScenes.scenes;
  assert.equal(Object.keys(scenes).length,14);
  poems.forEach((poem,index)=>{
    assert.ok(scenes[poem.id],poem.id+' has a scene');
    assert.ok(existsSync(new URL(`assets/poetry/${poem.id}.webp`,root)),poem.id+' has real artwork');
    const q=run(`genCnPoemQuestion(${index})`);
    assert.equal(q.animData.poemId,poem.id);assert.ok(q.choices.includes(q.answer));
    assert.equal(q.choices.length,4);assert.equal(new Set(q.choices).size,4);
  });
});

test('semester filters and practice sets include the new poems without mixing semesters',()=>{
  const run=library();
  const upper=run("getPoemsForGrade('upper')"),lower=run("getPoemsForGrade('lower')");
  assert.equal(upper.length,7);assert.equal(lower.length,7);assert.equal(run('getPoemsForGrade().length'),14);
  assert.ok(lower.some(p=>p.id==='min_nong_qi_yi'));assert.ok(lower.some(p=>p.id==='zhou_ye_shu_suo_jian'));
  const questions=run("generatePoemQuizSet(7,'lower')");
  assert.equal(new Set(questions.map(q=>q.animData.poemId)).size,7);
  assert.ok(questions.every(q=>lower.some(p=>p.id===q.animData.poemId)));
  const full=run('generatePoemQuizSet(14)');assert.equal(new Set(full.map(q=>q.animData.poemId)).size,14);
});
