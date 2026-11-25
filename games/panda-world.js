/* 100% Full-3D Volumetric Chibi Dr. Panda (Mochi Cheeks, Diamond Mortarboard Hat, 3D Glasses with Temples, Pink Paw Pads, Rounded Satchel & Star Wand) + Lush Floating Sky-Islands. Three.js r128. */

function pandaMaterial(color, extra = {}) {
  const material = new THREE.MeshStandardMaterial({ color, roughness: .72, metalness: 0.05, ...extra });
  material.color.convertSRGBToLinear();
  return material;
}
function pandaBall(parent, material, position, scale) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 24), material);
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}
function pandaCurve(parent, points, material, radius = .025) {
  const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
  const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 24, radius, 10, false), material);
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}
function pandaStar(material, size = .14) {
  const shape = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const a = Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? size * .48 : size;
    if (!i) shape.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    else shape.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  shape.closePath();
  const mesh = new THREE.Mesh(
    new THREE.ExtrudeGeometry(shape, { depth: .045, bevelEnabled: true, bevelSize: .022, bevelThickness: .018, bevelSegments: 2, steps: 1 }),
    material
  );
  mesh.castShadow = true;
  return mesh;
}

// Create a soft procedural plush-fur bump texture so 3D spheres look like soft velvet plush instead of plastic!
let _plushBumpTex = null;
function getPlushBumpTexture() {
  if (_plushBumpTex) return _plushBumpTex;
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 1400; i++) {
    const x = Math.random() * 128;
    const y = Math.random() * 128;
    const v = 110 + Math.floor(Math.random() * 36);
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.fillRect(x, y, 2, 2);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);
  _plushBumpTex = tex;
  return tex;
}

