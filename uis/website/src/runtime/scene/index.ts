import * as T from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Scope } from '../scope';
import type { Slot } from '../slot';
import type { BeltApi, PorchApi } from '../choreography';
import { $id } from '../dom';
import { createTapeGun } from '../tape';
import { C, FONT, createKit, disposeScene, makeRenderer } from './kit';
import { buildPorch } from './porch';
import { buildConveyor } from './conveyor';

interface Route { tracks: T.Mesh[]; mat: T.MeshBasicMaterial; curve: T.CatmullRomCurve3 | null; length: number; drawn: (i: number) => number; base: number }
interface Puff { sp: T.Sprite; life: number; max: number; vel: T.Vector3; size: number }

/**
 * The 3D layer: the background truck and cargo plane that travel with the scroll, the tape-gun intro
 * that lays the navbar, and the two embedded toy scenes (porch, conveyor) that share the same kit.
 * Loaded on demand by site.ts; the intro wordmark itself lives in ../intro.ts so it can play before three.js arrives.
 * Without WebGL the intro is skipped and the page simply shows the finished navbar.
 */
export function startScene(scope: Scope, porchSlot: Slot<PorchApi>, beltSlot: Slot<BeltApi>) {
  const layer = $id('truck-layer');
  const canvas = $id<HTMLCanvasElement>('truck-canvas');
  const introEl = $id('intro');
  const tape = createTapeGun(scope);
  // no WebGL: drop the intro (and the pin ../intro.ts put on it) and show the finished navbar
  const noIntro = () => { ScrollTrigger.getById('intro-pin')?.kill(); tape.whole(); layer.hidden = true; introEl.style.display = 'none'; ScrollTrigger.refresh(); };
  scope.add(() => { layer.hidden = false; introEl.style.display = ''; });

  const DPR = Math.min(window.devicePixelRatio || 1, 1.75);
  const renderer = makeRenderer(canvas, DPR);
  if (!renderer) { noIntro(); return; }
  const kit = createKit(scope, DPR);
  const { part, rbox, toon, canvasTex, outlineMat, white, labelTex, labelMat, treadTex, puffTex, glowTex, shadowMat } = kit;

  const scene = new T.Scene();
  // the canvas is React's and outlives this scope, so its context is released, not killed (a remount reuses it)
  scope.add(() => { disposeScene(scene); renderer.dispose(); });
  const camera = new T.PerspectiveCamera(32, 1, 0.1, 200);
  camera.position.set(0, 8.5, 24);
  camera.lookAt(0, 0.6, 0);
  let stillMode = false;

  /* ---------- Light: flat illustration light on a 3-step toon ramp ---------- */
  scene.add(new T.AmbientLight(0xffffff, 0.62));
  const sun = new T.DirectionalLight(0xffffff, 0.72);
  sun.position.set(-5, 12, 9);
  scene.add(sun);

  kit.whenFonts([`900 70px ${FONT.display}`, `800 60px ${FONT.wide}`], () => { labelTex.redraw(); render(); });

  /* ---------- The truck: a red cab hauling a kraft parcel. Faces +x, origin on the ground between the axles.
     truck (unsprung: wheels, shadow) → sprung (suspension pivot) → body (everything that rocks) ---------- */
  const truck = new T.Group();
  const sprung = new T.Group(); sprung.position.y = 0.45; truck.add(sprung);
  const body = new T.Group(); body.position.y = -0.45; sprung.add(body);

  part(body, rbox(2.36, 0.14, 0.78, 0.04, 0.02), C.ink, { pos: [0.03, 0.42, 0], outline: false });           // chassis
  const CG = { x: -0.4, y: 1.03, w: 1.52, h: 1.06, d: 0.94 };
  part(body, rbox(CG.w, CG.h, CG.d, 0.05, 0.035), C.kraft, { pos: [CG.x, CG.y, 0] });                        // cargo: a parcel
  part(body, new T.BoxGeometry(CG.w * 0.985, 0.02, 0.24), C.tape, { pos: [CG.x, CG.y + CG.h / 2 + 0.004, 0], outline: false });   // tape over the top
  part(body, new T.BoxGeometry(0.02, CG.h * 0.6, 0.24), C.tape, { pos: [CG.x - CG.w / 2 - 0.004, CG.y + CG.h * 0.2, 0], outline: false }); // and down the back
  part(body, new T.BoxGeometry(CG.w * 0.985, 0.012, 0.012), C.ink, { pos: [CG.x, CG.y + CG.h / 2 + 0.006, 0], outline: false });       // flap seam
  [1, -1].forEach(sd => {
    const m = new T.Mesh(new T.PlaneGeometry(0.7, 0.47), labelMat);
    m.position.set(CG.x - 0.1, CG.y - 0.05, sd * (CG.d / 2 + 0.005));
    m.rotation.set(0, sd < 0 ? Math.PI : 0, -0.035 * sd);
    body.add(m);
  });

  const cabShape = new T.Shape();
  cabShape.moveTo(0, 0); cabShape.lineTo(0.78, 0); cabShape.lineTo(0.78, 0.42);
  cabShape.quadraticCurveTo(0.78, 0.55, 0.64, 0.6); cabShape.lineTo(0.44, 0.86);
  cabShape.quadraticCurveTo(0.37, 0.94, 0.26, 0.94); cabShape.lineTo(0.07, 0.94); cabShape.quadraticCurveTo(0, 0.94, 0, 0.87); cabShape.lineTo(0, 0);
  const cabGeo = new T.ExtrudeGeometry(cabShape, { depth: 0.76, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.05, bevelSegments: 3, curveSegments: 8 });
  cabGeo.center();
  part(body, cabGeo, C.red, { pos: [0.79, 0.93, 0] });                                                         // cab: x .35 → 1.23, y .41 → 1.45
  const WS = { a: Math.atan2(0.26, -0.2) - Math.PI, x: 0.989, y: 1.228 };
  part(body, new T.BoxGeometry(0.27, 0.03, 0.74), C.glass, { pos: [WS.x, WS.y, 0], rot: [0, 0, WS.a] });     // windscreen
  ([[0.2, 0.012, -0.06, 0.2], [0.1, 0.012, 0.02, 0.27]] as const).forEach(([l, t, off, z]) => {               // cartoon glints
    const g = new T.Mesh(new T.BoxGeometry(l, t, 0.05), white);
    g.position.set(WS.x + 0.012 + off * Math.cos(WS.a), WS.y + 0.012 + off * Math.sin(WS.a), z); g.rotation.z = WS.a; body.add(g);
  });
  part(body, rbox(0.3, 0.25, 0.9, 0.04, 0.01), C.glass, { pos: [0.62, 1.16, 0] });                             // side windows
  [1, -1].forEach(sd => {
    const g = new T.Mesh(new T.BoxGeometry(0.16, 0.022, 0.01), white); g.position.set(0.6, 1.22, sd * 0.452); g.rotation.z = 0.5; body.add(g);
    part(body, new T.BoxGeometry(0.09, 0.022, 0.01), C.ink, { pos: [0.74, 0.93, sd * 0.445], outline: false });  // door handle
    part(body, new T.BoxGeometry(0.012, 0.42, 0.01), C.ink, { pos: [0.43, 0.86, sd * 0.445], outline: false }); // door seam
    part(body, new T.BoxGeometry(0.03, 0.02, 0.12), C.ink, { pos: [1.03, 1.1, sd * 0.49], outline: false });     // mirror arm
    part(body, rbox(0.05, 0.13, 0.09, 0.02, 0.01), C.red, { pos: [1.03, 1.12, sd * 0.56] });                    // mirror
    part(body, new T.CylinderGeometry(0.075, 0.075, 0.05, 20), new T.MeshBasicMaterial({ color: C.lamp }), { pos: [1.245, 0.84, sd * 0.31], rot: [0, 0, Math.PI / 2] }); // headlight
    part(body, new T.TorusGeometry(0.33, 0.045, 8, 24, Math.PI), C.red, { pos: [0.78, 0.27, sd * 0.47] });     // front mudguard
  });
  part(body, rbox(0.05, 0.27, 0.5, 0.03, 0.01), C.ink, { pos: [1.245, 0.66, 0], outline: false });              // grille
  [0.6, 0.66, 0.72].forEach(y => part(body, new T.BoxGeometry(0.02, 0.022, 0.4), C.cream, { pos: [1.275, y, 0], outline: false }));
  part(body, rbox(0.15, 0.15, 1.0, 0.05, 0.02), C.ink, { pos: [1.26, 0.48, 0], outline: false });               // bumper
  part(body, new T.CylinderGeometry(0.05, 0.06, 0.04, 16), C.ink, { pos: [0.66, 1.47, 0], outline: false });
  const beaconMat = toon(C.yellow, { emissive: new T.Color(C.yellow), emissiveIntensity: 0.2 });
  part(body, new T.SphereGeometry(0.075, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), beaconMat, { pos: [0.66, 1.49, 0] }); // roof beacon
  part(body, new T.CylinderGeometry(0.03, 0.03, 0.6, 12), C.steel, { pos: [0.3, 1.2, 0.39] });                   // exhaust stack
  const exhaustTip = new T.Object3D(); exhaustTip.position.set(0.3, 1.52, 0.39); body.add(exhaustTip);
  const glows = [1, -1].map(sd => {
    const s = new T.Sprite(new T.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false }));
    s.position.set(1.34, 0.84, sd * 0.31); s.scale.set(0.75, 0.75, 1); body.add(s); return s;
  });

  // wheels: rounded tyre (lathe), steel hub, red cap, a dark bar so you can see them turn
  const WHEEL_R = 0.27;
  const prof: T.Vector2[] = [], tr0 = 0.15, hw = 0.1, cr = 0.055;
  prof.push(new T.Vector2(tr0, -hw));
  for (let i = 0; i <= 6; i++) { const a = -Math.PI / 2 + (i / 6) * (Math.PI / 2); prof.push(new T.Vector2(WHEEL_R - cr + Math.cos(a) * cr, -hw + cr + Math.sin(a) * cr)); }
  for (let i = 0; i <= 6; i++) { const a = (i / 6) * (Math.PI / 2); prof.push(new T.Vector2(WHEEL_R - cr + Math.cos(a) * cr, hw - cr + Math.sin(a) * cr)); }
  prof.push(new T.Vector2(tr0, hw));
  const tyreGeo = new T.LatheGeometry(prof, 30); tyreGeo.rotateX(Math.PI / 2);
  const hubGeo = new T.CylinderGeometry(0.14, 0.14, 0.205, 20); hubGeo.rotateX(Math.PI / 2);
  const capGeo = new T.CylinderGeometry(0.055, 0.055, 0.225, 14); capGeo.rotateX(Math.PI / 2);
  const barGeo = new T.BoxGeometry(0.22, 0.04, 0.215);
  const tyreMat = toon(C.ink), hubMat = toon(C.steel), capMat = toon(C.red);
  const spinners: T.Group[] = [], steerers: T.Group[] = [];
  ([[-0.72, false], [0.78, true]] as const).forEach(([x, front]) => {
    [-0.45, 0.45].forEach(z => {
      const pivot = new T.Group(); pivot.position.set(x, WHEEL_R, z);
      const spin = new T.Group();
      part(spin, tyreGeo, tyreMat);
      part(spin, hubGeo, hubMat, { outline: false });
      part(spin, barGeo, tyreMat, { outline: false });
      part(spin, capGeo, capMat, { outline: false });
      pivot.add(spin); truck.add(pivot);
      spinners.push(spin); if (front) steerers.push(pivot);
    });
  });
  scene.add(truck);

  const shadow = new T.Mesh(new T.PlaneGeometry(3.3, 1.45), shadowMat());
  shadow.rotation.x = -Math.PI / 2;
  scene.add(shadow);

  /* ---------- Exhaust puffs: cartoon smoke, ink-outlined like the stickers ---------- */
  const puffs: Puff[] = [];
  const addPuffs = (n: number) => {
    for (let i = 0; i < n; i++) {
      const sp = new T.Sprite(new T.SpriteMaterial({ map: puffTex, transparent: true, depthWrite: false }));
      sp.visible = false; scene.add(sp);
      puffs.push({ sp, life: 1, max: 1, vel: new T.Vector3(), size: 0.2 });
    }
  };
  addPuffs(16);
  const tmpV = new T.Vector3(), fwd = new T.Vector3();
  let emitAcc = 0;
  const emitPuff = (moving: number) => {
    const p = puffs.find(q => q.life >= q.max); if (!p) return;
    exhaustTip.getWorldPosition(tmpV);
    fwd.set(1, 0, 0).applyQuaternion(truck.quaternion);
    p.sp.position.copy(tmpV);
    p.vel.set(0, (0.55 + Math.random() * 0.3) * scaleT, 0).addScaledVector(fwd, -(0.25 + 0.6 * moving) * scaleT);
    p.vel.x += (Math.random() - 0.5) * 0.15 * scaleT; p.vel.z += (Math.random() - 0.5) * 0.15 * scaleT;
    p.life = 0; p.max = 0.75 + Math.random() * 0.45; p.size = (0.16 + Math.random() * 0.06) * scaleT;
    p.sp.material.rotation = Math.random() * 6.28; p.sp.visible = true;
  };
  const updatePuffs = (dt: number) => {
    let alive = false;
    puffs.forEach(p => {
      if (p.life >= p.max) return;
      p.life += dt; const t = Math.min(1, p.life / p.max);
      p.sp.position.addScaledVector(p.vel, dt); p.vel.multiplyScalar(1 - Math.min(1, dt * 1.6));
      const s = p.size * (0.8 + 1.9 * (1 - (1 - t) * (1 - t)));
      p.sp.scale.set(s, s, 1); p.sp.material.opacity = 1 - t * t; p.sp.material.rotation += dt * 0.7;
      if (t >= 1) p.sp.visible = false; else alive = true;
    });
    return alive;
  };

  /* ---------- Toy cargo plane for the "We store / We deliver / Bring it back" stretch. Faces +x like the truck. ---------- */
  const plane = new T.Group();
  const fp = [new T.Vector2(0, -0.92)];
  for (let i = 0; i <= 20; i++) {
    const t = i / 20, y = -0.92 + 1.84 * t;
    const r = t < 0.22 ? 0.075 + Math.pow(t / 0.22, 0.8) * 0.175 : t > 0.84 ? 0.25 * Math.sqrt(Math.max(0, 1 - Math.pow((t - 0.84) / 0.16, 2))) : 0.25;
    fp.push(new T.Vector2(Math.max(r, 0.0001), y));
  }
  const fusGeo = new T.LatheGeometry(fp, 28); fusGeo.rotateZ(-Math.PI / 2);
  part(plane, fusGeo, C.cream);                                                                                   // chunky fuselage
  [1, -1].forEach(sd => {
    part(plane, rbox(1.25, 0.07, 0.02, 0.03, 0.006), C.red, { pos: [0.1, -0.04, sd * 0.248], outline: false });  // red cheat line
    part(plane, rbox(0.36, 0.27, 0.014, 0.04, 0.005), C.cream, { pos: [-0.32, 0.0, sd * 0.247] });              // cargo door (outlined)
    part(plane, rbox(0.14, 0.07, 0.02, 0.025, 0.006), C.glass, { pos: [0.72, 0.1, sd * 0.19], rot: [0, sd * 0.45, 0] }); // cockpit side windows
  });
  part(plane, rbox(0.06, 0.08, 0.26, 0.025, 0.008), C.glass, { pos: [0.83, 0.1, 0], rot: [0, 0, -0.5] });       // windscreen
  const wordTex = canvasTex(512, 128, x => {
    x.fillStyle = '#FF1F2F'; x.beginPath(); x.arc(40, 88, 13, 0, 7); x.fill(); x.beginPath(); x.arc(92, 36, 13, 0, 7); x.fill();
    x.strokeStyle = '#FF1F2F'; x.setLineDash([10, 7]); x.lineWidth = 7; x.beginPath(); x.moveTo(40, 88); x.bezierCurveTo(40, 48, 92, 76, 92, 36); x.stroke(); x.setLineDash([]);
    kit.setStretch(x, 'expanded');
    x.fillStyle = '#2B1D0E'; x.font = `800 70px ${FONT.wide}`; x.fillText('TrackFlow', 122, 90);
  });
  scope.add(() => wordTex.dispose());
  [1, -1].forEach(sd => {
    const m = new T.Mesh(new T.PlaneGeometry(0.62, 0.155), new T.MeshBasicMaterial({ map: wordTex, transparent: true, depthWrite: false }));
    m.position.set(0.28, 0.09, sd * 0.252); if (sd < 0) m.rotation.y = Math.PI; plane.add(m);
  });
  kit.whenFonts([`800 70px ${FONT.wide}`], () => wordTex.redraw());
  part(plane, rbox(0.5, 0.07, 2.7, 0.07, 0.02), C.cream, { pos: [0.12, 0.27, 0] });                              // high wing
  [1.3, -1.3].forEach(z => part(plane, rbox(0.5, 0.075, 0.18, 0.05, 0.02), C.red, { pos: [0.12, 0.272, z * 0.98], outline: false })); // red wing tips
  const props: T.Group[] = [];
  [0.66, -0.66].forEach(z => {
    const nac = new T.CylinderGeometry(0.085, 0.1, 0.46, 16); nac.rotateZ(-Math.PI / 2);
    part(plane, nac, C.red, { pos: [0.24, 0.2, z] });                                                             // engine nacelle
    part(plane, new T.SphereGeometry(0.06, 12, 8), C.yellow, { pos: [0.48, 0.2, z] });                           // spinner
    const pr = new T.Group(); pr.position.set(0.5, 0.2, z); plane.add(pr); props.push(pr);
    part(pr, rbox(0.025, 0.5, 0.06, 0.012, 0.008), C.ink, { outline: false });
    part(pr, rbox(0.025, 0.06, 0.5, 0.012, 0.008), C.ink, { outline: false });
  });
  const fin = new T.Shape(); fin.moveTo(0, 0); fin.lineTo(0.4, 0); fin.lineTo(0.12, 0.44); fin.lineTo(-0.02, 0.44); fin.lineTo(0, 0);
  const finGeo = new T.ExtrudeGeometry(fin, { depth: 0.04, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 2 }); finGeo.center();
  part(plane, finGeo, C.red, { pos: [-0.74, 0.3, 0] });                                                           // T-tail fin
  part(plane, rbox(0.3, 0.045, 0.95, 0.05, 0.014), C.cream, { pos: [-0.83, 0.52, 0] });                          // T-tail stabiliser
  ([[0.48, 0], [-0.08, 0.15], [-0.08, -0.15]] as const).forEach(([x, z]) => {                                     // landing gear
    part(plane, new T.CylinderGeometry(0.014, 0.014, 0.14, 6), C.ink, { pos: [x, -0.27, z], outline: false });
    const w = new T.CylinderGeometry(0.055, 0.055, 0.045, 14); w.rotateX(Math.PI / 2);
    part(plane, w, C.ink, { pos: [x, -0.35, z] });
  });
  const planeTail = new T.Object3D(); planeTail.position.set(-0.95, 0.1, 0); plane.add(planeTail);
  plane.rotation.order = 'YZX';
  plane.visible = false;
  scene.add(plane);
  const planeShadowMat = shadowMat();
  const planeShadow = new T.Mesh(new T.PlaneGeometry(2.0, 1.2), planeShadowMat);
  planeShadow.rotation.x = -Math.PI / 2; planeShadow.visible = false;
  scene.add(planeShadow);
  // more puffs: the plane leaves a dotted trail
  addPuffs(24);
  const emitTrail = () => {
    const p = puffs.find(q => q.life >= q.max); if (!p) return;
    planeTail.getWorldPosition(tmpV);
    p.sp.position.copy(tmpV);
    p.vel.set((Math.random() - 0.5) * 0.08, 0.12 + Math.random() * 0.08, (Math.random() - 0.5) * 0.08).multiplyScalar(scaleT);
    p.life = 0; p.max = 1.3 + Math.random() * 0.4; p.size = (0.12 + Math.random() * 0.04) * scaleT;
    p.sp.material.rotation = Math.random() * 6.28; p.sp.visible = true;
  };

  /* ---------- Truck routes: two passes shaped like the "From click to doorstep" road banner, driven right → left.
     The banner's own SVG curve is sampled and laid on the ground: across the screen = x, up/down the screen = depth. ---------- */
  const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
  const banner = (() => {
    type P2 = readonly [number, number];
    const cub = (p0: P2, p1: P2, p2: P2, p3: P2, t: number) => { const m = 1 - t; return [0, 1].map(k => m * m * m * p0[k] + 3 * m * m * t * p1[k] + 3 * m * t * t * p2[k] + t * t * t * p3[k]); };
    const segs: Array<[P2, P2, P2, P2]> = [[[-80, 205], [240, 70], [520, 60], [800, 160]], [[800, 160], [1080, 260], [1340, 270], [1680, 105]]];
    const out: number[][] = [];
    segs.forEach((sg, k) => { for (let i = k ? 1 : 0; i <= 28; i++) out.push(cub(...sg, i / 28)); });
    return out.map(([x, y]) => ({ u: x / 1600, v: (y - 160) / 110 })).reverse();   // reversed: starts at the right
  })();

  /* ---------- Tyre tracks: printed tread marks laid behind the truck, one set per pass ---------- */
  const mkTread = () => new T.MeshBasicMaterial({ map: treadTex, transparent: true, opacity: 0.42, depthWrite: false, side: T.DoubleSide });
  const treadA = mkTread(), treadC = mkTread(), treadI = mkTread();
  const pair = (m: T.Material) => [new T.Mesh(new T.BufferGeometry(), m), new T.Mesh(new T.BufferGeometry(), m)];
  const tracksA = pair(treadA), tracksC = pair(treadC), approachTracks = pair(treadI);
  [...tracksA, ...tracksC, ...approachTracks].forEach(m => scene.add(m));
  const up = new T.Vector3(0, 1, 0);
  const fillRibbons = (meshes: T.Mesh[], pts: T.Vector3[], offset: number, half: number, repeat: number) => {
    const n = pts.length, tan = new T.Vector3(), side = new T.Vector3(), dist = [0];
    for (let i = 1; i < n; i++) dist.push(dist[i - 1] + pts[i].distanceTo(pts[i - 1]));
    [-offset, offset].forEach((off, mi) => {
      const pos = new Float32Array(n * 6), uv = new Float32Array(n * 4), idx: number[] = [];
      pts.forEach((p, i) => {
        tan.subVectors(pts[Math.min(n - 1, i + 1)], pts[Math.max(0, i - 1)]).normalize();
        side.crossVectors(up, tan).normalize();
        const cx = p.x + side.x * off, cy = p.y + 0.012, cz = p.z + side.z * off;
        pos.set([cx + side.x * half, cy, cz + side.z * half, cx - side.x * half, cy, cz - side.z * half], i * 6);
        uv.set([0, dist[i] / repeat, 1, dist[i] / repeat], i * 4);
      });
      for (let i = 0; i < n - 1; i++) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
      const g = new T.BufferGeometry();
      g.setAttribute('position', new T.BufferAttribute(pos, 3));
      g.setAttribute('uv', new T.BufferAttribute(uv, 2));
      g.setIndex(idx);
      meshes[mi].geometry.dispose();
      meshes[mi].geometry = g;
    });
    return (i: number) => i * 6;
  };

  const CAM_A = { pos: new T.Vector3(0, 1.4, 14), look: new T.Vector3(0, 1.1, 0) };
  const CAM_B = { pos: new T.Vector3(0, 8.5, 24), look: new T.Vector3(0, 0.6, 0) };
  const look = new T.Vector3();
  let camBlend = 1;
  const setCamera = (c: number) => { camBlend = c; camera.position.lerpVectors(CAM_A.pos, CAM_B.pos, c); look.lerpVectors(CAM_A.look, CAM_B.look, c); camera.lookAt(look); };

  const Z_FAR = -140, Z_END = 17, M = 400;
  const D_START = CAM_A.pos.z - Z_FAR, D_NEAR = 8;
  const sway = (tr: number) => Math.sin(tr * 0.25) * 0.35 * scaleT;
  const swaySlope = (tr: number) => Math.cos(tr * 0.25) * 0.25 * 0.35 * scaleT;

  const N = 700;
  let scaleT = 1, halfW = 10, approachDrawn = (_i: number) => 0;
  const RA: Route = { tracks: tracksA, mat: treadA, curve: null, length: 1, drawn: () => 0, base: 0 };
  const RC: Route = { tracks: tracksC, mat: treadC, curve: null, length: 1, drawn: () => 0, base: 0 };
  const drawBuf = new T.Vector2();
  const build = () => {
    const W = layer.clientWidth || window.innerWidth, H = layer.clientHeight || window.innerHeight;
    renderer.setSize(W, H, false);
    renderer.getDrawingBufferSize(drawBuf); outlineMat.uniforms.resolution.value.copy(drawBuf);
    camera.aspect = W / H; camera.updateProjectionMatrix();
    const dist = CAM_B.pos.distanceTo(CAM_B.look);
    halfW = Math.tan(T.MathUtils.degToRad(camera.fov / 2)) * dist * camera.aspect;
    scaleT = clamp(halfW / 12.9, 0.45, 1);
    truck.scale.setScalar(scaleT);
    shadow.scale.setScalar(scaleT);
    plane.scale.setScalar(scaleT * 1.45);
    // pass A follows the banner; pass C is its mirror image, a little flatter
    const reach = halfW * 1.2 + 2.6 * scaleT;           // far enough that the truck starts and ends fully off screen
    const amp = 3.1 * Math.max(0.6, scaleT);
    const toPts = (flip: boolean, zOff: number) => banner.map(({ u, v }) => new T.Vector3((u - 0.5) * 2 * reach / 1.1, 0, (flip ? -0.8 : 1) * v * amp + zOff));
    ([[RA, false, 0.2], [RC, true, 0.6]] as const).forEach(([R, flip, zOff]) => {
      R.curve = new T.CatmullRomCurve3(toPts(flip, zOff), false, 'centripetal');
      R.length = R.curve.getLength();
      R.drawn = fillRibbons(R.tracks, R.curve.getSpacedPoints(N), 0.45 * scaleT, 0.085 * scaleT, 0.24 * scaleT);
    });
    RC.base = RA.length;
    const apts: T.Vector3[] = [];
    for (let i = 0; i < M; i++) { const z = Z_FAR + (Z_END - Z_FAR) * i / (M - 1); apts.push(new T.Vector3(sway(z - Z_FAR), 0, z)); }
    approachDrawn = fillRibbons(approachTracks, apts, 0.45 * scaleT, 0.085 * scaleT, 0.24 * scaleT);
  };

  /* ---------- Pose from scroll (where things are), then dynamics on top (how they move) ---------- */
  const state = { intro: 0, a: 0, plane: 0, c: 0 };
  const pose = { trav: 0, roll: 0, y: 0 };
  const P = new T.Vector3(), Tg = new T.Vector3(), Ta = new T.Vector3(), Tb = new T.Vector3();
  truck.rotation.order = 'YZX';
  const smooth = (t: number) => t * t * (3 - 2 * t);
  const placeTruck = (x: number, y: number, z: number, yaw: number, roll: number, pitch: number, travelled: number, steer: number) => {
    truck.position.set(x, y, z);
    truck.rotation.set(0, yaw, pitch);
    pose.trav = travelled; pose.roll = roll; pose.y = y;
    spinners.forEach(sp => { sp.rotation.z = -travelled / (WHEEL_R * scaleT); });
    steerers.forEach(sp => { sp.rotation.y = steer; });
    shadow.position.set(x, y + 0.006, z);
    shadow.rotation.z = yaw;
  };
  const introPose = (i: number) => {
    setCamera(smooth(clamp((i - 0.72) / 0.28, 0, 1)));
    const d = i <= 0.62 ? D_START * Math.pow(D_NEAR / D_START, i / 0.62) : D_NEAR + (-3 - D_NEAR) * clamp((i - 0.62) / 0.2, 0, 1);
    const z = CAM_A.pos.z - d, tr = z - Z_FAR;
    const wobbleYaw = Math.sin(tr * 0.6) * 0.07;
    placeTruck(sway(tr), 0, z, -Math.PI / 2 + Math.atan(swaySlope(tr)) + wobbleYaw, Math.sin(tr * 1.1) * 0.07, 0, tr, clamp(swaySlope(tr) * 3 + wobbleYaw, -0.4, 0.4));
    truck.visible = shadow.visible = i > 0.003 && d > 0.8;
    const ai = clamp(Math.round((z - Z_FAR) / (Z_END - Z_FAR) * (M - 1)), 0, M - 1);
    approachTracks.forEach(m => { m.visible = i < 0.8; m.geometry.setDrawRange(0, approachDrawn(ai)); });
    [...tracksA, ...tracksC].forEach(m => { m.visible = false; });
  };
  const routePose = (pRaw: number, R: Route) => {
    setCamera(1);
    const p = clamp(pRaw, 0, 1), curve = R.curve!, length = R.length;
    curve.getPointAt(p, P);
    curve.getTangentAt(p, Tg);
    const yaw = Math.atan2(-Tg.z, Tg.x);
    const e = 0.004;
    curve.getTangentAt(clamp(p - e, 0, 1), Ta); curve.getTangentAt(clamp(p + e, 0, 1), Tb);
    let turn = Math.atan2(-Tb.z, Tb.x) - Math.atan2(-Ta.z, Ta.x);
    turn = Math.atan2(Math.sin(turn), Math.cos(turn)) / (2 * e * length);
    placeTruck(P.x, P.y, P.z, yaw, clamp(-turn * 0.9, -0.14, 0.14), 0, R.base + p * length, clamp(turn * 1.4, -0.5, 0.5));
    truck.visible = shadow.visible = true;
    approachTracks.forEach(m => { m.visible = false; });
    [RA, RC].forEach(X => X.tracks.forEach(m => { m.visible = X === R; }));
    R.tracks.forEach(m => m.geometry.setDrawRange(0, R.drawn(clamp(Math.floor(p * (N - 1)), 0, N - 1))));
  };
  // the plane: a lazy wave across the screen, banking, one wing-waggle in the middle
  const lastPlane = new T.Vector3();
  let trailAcc = 0;
  const planePose = (s: number) => {
    const Wd = halfW * 1.25 + 2 * scaleT, k = Math.max(0.6, scaleT);
    const x = -Wd + 2 * Wd * s;                       // left → right
    const y = (4.3 + 0.55 * Math.sin(s * Math.PI * 3)) * k;
    const z = (0.2 + 1.2 * Math.sin(s * Math.PI * 1.7 + 0.5)) * k;
    const dx = 2 * Wd, dy = 0.55 * Math.PI * 3 * Math.cos(s * Math.PI * 3) * k, dz = 1.2 * Math.PI * 1.7 * Math.cos(s * Math.PI * 1.7 + 0.5) * k;
    const ddz = -1.2 * Math.pow(Math.PI * 1.7, 2) * Math.sin(s * Math.PI * 1.7 + 0.5) * k;
    const yaw = Math.atan2(-dz, dx);
    const pitch = Math.atan2(dy, Math.hypot(dx, dz));
    const bank = clamp(ddz / (dx * dx) * 18, -0.5, 0.5);
    // a cargo plane doesn't barrel-roll: it banks, and waggles its wings once mid-way like a wave
    const waggle = Math.sin(clamp((s - 0.45) / 0.14, 0, 1) * Math.PI * 3) * 0.22;
    const roll = bank + waggle;
    plane.position.set(x, y, z);
    plane.rotation.set(roll, yaw, pitch);
    planeShadow.position.set(x, 0.01, z);
    const sh = scaleT * 1.5 * (1.05 - y / (12 * k));
    planeShadow.scale.set(sh, sh, 1);
    planeShadow.rotation.z = yaw;
    planeShadowMat.opacity = 0.75;
  };

  // suspension springs: nose dips when it brakes, squats when it pulls away, leans into turns, bounces over rises
  const dyn = { trav: null as number | null, y: 0, v: 0, vy: 0, pitch: 0, pv: 0, roll: 0, rv: 0, bob: 0, bv: 0, t: 0 };
  type DynKey = 'pitch' | 'roll' | 'bob';
  type DynVel = 'pv' | 'rv' | 'bv';
  const spring = (k: DynKey, vk: DynVel, target: number, stiff: number, damp: number, dt: number) => { dyn[vk] += (stiff * (target - dyn[k]) - damp * dyn[vk]) * dt; dyn[k] += dyn[vk] * dt; };
  const frame = (dt: number) => {
    if (state.intro < 0.999) introPose(state.intro);
    else if (state.c > 0.0005) routePose(state.c, RC);
    else routePose(state.a, RA);
    // first pass's tracks fade out while the plane flies
    treadA.opacity = 0.42 * (1 - clamp(state.plane * 2.5, 0, 1));
    treadC.opacity = 0.42 * (1 - clamp((state.c - 0.82) / 0.18, 0, 1));          // second pass's tracks fade as it leaves
    // plane
    const flying = state.intro >= 0.999 && state.plane > 0.0005 && state.plane < 0.9995;
    plane.visible = planeShadow.visible = flying;
    if (flying) planePose(state.plane);
    let moving = 0;
    if (dt > 0 && dyn.trav !== null && !stillMode) {
      const vNow = (pose.trav - dyn.trav) / dt;
      const vS = dyn.v + (vNow - dyn.v) * Math.min(1, dt * 10);
      const acc = clamp((vS - dyn.v) / dt, -400, 400); dyn.v = vS;
      const vyNow = (pose.y - dyn.y) / dt, ay = clamp((vyNow - dyn.vy) / dt, -80, 80); dyn.vy = vyNow;
      moving = Math.min(1, Math.abs(dyn.v) / (2.2 * scaleT));
      spring('pitch', 'pv', clamp(acc * 0.0028 / scaleT, -0.085, 0.085), 95, 9, dt);
      spring('roll', 'rv', pose.roll * 1.5, 80, 8, dt);
      spring('bob', 'bv', clamp(-ay * 0.0016, -0.05, 0.035), 130, 10, dt);
      dyn.t += dt;
      emitAcc += dt * (moving > 0.06 && truck.visible ? 3 + moving * 10 : 0);
      while (emitAcc >= 1) { emitPuff(moving); emitAcc -= 1; }
      if (flying) {
        props.forEach(pr => { pr.rotation.x += dt * 38; });
        trailAcc += plane.position.distanceTo(lastPlane);
        if (trailAcc > 6) trailAcc = 0;                       // a jump, not a flight: don't spray puffs
        while (trailAcc > 0.32 * scaleT) { emitTrail(); trailAcc -= 0.32 * scaleT; }
      }
    }
    if (flying) lastPlane.copy(plane.position);
    dyn.trav = pose.trav; dyn.y = pose.y;
    sprung.rotation.set(dyn.roll, 0, dyn.pitch);
    sprung.position.y = 0.45 + dyn.bob + (Math.sin(pose.trav * 9 / scaleT) * 0.011 + Math.sin(dyn.t * 40) * 0.0035) * moving;
    beaconMat.emissiveIntensity = moving > 0.05 ? 0.25 + 0.45 * (0.5 + 0.5 * Math.sin(dyn.t * 10)) : 0.18;
    glows.forEach(g => { g.material.opacity = 0.6 * (1 - camBlend); g.visible = camBlend < 0.98; });
    const puffing = dt > 0 ? updatePuffs(dt) : false;
    renderer.render(scene, camera);
    return puffing || Math.abs(dyn.pv) + Math.abs(dyn.rv) + Math.abs(dyn.bv) > 0.002 || moving > 0.02;
  };

  // draw on demand: runs while scrolling, then keeps going only until the springs settle and the smoke clears
  let raf = 0, lastT = 0, quietUntil = 0;
  const loop = (now: number) => {
    const dt = Math.min(0.05, Math.max(0.001, (now - lastT) / 1000)); lastT = now;
    const busy = frame(dt);
    raf = (busy || now < quietUntil) ? scope.raf(loop) : 0;
  };
  function render() {
    if (scope.dead) return;
    if (stillMode) { frame(0); return; }
    quietUntil = performance.now() + 250;
    if (!raf) { lastT = performance.now(); raf = scope.raf(loop); }
  }

  /* ---------- The two embedded toy scenes share this kit ----------
     Both sit far down the page, so each is built when it comes within ~1.5 screens instead of at load
     (two extra WebGL scenes were holding up the intro). Their Slots replay any commands queued before then.
     Building swaps the HTML fallback for a canvas, which can change the section's height, so triggers are re-measured. */
  const buildWhenNear = (id: string, build: () => void) => {
    const host = document.getElementById(id);
    if (!host) return;
    scope.observe((entries, io) => {
      if (!entries.some(e => e.isIntersecting)) return;
      io.disconnect();
      build();
      ScrollTrigger.refresh();
    }, host, { rootMargin: '150% 0px' });
  };
  buildWhenNear('belt-scene', () => beltSlot.set(buildConveyor(scope, kit)));
  buildWhenNear('door-scene', () => porchSlot.set(buildPorch(scope, kit)));
  scope.add(() => { beltSlot.clear(); porchSlot.clear(); });

  build();
  frame(0);
  scope.on(window, 'resize', () => { build(); frame(0); render(); });

  const cue = $id('scroll-cue');
  const skip = $id('skip-intro');
  const mm = gsap.matchMedia();
  scope.add(() => mm.revert());
  mm.add({ still: '(prefers-reduced-motion: reduce)', moving: '(prefers-reduced-motion: no-preference)' }, ctx => {
    if ((ctx.conditions as Record<string, boolean>).still) {
      introEl.style.display = 'none';
      tape.whole();
      stillMode = true; state.intro = 1; state.a = 0.55; render();
      ScrollTrigger.refresh();
      return () => { introEl.style.display = ''; stillMode = false; };
    }

    const TAPE_AT = 0.55, TAPE_LEN = 0.45;   // the tape step occupies the last 45% of the intro
    const syncTape = () => tape.draw((introTl.time() - TAPE_AT) / TAPE_LEN);
    const introTl: gsap.core.Timeline = gsap.timeline({
      defaults: { ease: 'none' },
      onUpdate: () => syncTape(),
      // Same scroll range as the pin created in ../intro.ts (refreshed just after it). It reads the pin's numbers
      // instead of using the intro as its trigger: measuring a pinned trigger briefly un-pins it, and the browser
      // then repaints the wordmark as if it were new content (a late Largest Contentful Paint).
      scrollTrigger: {
        start: () => ScrollTrigger.getById('intro-pin')?.start ?? 0,
        end: () => ScrollTrigger.getById('intro-pin')?.end ?? window.innerHeight * 2.5,
        scrub: 0.8, invalidateOnRefresh: true, refreshPriority: 9, onRefresh: () => syncTape(),
      },
    });
    introTl
      .to(state, { intro: 1, duration: 1, onUpdate: render }, 0)
      .to([cue, skip], { autoAlpha: 0, duration: 0.05 }, 0)
      .to('#intro-logo', { autoAlpha: 0, y: -36, scale: 0.92, duration: 0.1, ease: 'power2.in', force3D: true }, 0)
      .set({}, {}, 1);
    syncTape();

    // The journey after the intro, always right → left like the road banner:
    //   truck, first pass:  end of intro → "How it works" coming into view
    //   toy plane:          across the whole "We store / We deliver / Bring it back" stretch
    //   truck, second pass: Coverage → Leadership (then the delivery driver takes over)
    const leg = (key: 'a' | 'plane' | 'c', st: ScrollTrigger.Vars) => gsap.fromTo(state, { [key]: 0 }, { [key]: 1, ease: 'none', onUpdate: render, immediateRender: false,
      scrollTrigger: { scrub: 0.8, invalidateOnRefresh: true, refreshPriority: -10, ...st } });
    const legs = [
      leg('a', { start: () => introTl.scrollTrigger!.end, endTrigger: '#services', end: 'bottom 85%' }),
      // anchored to the sections around the pinned one, so the pin's extra scroll length is counted
      leg('plane', { trigger: '#services', start: 'bottom 85%', endTrigger: '#coverage', end: 'top 85%' }),
      leg('c', { trigger: '#coverage', start: 'top 85%', endTrigger: '#leadership', end: 'top 75%' }),   // clears the stage before the delivery driver walks in
    ];
    render();
    // Measure only the triggers added here; a global refresh would briefly un-pin the intro (see above).
    ScrollTrigger.sort();
    [introTl.scrollTrigger, ...legs.map(l => l.scrollTrigger)].forEach(st => st?.refresh());
    return () => { Object.assign(state, { intro: 0, a: 0, plane: 0, c: 0 }); };
  });

  scope.on(canvas, 'webglcontextlost', e => e.preventDefault());
  scope.on(canvas, 'webglcontextrestored', () => { build(); render(); });
  scope.on(document, 'visibilitychange', () => { if (!document.hidden) render(); });
  scope.on(window, 'pageshow', () => render());
}
