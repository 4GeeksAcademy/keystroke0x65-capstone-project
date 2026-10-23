import * as T from 'three';
import { gsap } from 'gsap';
import type { Scope } from '../scope';
import type { PorchApi } from '../choreography';
import { $ } from '../dom';
import { C, FONT, disposeScene, makeRenderer, type Kit, type PartOpts } from './kit';

/**
 * The porch: delivery driver at the FAQ door, built from the same toon + ink kit as the truck and plane.
 * Its own small renderer lives inside the FAQ column, so it scrolls with the page and only draws while it animates.
 */
export function buildPorch(scope: Scope, kit: Kit): PorchApi | null {
  const host = document.getElementById('door-scene');
  if (!host) return null;
  const { DPR, part, rbox, toon, canvasTex, setStretch, white, labelMat, shadowMat } = kit;
  const cv = document.createElement('canvas'); cv.className = 'porch-canvas'; cv.setAttribute('aria-hidden', 'true');
  host.appendChild(cv);
  const pr = makeRenderer(cv, DPR);
  if (!pr) { cv.remove(); return null; }
  host.classList.add('porch-3d');
  const sc = new T.Scene();
  scope.add(() => { disposeScene(sc); pr.dispose(); pr.forceContextLoss(); cv.remove(); host.classList.remove('porch-3d'); });

  sc.add(new T.AmbientLight(0xffffff, 0.62));
  const key = new T.DirectionalLight(0xffffff, 0.75); key.position.set(3, 6, 7); sc.add(key);
  const cam = new T.PerspectiveCamera(27, 1, 0.1, 60);
  cam.position.set(1.75, 1.6, 6.4); cam.lookAt(-0.18, 1.1, 0);
  const om = kit.outlineFor();
  const pp = (parent: T.Object3D, geo: T.BufferGeometry, mat: number | T.Material, o: PartOpts = {}) => part(parent, geo, mat, { ...o, om });

  // porch: a landing wide and deep enough for the driver to stand on, a lower step in front, the door frame
  pp(sc, rbox(2.3, 0.12, 1.0, 0.04, 0.02), C.ink, { pos: [-0.15, 0.06, 0.32], outline: false });
  pp(sc, rbox(2.1, 0.06, 0.24, 0.03, 0.015), C.ink, { pos: [-0.15, 0.03, 0.92], outline: false });
  [-1.02, 0.02].forEach(x => pp(sc, rbox(0.13, 2.16, 0.22, 0.04, 0.02), C.ink, { pos: [x, 1.2, -0.02], outline: false }));
  pp(sc, rbox(1.17, 0.15, 0.22, 0.04, 0.02), C.ink, { pos: [-0.5, 2.27, -0.02], outline: false });

  // the hallway behind the door: a real little room, drawn only through the doorway (stencil),
  // so the door can swing inward into it without anything showing outside the frame
  const OPEN_L = -0.955, OPEN_R = -0.045, OPEN_B = 0.12, OPEN_T = 2.195, DEEP = -1.5;
  const portal = new T.Mesh(new T.PlaneGeometry(OPEN_R - OPEN_L, OPEN_T - OPEN_B), new T.MeshBasicMaterial({
    colorWrite: false, depthWrite: false,
    stencilWrite: true, stencilRef: 1, stencilFunc: T.AlwaysStencilFunc, stencilZPass: T.ReplaceStencilOp,
  }));
  portal.position.set((OPEN_L + OPEN_R) / 2, (OPEN_B + OPEN_T) / 2, 0.05); portal.renderOrder = -2; sc.add(portal);
  const inside = (color: number, w: number, h: number, pos: [number, number, number], rot: [number, number, number] = [0, 0, 0]) => {
    const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color, stencilWrite: true, stencilRef: 1, stencilFunc: T.EqualStencilFunc }));
    m.position.set(...pos); m.rotation.set(...rot); m.renderOrder = -1; sc.add(m); return m;
  };
  const midX = (OPEN_L + OPEN_R) / 2, hallH = OPEN_T - OPEN_B + 0.1;
  inside(0xFFD36B, 1.2, hallH, [midX, OPEN_B + hallH / 2, DEEP]);                                          // end wall
  inside(0xFFE9A6, 0.5, 0.9, [midX + 0.05, 1.35, DEEP + 0.01]);                                         // lamp-lit patch on it
  inside(0xE9A23A, -DEEP, hallH, [OPEN_L, OPEN_B + hallH / 2, DEEP / 2], [0, Math.PI / 2, 0]);           // left wall (the side you see)
  inside(0xD08A2E, -DEEP, hallH, [OPEN_R, OPEN_B + hallH / 2, DEEP / 2], [0, -Math.PI / 2, 0]);          // right wall
  inside(0xA8682C, 1.2, -DEEP, [midX, OPEN_B, DEEP / 2], [-Math.PI / 2, 0, 0]);                          // wooden floor
  inside(0xC22030, 0.42, -DEEP - 0.2, [midX, OPEN_B + 0.003, DEEP / 2 - 0.05], [-Math.PI / 2, 0, 0]);   // runner rug
  inside(0xE7B04C, 1.2, -DEEP, [midX, OPEN_T + 0.05, DEEP / 2], [Math.PI / 2, 0, 0]);                    // ceiling
  inside(0x7A4A22, 0.24, 0.3, [OPEN_L + 0.005, 1.45, -0.95], [0, Math.PI / 2, 0]);                       // a picture on the wall
  inside(0x86CDEB, 0.18, 0.24, [OPEN_L + 0.008, 1.45, -0.95], [0, Math.PI / 2, 0]);

  // the door, on its hinge: swings inward into the hallway
  const hinge = new T.Group(); hinge.position.set(-0.955, 0.13, 0); sc.add(hinge);
  pp(hinge, rbox(0.9, 2.0, 0.08, 0.03, 0.015), 0x8C8CF7, { pos: [0.45, 1.0, 0] });
  pp(hinge, rbox(0.56, 0.42, 0.03, 0.06, 0.01), C.glass, { pos: [0.45, 1.5, 0.045] });
  pp(hinge, rbox(0.56, 0.78, 0.02, 0.05, 0.008), 0x8C8CF7, { pos: [0.45, 0.62, 0.045] });
  pp(hinge, new T.SphereGeometry(0.05, 14, 10), C.cream, { pos: [0.8, 0.98, 0.075] });
  pp(hinge, new T.BoxGeometry(0.28, 0.03, 0.02), C.ink, { pos: [0.45, 1.13, 0.05], outline: false });
  const dg = new T.Mesh(new T.BoxGeometry(0.16, 0.025, 0.01), white); dg.position.set(0.32, 1.6, 0.064); dg.rotation.z = 0.5; hinge.add(dg);

  // mat, and the warm light that spills over it once the door is open
  pp(sc, rbox(0.92, 0.035, 0.48, 0.05, 0.012), C.red, { pos: [-0.5, 0.137, 0.32] });
  const helloTex = canvasTex(256, 64, x => {
    setStretch(x, 'ultra-condensed');
    x.fillStyle = '#FFF8E7'; x.font = `900 46px ${FONT.display}`; x.textAlign = 'center'; x.fillText('H E L L O', 128, 48);
  });
  scope.add(() => helloTex.dispose());
  const hello = new T.Mesh(new T.PlaneGeometry(0.6, 0.15), new T.MeshBasicMaterial({ map: helloTex, transparent: true, depthWrite: false }));
  hello.rotation.x = -Math.PI / 2; hello.position.set(-0.5, 0.157, 0.34); sc.add(hello);
  // a soft wedge of light, widening and fading as it leaves the doorway
  const spillTex = canvasTex(128, 128, (x, w, h) => {
    const g = x.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, 'rgba(255,236,160,0.95)'); g.addColorStop(1, 'rgba(255,236,160,0)');
    x.fillStyle = g; x.beginPath(); x.moveTo(w * 0.22, 0); x.lineTo(w * 0.78, 0); x.lineTo(w, h); x.lineTo(0, h); x.closePath(); x.fill();
  });
  scope.add(() => spillTex.dispose());
  const spillMat = new T.MeshBasicMaterial({ map: spillTex, transparent: true, opacity: 0, depthWrite: false });
  const spill = new T.Mesh(new T.PlaneGeometry(1.6, 0.7), spillMat);
  spill.rotation.x = -Math.PI / 2; spill.position.set(-0.45, 0.162, 0.37); spill.renderOrder = 2; sc.add(spill);

  // porch lantern on the side of the frame: off until someone comes to the door
  const lantern = new T.Group(); lantern.position.set(0.085, 1.72, 0.02); sc.add(lantern);
  pp(lantern, rbox(0.02, 0.2, 0.11, 0.008, 0.004), C.ink, { pos: [0.01, 0, 0], outline: false });           // wall plate
  pp(lantern, new T.BoxGeometry(0.12, 0.025, 0.025), C.ink, { pos: [0.07, 0.07, 0], outline: false });      // arm
  const LAMP_OFF = new T.Color(0x5E5648), LAMP_ON = new T.Color(0xFFFBE6);
  const lampMat = toon(0x5E5648, { emissive: new T.Color(0xFFF3B0), emissiveIntensity: 0 });
  pp(lantern, rbox(0.1, 0.13, 0.1, 0.012, 0.004), lampMat, { pos: [0.15, -0.02, 0] });                     // glass
  pp(lantern, rbox(0.13, 0.025, 0.13, 0.01, 0.004), C.ink, { pos: [0.15, 0.055, 0], outline: false });       // top band
  pp(lantern, rbox(0.12, 0.022, 0.12, 0.01, 0.004), C.ink, { pos: [0.15, -0.095, 0], outline: false });      // base
  const roof = new T.Mesh(new T.ConeGeometry(0.1, 0.07, 4), toon(C.ink)); roof.rotation.y = Math.PI / 4; roof.position.set(0.15, 0.1, 0); lantern.add(roof);
  const glowMat = new T.MeshBasicMaterial({ map: kit.glowTex, color: 0xFFFFFF, transparent: true, opacity: 0, depthWrite: false });
  const glow = new T.Mesh(new T.PlaneGeometry(0.7, 0.7), glowMat); glow.position.set(0.15, -0.02, 0.06); glow.renderOrder = 3; lantern.add(glow);

  // the driver: chunky toy figure, red uniform and cap (faces +z, then turned toward the door)
  const SKIN = 0xC98B5E, PANTS = 0x4A3826;
  const cr = new T.Group(); cr.position.set(0.5, 0.12, 0.46); cr.rotation.y = -0.55; sc.add(cr);   // three-quarters: toward the door and the viewer
  [-0.09, 0.09].forEach(x => {
    pp(cr, rbox(0.15, 0.4, 0.17, 0.05, 0.02), PANTS, { pos: [x, 0.28, 0] });
    pp(cr, rbox(0.17, 0.09, 0.27, 0.04, 0.02), C.ink, { pos: [x, 0.045, 0.04] });
  });
  const hips = new T.Group(); hips.position.y = 0.47; cr.add(hips);
  pp(hips, rbox(0.46, 0.44, 0.3, 0.1, 0.03), C.red, { pos: [0, 0.22, 0] });
  pp(hips, rbox(0.47, 0.055, 0.31, 0.03, 0.01), C.ink, { pos: [0, 0.04, 0], outline: false });
  pp(hips, rbox(0.1, 0.065, 0.02, 0.015, 0.005), C.cream, { pos: [0.11, 0.33, 0.155] });
  const head = new T.Group(); head.position.y = 0.66; hips.add(head);
  pp(head, new T.SphereGeometry(0.21, 24, 18), SKIN);
  [-1, 1].forEach(sd => pp(head, new T.SphereGeometry(0.05, 10, 8), SKIN, { pos: [sd * 0.205, -0.01, 0] }));
  [-0.075, 0.075].forEach(x => { const e = new T.Mesh(new T.SphereGeometry(0.027, 10, 8), toon(C.ink)); e.position.set(x, 0.015, 0.192); head.add(e); });
  const smile = new T.Mesh(new T.TorusGeometry(0.06, 0.014, 6, 14, Math.PI), toon(C.ink)); smile.rotation.z = Math.PI; smile.position.set(0, -0.06, 0.196); head.add(smile);
  pp(head, new T.SphereGeometry(0.22, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), C.red, { pos: [0, 0.035, 0] });
  pp(head, rbox(0.3, 0.035, 0.2, 0.06, 0.01), C.red, { pos: [0, 0.05, 0.2] });
  const capBadge = new T.Mesh(new T.SphereGeometry(0.036, 10, 8), toon(C.yellow)); capBadge.position.set(0, 0.17, 0.18); head.add(capBadge);
  const arms = [-1, 1].map(sd => {
    const sh = new T.Group(); sh.position.set(sd * 0.28, 0.38, 0); hips.add(sh);
    pp(sh, rbox(0.12, 0.36, 0.13, 0.05, 0.02), C.red, { pos: [0, -0.16, 0] });
    pp(sh, new T.SphereGeometry(0.066, 12, 10), SKIN, { pos: [0, -0.36, 0] });
    return sh;
  });
  const handAnchor = new T.Object3D(); handAnchor.position.set(0, 0.25, 0.37); hips.add(handAnchor);

  // the parcel: same kraft box, tape and TrackFlow label as the truck's cargo
  const parcel = new T.Group(); sc.add(parcel);
  pp(parcel, rbox(0.38, 0.3, 0.3, 0.03, 0.02), C.kraft);
  pp(parcel, new T.BoxGeometry(0.39 * 0.98, 0.012, 0.08), C.tape, { pos: [0, 0.152, 0], outline: false });
  const lab = new T.Mesh(new T.PlaneGeometry(0.2, 0.135), labelMat); lab.position.set(0, -0.01, 0.153); parcel.add(lab);
  const matPos = new T.Vector3(-0.47, 0.155 + 0.15, 0.42);                       // on the mat, right in front of the door

  // soft shadows
  const blob = (w: number, d: number) => { const m = new T.Mesh(new T.PlaneGeometry(w, d), shadowMat()); m.rotation.x = -Math.PI / 2; sc.add(m); return m; };
  const crShadow = blob(0.75, 0.42); crShadow.position.set(0.5, 0.125, 0.46);
  const pcShadow = blob(0.5, 0.3);

  /* Pose is a pure function of five 0..1 values:
       drop   bend, set the parcel on the mat, stand back up
       raise  lift the door-side arm to the door
       knock  three taps (the door rattles on each)
       open   the porch light comes on, the door swings open into the hallway
       wave   the near arm goes up and waves */
  const st = { drop: 0, raise: 0, knock: 0, open: 0, wave: 0 };
  const c01 = (v: number) => Math.min(1, Math.max(0, v));
  const io = (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * x);
  const backOut = (x: number) => { const c = 1.2; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  const hp = new T.Vector3();
  const draw = () => {
    const d = st.drop, bendT = c01(d / 0.85);
    hips.rotation.x = Math.sin(Math.PI * bendT) * 0.6;
    const release = io(c01((d - 0.6) / 0.3));
    const hold = -1.25 + 0.45 * Math.sin(Math.PI * bendT);
    arms.forEach(a => a.rotation.set(hold * (1 - release), 0, 0));
    // knock: door-side arm swings out to the door, taps three times
    const tap = Math.pow(Math.max(0, Math.sin(st.knock * Math.PI * 6)), 2);
    hips.rotation.z = 0.07 * io(st.raise) + 0.025 * tap;                    // leans in to knock
    if (st.raise > 0) arms[0].rotation.set(-0.35 * io(st.raise), 0, -1.5 * io(st.raise) - 0.22 * tap);
    // wave: near arm up, three waves, a little head tilt
    const wv = st.wave;
    const turn = io(c01(wv / 0.25));
    cr.rotation.y = -0.55 + 0.32 * turn;                                        // turns toward you to wave
    if (wv > 0) {
      const up = io(c01(wv / 0.18));
      arms[1].rotation.set(0, 0, up * 2.55 + (wv > 0.18 ? Math.sin((wv - 0.18) / 0.82 * Math.PI * 6) * 0.4 : 0));
      head.rotation.z = wv > 0.18 ? Math.sin((wv - 0.18) / 0.82 * Math.PI * 3) * 0.09 : 0;
    } else head.rotation.z = 0;
    head.rotation.y = -0.45 * io(Math.max(st.raise * (1 - st.open), st.open * 0.8)) * (1 - turn);   // looks at the door while knocking and as it opens, then at you
    // the light comes on first, then the door swings inward (about 65°, settling against its stop)
    const lit = io(c01(st.open / 0.25));
    lampMat.color.lerpColors(LAMP_OFF, LAMP_ON, lit); lampMat.emissiveIntensity = 0.7 * lit; glowMat.opacity = 0.75 * lit;
    const sw = c01((st.open - 0.15) / 0.85);
    hinge.rotation.y = 0.04 * tap + 1.12 * backOut(sw);
    spillMat.opacity = 0.6 * io(sw);
    // the parcel: from his hands to the mat
    cr.updateMatrixWorld(true); handAnchor.getWorldPosition(hp);
    const pk = io(c01((d - 0.15) / 0.55));
    parcel.position.lerpVectors(hp, matPos, pk);
    parcel.rotation.set(0, -0.55 * (1 - pk) - 0.15 * pk, 0);
    pcShadow.position.set(parcel.position.x, 0.16, parcel.position.z);
    const ps = 0.35 + 0.65 * pk; pcShadow.scale.set(ps, ps, 1); (pcShadow.material as T.MeshBasicMaterial).opacity = 0.3 + 0.7 * pk;
    pr.render(sc, cam);
  };
  kit.whenFonts([`900 46px ${FONT.display}`], () => { helloTex.redraw(); draw(); });

  const buf = new T.Vector2();
  const size = () => {
    const w = cv.clientWidth, h = cv.clientHeight;
    if (!w || !h) return;
    pr.setSize(w, h, false); pr.getDrawingBufferSize(buf); om.uniforms.resolution.value.copy(buf);
    cam.aspect = w / h; cam.updateProjectionMatrix(); draw();
  };
  scope.on(window, 'resize', size);
  size();

  const done = document.getElementById('door-done')!, doneTick = $<SVGPathElement>('.hc-tick', done)!;
  const knockNote = document.getElementById('door-knock')!;
  let tl: gsap.core.Timeline | null = null;
  const reset = () => {
    if (tl) { tl.kill(); tl = null; }
    (Object.keys(st) as Array<keyof typeof st>).forEach(k => { st[k] = 0; });
    gsap.set([done, knockNote], { autoAlpha: 0 }); doneTick.style.strokeDashoffset = '1';
    draw();
  };
  reset();
  scope.add(() => { tl?.kill(); gsap.set([done, knockNote], { clearProps: 'all' }); doneTick.style.strokeDashoffset = ''; });

  return {
    play() {
      reset();
      tl = gsap.timeline({ onUpdate: draw, onComplete: draw })
        // 1. set the parcel down in front of the door
        .to(st, { drop: 1, duration: 1.5, ease: 'none' }, 0.25)
        // 2. knock, knock, knock
        .to(st, { raise: 1, duration: 0.35, ease: 'none' }, 1.85)
        .fromTo(knockNote, { autoAlpha: 0, scale: 0.6, rotation: -6 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.35, ease: 'back.out(2.6)' }, 2.15)
        .to(st, { knock: 1, duration: 1.05, ease: 'none' }, 2.2)
        .to(st, { raise: 0, duration: 0.35, ease: 'none' }, 3.3)
        .to(knockNote, { autoAlpha: 0, duration: 0.3 }, 3.75)
        // 3. the porch light comes on and the door swings open
        .to(st, { open: 1, duration: 1.3, ease: 'none' }, 3.5)
        .fromTo(done, { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(2.4)' }, 4.3)
        .fromTo(doneTick, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.35, ease: 'power2.out' }, 4.5)
        // 4. and he turns to you and waves
        .to(st, { wave: 1, duration: 2.2, ease: 'none' }, 4.4);
    },
    reset,
    final() { reset(); Object.assign(st, { drop: 1, raise: 0, knock: 1, open: 1, wave: 0.18 }); gsap.set(done, { autoAlpha: 1 }); doneTick.style.strokeDashoffset = '0'; draw(); },
  };
}