function buildPandaRig(outfit = 'blue') {
  const root = new THREE.Group(), pelvis = new THREE.Group(), spine = new THREE.Group();
  pelvis.position.y = .60;
  root.add(pelvis);
  pelvis.add(spine);

  const bump = getPlushBumpTexture();
  const cream = pandaMaterial(0xfffdf7, { roughness: .82, bumpMap: bump, bumpScale: 0.008 });
  const vestCream = pandaMaterial(0xfef3c7, { roughness: .75 });
  const ink = pandaMaterial(0x232730, { roughness: .80, bumpMap: bump, bumpScale: 0.008 });

  const outfitPalettes = {
    blue:   { main: 0x2563eb, dark: 0x1d4ed8 },
    mint:   { main: 0x059669, dark: 0x047857 },
    peach:  { main: 0xec4899, dark: 0xdb2777 },
    royal:  { main: 0xd97706, dark: 0xb45309 },
    cosmic: { main: 0x6366f1, dark: 0x4f46e5 }
  };
  const pal = outfitPalettes[outfit] || outfitPalettes.blue;
  const robeMat = pandaMaterial(pal.main, { roughness: .62, metalness: 0.08 });
  const robeDark = pandaMaterial(pal.dark, { roughness: .68, metalness: 0.08 });
  const gold = pandaMaterial(0xfbbf24, { roughness: .28, metalness: .42, emissive: 0x78350f, emissiveIntensity: .20 });
  const leather = pandaMaterial(0x92400e, { roughness: .65 });
  const leatherLight = pandaMaterial(0xb45309, { roughness: .62 });
  const white = pandaMaterial(0xffffff, { roughness: .2 });
  const rose = pandaMaterial(0xfda4af, { roughness: .65 });
  const mouthRed = pandaMaterial(0xbe123c, { roughness: .5 });
  const tonguePink = pandaMaterial(0xfb7185, { roughness: .45 });
  const irisBrown = pandaMaterial(0x4a2511, { roughness: .18 });
  const pupilBlack = pandaMaterial(0x0f172a, { roughness: .12 });

  // 0. Soft 3D Ground Shadow & Magic Footstep Ring
  const footHalo = new THREE.Mesh(
    new THREE.RingGeometry(0.68, 0.78, 36),
    new THREE.MeshBasicMaterial({ color: 0xfde047, side: THREE.DoubleSide, transparent: true, opacity: 0.45 })
  );
  footHalo.rotation.x = -Math.PI / 2;
  footHalo.position.y = 0.03;
  root.add(footHalo);

  // 1. Plump Chubby Torso, Tailored Cream Waistcoat & Fluffy Wagging Tail
  pandaBall(spine, ink, [0, .42, 0], [.64, .66, .54]);
  pandaBall(spine, cream, [0, .38, .22], [.56, .58, .40]);
  // Waistcoat V-vest with 2 shiny gold buttons
  pandaBall(spine, vestCream, [0, .40, .28], [.48, .50, .35]);
  pandaBall(spine, gold, [0, .48, .63], [.048, .048, .032]);
  pandaBall(spine, gold, [0, .33, .63], [.048, .048, .032]);

  // Cute Fluffy White Panda Tail at the lower back!
  const tail = pandaBall(spine, cream, [0, .10, -.54], [.19, .19, .21]);

  // 2. Full 3D Flared Academic/Wizard Cape with Thick Gold Hem & Collar Trim
  const cape = new THREE.Group();
  cape.position.set(0, .44, -.02);
  spine.add(cape);

  const capeCloth = new THREE.Mesh(
    new THREE.CylinderGeometry(.42, .82, .88, 36, 1, true, Math.PI * 0.40, Math.PI * 1.20),
    robeMat
  );
  capeCloth.material.side = THREE.DoubleSide;
  capeCloth.castShadow = true;
  cape.add(capeCloth);

  // Golden Bottom Hem Trim along the flared cape
  const capeHem = new THREE.Mesh(
    new THREE.TorusGeometry(.81, .032, 10, 48, Math.PI * 1.20),
    gold
  );
  capeHem.rotation.x = Math.PI / 2;
  capeHem.rotation.z = -Math.PI * 0.10;
  capeHem.position.y = -.43;
  cape.add(capeHem);

  // Golden Shoulder Collar Ring
  const collarRing = new THREE.Mesh(
    new THREE.TorusGeometry(.46, .042, 12, 40),
    gold
  );
  collarRing.rotation.x = Math.PI / 2 + 0.08;
  collarRing.position.set(0, .84, .04);
  spine.add(collarRing);

  // Plump 3D Bow Tie in front
  for (const side of [-1, 1]) {
    const loop = pandaBall(spine, robeMat, [side * .14, .81, .56], [.17, .11, .09]);
    loop.rotation.z = side * .24;
  }
  pandaBall(spine, gold, [0, .81, .62], [.068, .068, .052]);

  // 3. Cute Rounded 3D Explorer Satchel Backpack + Rolled Map Scroll + Shoulder Straps
  const pack = new THREE.Group();
  pack.position.set(0, .44, -.52);
  // Rounded plush leather body instead of a sharp box
  pandaBall(pack, leather, [0, 0, 0], [.36, .32, .22]);
  // Top flap in warm tan leather
  pandaBall(pack, leatherLight, [0, .14, .02], [.37, .16, .23]);
  // Gold Star Buckle on back of backpack
  const packBuckle = pandaStar(gold, .11);
  packBuckle.position.set(0, .02, -.24);
  packBuckle.rotation.y = Math.PI;
  pack.add(packBuckle);
  // Rolled Treasure Map Scroll tied on top of backpack
  const scrollRoll = new THREE.Mesh(new THREE.CylinderGeometry(.075, .075, .68, 20), vestCream);
  scrollRoll.rotation.z = Math.PI / 2;
  scrollRoll.position.set(0, .30, -.02);
  scrollRoll.castShadow = true;
  pack.add(scrollRoll);
  for (const sx of [-.20, .20]) {
    const ribbon = new THREE.Mesh(new THREE.TorusGeometry(.08, .016, 8, 24), mouthRed);
    ribbon.rotation.y = Math.PI / 2;
    ribbon.position.set(sx, .30, -.02);
    pack.add(ribbon);
  }
  spine.add(pack);

  // Shoulder straps wrapping over shoulders
  for (const side of [-1, 1]) {
    const strap = new THREE.Mesh(new THREE.TorusGeometry(.32, .026, 8, 28, Math.PI), leather);
    strap.rotation.y = side * 0.25;
    strap.position.set(side * .28, .54, -.18);
    spine.add(strap);
  }

  // 4. Sculpted Chibi "Mochi" Head (Wide Chubby Cheeks, Fluffy Ears, 3D Glasses with Temples & Open Pink Smile)
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.32, 0);
  spine.add(headGroup);

  // Main cranium + 2 chubby lower-cheek puffs for signature cute mochi silhouette from EVERY angle!
  pandaBall(headGroup, cream, [0, .04, 0], [.90, .80, .78]);
  for (const side of [-1, 1]) {
    // Chubby mochi cheek puff (visible from back, 3/4, and front!)
    pandaBall(headGroup, cream, [side * .36, -.15, .10], [.60, .44, .54]);
    // Rosy pink blush cushion on outer cheek
    pandaBall(headGroup, rose, [side * .58, -.16, .52], [.16, .09, .09]);
    // Big round fluffy black ear + soft pink inner ear
    pandaBall(headGroup, ink, [side * .68, .58, -.03], [.31, .31, .21]);
    pandaBall(headGroup, rose, [side * .68, .57, .13], [.17, .17, .06]);
  }

  // Expressive Warm Brown 3D Eyes + Metallic Gold Round Glasses with Side Temple Arms!
  const eyes = [];
  for (const side of [-1, 1]) {
    // Soft tilted teardrop black eye patch
    const patch = pandaBall(headGroup, ink, [side * .32, .09, .63], [.28, .33, .16]);
    patch.rotation.z = side * .25;

    // Warm chocolate-brown iris + deep black pupil + twin bright white starlight catchlights (no bug-eyed white ring!)
    const eye = new THREE.Group();
    eye.position.set(side * .31, .11, .73);
    headGroup.add(eye);
    eyes.push(eye);

    pandaBall(eye, irisBrown, [0, 0, 0], [.16, .19, .07]);
    pandaBall(eye, pupilBlack, [-side * .01, 0, .04], [.11, .14, .05]);
    pandaBall(eye, white, [-.042, .052, .085], [.042, .046, .02]);
    pandaBall(eye, white, [.038, -.045, .085], [.020, .022, .015]);

    // Round metallic-gold glasses frame
    const frame = new THREE.Mesh(new THREE.TorusGeometry(.245, .022, 12, 48), gold);
    frame.position.set(side * .31, .11, .82);
    headGroup.add(frame);

    // 3D Gold Glasses Temple Arm (眼镜腿) running along the side of the head to the ear (visible from side & back!)
    pandaCurve(
      headGroup,
      [
        [side * .55, .12, .80],
        [side * .78, .16, .45],
        [side * .82, .24, .05],
        [side * .74, .28, -.12]
      ],
      gold,
      .020
    );
  }
  // Gold glasses nose bridge
  pandaCurve(headGroup, [[-.07, .13, .83], [0, .17, .87], [.07, .13, .83]], gold, .020);

  // Plump 3D Cream Muzzle, Glossy Button Nose & Happy Open Coral-Pink Smile with Tongue!
  pandaBall(headGroup, cream, [0, -.15, .68], [.34, .22, .22]);
  pandaBall(headGroup, ink, [0, -.06, .87], [.10, .072, .068]);
  // Happy open D-shaped mouth + pink tongue
  const mouth = pandaBall(headGroup, mouthRed, [0, -.23, .79], [.16, .11, .08]);
  mouth.rotation.x = 0.15;
  const tongue = pandaBall(headGroup, tonguePink, [0, -.26, .83], [.11, .065, .06]);
  tongue.rotation.x = 0.2;

  // 5. Diamond-Oriented (45°) Royal-Blue Graduation Mortarboard Hat with Gold Rim & Swinging Tassel
  const hat = new THREE.Group();
  hat.position.set(0, .70, -.03);
  hat.rotation.x = -0.08;
  hat.rotation.z = 0.04;
  headGroup.add(hat);

  // Fitted skullcap + golden brow ring
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(.46, .53, .24, 36), robeDark);
  cap.position.y = .04;
  cap.castShadow = true;
  hat.add(cap);

  const capGoldBand = new THREE.Mesh(new THREE.TorusGeometry(.53, .026, 10, 48), gold);
  capGoldBand.rotation.x = Math.PI / 2;
  capGoldBand.position.y = -.06;
  hat.add(capGoldBand);

  // Diamond-rotated (Math.PI / 4) Mortarboard Top with Golden Edge Trim
  const boardGroup = new THREE.Group();
  boardGroup.position.y = .18;
  boardGroup.rotation.y = Math.PI / 4; // 45-degree diamond orientation like game-cover.webp!
  hat.add(boardGroup);

  const boardGoldRim = new THREE.Mesh(new THREE.BoxGeometry(1.36, .048, 1.36), gold);
  boardGoldRim.castShadow = true;
  boardGroup.add(boardGoldRim);

  const boardTop = new THREE.Mesh(new THREE.BoxGeometry(1.30, .068, 1.30), robeMat);
  boardTop.position.y = .01;
  boardTop.castShadow = true;
  boardGroup.add(boardTop);

  // Golden center button & lush swinging tassel on the left side
  pandaBall(hat, gold, [0, .23, 0], [.07, .035, .07]);
  const tassel = new THREE.Group();
  hat.add(tassel);
  pandaCurve(tassel, [[0, .23, 0], [-.34, .22, .06], [-.66, .16, .10], [-.74, -.16, .12]], gold, .024);
  pandaBall(tassel, gold, [-.74, -.16, .12], [.048, .048, .048]);
  const tasselFringe = new THREE.Mesh(new THREE.ConeGeometry(.085, .24, 16), gold);
  tasselFringe.position.set(-.74, -.28, .12);
  tasselFringe.castShadow = true;
  tassel.add(tasselFringe);

  // 6. Floating 3D Star Pet Companion & Bamboo Shield Ring
  const petStar = pandaStar(gold, .18);
  petStar.position.set(-1.05, 2.02, -.10);
  root.add(petStar);

  const shieldRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.08, .05, 12, 48),
    pandaMaterial(0x34d399, { transparent: true, opacity: 0.82, emissive: 0x10b981, emissiveIntensity: 0.45 })
  );
  shieldRing.rotation.x = Math.PI / 2;
  shieldRing.position.y = .85;
  shieldRing.visible = false;
  root.add(shieldRing);

  // 7. Chubby 3D Panda Arms (Left Hand: Magic Book; Right Hand: Glowing Star Wand)
  function arm(side) {
    const shoulder = new THREE.Group();
    shoulder.position.set(side * .54, .80, .02);
    spine.add(shoulder);
    pandaBall(shoulder, robeMat, [side * .05, -.09, 0], [.24, .26, .24]);
    pandaBall(shoulder, ink, [side * .10, -.26, .05], [.20, .27, .20]);

    const elbow = new THREE.Group();
    elbow.position.set(side * .10, -.32, .06);
    shoulder.add(elbow);
    pandaBall(elbow, ink, [0, -.12, .06], [.21, .23, .21]);
    // Cute pink paw pad on palm
    pandaBall(elbow, rose, [0, -.15, .24], [.095, .095, .03]);
    for (let i = 0; i < 3; i++) {
      pandaBall(elbow, rose, [(i - 1) * .062, -.04, .24], [.028, .035, .02]);
    }

    if (side === -1) {
      // Left Hand: Royal-Blue & Gold Magic Math Book
      const book = new THREE.Group();
      book.position.set(-.08, -.10, .22);
      book.rotation.set(0.25, 0.35, -0.20);
      const cover = new THREE.Mesh(new THREE.BoxGeometry(.34, .44, .09), robeDark);
      cover.castShadow = true;
      book.add(cover);
      const pages = new THREE.Mesh(new THREE.BoxGeometry(.31, .41, .07), vestCream);
      pages.position.x = .02;
      book.add(pages);
      const bookStar = pandaStar(gold, .08);
      bookStar.position.set(0, 0, .05);
      book.add(bookStar);
      elbow.add(book);
    } else {
      // Right Hand: Glowing Golden Star Wand with Orbiting Ring
      const wand = new THREE.Group();
      wand.position.set(.06, -.16, .18);
      wand.rotation.x = -Math.PI / 3;
      const stick = new THREE.Mesh(new THREE.CylinderGeometry(.025, .032, .68, 12), leather);
      stick.position.y = .28;
      wand.add(stick);
      const wandStar = pandaStar(gold, .18);
      wandStar.position.set(0, .66, 0);
      wand.add(wandStar);
      const wandHalo = new THREE.Mesh(
        new THREE.TorusGeometry(.24, .015, 8, 32),
        new THREE.MeshBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0.8 })
      );
      wandHalo.position.set(0, .66, 0);
      wand.add(wandHalo);
      elbow.userData.wandStar = wandStar;
      elbow.userData.wandHalo = wandHalo;
      elbow.add(wand);
    }
    return { shoulder, elbow };
  }

  // 8. Chubby 3D Panda Legs with Cute Pink Paw Pads on the Soles (visible when jumping forward!)
  function leg(side) {
    const hip = new THREE.Group();
    hip.position.set(side * .29, .08, 0);
    pelvis.add(hip);
    pandaBall(hip, ink, [0, -.15, .01], [.24, .30, .24]);
    const knee = new THREE.Group();
    knee.position.y = -.24;
    hip.add(knee);
    const ankle = new THREE.Group();
    ankle.position.set(0, -.21, .08);
    knee.add(ankle);
    // Plump 3D foot
    pandaBall(ankle, ink, [0, -.07, .05], [.26, .17, .33]);
    // Pink Paw Pad & 3 Toe Beans on the sole/heel so they show adorably when kicking mid-jump!
    pandaBall(ankle, rose, [0, -.15, -.02], [.13, .04, .14]);
    for (let i = -1; i <= 1; i++) {
      pandaBall(ankle, rose, [i * .085, -.14, -.16], [.042, .032, .045]);
    }
    return { hip, knee, ankle };
  }

  root.userData = {
    pelvis,
    spine,
    headGroup,
    cape,
    tassel,
    tail,
    footHalo,
    eyes,
    petStar,
    shieldRing,
    leftArmRig: arm(-1),
    rightArmRig: arm(1),
    leftLegRig: leg(-1),
    rightLegRig: leg(1),
    mood: 'normal',
    landing: 0
  };
  return root;
}

