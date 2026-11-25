(() => {
  function openBookOutline(width, height) {
    const x = ratio => Math.round(width * ratio * 100) / 100;
    const fold = Math.min(25, Math.round(height * .031));
    return [
      `M ${x(.013)} 24`,
      `C ${x(.014)} 8 ${x(.023)} 5 ${x(.061)} 5`,
      `C ${x(.205)} 5 ${x(.33)} 0 ${x(.407)} 4`,
      `C ${x(.453)} 5 ${x(.484)} 9 ${x(.5)} ${fold}`,
      `C ${x(.516)} 9 ${x(.547)} 5 ${x(.593)} 4`,
      `C ${x(.665)} 0 ${x(.81)} 5 ${x(.939)} 5`,
      `C ${x(.977)} 5 ${x(.986)} 8 ${x(.987)} 24`,
      `C ${x(.991)} ${height * .36} ${x(.996)} ${height * .67} ${x(.999)} ${height - 32}`,
      `Q ${width} ${height - 11} ${x(.973)} ${height - 13}`,
      `C ${x(.859)} ${height - 15} ${x(.677)} ${height - 25} ${x(.585)} ${height - 18}`,
      `C ${x(.541)} ${height - 15} ${x(.521)} ${height - 10} ${x(.5)} ${height}`,
      `C ${x(.479)} ${height - 10} ${x(.459)} ${height - 15} ${x(.415)} ${height - 18}`,
      `C ${x(.323)} ${height - 25} ${x(.141)} ${height - 15} ${x(.027)} ${height - 13}`,
      `Q 0 ${height - 11} ${x(.001)} ${height - 32}`,
      `C ${x(.004)} ${height * .67} ${x(.009)} ${height * .36} ${x(.013)} 24 Z`
    ].join(' ');
  }

  function paintStack(canvas, width, height, box, single) {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.ceil(width * pixelRatio);
    canvas.height = Math.ceil(height * pixelRatio);
    const context = canvas.getContext('2d');
    if (!context) return;
    context.scale(pixelRatio, pixelRatio);

    const { x, y, pageWidth, pageHeight } = box;
    const sides = Math.max(2, Math.min(x - 8, pageWidth * .027));
    const base = Math.max(2, Math.min(height - y - pageHeight - 6, single ? 7 : 17));
    const sheets = single ? 5 : 15;
    for (let i = sheets; i > 0; i--) {
      const depth = i / sheets;
      const side = sides * depth + .65 * Math.sin(i * 1.8);
      const top = (single ? 1.3 : 3) * depth;
      const layerWidth = pageWidth + 2 * side;
      const layerHeight = pageHeight + base * depth - top;
      context.save();
      context.translate(x - side, y + top);
      const edge = single ? new Path2D() : new Path2D(openBookOutline(layerWidth, layerHeight));
      if (single) edge.roundRect(0, 0, layerWidth, layerHeight, 6);
      const grain = context.createLinearGradient(0, 0, layerWidth, 0);
      for (const [offset, color] of [
        [0, '#b69874'], [.009, '#efd9b3'], [.027, '#fae9cb'], [.056, '#e9cca6'],
        [.44, '#d9bd97'], [.5, '#9a704b'], [.56, '#dcbf96'],
        [.944, '#ead1aa'], [.973, '#f7e6c7'], [.991, '#e6cba4'], [1, '#a7805b']
      ]) grain.addColorStop(offset, color);
      context.fillStyle = grain;
      if (i === sheets) {
        context.shadowColor = '#2e170db8';
        context.shadowBlur = 6;
        context.shadowOffsetY = 3;
      }
      context.fill(edge);
      context.shadowColor = 'transparent';
      context.lineWidth = i % 4 === 1 ? 1 : .67;
      context.strokeStyle = i % 4 === 1 ? '#916438a8' : '#af895b73';
      context.stroke(edge);
      context.restore();
    }
  }

  function attach(book) {
    const surface = book.querySelector('.reader-page-surface');
    const canvas = book.querySelector('.reader-page-stack');
    const spread = surface.querySelector('.reader-spread');
    function measure() {
      const pageWidth = surface.clientWidth;
      const pageHeight = surface.clientHeight;
      if (!pageWidth || !pageHeight) return;
      const single = getComputedStyle(spread).display === 'flex';
      const outline = single ? '' : openBookOutline(pageWidth, pageHeight);
      surface.style.clipPath = outline ? `path("${outline}")` : '';

      const bookRect = book.getBoundingClientRect();
      const paperRect = surface.getBoundingClientRect();
      paintStack(canvas, book.clientWidth, book.clientHeight, {
        x: paperRect.left - bookRect.left - book.clientLeft,
        y: paperRect.top - bookRect.top - book.clientTop,
        pageWidth, pageHeight
      }, single);
    }
    const observer = new ResizeObserver(measure);
    observer.observe(surface);
    observer.observe(book);
    measure();
  }

  function clipCapture(snapshot, width, height) {
    const context = snapshot.getContext('2d');
    context.save();
    // html2canvas leaves the capture viewport's translation and scale on the context.
    context.setTransform(snapshot.width / width, 0, 0, snapshot.height / height, 0, 0);
    context.globalCompositeOperation = 'destination-in';
    context.fill(new Path2D(openBookOutline(width, height)));
    context.restore();
    return snapshot;
  }

  document.querySelectorAll('.reader-sheet').forEach(attach);
  window.BookShape = { clipCapture };
})();
