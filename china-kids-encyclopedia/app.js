// 主应用逻辑：书架筛选、互动阅读器、语音朗读、探索徽章、Banana 2×2 序列图切片导入

(() => {
  const VOLUMES = window.ENCYCLOPEDIA_VOLUMES;
  const ENTRIES = window.ENCYCLOPEDIA_ENTRIES;

  const STORAGE_KEY = 'china_kids_ency_progress_v1';
  const CUSTOM_ART_KEY = 'china_kids_ency_custom_art_v1';
  const BOOKMARKS_KEY = 'china_kids_ency_bookmarks_v1';
  const volumeArtwork = {
    earth: 'leaf-factory',
    ocean: 'coral-reef',
    science: 'rocket-launch',
    society: 'great-wall',
    culture: 'peking-opera'
  };

  let state = {
    volume: 'all',
    query: '',
    onlyMotion: false,
    solved: loadSolved(),
    customArt: loadCustomArt(),
    bookmarks: loadBookmarks(),
    currentEntry: null
  };

  function loadSolved() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
  }
  function saveSolved() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.solved)); } catch {}
  }
  function loadCustomArt() {
    try { return JSON.parse(localStorage.getItem(CUSTOM_ART_KEY) || '{}'); } catch { return {}; }
  }
  function saveCustomArt() {
    try { localStorage.setItem(CUSTOM_ART_KEY, JSON.stringify(state.customArt)); } catch {}
  }

  function loadBookmarks() {
    try {
      const saved = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '[]');
      return new Set(Array.isArray(saved) ? saved : []);
    } catch {
      return new Set();
    }
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const canHover = window.matchMedia('(any-hover: hover) and (any-pointer: fine)');
  const plateStage = document.querySelector('.plate-stage');
  const plateImg = document.getElementById('plateImg');
  const platePlay = document.getElementById('platePlayBtn');
  const motionPane = document.getElementById('motionPane');
  const motionError = document.getElementById('motionError');
  const entryVideo = document.getElementById('entryMotion');
  const entrySprite = document.getElementById('entrySprite');
  let platePlayback = null;
  let hoverTimer = null;
  let plateTimer = null;
  let visualTab = 'plate';

  function getEntryVisualSrc(entry, thumbnail = false) {
    const custom = state.customArt[entry.id];
    return custom?.frames?.[0] || custom?.src || `assets/illustrations/${thumbnail ? 'thumbs/' : ''}${entry.id}.webp`;
  }

  function hasMotion(entry) {
    return Boolean(entry.motion || state.customArt[entry.id]?.frames?.length > 1);
  }

  function stopPlateMotion() {
    clearTimeout(hoverTimer);
    hoverTimer = null;
    platePlayback = null;
    entryVideo.onseeked = null;
    entryVideo.pause();
    entryVideo.controls = false;
    clearInterval(plateTimer);
    plateTimer = null;
    motionPane.classList.remove('is-visible');
    motionPane.setAttribute('aria-hidden', 'true');
    motionError.classList.add('hidden');
  }

  function stopVisual() {
    stopPlateMotion();
    window.EncyclopediaLabs.stop();
  }

  function failPlatePlayback(playback) {
    if (!playback || platePlayback !== playback) return;
    stopPlateMotion();
    if (playback.mode === 'manual') motionError.classList.remove('hidden');
  }

  function startPlateMotion(entry, mode) {
    const alreadyRequested = Boolean(platePlayback);
    const playback = platePlayback ?? { mode };
    playback.mode = mode;
    platePlayback = playback;
    const manual = mode === 'manual';
    const frames = state.customArt[entry.id]?.frames;
    const useFrames = frames?.length > 1;

    motionError.classList.add('hidden');
    motionPane.setAttribute('aria-hidden', String(!manual));
    entryVideo.controls = manual && !useFrames;
    entryVideo.loop = !manual;
    if (alreadyRequested) return;

    entryVideo.classList.toggle('hidden', useFrames);
    entrySprite.classList.toggle('hidden', !useFrames);
    document.getElementById('motionCaption').textContent = useFrames ? '你导入的序列图' : entry.motion.caption;
    if (useFrames) {
      let frame = 0;
      entrySprite.alt = entry.title;
      entrySprite.src = frames[frame];
      motionPane.classList.add('is-visible');
      plateTimer = setInterval(() => {
        frame = (frame + 1) % frames.length;
        entrySprite.src = frames[frame];
      }, 320);
      return;
    }

    if (!manual) entryVideo.muted = true;
    if (!entryVideo.hasAttribute('src')) entryVideo.src = entry.motion.src;
    if (entryVideo.currentTime > 0) entryVideo.currentTime = 0;
    const reveal = () => {
      entryVideo.onseeked = null;
      if (platePlayback === playback) motionPane.classList.add('is-visible');
    };
    entryVideo.play().then(() => {
      if (platePlayback !== playback) return;
      if (entryVideo.seeking) entryVideo.onseeked = reveal;
      else reveal();
    }).catch(() => failPlatePlayback(playback));
  }

  function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth' });
  }

  function selectVolume(id) {
    state.volume = id;
    renderVolumeTabs();
    renderGrid();
  }

  function renderVolumeCards() {
    const cards = VOLUMES.filter(volume => volume.id !== 'all').map(volume => {
      const button = document.createElement('button');
      button.className = 'volume-card';
      button.type = 'button';
      button.innerHTML = `
        <img src="assets/illustrations/thumbs/${volumeArtwork[volume.id]}.webp" alt="" width="570" height="380" />
        <span>${volume.name}</span>
      `;
      button.addEventListener('click', () => {
        state.query = '';
        document.getElementById('searchInput').value = '';
        selectVolume(volume.id);
        document.getElementById('entriesTitle').focus({ preventScroll: true });
        scrollToSection('entries');
      });
      return button;
    });
    document.getElementById('volumeCards').replaceChildren(...cards);
  }

  function renderVolumeTabs() {
    const host = document.getElementById('volumeTabs');
    if (!host.children.length) {
      for (const volume of VOLUMES) {
        const button = document.createElement('button');
        button.className = 'vol-tab';
        button.type = 'button';
        button.dataset.volume = volume.id;
        button.textContent = volume.id === 'all' ? '全部' : volume.name;
        button.addEventListener('click', () => selectVolume(volume.id));
        host.appendChild(button);
      }
    }
    for (const button of host.children) {
      button.setAttribute('aria-pressed', String(button.dataset.volume === state.volume));
    }
  }

  // 渲染词条网格
  function renderGrid() {
    const grid = document.getElementById('entryGrid');
    const empty = document.getElementById('emptyState');
    const q = state.query.trim().toLowerCase();

    const filtered = ENTRIES.filter(e => {
      if (state.volume !== 'all' && e.volume !== state.volume) return false;
      const animated = hasMotion(e);
      if (state.onlyMotion && !animated) return false;
      if (q) {
        const hay = `${e.title} ${e.subtitle} ${e.category} ${e.volumeName} ${e.lead}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    const volume = VOLUMES.find(item => item.id === state.volume);
    document.getElementById('entriesTitle').textContent = state.volume === 'all' ? '全部篇目' : volume.name;
    document.getElementById('entryCount').textContent = `共 ${filtered.length} 篇`;
    grid.replaceChildren();
    empty.classList.toggle('hidden', filtered.length > 0);

    filtered.forEach(e => {
      const isDone = state.solved.includes(e.id);
      const animated = hasMotion(e);
      const card = document.createElement('article');
      card.className = 'entry-card';
      card.addEventListener('click', () => openReader(e.id, card.querySelector('.entry-link')));

      card.innerHTML = `
        <div class="card-media">
          <img src="${getEntryVisualSrc(e, true)}" alt="" width="570" height="380" loading="lazy" decoding="async" />
          <div class="card-badges">
            ${animated ? '<span class="pill-motion">含动画</span>' : ''}
            ${isDone ? '<span class="pill-done">已点亮</span>' : ''}
          </div>
        </div>
        <div class="card-body">
          <div class="card-meta">
            <span class="vol-tag vol-${e.volume}">${e.volumeName}</span>
            <span class="cat-text">${e.category}</span>
          </div>
          <h3 class="card-title"><button class="entry-link" type="button">${e.title}</button></h3>
          <p class="card-desc">${e.subtitle}</p>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  // 打开沉浸式百科阅读弹窗
  let readerOpener = null;
  let previousScroll = 0;
  const readerModal = document.getElementById('readerModal');
  const readerSpread = readerModal.querySelector('.reader-spread');
  let pageAnimation;
  let turnController;
  const readerBody = readerModal.querySelector('.reader-body');
  const turnLayer = readerModal.querySelector('.book-turn-layer');

  function openReader(entryId, opener = document.activeElement) {
    const index = ENTRIES.findIndex(entry => entry.id === entryId);
    const e = ENTRIES[index];
    if (!e) return;
    if (readerModal.classList.contains('hidden')) {
      readerOpener = opener;
      previousScroll = window.scrollY;
      document.body.classList.add('reading');
      window.scrollTo(0, 0);
    }
    stopSpeech();
    stopVisual();
    entryVideo.removeAttribute('src');
    entryVideo.load();
    state.currentEntry = e;
    if (!turnController) document.body.dataset.habitat = e.habitat ?? '';

    document.getElementById('readerVolumeBadge').textContent = e.volumeName;
    const isVolcano = e.id === 'volcano-erupt';
    readerBody.classList.toggle('volcano-spread', isVolcano);
    document.getElementById('readerCategory').textContent = isVolcano ? '火山' : e.category;
    const title = document.getElementById('readerTitle');
    title.textContent = e.title;
    title.classList.toggle('reader-title-long', e.title.length > 9);
    readerSpread.querySelector('.reader-engraving').src = `assets/book/engravings/${e.id}.webp`;
    const lead = document.getElementById('readerLead');
    const paragraphs = isVolcano ? [
      '地球的内部非常热，像一个巨大的「热锅」。地壳下面有高温的岩浆，岩浆里的气体会对周围的岩石产生压力。',
      '当岩浆沿着岩石的裂缝上升时，气体会膨胀，把岩浆推向地表。岩浆、气体和火山灰从火山口喷涌出来，这就是火山喷发。'
    ] : [e.lead];
    lead.replaceChildren(...paragraphs.map(text => {
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      return paragraph;
    }));
    document.getElementById('readerInset').classList.toggle('hidden', !isVolcano);
    document.getElementById('readerTeaser').classList.toggle('hidden', isVolcano);
    document.getElementById('readerTeaserTitle').textContent = e.hotspots[0].title;
    document.getElementById('readerTeaserBody').textContent = e.hotspots[0].desc;
    document.getElementById('readerFunFact').textContent = e.funFact;

    const secHost = document.getElementById('readerSections');
    secHost.innerHTML = e.sections.map(s => `
      <div class="knowledge-block">
        <h3>${s.h.replace(/^\d+[.、]\s*/, '')}</h3>
        <p>${s.p}</p>
      </div>
    `).join('');

    const customArt = state.customArt[e.id];
    const builtInPoster = e.motion && !customArt;
    plateImg.src = builtInPoster ? `assets/motion/posters/${e.id}.webp` : getEntryVisualSrc(e);
    entryVideo.poster = plateImg.src;
    plateStage.classList.toggle('reference-plate', isVolcano && !customArt);
    plateStage.dataset.entry = e.id;
    plateImg.alt = e.title;
    const animated = hasMotion(e);
    document.getElementById('tabMotion').classList.toggle('hidden', !animated);
    document.getElementById('tabLab').classList.toggle('hidden', !e.labType);
    platePlay.classList.toggle('hidden', !animated);
    const source = document.getElementById('readerSource');
    source.classList.toggle('hidden', !e.source);
    source.textContent = e.source?.label ?? '';
    if (e.source) source.href = e.source.url;
    else source.removeAttribute('href');
    document.getElementById('prevEntryBtn').disabled = index === 0;
    document.getElementById('nextEntryBtn').disabled = index === ENTRIES.length - 1;
    document.getElementById('readerPageNumber').textContent = `第 ${index + 1} / ${ENTRIES.length} 篇`;
    updateBookmarkButton();
    renderFacts(e.hotspots);
    renderQuiz(e);
    readerModal.classList.remove('hidden');
    readerBody.scrollTop = 0;
    if (!reduceMotion.matches) window.BookTurn.warmup();
    switchVisualTab('plate');
    title.focus({ preventScroll: true });
  }

  function renderFacts(facts) {
    const list = document.getElementById('hotspotLayer');
    const panel = document.getElementById('hotspotCard');
    list.replaceChildren();
    for (const [index, fact] of facts.entries()) {
      const button = document.createElement('button');
      button.className = 'fact-option';
      button.type = 'button';
      button.setAttribute('aria-pressed', String(index === 0));
      button.textContent = fact.title.split(/[（·]/)[0].trim();
      function showFact() {
        list.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
        panel.replaceChildren();
        const title = document.createElement('strong');
        title.textContent = fact.title;
        const description = document.createElement('p');
        description.textContent = fact.desc;
        panel.append(title, description);
      }
      button.addEventListener('click', showFact);
      list.appendChild(button);
      if (index === 0) showFact();
    }
  }

  function switchVisualTab(tab) {
    const entry = state.currentEntry;
    if (!entry || (tab === 'motion' && !hasMotion(entry)) || (tab === 'lab' && !entry.labType)) return;
    window.EncyclopediaLabs.stop();
    if (tab !== 'motion') stopPlateMotion();
    visualTab = tab;
    const lab = tab === 'lab';
    document.getElementById('plateNotes').classList.toggle('hidden', lab);
    document.getElementById('platePane').classList.toggle('hidden', lab);
    document.getElementById('labPane').classList.toggle('hidden', !lab);
    plateStage.classList.toggle('manual-motion', tab === 'motion');
    platePlay.textContent = tab === 'motion' ? '返回插画' : entry.id === 'volcano-erupt' ? '看火山喷发' : '看动画';
    for (const name of ['plate', 'lab', 'motion']) {
      const selected = name === tab;
      const button = document.getElementById('tab' + name[0].toUpperCase() + name.slice(1));
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    }

    if (lab) {
      window.EncyclopediaLabs.start(entry.labType, document.getElementById('labCanvasHost'), document.getElementById('labControls'));
    }
    if (tab === 'motion') startPlateMotion(entry, 'manual');
  }

  entryVideo.addEventListener('error', () => failPlatePlayback(platePlayback));
  reduceMotion.addEventListener('change', () => {
    if (reduceMotion.matches && visualTab === 'plate') stopPlateMotion();
  });

  function renderQuiz(e) {
    const solved = state.solved.includes(e.id);
    document.getElementById('quizStatus').textContent = solved ? '⭐ 已点亮探索徽章！' : '答对点亮探索星星 ⭐';
    document.getElementById('quizQuestion').textContent = e.quiz.q;
    const optsHost = document.getElementById('quizOptions');
    const fb = document.getElementById('quizFeedback');
    fb.className = 'quiz-feedback hidden';
    fb.textContent = '';
    optsHost.innerHTML = '';

    e.quiz.options.forEach((opt, i) => {
      const b = document.createElement('button');
      b.className = 'quiz-opt';
      b.type = 'button';
      b.textContent = `${['A', 'B', 'C', 'D'][i]}. ${opt}`;
      b.onclick = () => {
        optsHost.querySelectorAll('.quiz-opt').forEach(x => x.classList.remove('correct', 'wrong'));
        if (i === e.quiz.answer) {
          b.classList.add('correct');
          fb.className = 'quiz-feedback ok';
          fb.textContent = '🎉 ' + e.quiz.explain;
          if (!state.solved.includes(e.id)) {
            state.solved.push(e.id);
            saveSolved();
            updateBadgeCounter();
            renderGrid();
          }
          document.getElementById('quizStatus').textContent = '⭐ 已点亮探索徽章！';
          fireConfetti();
        } else {
          b.classList.add('wrong');
          fb.className = 'quiz-feedback no';
          fb.textContent = '🤔 再想一想哦，提示就藏在上面的百科小课堂里！';
        }
      };
      optsHost.appendChild(b);
    });
  }

  // Web Speech API 中文语音朗读
  function stopSpeech() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    const btn = document.getElementById('speakBtn');
    btn.classList.remove('speaking');
    btn.textContent = '朗读';
  }

  function toggleSpeech() {
    if (!('speechSynthesis' in window) || !state.currentEntry) {
      alert('当前浏览器暂不支持语音朗读功能哦。');
      return;
    }
    const btn = document.getElementById('speakBtn');
    if (window.speechSynthesis.speaking) {
      stopSpeech();
      return;
    }
    const e = state.currentEntry;
    const text = `${e.title}。${e.lead} ` + e.sections.map(s => `${s.h}。${s.p}`).join(' ') + ` 你知道吗？${e.funFact}`;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'zh-CN';
    utter.rate = 0.96;
    utter.pitch = 1.08;
    utter.onend = stopSpeech;
    utter.onerror = stopSpeech;
    btn.classList.add('speaking');
    btn.textContent = '停止朗读';
    window.speechSynthesis.speak(utter);
  }

  // 徽章系统
  function updateBadgeCounter() {
    document.getElementById('badgeCount').textContent = `${state.solved.length}/${ENTRIES.length}`;
  }

  function openBadgesModal() {
    const pct = Math.round((state.solved.length / ENTRIES.length) * 100);
    document.getElementById('progressSummary').textContent = `已探索点亮 ${state.solved.length} / ${ENTRIES.length} 枚徽章（${pct}%）`;
    document.getElementById('progressBarFill').style.width = pct + '%';
    const grid = document.getElementById('badgeGrid');
    grid.innerHTML = ENTRIES.map(e => {
      const ok = state.solved.includes(e.id);
      return `
        <div class="badge-item ${ok ? 'unlocked' : ''}">
          <span class="b-emoji">${e.emoji}</span>
          <strong>${e.badgeName}</strong>
          <small>${ok ? '⭐ 已获得' : e.title}</small>
        </div>
      `;
    }).join('');
    document.getElementById('badgesModal').classList.remove('hidden');
  }

  // Banana 插图与 2×2 四格图切片工坊
  function initStudio() {
    const sel = document.getElementById('studioEntrySelect');
    sel.innerHTML = ENTRIES.map(e => `<option value="${e.id}">${e.emoji} ${e.title}（${e.volumeName}）</option>`).join('');
    const dz = document.getElementById('studioDropzone');
    const fi = document.getElementById('studioFileInput');
    dz.onclick = () => fi.click();
    dz.ondragover = (ev) => { ev.preventDefault(); dz.classList.add('dragover'); };
    dz.ondragleave = () => dz.classList.remove('dragover');
    dz.ondrop = (ev) => {
      ev.preventDefault();
      dz.classList.remove('dragover');
      if (ev.dataTransfer.files[0]) handleStudioFile(ev.dataTransfer.files[0]);
    };
    fi.onchange = () => { if (fi.files[0]) handleStudioFile(fi.files[0]); fi.value = ''; };
    document.getElementById('clearCustomArtBtn').onclick = () => {
      state.customArt = {};
      saveCustomArt();
      renderGrid();
      const msg = document.getElementById('studioMsg');
      msg.classList.remove('hidden');
      msg.textContent = '✅ 已恢复全部默认内置插图与动图！';
    };
  }

  function handleStudioFile(file) {
    const entryId = document.getElementById('studioEntrySelect').value;
    const isSprite = document.getElementById('studioIsSprite').checked;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        if (isSprite) {
          // 自动裁切 2×2 四格序列图并去掉中间细白线
          const frames = [];
          const coords = [[0.01, 0.01], [0.51, 0.01], [0.01, 0.51], [0.51, 0.51]];
          const fw = Math.floor(img.width * 0.48), fh = Math.floor(img.height * 0.48);
          coords.forEach(([ox, oy]) => {
            const c = document.createElement('canvas');
            c.width = 360; c.height = 360;
            c.getContext('2d').drawImage(img, img.width * ox, img.height * oy, fw, fh, 0, 0, 360, 360);
            frames.push(c.toDataURL('image/jpeg', 0.82));
          });
          state.customArt[entryId] = { frames };
        } else {
          const c = document.createElement('canvas');
          const scale = Math.min(1, 720 / img.width);
          c.width = Math.round(img.width * scale);
          c.height = Math.round(img.height * scale);
          c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
          state.customArt[entryId] = { src: c.toDataURL('image/jpeg', 0.85) };
        }
        saveCustomArt();
        renderGrid();
        const msg = document.getElementById('studioMsg');
        msg.classList.remove('hidden');
        msg.textContent = isSprite
          ? '🎉 成功！已将 2×2 Banana 序列图切分为 4 帧循环动画并应用到该词条！'
          : '🎉 成功！已将高清 Banana 插图应用到该百科词条！';
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  // 庆祝彩带动画
  function fireConfetti() {
    const c = document.getElementById('confettiCanvas');
    c.width = window.innerWidth; c.height = window.innerHeight;
    const ctx = c.getContext('2d');
    const items = Array.from({ length: 65 }, () => ({
      x: c.width / 2 + (Math.random() - 0.5) * 180,
      y: c.height * 0.45,
      vx: (Math.random() - 0.5) * 12,
      vy: -Math.random() * 11 - 4,
      color: ['#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#ec4899'][Math.floor(Math.random() * 5)],
      sz: 6 + Math.random() * 6,
      life: 70
    }));
    const tick = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      let alive = false;
      items.forEach(p => {
        if (p.life <= 0) return;
        alive = true;
        p.x += p.vx; p.y += p.vy; p.vy += 0.35; p.life--;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.sz, p.sz * 0.6);
      });
      if (alive) requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, c.width, c.height);
    };
    tick();
  }

  function closeModal(id, restoreFocus = true) {
    const modal = document.getElementById(id);
    if (modal.classList.contains('hidden')) return;
    modal.classList.add('hidden');
    if (id === 'readerModal') {
      stopTurn();
      stopVisual();
      stopSpeech();
      state.currentEntry = null;
      document.body.classList.remove('reading');
      delete document.body.dataset.habitat;
      if (restoreFocus) {
        window.scrollTo(0, previousScroll);
        const target = readerOpener?.isConnected ? readerOpener : document.getElementById('entriesTitle');
        target?.focus({ preventScroll: true });
      }
      readerOpener = null;
    }
  }

  function stopTurn() {
    turnController?.abort();
    turnController = null;
    pageAnimation?.cancel();
    turnLayer.hidden = true;
    turnLayer.replaceChildren();
    readerModal.removeAttribute('aria-busy');
    readerBody.inert = false;
  }

  async function turnPage(offset) {
    const index = ENTRIES.indexOf(state.currentEntry);
    const next = ENTRIES[index + offset];
    if (index === -1 || !next || turnController) return;
    if (reduceMotion.matches) {
      openReader(next.id);
      return;
    }

    const controller = new AbortController();
    turnController = controller;
    readerModal.setAttribute('aria-busy', 'true');
    readerBody.inert = true;
    if (visualTab === 'motion') switchVisualTab('plate');
    else stopPlateMotion();
    let swapped = false;
    const swap = () => {
      openReader(next.id);
      swapped = true;
    };
    const animated = await window.BookTurn.turn(readerBody.parentElement, turnLayer, offset, swap, controller.signal);
    if (controller.signal.aborted) return;
    stopTurn();
    if (!swapped) swap();
    document.body.dataset.habitat = next.habitat ?? '';
    document.getElementById('readerTitle').focus({ preventScroll: true });
    if (!animated) {
      pageAnimation = readerSpread.animate([{ opacity: 0.65 }, { opacity: 1 }], {
        duration: 180, easing: 'ease-out'
      });
    }
  }

  const bookmarksDialog = document.getElementById('bookmarksDialog');
  const bookmarkButton = document.getElementById('bookmarkEntryBtn');

  function updateBookmarkButton() {
    const bookmarked = state.bookmarks.has(state.currentEntry?.id);
    bookmarkButton.textContent = bookmarked ? '已加书签' : '加入书签';
    bookmarkButton.setAttribute('aria-pressed', String(bookmarked));
  }

  bookmarkButton.addEventListener('click', () => {
    const entry = state.currentEntry;
    if (!entry) return;
    if (state.bookmarks.has(entry.id)) state.bookmarks.delete(entry.id);
    else state.bookmarks.add(entry.id);
    try {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify([...state.bookmarks]));
    } catch {
      // Keep the current session usable if browser storage is disabled.
    }
    updateBookmarkButton();
  });

  document.getElementById('openBookmarksBtn').addEventListener('click', event => {
    const opener = event.currentTarget;
    const list = document.getElementById('bookmarkList');
    list.replaceChildren();
    for (const entry of ENTRIES.filter(item => state.bookmarks.has(item.id))) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = entry.title;
      button.addEventListener('click', () => {
        bookmarksDialog.close();
        stopTurn();
        openReader(entry.id, opener);
        window.scrollTo(0, 0);
      });
      list.appendChild(button);
    }
    if (!list.children.length) {
      const empty = document.createElement('p');
      empty.textContent = '打开一篇图鉴，点「加入书签」，下次就能从这里接着读。';
      list.appendChild(empty);
    }
    bookmarksDialog.showModal();
  });

  // 事件绑定
  document.querySelectorAll('[data-open]').forEach(el => {
    el.addEventListener('click', () => openReader(el.dataset.open, el));
  });
  document.querySelectorAll('[data-close-modal]').forEach(el => {
    el.addEventListener('click', () => closeModal(el.dataset.closeModal));
  });
  document.addEventListener('keydown', ev => {
    if (ev.key === 'Escape' && !bookmarksDialog.open) {
      ['readerModal', 'badgesModal', 'studioModal'].forEach(id => closeModal(id));
    }
  });

  function goToContents() {
    closeModal('readerModal', false);
    document.getElementById('shelfTitle').focus({ preventScroll: true });
    scrollToSection('shelf');
  }

  document.querySelector('.brand').addEventListener('click', () => closeModal('readerModal', false));
  document.getElementById('topContents').addEventListener('click', event => {
    if (!state.currentEntry) return;
    event.preventDefault();
    goToContents();
  });
  document.getElementById('prevEntryBtn').onclick = () => turnPage(-1);
  document.getElementById('nextEntryBtn').onclick = () => turnPage(1);
  document.getElementById('backToContentsBtn').onclick = goToContents;
  platePlay.onclick = () => {
    if (!turnController) switchVisualTab(visualTab === 'motion' ? 'plate' : 'motion');
  };
  plateStage.addEventListener('pointerenter', event => {
    const entry = state.currentEntry;
    if (event.pointerType !== 'mouse' || !canHover.matches || reduceMotion.matches ||
        visualTab !== 'plate' || turnController || !entry || !hasMotion(entry)) return;
    hoverTimer = setTimeout(() => {
      hoverTimer = null;
      if (state.currentEntry === entry && visualTab === 'plate' && !turnController) {
        startPlateMotion(entry, 'preview');
      }
    }, 140);
  });
  plateStage.addEventListener('pointerleave', () => {
    if (visualTab === 'plate') stopPlateMotion();
  });
  function viewSpread(tab) {
    if (turnController) return;
    switchVisualTab(tab);
    readerModal.querySelector('.reader-sheet').scrollIntoView({
      block: 'start', behavior: reduceMotion.matches ? 'auto' : 'smooth'
    });
  }
  for (const [id, tab] of [['tabMotion', 'motion'], ['tabLab', 'lab'], ['tabPlate', 'plate']]) {
    document.getElementById(id).onclick = () => viewSpread(tab);
  }
  for (const button of document.querySelectorAll('.reader-media-return')) {
    button.onclick = () => {
      switchVisualTab('plate');
      platePlay.focus({ preventScroll: true });
    };
  }
  document.getElementById('speakBtn').onclick = toggleSpeech;
  document.getElementById('openBadgesBtn').onclick = openBadgesModal;
  document.getElementById('openStudioBtn').onclick = () => {
    document.getElementById('studioMsg').classList.add('hidden');
    document.getElementById('studioModal').classList.remove('hidden');
  };
  document.getElementById('entrySearch').addEventListener('submit', ev => {
    ev.preventDefault();
    closeModal('readerModal', false);
    selectVolume('all');
    scrollToSection('entries');
  });
  document.getElementById('searchInput').oninput = (ev) => {
    state.query = ev.target.value;
    renderGrid();
  };
  document.getElementById('onlyMotionCheck').onchange = (ev) => {
    state.onlyMotion = ev.target.checked;
    renderGrid();
  };
  document.getElementById('resetFilterBtn').onclick = () => {
    state.volume = 'all'; state.query = ''; state.onlyMotion = false;
    document.getElementById('searchInput').value = '';
    document.getElementById('onlyMotionCheck').checked = false;
    renderVolumeTabs(); renderGrid();
  };

  // 初始化
  renderVolumeCards();
  renderVolumeTabs();
  renderGrid();
  updateBadgeCounter();
  initStudio();
  const initialEntry = new URLSearchParams(location.search).get('book');
  if (initialEntry) openReader(initialEntry, document.getElementById('topContents'));
})();