// Natural 3D forward heading toward the target island!
function pandaHeading(start, end) {
  return Math.atan2(end.x - start.x, end.z - start.z);
}
function pandaTurn(from, to, amount) {
  const delta = THREE.MathUtils.euclideanModulo(to - from + Math.PI, Math.PI * 2) - Math.PI;
  return from + delta * amount;
}
function animatePanda(player, elapsed, dt, jumpProgress, recovering) {
  const r = player.userData;
  const breath = Math.sin(elapsed * 2.6);
  const air = jumpProgress === null ? 0 : Math.sin(Math.PI * Math.max(0, (jumpProgress - .15) / .85));
  const crouch = jumpProgress !== null && jumpProgress < .15 ? Math.sin((jumpProgress / .15) * Math.PI) : 0;
  r.landing = Math.max(0, r.landing - dt * 4);
  const squash = crouch * .16 + r.landing * .13;

  r.pelvis.position.y = .60 - squash + breath * .018;
  r.pelvis.scale.set(1 + squash * .26, 1 - squash * .24, 1 + squash * .26);
  r.pelvis.rotation.x = air * .24 + crouch * .12;
  r.pelvis.rotation.z = recovering ? Math.sin(elapsed * 12) * .08 : Math.sin(elapsed * 2.2) * .025;
  r.spine.rotation.x = breath * .015;

  // When idle on the island, Dr. Panda gently turns his head to glance warmly toward the player!
  const idleHeadYaw = jumpProgress === null ? 0.36 + Math.sin(elapsed * 1.1) * 0.14 : 0;
  r.headGroup.rotation.set(
    air * -.12 + Math.sin(elapsed * 1.8) * .03,
    idleHeadYaw,
    Math.sin(elapsed * 1.4) * .035
  );

  const phase = elapsed % 4.4;
  const blink = phase > 4.16 ? Math.max(.08, Math.abs(phase - 4.28) / .12) : 1;
  r.eyes.forEach(eye => eye.scale.y = blink);

  r.cape.rotation.x = .05 + air * .28 + Math.sin(elapsed * 2.4) * .03;
  r.tassel.rotation.z = Math.sin(elapsed * 3.2) * .06 + air * .18;
  if (r.tail) {
    r.tail.position.x = Math.sin(elapsed * 5.5) * .045;
  }
  if (r.footHalo) {
    r.footHalo.rotation.z = -elapsed * 1.2;
    r.footHalo.scale.setScalar(Math.max(0.35, 1 - air * 0.55));
  }
  if (r.petStar) {
    r.petStar.position.y = 2.02 + Math.sin(elapsed * 3.2) * .14 + air * .35;
    r.petStar.rotation.y = elapsed * 2.2;
  }
  if (r.rightArmRig && r.rightArmRig.elbow.userData.wandStar) {
    r.rightArmRig.elbow.userData.wandStar.rotation.z = elapsed * 2.5;
    r.rightArmRig.elbow.userData.wandHalo.rotation.x = elapsed * 3.0;
    r.rightArmRig.elbow.userData.wandHalo.rotation.y = elapsed * 2.2;
  }
  if (r.shieldRing && r.shieldRing.visible) {
    r.shieldRing.rotation.z = elapsed * 1.8;
    r.shieldRing.position.y = .85 + Math.sin(elapsed * 4) * .06;
  }

  for (const [side, arm, leg] of [[-1, r.leftArmRig, r.leftLegRig], [1, r.rightArmRig, r.rightLegRig]]) {
    // Cheerful waving when idle, dynamic forward leap pose when jumping!
    const wave = side === 1 && jumpProgress === null ? Math.sin(elapsed * 3.6) * .18 + .15 : 0;
    arm.shoulder.rotation.set(-air * .72 + breath * .04 - wave * .5, 0, side * (.12 + air * .75 + wave));
    arm.elbow.rotation.x = -air * .45 - wave * .3;
    // Kick legs back during jump so the cute pink paw pads on the soles show!
    leg.hip.rotation.x = air * .52 + crouch * .22;
    leg.knee.rotation.x = air * .58;
    leg.ankle.rotation.x = air * .25;
  }
}

