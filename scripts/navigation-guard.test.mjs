import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {existsSync, readFileSync} from 'node:fs';

const root = new URL('../', import.meta.url);
function setup() {
  const listeners = new Map();
  const element = (values = {}) => ({nodeType: 1, parentElement: null, scrollLeft: 0, scrollWidth: 100, clientWidth: 100, overflowX: 'visible', closest: () => null, ...values});
  const html = element(), body = element({parentElement: html});
  const document = {documentElement: html, body, addEventListener(type, callback, options) {listeners.set(type, {callback, options});}};
  const context = vm.createContext({document, window: {getComputedStyle: node => ({overflowX: node.overflowX})}, Math});
  const path = new URL('assets/navigation-guard.js', root);
  if (existsSync(path)) vm.runInContext(readFileSync(path, 'utf8'), context);
  function emit(type, values = {}) {
    const record = listeners.get(type); assert.ok(record, type + ' guard installed');
    const event = {target: body, cancelable: true, defaultPrevented: false, deltaX: 0, deltaY: 0, deltaMode: 0, touches: [], preventDefault() {this.defaultPrevented = true;}, ...values};
    record.callback(event); return event;
  }
  return {listeners, element, html, body, emit};
}

test('left and right wheel gestures are cancelled with non-passive capture listeners', () => {
  const h = setup();
  for (const deltaX of [-120, 120]) assert.equal(h.emit('wheel', {deltaX}).defaultPrevented, true);
  assert.equal(h.listeners.get('wheel').options.passive, false);
  assert.equal(h.listeners.get('wheel').options.capture, true);
});

test('ordinary vertical scrolling, diagonal vertical movement and browser zoom remain available', () => {
  const h = setup();
  for (const values of [{deltaY: 100}, {deltaX: 2, deltaY: -80}, {deltaX: 60, ctrlKey: true}, {deltaX: 60, metaKey: true}]) {
    assert.equal(h.emit('wheel', values).defaultPrevented, false);
  }
  assert.equal(h.emit('wheel', {deltaY: 80, shiftKey: true}).defaultPrevented, true);
});

test('horizontal poem and question tabs scroll internally and contain gestures at both ends', () => {
  const h = setup();
  const strip = h.element({parentElement: h.body, scrollWidth: 500, clientWidth: 200, scrollLeft: 80, overflowX: 'auto'});
  const button = h.element({parentElement: strip});
  assert.equal(h.emit('wheel', {target: button, deltaX: 60}).defaultPrevented, true);
  assert.equal(strip.scrollLeft, 140);
  h.emit('wheel', {target: button, deltaX: 400}); assert.equal(strip.scrollLeft, 300);
  h.emit('wheel', {target: button, deltaX: 60}); assert.equal(strip.scrollLeft, 300);
  h.emit('wheel', {target: button, deltaX: -500}); assert.equal(strip.scrollLeft, 0);
  assert.equal(h.emit('wheel', {target: button, deltaX: -60}).defaultPrevented, true);
  assert.equal(strip.scrollLeft, 0);
});

test('line and page delta modes work and non-cancelable events are not manually scrolled twice', () => {
  const h = setup(), strip = h.element({parentElement: h.body, overflowX: 'scroll', scrollWidth: 1000, clientWidth: 200});
  h.emit('wheel', {target: strip, deltaX: 2, deltaMode: 1}); assert.equal(strip.scrollLeft, 32);
  h.emit('wheel', {target: strip, deltaX: 1, deltaMode: 2}); assert.equal(strip.scrollLeft, 232);
  h.emit('wheel', {target: strip, deltaX: 80, cancelable: false}); assert.equal(strip.scrollLeft, 232);
});

const touch = (clientX, clientY, identifier = 1) => ({clientX, clientY, identifier});
test('horizontal touch swipes are contained while vertical touch and pinch gestures remain native', () => {
  const h = setup();
  h.emit('touchstart', {touches: [touch(150, 100)]});
  assert.equal(h.emit('touchmove', {touches: [touch(90, 103)]}).defaultPrevented, true);
  h.emit('touchend');
  h.emit('touchstart', {touches: [touch(150, 100)]});
  assert.equal(h.emit('touchmove', {touches: [touch(153, 160)]}).defaultPrevented, false);
  h.emit('touchcancel');
  h.emit('touchstart', {touches: [touch(100, 100), touch(200, 100, 2)]});
  assert.equal(h.emit('touchmove', {touches: [touch(80, 100), touch(220, 100, 2)]}).defaultPrevented, false);
});

test('touch drags move inner horizontal tabs without disabling inputs or taps', () => {
  const h = setup(), strip = h.element({parentElement: h.body, overflowX: 'auto', scrollWidth: 500, clientWidth: 200});
  h.emit('touchstart', {target: strip, touches: [touch(150, 100)]});
  h.emit('touchmove', {target: strip, touches: [touch(90, 101)]}); assert.equal(strip.scrollLeft, 60);
  h.emit('touchend');
  const input = h.element({parentElement: h.body, closest: () => ({})});
  assert.equal(h.emit('touchstart', {target: input, touches: [touch(100, 100)]}).defaultPrevented, false);
  assert.equal(h.emit('touchmove', {target: input, touches: [touch(180, 100)]}).defaultPrevented, false);
  assert.equal(h.listeners.has('click'), false);
});

test('both the main park and standalone game include the shared guard without altering browser history', () => {
  const main = readFileSync(new URL('index.html', root), 'utf8');
  const game = readFileSync(new URL('games/cyberhop.html', root), 'utf8');
  for (const html of [main, game]) {
    assert.ok(/navigation-guard\.js\?v=/.test(html), 'shared script included');
    assert.ok(/navigation-guard\.css\?v=/.test(html), 'shared stylesheet included');
  }
  const path = new URL('assets/navigation-guard.js', root);
  assert.ok(existsSync(path));
  const code = readFileSync(path, 'utf8');
  assert.doesNotMatch(code, /pushState|replaceState|history\.go|beforeunload/);
});
