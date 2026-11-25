/* Freeze the two visible spreads only for the duration of the 3D paper turn. */
(() => {
  const scriptUrl = document.currentScript.src;
  let libraryRequest;
  let renderer;
  let webglUnavailable = false;

  function loadLibrary() {
    if (!libraryRequest) {
      libraryRequest = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = new URL('vendor/book-turn-libs.js', scriptUrl);
        script.onload = () => resolve(BookTurnLib);
        script.onerror = () => reject(new Error('Book animation library could not load.'));
        document.head.appendChild(script);
      }).catch(error => {
        libraryRequest = null;
        throw error;
      });
    }
    return libraryRequest;
  }

  function getRenderer(lib) {
    if (webglUnavailable) throw new Error('WebGL is unavailable.');
    if (!renderer) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('webgl2', { alpha: true, antialias: true });
      if (!context) {
        webglUnavailable = true;
        throw new Error('WebGL 2 is unavailable.');
      }
      renderer = new lib.WebGLRenderer({ canvas, context, alpha: true, antialias: true });
      canvas.className = 'book-turn-drawing';
      renderer.setClearAlpha(0);
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = lib.PCFShadowMap;
      canvas.addEventListener('webglcontextlost', () => {
        webglUnavailable = true;
      });
    }
    return renderer;
  }

  function capture(lib, surface, { width, height }, single) {
    const scale = Math.min(1.35, 1600 / width);
    return lib.captureElement(surface, {
      width,
      height,
      scale,
      backgroundColor: null,
      logging: false,
      imageTimeout: 750,
      onclone(clone, spread) {
        // The temporary document can have a different scrollbar gutter.
        spread.style.width = width + 'px';
        spread.style.height = height + 'px';
        // Keep the footer's paper in the texture. The live navigation floats above it.
        spread.querySelector('.reader-pagination').style.visibility = 'hidden';
        const plate = spread.querySelector('#platePane:not(.hidden) #plateImg');
        if (!plate?.src) return;
        const style = clone.defaultView.getComputedStyle(plate);
        if (!['cover', 'contain'].includes(style.objectFit)) return;

        // html2canvas supports this sizing on backgrounds rather than on images.
        const artwork = clone.createElement('div');
        Object.assign(artwork.style, {
          width: style.width,
          height: style.height,
          borderRadius: style.borderRadius,
          backgroundImage: `url(${JSON.stringify(plate.src)})`,
          backgroundColor: style.backgroundColor,
          backgroundSize: style.objectFit,
          backgroundPosition: style.objectPosition,
          backgroundRepeat: 'no-repeat'
        });
        plate.replaceWith(artwork);
      }
    }).then(snapshot => single ? snapshot : window.BookShape.clipCapture(snapshot, width, height));
  }

  function copyLeaf(snapshot, left, single) {
    if (single) return snapshot;
    const leaf = document.createElement('canvas');
    const middle = Math.floor(snapshot.width / 2);
    leaf.width = left ? middle : snapshot.width - middle;
    leaf.height = snapshot.height;
    leaf.getContext('2d').drawImage(
      snapshot, left ? 0 : middle, 0, leaf.width, leaf.height,
      0, 0, leaf.width, leaf.height
    );
    return leaf;
  }

  function paintUnderlay(canvas, oldSpread, newSpread, direction, single) {
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (single) {
      context.drawImage(newSpread, 0, 0);
      return;
    }
    const first = copyLeaf(direction === 1 ? oldSpread : newSpread, true, false);
    const second = copyLeaf(direction === 1 ? newSpread : oldSpread, false, false);
    context.drawImage(first, 0, 0);
    context.drawImage(second, first.width, 0);
  }

  function holdPrintedSpread(surface) {
    const spread = surface.cloneNode(true);
    spread.inert = true;
    for (const element of spread.querySelectorAll('[id]')) element.removeAttribute('id');
    return spread;
  }

  function createScene(lib, output, size, direction, single, oldSpread, newSpread) {
    const { width, height } = size;
    const leafWidth = single ? width : width / 2;
    const center = single ? direction * width / 2 : 0;
    const columns = 56;
    const rows = 22;
    const scene = new lib.Scene();
    // Match the HTML spread at rest and let a raised sheet grow subtly toward the eye.
    const distance = Math.max(height, width) * 3.9;
    // The curl can project past the resting top and bottom edges as it lifts.
    const rise = Math.ceil((height / 2) * leafWidth / (distance - leafWidth));
    const drawingHeight = height + 2 * rise;
    const fov = 2 * Math.atan(drawingHeight / (2 * distance)) * 180 / Math.PI;
    const camera = new lib.PerspectiveCamera(fov, width / drawingHeight, 1, distance * 2);
    camera.position.set(center, 0, distance);
    camera.lookAt(center, 0, 0);

    const geometry = new lib.PlaneGeometry(leafWidth, height, columns, rows);
    const curl = window.BookCurl.makeCurl(leafWidth, height, columns, rows, direction);
    const positions = geometry.attributes.position;
    const front = new lib.CanvasTexture(copyLeaf(oldSpread, direction < 0, single));
    const back = new lib.CanvasTexture(copyLeaf(newSpread, direction > 0, single));
    front.colorSpace = back.colorSpace = lib.SRGBColorSpace;
    back.repeat.x = -1;
    back.offset.x = 1;

    const paperMaterial = { transparent: true, alphaTest: 0.025 };
    const printedFront = new lib.MeshLambertMaterial({ ...paperMaterial, map: front, side: lib.FrontSide });
    const printedBack = new lib.MeshLambertMaterial({ ...paperMaterial, map: back, side: lib.BackSide });
    const paperLighting = { value: 0 };
    // A flat sheet must match the captured page when the canvas takes over or disappears.
    printedFront.onBeforeCompile = printedBack.onBeforeCompile = shader => {
      shader.uniforms.paperLighting = paperLighting;
      shader.fragmentShader = 'uniform float paperLighting;\n' + shader.fragmentShader.replace(
        '#include <opaque_fragment>',
        'outgoingLight = mix(diffuseColor.rgb, outgoingLight, paperLighting);\n#include <opaque_fragment>'
      );
    };
    printedFront.shadowSide = lib.DoubleSide;
    const face = new lib.Mesh(geometry, printedFront);
    const reverse = new lib.Mesh(geometry, printedBack);
    face.castShadow = true;
    face.frustumCulled = reverse.frustumCulled = false;
    scene.add(face, reverse, new lib.AmbientLight(0xfffbf0, 1.9));

    const light = new lib.DirectionalLight(0xfff8e8, 1.43);
    light.position.set(center - width * 0.31, height * 0.68, height * 1.1 + leafWidth);
    light.target.position.x = center;
    light.castShadow = true;
    light.shadow.mapSize.set(1024, 1024);
    Object.assign(light.shadow.camera, {
      left: -width, right: width, top: height, bottom: -height, near: 1, far: height * 6 + width
    });
    light.shadow.camera.updateProjectionMatrix();
    light.shadow.normalBias = 0.7;
    light.shadow.radius = 3;
    scene.add(light, light.target);

    const groundGeometry = new lib.PlaneGeometry(width * 1.01, height * 1.01);
    const shade = new lib.ShadowMaterial({ opacity: 0 });
    const ground = new lib.Mesh(groundGeometry, shade);
    ground.position.set(center, 0, -0.6);
    ground.receiveShadow = true;
    scene.add(ground);

    output.setSize(width, drawingHeight);
    output.domElement.style.top = -rise + 'px';
    return {
      draw(progress) {
        curl(progress, positions.array);
        positions.needsUpdate = true;
        geometry.computeVertexNormals();
        const lift = Math.sin(Math.PI * progress);
        paperLighting.value = lift ** 2;
        shade.opacity = 0.20 * lift ** 1.2;
        output.render(scene, camera);
        if (output.getContext().isContextLost()) throw new Error('WebGL context lost.');
      },
      dispose() {
        for (const item of [front, back, geometry, printedFront, printedBack, groundGeometry, shade, light.shadow]) {
          item.dispose();
        }
        scene.clear();
      }
    };
  }

  function animate(scene, signal) {
    return new Promise((resolve, reject) => {
      let start;
      let frame;
      function onAbort() {
        cancelAnimationFrame(frame);
        signal.removeEventListener('abort', onAbort);
        resolve();
      }
      function step(now) {
        start ??= now;
        const progress = Math.min((now - start) / 700, 1);
        try { scene.draw(progress); } catch (error) {
          signal.removeEventListener('abort', onAbort);
          reject(error);
          return;
        }
        if (progress < 1) frame = requestAnimationFrame(step);
        else onAbort();
      }
      signal.addEventListener('abort', onAbort, { once: true });
      frame = requestAnimationFrame(step);
    });
  }

  function bounded(work) {
    let timeout;
    return Promise.race([
      work,
      new Promise((_, reject) => {
        timeout = setTimeout(() => reject(new Error('Page snapshot took too long.')), 1600);
      })
    ]).finally(() => clearTimeout(timeout));
  }

  async function turn(surface, layer, direction, swap, signal) {
    if (location.protocol === 'file:' || webglUnavailable) return false;
    let scene;
    try {
      const lib = await bounded(loadLibrary());
      if (signal.aborted) return false;
      const output = getRenderer(lib);
      const size = { width: surface.clientWidth, height: surface.clientHeight };
      if (!size.width || !size.height) return false;
      const body = surface.querySelector('.reader-body');
      const single = getComputedStyle(body.firstElementChild).display === 'flex';
      const oldSpread = await bounded(capture(lib, surface, size, single));
      if (signal.aborted) return false;

      // Keep stationary text in the browser's layout to avoid shifting its baseline.
      const printedSpread = !single && body.querySelector('#platePane:not(.hidden)')
        ? holdPrintedSpread(surface)
        : null;
      const underlay = printedSpread ?? document.createElement('canvas');
      if (printedSpread) {
        printedSpread.style.width = surface.getBoundingClientRect().width + 'px';
      } else {
        underlay.width = oldSpread.width;
        underlay.height = oldSpread.height;
        underlay.getContext('2d').drawImage(oldSpread, 0, 0);
      }
      layer.style.width = size.width + 'px';
      layer.style.height = size.height + 'px';
      layer.replaceChildren(underlay);
      layer.hidden = false;
      if (printedSpread) printedSpread.querySelector('.reader-body').scrollTop = body.scrollTop;

      swap();
      const pendingImages = [...body.querySelectorAll('#plateImg, .reader-engraving')]
        .filter(image => !image.complete);
      await bounded(Promise.allSettled(pendingImages.map(image => image.decode()))).catch(() => {});
      const newSpread = await bounded(capture(lib, surface, size, single));
      if (signal.aborted || surface.clientWidth !== size.width || surface.clientHeight !== size.height) return false;

      scene = createScene(lib, output, size, direction, single, oldSpread, newSpread);
      scene.draw(0);
      if (printedSpread) {
        printedSpread.style.maskImage = direction > 0
          ? 'linear-gradient(to right, #000 50%, transparent 50%)'
          : 'linear-gradient(to right, transparent 50%, #000 50%)';
      } else {
        paintUnderlay(underlay, oldSpread, newSpread, direction, single);
      }
      layer.appendChild(output.domElement);
      await animate(scene, signal);
      return true;
    } catch {
      return false;
    } finally {
      scene?.dispose();
      if (!signal.aborted) {
        layer.hidden = true;
        layer.replaceChildren();
      }
    }
  }

  function warmup() {
    if (location.protocol !== 'file:' && !webglUnavailable) loadLibrary().then(getRenderer).catch(() => {});
  }

  window.BookTurn = { turn, warmup };
})();
