// 全站防止横向滑动误触历史导航；页面内的横向列表自行消化位移。
(() => {
  'use strict';
  const activeListener = {capture: true, passive: false};

  function horizontalContainer(target) {
    let node = target?.nodeType === 1 ? target : target?.parentElement;
    while (node && node !== document.body && node !== document.documentElement) {
      if (node.clientWidth > 0 && node.scrollWidth > node.clientWidth + 1 &&
          /^(auto|scroll)$/.test(window.getComputedStyle(node).overflowX)) return node;
      node = node.parentElement;
    }
    return null;
  }

  function moveInside(container, delta) {
    if (!container) return;
    const maximum = container.scrollWidth - container.clientWidth;
    container.scrollLeft = Math.max(0, Math.min(maximum, container.scrollLeft + delta));
  }

  document.addEventListener('wheel', event => {
    if (!event.cancelable || event.defaultPrevented || event.ctrlKey || event.metaKey) return;
    const dx = event.deltaX || (event.shiftKey ? event.deltaY : 0);
    const dy = event.shiftKey ? 0 : event.deltaY;
    if (Math.abs(dx) <= Math.abs(dy)) return;
    event.preventDefault();
    const container = horizontalContainer(event.target);
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? container?.clientWidth || 1 : 1;
    moveInside(container, dx * unit);
  }, activeListener);

  let gesture = null;
  document.addEventListener('touchstart', event => {
    if (event.touches.length !== 1 || event.target?.closest?.('input,select,textarea,[contenteditable]')) {
      gesture = null;
      return;
    }
    const point = event.touches[0];
    gesture = {id: point.identifier, startX: point.clientX, startY: point.clientY, lastX: point.clientX, target: event.target, axis: null};
  }, {capture: true, passive: true});

  document.addEventListener('touchmove', event => {
    if (!gesture || event.touches.length !== 1) {
      gesture = null;
      return;
    }
    const point = event.touches[0];
    if (point.identifier !== gesture.id) return;
    const dx = point.clientX - gesture.startX, dy = point.clientY - gesture.startY;
    if (!gesture.axis && Math.max(Math.abs(dx), Math.abs(dy)) >= 4) {
      gesture.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    }
    if (gesture.axis === 'x' && event.cancelable) {
      event.preventDefault();
      moveInside(horizontalContainer(gesture.target), gesture.lastX - point.clientX);
    }
    gesture.lastX = point.clientX;
  }, activeListener);

  const endGesture = () => {gesture = null;};
  document.addEventListener('touchend', endGesture, {capture: true, passive: true});
  document.addEventListener('touchcancel', endGesture, {capture: true, passive: true});
})();
