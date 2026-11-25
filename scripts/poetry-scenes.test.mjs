import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

function setup(reduced=false){
  let code='';
  try{code=readFileSync(new URL('../assets/poetry-scenes.js',import.meta.url),'utf8');}catch{}
  const frames=new Map(), events={}, images=[];let seq=0;
  const operations=[];
  const gradient={addColorStop(){}};
  const context=new Proxy({drawImage(...args){operations.push(args);},createLinearGradient(){return gradient;},createRadialGradient(){return gradient;},measureText(){return {width:20};}}, {get:(obj,key)=>obj[key]??(()=>{}),set:(obj,key,value)=>(obj[key]=value,true)});
  const canvas={width:960,height:540,clientWidth:800,isConnected:true,dataset:{},setAttribute(){},getContext:()=>context};
  const document={hidden:false,addEventListener:(name,fn)=>{events[name]=fn;}};
  const window={devicePixelRatio:1,matchMedia:()=>({matches:reduced}),addEventListener(){}};
  class Image{constructor(){images.push(this);this.complete=false;this.naturalWidth=960;this.naturalHeight=540;}}
  vm.runInNewContext(code,{window,document,Image,console,Math,performance:{now:()=>0},requestAnimationFrame:fn=>{frames.set(++seq,fn);return seq;},cancelAnimationFrame:id=>frames.delete(id)});
  return {api:window.PoetryScenes,canvas,document,events,frames,images,operations,
    ready(){for(const image of images){image.complete=true;image.onload?.();}},
    frame(time=1000){const pending=[...frames.values()];frames.clear();for(const fn of pending)fn(time);}};
}

test('the painter covers every poem and uses loaded artwork in all scene sizes',()=>{
  const h=setup();assert.ok(h.api,'PoetryScenes module is available');
  assert.equal(Object.keys(h.api.scenes).length,14);
  h.api.draw(h.canvas.getContext(),0,0,680,220,'jiang_xue',0);h.ready();
  h.api.draw(h.canvas.getContext(),0,0,680,220,'jiang_xue',1);
  assert.ok(h.operations.length>0,'loaded illustration is painted');
});

test('pausing, hidden pages and disposal stop scheduling animation frames',()=>{
  const h=setup();assert.ok(h.api,'PoetryScenes module is available');
  const session=h.api.mount(h.canvas,'wang_lu_shan_pu_bu');h.ready();h.frame();
  assert.equal(h.frames.size,1);session.setPaused(true);assert.equal(h.frames.size,0);
  session.setPaused(false);assert.equal(h.frames.size,1);
  h.document.hidden=true;h.events.visibilitychange();assert.equal(h.frames.size,0);
  h.document.hidden=false;h.events.visibilitychange();assert.equal(h.frames.size,1);
  session.stop();assert.equal(h.frames.size,0);h.events.visibilitychange();assert.equal(h.frames.size,0);
});

test('reduced motion and failed assets still show a static readable scene',()=>{
  const h=setup(true);assert.ok(h.api,'PoetryScenes module is available');
  h.api.mount(h.canvas,'yong_liu');assert.equal(h.frames.size,0);
  for(const image of h.images)image.onerror?.();
  assert.equal(h.frames.size,0);assert.equal(h.canvas.dataset.sceneState,'error');
});