// Rich background props: Fluffy Cloud Banks, Floating Castle Island, Hot Air Balloon, and Crystal Trees
function makeGardenProp(kind, seed = 0) {
  const group = new THREE.Group();
  const white = pandaMaterial(0xffffff, { roughness: 0.9 });
  const green = pandaMaterial(seed % 2 ? 0x4ade80 : 0x22c55e);
  const wood = pandaMaterial(0x9a6b3e);
  const stone = pandaMaterial(0x7c6f64);
  const crystalMat = pandaMaterial(seed % 2 ? 0xc084fc : 0x38bdf8, { roughness: 0.25, metalness: 0.2, emissive: seed % 2 ? 0x581c87 : 0x0369a1, emissiveIntensity: 0.35 });

  if (kind === 'cloud') {
    [[-1.1, 0, 0, .95], [0, .28, 0, 1.25], [1.1, .04, 0, .88], [.3, -.14, .45, .92], [-.5, -.1, -.35, .8]].forEach(([x, y, z, s]) =>
      pandaBall(group, white, [x, y, z], [s, s * .58, s * .68])
    );
  } else if (kind === 'balloon') {
    const balloonColors = [0xf43f5e, 0xf59e0b, 0x38bdf8, 0xa855f7];
    const bMat = pandaMaterial(balloonColors[seed % balloonColors.length]);
    pandaBall(group, bMat, [0, 1.4, 0], [1.1, 1.35, 1.1]);
    const stripe = new THREE.Mesh(new THREE.TorusGeometry(1.06, .08, 10, 32), pandaMaterial(0xfef08a));
    stripe.rotation.x = Math.PI / 2;
    stripe.position.y = 1.4;
    group.add(stripe);
    const basket = new THREE.Mesh(new THREE.CylinderGeometry(.32, .26, .38, 12), wood);
    basket.position.y = -.2;
    group.add(basket);
  } else if (kind === 'castle') {
    const rock = new THREE.Mesh(new THREE.ConeGeometry(2.6, 2.4, 7), stone);
    rock.rotation.x = Math.PI;
    rock.position.y = -1.2;
    group.add(rock);
    pandaBall(group, green, [0, 0, 0], [2.6, .42, 2.4]);
    const wall = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.3, 1.4), pandaMaterial(0xfef3c7));
    wall.position.y = .75;
    group.add(wall);
    for (const sx of [-.85, 0, .85]) {
      const h = sx === 0 ? 2.1 : 1.5;
      const tower = new THREE.Mesh(new THREE.CylinderGeometry(.28, .32, h, 12), pandaMaterial(0xfffbeb));
      tower.position.set(sx, h / 2 + .1, .2);
      group.add(tower);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(.42, .75, 12), pandaMaterial(0x2563eb));
      roof.position.set(sx, h + .45, .2);
      group.add(roof);
    }
    const wf = new THREE.Mesh(new THREE.BoxGeometry(.48, 2.3, .12), pandaMaterial(0x38bdf8, { transparent: true, opacity: 0.78, emissive: 0x0284c7, emissiveIntensity: 0.35 }));
    wf.position.set(.4, -1.05, 1.6);
    group.add(wf);
  } else {
    const rock = new THREE.Mesh(new THREE.ConeGeometry(1.9, 1.85, 7), stone);
    rock.rotation.x = Math.PI;
    rock.position.y = -.95;
    group.add(rock);
    pandaBall(group, green, [0, -.12, 0], [1.95, .38, 1.8]);
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(.14, .22, 1.25, 10), wood);
    trunk.position.y = .5;
    group.add(trunk);
    pandaBall(group, green, [0, 1.45, 0], [.85, .95, .8]);
    pandaBall(group, green, [-.52, 1.18, .12], [.65, .7, .6]);
    pandaBall(group, green, [.52, 1.25, .12], [.6, .75, .6]);
    const crys = new THREE.Mesh(new THREE.ConeGeometry(.22, .68, 6), crystalMat);
    crys.position.set(-.85, .28, .55);
    crys.rotation.z = .22;
    group.add(crys);
  }
  return group;
}

function disposeGardenObject(object) {
  const geometries = new Set(), materials = new Set(), textures = new Set();
  object.traverse(child => {
    if (child.geometry) geometries.add(child.geometry);
    if (child.material) (Array.isArray(child.material) ? child.material : [child.material]).forEach(m => materials.add(m));
  });
  materials.forEach(m => {
    for (const value of Object.values(m)) if (value?.isTexture) textures.add(value);
    m.dispose();
  });
  textures.forEach(t => t.dispose());
  geometries.forEach(g => g.dispose());
}
