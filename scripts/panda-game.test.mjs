import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const base=new URL('../',import.meta.url);
function game(){
  const events={},elements=new Map(),intervals=new Set(),timeouts=[];
  const node=id=>{if(!elements.has(id))elements.set(id,{style:{},classList:{add(){},remove(){}},addEventListener(t,f){events[id+':'+t]=f;},appendChild(){},remove(){},open:false});return elements.get(id);};
  const canvasContext=new Proxy({}, {get:()=>()=>{},set:()=>true});
  const document={hidden:false,body:node('body'),getElementById:node,querySelector:()=>node('settings'),createElement:tag=>tag==='canvas'?{getContext:()=>canvasContext}:node(Math.random())};
  const context=vm.createContext({document,window:{innerWidth:1440,innerHeight:900,devicePixelRatio:1,addEventListener(){}},console,Math,performance,
    requestAnimationFrame(){},setTimeout:fn=>{timeouts.push(fn);},setInterval:fn=>{intervals.add(fn);return fn;},clearInterval:fn=>intervals.delete(fn)});
  const run=code=>vm.runInContext(code,context);
  run(readFileSync(new URL('games/vendor/three.min.js',base),'utf8'));
  run(`THREE.WebGLRenderer=class {constructor(){this.shadowMap={};this.domElement={};} setSize(){} setPixelRatio(){} render(){}};`);
  run(readFileSync(new URL('games/panda-world.js',base),'utf8'));
  const html=readFileSync(new URL('games/cyberhop.html',base),'utf8');run(html.split('  <script>')[1].split('</script>')[0]);
  run('sfx.enabled=false;var elapsedForTest=0;clock.getDelta=()=>1/60;clock.getElapsedTime=()=>elapsedForTest;var handleChoice=window.handleChoice;');
  function frames(n){for(let i=0;i<n;i++){run('elapsedForTest+=1/60;animate();');for(const fn of [...intervals])fn();}}
  return {run,frames,flush(){for(const fn of timeouts.splice(0))fn();},events};
}
test('panda has separate eyes and limbs, blinks, crouches and extends in a jump',()=>{
 const h=game();assert.equal(h.run('player.userData.eyes.length'),2);
 h.run('animatePanda(player,4.46,0,null,false)');assert.ok(h.run('player.userData.eyes[0].scale.y')<.1);
 h.run('animatePanda(player,1,0,.08,false)');assert.ok(h.run('player.userData.pelvis.position.y')<.55);
 h.run('animatePanda(player,1,0,.6,false)');assert.ok(Math.abs(h.run('player.userData.leftArmRig.shoulder.rotation.z'))>.6);
});
test('correct answer lands, scores and generates the next row; wrong answer returns and reshuffles',()=>{
 const h=game();h.run('handleChoice(currentQuestion.correctIndex)');h.frames(65);h.flush();assert.equal(h.run('currentStep'),1);assert.ok(h.run('score')>100);
 const score=h.run('score');const pos=h.run('player.position.z');h.run('handleChoice((currentQuestion.correctIndex+1)%5)');h.frames(110);h.flush();
 assert.equal(h.run('score'),score-25);assert.equal(h.run('player.position.z'),pos);assert.equal(h.run('isAnimating'),false);assert.equal(h.run('currentRowTiles.filter(t=>t.visible).length'),5);
});
test('switching mode while jumping invalidates old movement and recovery callbacks',()=>{
 const h=game();h.run('handleChoice((currentQuestion.correctIndex+1)%5)');h.frames(60);h.run('resetGame()');h.frames(90);h.flush();assert.equal(h.run('currentStep'),0);assert.equal(h.run('score'),100);assert.equal(h.run('player.position.z'),0);assert.equal(h.run('jumpAnim'),null);
});
test('outfits preserve position and timer pauses in settings and hidden pages',()=>{
 const h=game();h.run("player.position.x=2.9;switchCharacterModel('mint')");assert.equal(h.run('player.position.x'),2.9);
 h.run("document.querySelector('.game-settings').open=true");const t=h.run('timeRemaining');h.frames(90);assert.equal(h.run('timeRemaining'),t);
 h.run("document.querySelector('.game-settings').open=false;document.hidden=true");h.frames(90);assert.equal(h.run('timeRemaining'),t);
});

test('back view faces the destination before lift-off and keeps its heading through landing',()=>{
 const h=game();assert.equal(h.run('player.rotation.y'),Math.PI);
 h.run('handleChoice(4)');h.frames(9);
 assert.equal(h.run('player.position.z'),0);
 h.frames(6);
 assert.ok(h.run('player.position.z')<0);
 assert.ok(h.run('Math.abs(Math.sin(player.rotation.y)-Math.sin(jumpAnim.heading))')<1e-8);
 assert.ok(h.run('Math.cos(player.rotation.y)')<0);
 h.run("switchCharacterModel('mint')");assert.ok(h.run('Math.cos(player.rotation.y)')<0);
});
test('sideways turns take the short route across the back-facing angle',()=>{
 const h=game();h.run('handleChoice(0)');h.frames(8);
 assert.ok(h.run('Math.cos(player.rotation.y)')<0);
 assert.ok(h.run('Math.sin(player.rotation.y)')<0);
});
