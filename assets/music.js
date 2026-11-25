(() => {
  const button = document.getElementById('musicToggle');
  const label = document.getElementById('musicLabel');
  const slider = document.getElementById('musicVolume');
  const output = document.getElementById('musicVolumeValue');
  const status = document.getElementById('musicStatus');
  const trackSelect = document.getElementById('musicTrack');
  const control = document.querySelector('.music-control');
  const tracks = {sunny:'assets/audio/easy-lemon.mp3', quiet:'assets/audio/dream-culture.mp3'};
  let track = 'sunny';
  try {
    const savedTrack = localStorage.getItem('park_music_track');
    if (Object.hasOwn(tracks, savedTrack)) track = savedTrack;
  } catch {}
  const audio = new Audio(tracks[track]);
  audio.loop = true;
  audio.preload = 'none';
  let enabled = false;
  let volume = .28;
  let gain, context, timer, starting = false, generation = 0, interacted = false;
  try {
    enabled = localStorage.getItem('park_music_enabled') === 'true';
    const saved = localStorage.getItem('park_music_volume');
    if (saved !== null && Number.isFinite(Number(saved))) volume = Math.max(0, Math.min(1, Number(saved)));
  } catch {}

  function save() {
    try {
      localStorage.setItem('park_music_enabled', String(enabled));
      localStorage.setItem('park_music_volume', String(volume));
      localStorage.setItem('park_music_track', track);
    } catch {}
  }
  function render() {
    const playing = !audio.paused;
    label.textContent = starting ? '加载中' : playing ? '音乐开' : enabled ? '继续音乐' : '音乐关';
    button.setAttribute('aria-pressed', String(playing));
    button.setAttribute('aria-label', playing ? '暂停背景音乐' : '播放背景音乐');
    slider.value = Math.round(volume * 100);
    output.textContent = `${slider.value}%`;
    if (trackSelect) trackSelect.value = track;
  }
  function adjustVolume() {
    const speech = window.speechSynthesis;
    const nativeReading = speech && ((speech.speaking && !speech.paused) || speech.pending);
    const mmReading = typeof window.isMiniMaxSpeaking === "function" && window.isMiniMaxSpeaking();
    const reading = nativeReading || mmReading;
    const target = volume * (reading ? .18 : 1);
    if (gain) gain.gain.setTargetAtTime(target, context.currentTime, .12);
    else audio.volume = target;
  }
  function stop() {
    generation++;
    starting = false;
    audio.pause();
    clearInterval(timer);
    timer = undefined;
    render();
  }
  async function start() {
    if (!enabled || !interacted || document.hidden || starting || !audio.paused) return;
    const request = ++generation;
    starting = true;
    status.textContent = '';
    render();
    try {
      if (audio.error) audio.load();
      // GainNode also allows reliable volume control on mobile Safari.
      context = getAudioCtx();
      if (context && !gain) {
        const source = context.createMediaElementSource(audio);
        gain = context.createGain();
        source.connect(gain);
        gain.connect(context.destination);
        gain.gain.value = 0;
      }
      if (context?.state === 'suspended') await context.resume();
      if (request !== generation) return;
      adjustVolume();
      await audio.play();
      if (request !== generation || !enabled || document.hidden) {
        // A newer request owns playback; do not pause it from an old promise.
        if (!enabled || document.hidden) audio.pause();
        return;
      }
      clearInterval(timer);
      timer = setInterval(adjustVolume, 150);
    } catch (error) {
      if (request !== generation) return;
      status.textContent = error.name === 'NotAllowedError'
        ? '点击音乐按钮即可播放。' : '音乐暂时无法播放，请点击重试。';
    } finally {
      if (request === generation) { starting = false; render(); }
    }
  }
  button.addEventListener('click', () => {
    interacted = true;
    if (starting || !audio.paused) { enabled = false; stop(); }
    else { enabled = true; start(); }
    save();
  });
  slider.addEventListener('input', () => {
    volume = Number(slider.value) / 100;
    adjustVolume();
    save();
    render();
  });
  trackSelect?.addEventListener('change', () => {
    if (!Object.hasOwn(tracks, trackSelect.value)) return;
    track = trackSelect.value;
    stop();
    audio.src = tracks[track];
    audio.load();
    interacted = true;
    save();
    start();
    render();
  });
  // Returning visitors may resume on their first gesture; new visitors opt in.
  function resumeOnGesture(event) {
    if (!control.contains(event.target)) { interacted = true; start(); }
  }
  document.addEventListener('pointerdown', resumeOnGesture);
  document.addEventListener('keydown', resumeOnGesture);
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
  window.addEventListener('pagehide', stop);
  window.addEventListener('pageshow', start);
  audio.addEventListener('error', () => {
    stop();
    status.textContent = '音乐暂时无法加载，请点击重试。';
  });
  render();
})();
