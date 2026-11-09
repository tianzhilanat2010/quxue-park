/* Rounded, articulated characters and garden props. Three.js r128. */
function pandaMaterial(color, extra = {}) {
  const material = new THREE.MeshStandardMaterial({ color, roughness: .84, metalness: 0, ...extra });
  material.color.convertSRGBToLinear();
  return material;
}
function pandaBall(parent, material, position, scale) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 24), material);
  mesh.position.set(...position); mesh.scale.set(...scale);
  mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
}
function pandaCurve(parent, points, material, radius = .025) {
  const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
  const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 24, radius, 8, false), material);
  parent.add(mesh); return mesh;
}
function pandaStar(material, size = .14) {
  const shape = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const a = Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? size * .48 : size;
    if (!i) shape.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    else shape.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  shape.closePath();
  return new THREE.Mesh(new THREE.ExtrudeGeometry(shape, {depth:.045,bevelEnabled:true,bevelSize:.025,bevelThickness:.02,bevelSegments:2,steps:1}),material);
}
function buildPandaRig(outfit = 'blue') {
  const root = new THREE.Group(), pelvis = new THREE.Group(), spine = new THREE.Group();
  pelvis.position.y = .64; root.add(pelvis); pelvis.add(spine);
  const cream = pandaMaterial(0xfffcf1), ink = pandaMaterial(0x282e39);
  const blue = pandaMaterial({blue:0x4389c7,mint:0x5a9e88,peach:0xd78c80}[outfit] || 0x4389c7);
  const gold = pandaMaterial(0xe8ba59, {roughness:.43, metalness:.22});
  const white = pandaMaterial(0xffffff), rose = pandaMaterial(0xf0a8a3);
  const eyeMat = pandaMaterial(0x172739, {roughness:.22});
  pandaBall(spine, ink, [0,.43,0], [.61,.68,.48]);
  pandaBall(spine, cream, [0,.43,.27], [.54,.59,.33]);
  const cape = new THREE.Mesh(new THREE.CylinderGeometry(.35,.76,.94,32,1,true,Math.PI/2,Math.PI),blue);
  cape.position.set(0,.45,-.04); cape.material.side=THREE.DoubleSide; cape.castShadow=true; spine.add(cape);
  const backBadge=pandaStar(gold,.20);backBadge.position.set(0,0,-.57);backBadge.rotation.y=Math.PI;cape.add(backBadge);
  pandaCurve(spine,[[-.48,.84,.2],[-.25,.93,.44],[0,.85,.49],[.25,.93,.44],[.48,.84,.2]],blue,.07);
  for (const side of [-1,1]) pandaBall(spine,blue,[side*.12,.83,.58],[.16,.10,.09]).rotation.z=side*.25;
  pandaBall(spine,gold,[0,.82,.64],[.065,.065,.045]);
  const badge=pandaStar(gold,.12);badge.position.set(.32,.49,.58);spine.add(badge);
  const headGroup = new THREE.Group();headGroup.position.set(0,1.36,0);spine.add(headGroup);
  for (const side of [-1,1]) {
    pandaBall(headGroup,ink,[side*.64,.59,-.04],[.30,.31,.20]);
    pandaBall(headGroup,rose,[side*.65,.61,.12],[.16,.17,.045]);
  }
  pandaBall(headGroup,cream,[0,0,0],[.86,.77,.72]);
  const eyes=[];
  for (const side of [-1,1]) {
    const patch=pandaBall(headGroup,ink,[side*.33,.10,.61],[.28,.34,.16]);patch.rotation.z=side*.24;
    const eye=new THREE.Group();eye.position.set(side*.31,.13,.77);headGroup.add(eye);eyes.push(eye);
    pandaBall(eye,white,[0,0,0],[.17,.19,.065]);
    pandaBall(eye,eyeMat,[-side*.015,-.01,.062],[.105,.135,.045]);
    pandaBall(eye,white,[-.037,.047,.105],[.038,.043,.016]);
    pandaBall(eye,white,[.037,-.048,.105],[.016,.018,.012]);
    const glasses=new THREE.Mesh(new THREE.TorusGeometry(.247,.018,8,48),gold);
    glasses.position.set(side*.31,.13,.88);headGroup.add(glasses);
    pandaBall(headGroup,rose,[side*.57,-.24,.55],[.14,.07,.065]);
    pandaBall(headGroup,cream,[side*.13,-.27,.69],[.255,.18,.17]);
  }
  pandaCurve(headGroup,[[-.066,.15,.89],[0,.19,.92],[.066,.15,.89]],gold,.018);
  pandaBall(headGroup,ink,[0,-.17,.88],[.105,.075,.065]);
  pandaCurve(headGroup,[[0,-.22,.88],[0,-.30,.89],[-.10,-.35,.85],[-.20,-.31,.81]],ink,.018);
  pandaCurve(headGroup,[[0,-.30,.89],[.10,-.35,.85],[.20,-.31,.81]],ink,.018);
  const hat=new THREE.Group();hat.position.set(0,.70,-.025);headGroup.add(hat);
  const cap=new THREE.Mesh(new THREE.CylinderGeometry(.37,.43,.22,32),blue);cap.position.y=.05;hat.add(cap);
  const board=new THREE.Mesh(new THREE.BoxGeometry(1.28,.09,1.08),blue);board.position.y=.20;board.rotation.y=.15;board.castShadow=true;hat.add(board);
  pandaBall(hat,gold,[0,.26,0],[.06,.025,.06]);
  const tassel=new THREE.Group();hat.add(tassel);
  pandaCurve(tassel,[[0,.26,0],[.30,.26,.06],[.61,.23,.10],[.67,-.18,.13]],gold,.022);
  pandaBall(tassel,gold,[.67,-.24,.13],[.055,.12,.055]);
  function arm(side) {
    const shoulder=new THREE.Group();shoulder.position.set(side*.52,.83,.01);spine.add(shoulder);
    pandaBall(shoulder,blue,[side*.06,-.10,0],[.23,.26,.24]);
    pandaBall(shoulder,ink,[side*.10,-.28,.06],[.20,.28,.21]);
    const elbow=new THREE.Group();elbow.position.set(side*.10,-.34,.07);shoulder.add(elbow);
    pandaBall(elbow,ink,[0,-.13,.06],[.21,.24,.22]);
    pandaBall(elbow,rose,[0,-.16,.25],[.10,.10,.025]);
    for(let i=0;i<3;i++)pandaBall(elbow,rose,[(i-1)*.065,-.03,.25],[.026,.035,.02]);
    return {shoulder,elbow};
  }
  function leg(side) {
    const hip=new THREE.Group();hip.position.set(side*.29,.08,0);pelvis.add(hip);
    pandaBall(hip,ink,[0,-.16,.01],[.24,.31,.24]);
    const knee=new THREE.Group();knee.position.y=-.25;hip.add(knee);
    const ankle=new THREE.Group();ankle.position.set(0,-.22,.10);knee.add(ankle);
    pandaBall(ankle,ink,[0,-.07,.06],[.26,.17,.34]);
    return {hip,knee,ankle};
  }
  root.userData={pelvis,spine,headGroup,cape,tassel,eyes,leftArmRig:arm(-1),rightArmRig:arm(1),leftLegRig:leg(-1),rightLegRig:leg(1),mood:'normal',landing:0};
  return root;
}
function pandaHeading(start, end) {
  return Math.atan2(end.x-start.x,end.z-start.z);
}
function pandaTurn(from,to,amount) {
  const delta=THREE.MathUtils.euclideanModulo(to-from+Math.PI,Math.PI*2)-Math.PI;
  return from+delta*amount;
}
function animatePanda(player, elapsed, dt, jumpProgress, recovering) {
  const r=player.userData;
  const breath=Math.sin(elapsed*2.5), air=jumpProgress===null?0:Math.sin(Math.PI*Math.max(0,(jumpProgress-.16)/.84));
  const crouch=jumpProgress!==null&&jumpProgress<.16?Math.sin(jumpProgress/.16*Math.PI):0;
  r.landing=Math.max(0,r.landing-dt*4);
  const squash=crouch*.16+r.landing*.13;
  r.pelvis.position.y=.64-squash+breath*.015;
  r.pelvis.scale.set(1+squash*.28,1-squash*.25,1+squash*.28);
  r.pelvis.rotation.x=air*.20+crouch*.10;
  r.pelvis.rotation.z=recovering?Math.sin(elapsed*10)*.08:air*.08;
  r.spine.rotation.x=breath*.012;
  r.headGroup.rotation.set(air*.04,Math.sin(elapsed*.65)*.10,Math.sin(elapsed*.9)*.025);
  const phase=elapsed%4.6,blink=phase>4.32?Math.max(.07,Math.abs(phase-4.46)/.14):1;
  r.eyes.forEach(eye=>eye.scale.y=blink);
  r.cape.rotation.x=.04+air*.24+Math.sin(elapsed*2)*.025;
  r.tassel.rotation.z=Math.sin(elapsed*3)*.035+air*.13;
  for(const [side,arm,leg] of [[-1,r.leftArmRig,r.leftLegRig],[1,r.rightArmRig,r.rightLegRig]]) {
    arm.shoulder.rotation.set(-air*.65+breath*.035,0,side*(.10+air*.80));
    arm.elbow.rotation.x=-air*.42;
    leg.hip.rotation.x=air*-.48+crouch*.2;
    leg.knee.rotation.x=air*.72;
    leg.ankle.rotation.x=-air*.22;
  }
}
function makeGardenProp(kind, seed=0) {
  const group=new THREE.Group();
  const white=pandaMaterial(0xfffdf2),green=pandaMaterial(seed%2?0xa6cf94:0x7fb88a),wood=pandaMaterial(0xc69d71);
  if(kind==='cloud') {
    [[-1,0,0,.85],[0,.2,0,1.1],[1,0,0,.78],[.25,-.15,.4,.85]].forEach(([x,y,z,s])=>pandaBall(group,white,[x,y,z],[s,s*.55,s*.65]));
  } else {
    const island=new THREE.Mesh(new THREE.CylinderGeometry(1.8,1.2,.65,32),wood);island.position.y=-.5;group.add(island);
    pandaBall(group,green,[0,-.2,0],[1.85,.35,1.7]);
    const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.12,.20,1.3,12),wood);trunk.position.y=.5;group.add(trunk);
    pandaBall(group,green,[0,1.5,0],[.8,.95,.75]);
    pandaBall(group,green,[-.5,1.2,.1],[.65,.7,.6]);
    pandaBall(group,green,[.5,1.3,.1],[.6,.75,.6]);
    for(let i=0;i<3;i++)pandaBall(group,pandaMaterial(0xf1bc77),[(i-1)*.48,1.3+(i%2)*.4,.67],[.12,.13,.12]);
  }
  return group;
}
function disposeGardenObject(object) {
  const geometries=new Set(),materials=new Set(),textures=new Set();
  object.traverse(child=>{if(child.geometry)geometries.add(child.geometry);if(child.material)(Array.isArray(child.material)?child.material:[child.material]).forEach(m=>materials.add(m));});
  materials.forEach(m=>{for(const value of Object.values(m))if(value?.isTexture)textures.add(value);m.dispose();});
  textures.forEach(t=>t.dispose());geometries.forEach(g=>g.dispose());
}
