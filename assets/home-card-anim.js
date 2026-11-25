// Keep the original artwork visible while fetching a loop. A fresh object URL
// restarts the cached animation at frame one on each new hover.
const hoverAllowed = matchMedia('(hover: hover) and (pointer: fine)');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const entrances = document.getElementById('home-entrances');
const cards = entrances.querySelectorAll('button.home-world-card');
const reset = [];

for (const card of cards) {
  const poster = card.querySelector('img');
  let download;
  let sequence = 0;
  let playing;
  let url;

  function stop() {
    sequence++;
    playing?.remove();
    playing = null;
    if (url) URL.revokeObjectURL(url);
    url = null;
  }

  async function start() {
    stop();
    if (!hoverAllowed.matches || reducedMotion.matches ||
        document.documentElement.classList.contains('motion-paused')) return;
    const current = sequence;
    try {
      download ??= fetch(card.dataset.animation).then(response => {
        if (!response.ok) throw Error('Animation unavailable');
        return response.blob();
      }).catch(error => { download = null; throw error; });
      const blob = await download;
      if (sequence !== current) return;
      const img = new Image();
      img.alt = '';
      img.className = 'home-card-loop';
      img.onload = () => {
        if (sequence === current) poster.after(img);
      };
      playing = img;
      url = URL.createObjectURL(blob);
      img.src = url;
    } catch {
      if (sequence === current) stop();
    }
  }

  card.addEventListener('pointerenter', e => { if (e.pointerType !== 'touch') start(); });
  card.addEventListener('pointerleave', stop);
  card.addEventListener('click', stop);
  reset.push(stop);
  // The pointer may already be over the card when this module finishes loading.
  if (card.matches(':hover')) start();
}

function stopAll() { reset.forEach(stop => stop()); }
hoverAllowed.addEventListener('change', stopAll);
reducedMotion.addEventListener('change', stopAll);
new MutationObserver(stopAll).observe(document.documentElement, {attributes:true, attributeFilter:['class']});
window.addEventListener('pagehide', stopAll);
