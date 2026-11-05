import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

const code = readFileSync(new URL('../assets/music.js', import.meta.url), 'utf8');
function setup(saved = {}) {
  function target() {
    const listeners = {};
    return { value: 28, textContent: '', attrs: {},
      addEventListener(name, fn) { listeners[name] = fn; },
      fire(name, event = {}) { return listeners[name]?.(event); },
      setAttribute(name, value) { this.attrs[name] = value; },
      contains(node) { return node === this; },
    };
  }
  const elements = Object.fromEntries(['musicToggle','musicLabel','musicVolume','musicVolumeValue','musicStatus'].map(id => [id,target()]));
  const control = target(), document = target(), window = target();
  document.hidden = false;
  document.getElementById = id => elements[id];
  document.querySelector = () => control;
  window.speechSynthesis = { speaking:false, pending:false, paused:false };
  const storage = new Map(Object.entries(saved));
  let audio, tick, gainValue, nextPlay;
  class Audio {
    constructor() { audio = this; Object.assign(this,target()); this.paused = true; this.calls = 0; }
    play() { this.calls++; this.paused = false; return nextPlay ? nextPlay() : Promise.resolve(); }
    pause() { this.paused = true; }
  }
  const context = { state:'running', currentTime:0, destination:{},
    createMediaElementSource:() => ({connect(){}}),
    createGain:() => ({connect(){},gain:{value:0,setTargetAtTime(value){gainValue=value;}}}),
  };
  vm.runInNewContext(code, { document, window, Audio,
    getAudioCtx:() => context,
    localStorage:{getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,value)},
    setInterval:fn=>{tick=fn;return 1;}, clearInterval:()=>{tick=undefined;},
  });
  return { elements, audio, document, window, storage, control,
    click:async()=>{elements.musicToggle.fire('click');await new Promise(setImmediate);},
    flush:()=>new Promise(setImmediate),
    tick:()=>tick?.(), gain:()=>gainValue,
    setPlay:fn=>{nextPlay=fn;},
  };
}

test('new visitors explicitly start music; volume and playback preference persist',async()=>{
  const h=setup();assert.equal(h.audio.calls,0);
  h.document.fire('pointerdown',{});assert.equal(h.audio.calls,0);
  await h.click();assert.equal(h.audio.paused,false);assert.equal(h.gain(),.28);
  assert.equal(h.elements.musicToggle.attrs['aria-pressed'],'true');
  h.elements.musicVolume.value=45;h.elements.musicVolume.fire('input');
  assert.equal(h.gain(),.45);assert.equal(h.storage.get('park_music_volume'),'0.45');
  await h.click();assert.equal(h.audio.paused,true);assert.equal(h.storage.get('park_music_enabled'),'false');
});
test('reading ducks music and finishing restores the chosen level',async()=>{
  const h=setup();await h.click();h.window.speechSynthesis.speaking=true;h.tick();
  assert.equal(h.gain(),.28*.18);
  h.window.speechSynthesis.speaking=false;h.tick();assert.equal(h.gain(),.28);
});
test('background pauses playback; foreground resumes only when enabled',async()=>{
  const h=setup();await h.click();h.document.hidden=true;h.document.fire('visibilitychange');
  assert.equal(h.audio.paused,true);
  h.document.hidden=false;h.document.fire('visibilitychange');await h.flush();assert.equal(h.audio.paused,false);
  await h.click();h.document.hidden=true;h.document.fire('visibilitychange');
  h.document.hidden=false;h.document.fire('visibilitychange');assert.equal(h.audio.paused,true);
});
test('saved enabled preference resumes on a gesture, excluding music controls',async()=>{
  const h=setup({park_music_enabled:'true',park_music_volume:'0'});
  h.window.fire('pageshow');h.document.fire('visibilitychange');await h.flush();assert.equal(h.audio.calls,0);
  assert.equal(h.audio.calls,0);h.document.fire('pointerdown',{target:h.control});assert.equal(h.audio.calls,0);
  h.document.fire('pointerdown',{});await h.flush();assert.equal(h.audio.paused,false);assert.equal(h.gain(),0);
});
test('blocked playback remains retryable and never reports playing',async()=>{
  const h=setup();h.setPlay(()=>{h.audio.paused=true;return Promise.reject({name:'NotAllowedError'});});
  await h.click();assert.equal(h.elements.musicToggle.attrs['aria-pressed'],'false');
  assert.match(h.elements.musicStatus.textContent,/点击/);
  h.setPlay(null);await h.click();assert.equal(h.audio.paused,false);
});
test('stale play promise cannot undo a later pause or restart',async()=>{
  const h=setup();let resolve;h.setPlay(()=>new Promise(r=>{resolve=r;}));
  await h.click();await h.click();assert.equal(h.audio.paused,true);
  h.setPlay(null);await h.click();resolve();await h.flush();assert.equal(h.audio.paused,false);
});
