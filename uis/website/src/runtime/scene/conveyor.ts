import * as T from 'three';
import { gsap } from 'gsap';
import type { Scope } from '../scope';
import type { BeltApi } from '../choreography';
import { TEAM } from '../../content/team';
import { C, FONT, disposeScene, makeRenderer, type Kit, type PartOpts, type CanvasTex } from './kit';

/** Parcel sizes [width, height] per person, so the line looks hand-packed rather than uniform. */
const SIZES: Array<[number, number]> = [[1.3, 0.92], [1.15, 0.82], [1.36, 1.0], [1.2, 0.86], [1.12, 0.8], [1.32, 0.95], [1.24, 0.88]];

/**
 * Leadership conveyor: a toy belt carrying one parcel per person, left → right, forever.
 * Same toon + ink kit as the truck. Own renderer inside the section; it only draws while it's on screen and moving.
 */
export function buildConveyor(scope: Scope, kit: Kit): BeltApi | null {
  const host = document.getElementById('belt-scene');
  if (!host) return null;
  const { DPR, part, rbox, toon, canvasTex, setStretch, roundPath, shadowMat } = kit;
  const cv = document.createElement('canvas'); cv.className = 'belt-canvas'; cv.setAttribute('aria-hidden', 'true');
  host.insertBefore(cv, host.firstChild);
  const br = makeRenderer(cv, DPR);
  if (!br) { cv.remove(); return null; }
  host.classList.add('belt-3d');
  const sc = new T.Scene();
  scope.add(() => { disposeScene(sc); br.dispose(); br.forceContextLoss(); cv.remove(); host.classList.remove('belt-3d'); });

  sc.add(new T.AmbientLight(0xffffff, 0.62));
  const key = new T.DirectionalLight(0xffffff, 0.78); key.position.set(-3, 7, 8); sc.add(key);
  const cam = new T.PerspectiveCamera(28, 2, 0.1, 80);
  const om = kit.outlineFor();
  const bp = (parent: T.Object3D, geo: T.BufferGeometry, mat: number | T.Material, o: PartOpts = {}) => part(parent, geo, mat, { ...o, om });

  // ---------- shipping label, drawn in the site's type ----------
  const wrapText = (x: CanvasRenderingContext2D, text: string, maxW: number) => {
    const words = text.split(' '), lines: string[] = []; let line = '';
    words.forEach(w => { const t = line ? line + ' ' + w : w; if (x.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t; });
    if (line) lines.push(line);
    return lines;
  };
  const makeLabel = (i: number, { name, role, base, color }: (typeof TEAM)[number]) => canvasTex(1024, 717, x => {
    x.setTransform(1.6, 0, 0, 1.6, 0, 0); const w = 640, h = 448;     // drawn at 1.6x so it stays crisp up close
    roundPath(x, 10, 10, w - 20, h - 20, 26); x.fillStyle = '#FFF8E7'; x.fill();
    x.save(); roundPath(x, 10, 10, w - 20, h - 20, 26); x.clip(); x.fillStyle = color; x.fillRect(0, 0, w, 104); x.restore();
    x.lineWidth = 12; x.strokeStyle = '#2B1D0E'; roundPath(x, 10, 10, w - 20, h - 20, 26); x.stroke();
    x.beginPath(); x.moveTo(10, 104); x.lineTo(w - 10, 104); x.lineWidth = 7; x.stroke();
    const onDark = color === '#FF1F2F';
    x.fillStyle = onDark ? '#fff' : '#2B1D0E'; x.strokeStyle = x.fillStyle;
    x.beginPath(); x.arc(44, 78, 11, 0, 7); x.fill(); x.beginPath(); x.arc(86, 36, 11, 0, 7); x.fill();
    x.setLineDash([8, 6]); x.lineWidth = 5.5; x.beginPath(); x.moveTo(44, 78); x.bezierCurveTo(44, 46, 86, 70, 86, 36); x.stroke(); x.setLineDash([]);
    setStretch(x, 'expanded'); x.font = `800 50px ${FONT.wide}`; x.textBaseline = 'alphabetic'; x.fillText('TrackFlow', 110, 74);
    setStretch(x, 'normal'); x.font = `600 22px ${FONT.mono}`; x.textAlign = 'right'; x.fillText('SHIP TO', w - 36, 52); x.fillText(`No. 0${i + 1}`, w - 36, 82); x.textAlign = 'left';
    // name: as big as fits
    x.fillStyle = '#2B1D0E'; setStretch(x, 'ultra-condensed');
    let fs = 80; x.font = `900 ${fs}px ${FONT.display}`;
    while (x.measureText(name.toUpperCase()).width > w - 72 && fs > 40) { fs -= 2; x.font = `900 ${fs}px ${FONT.display}`; }
    x.fillText(name.toUpperCase(), 36, 104 + 20 + fs * 0.78);
    let y = 104 + 20 + fs * 0.78 + 52;
    setStretch(x, 'normal'); x.font = `600 46px ${FONT.mono}`;
    wrapText(x, role.toUpperCase(), w - 72).slice(0, 2).forEach(l => { x.fillText(l, 36, y); y += 50; });
    if (base) { x.font = `600 31px ${FONT.mono}`; x.fillText('BASE · ' + base.toUpperCase(), 36, y + 2); }
    // barcode + code
    let bx = 36, sd = 7 + i * 13; while (bx < w - 200) { sd = (sd * 16807) % 2147483647; const bw = 2 + (sd % 3) * 2; x.fillRect(bx, h - 62, bw, 30); bx += bw + 3 + (sd % 2) * 3; }
    x.font = `600 22px ${FONT.mono}`; x.textAlign = 'right'; x.fillText(`TF-TEAM-0${i + 1}`, w - 36, h - 38); x.textAlign = 'left'; x.setTransform(1, 0, 0, 1, 0, 0);
  });
  const labels: CanvasTex[] = TEAM.map((p, i) => makeLabel(i, p));
  scope.add(() => labels.forEach(t => t.dispose()));

  // ---------- the conveyor ----------
  const BELT_Y = 0.96, SPACING = 1.95;
  const frameG = new T.Group(); sc.add(frameG);
  let L = 30;
  const beltTex = canvasTex(128, 64, x => {
    x.fillStyle = '#3B2B1C'; x.fillRect(0, 0, 128, 64);
    x.fillStyle = '#4E3B28'; x.fillRect(0, 0, 18, 64);
    x.fillStyle = 'rgba(0,0,0,0.25)'; x.fillRect(18, 0, 4, 64);
  });
  scope.add(() => beltTex.dispose());
  beltTex.wrapS = T.RepeatWrapping; beltTex.wrapT = T.RepeatWrapping;
  const beltMat = toon(0xffffff, { map: beltTex });
  const rollers: T.Group[] = [];
  const buildFrame = () => {
    while (frameG.children.length) { const c = frameG.children[0]; frameG.remove(c); if (c !== undefined) disposeGeometry(c); }
    rollers.length = 0;
    const belt = new T.Mesh(new T.BoxGeometry(L, 0.12, 1.5), beltMat); belt.position.y = BELT_Y - 0.06; frameG.add(belt);
    beltTex.repeat.set(L / 0.42, 1);
    [0.82, -0.82].forEach(z => bp(frameG, rbox(L, 0.24, 0.13, 0.04, 0.02), C.red, { pos: [0, BELT_Y - 0.04, z], outline: false }));
    // ink top edge on the front rail so it reads as a drawn line
    bp(frameG, new T.BoxGeometry(L, 0.02, 0.02), C.ink, { pos: [0, BELT_Y + 0.085, 0.89], outline: false });
    bp(frameG, new T.BoxGeometry(L, 0.02, 0.02), C.ink, { pos: [0, BELT_Y - 0.165, 0.89], outline: false });
    const capGeo = new T.CylinderGeometry(0.065, 0.065, 0.03, 16); capGeo.rotateX(Math.PI / 2);
    const barGeo = new T.BoxGeometry(0.1, 0.022, 0.035);
    for (let x = -L / 2 + 0.4; x < L / 2; x += 0.75) {
      const g = new T.Group(); g.position.set(x, BELT_Y - 0.04, 0.9); frameG.add(g);
      bp(g, capGeo, C.steel); bp(g, barGeo, C.ink, { outline: false, pos: [0, 0, 0.012] }); rollers.push(g);
    }
    for (let x = -L / 2 + 1.2; x < L / 2; x += 2.6) {
      [0.72, -0.72].forEach(z => {
        bp(frameG, rbox(0.12, BELT_Y - 0.12, 0.12, 0.03, 0.015), C.ink, { pos: [x, (BELT_Y - 0.12) / 2, z], outline: false });
        bp(frameG, rbox(0.26, 0.05, 0.22, 0.02, 0.01), C.ink, { pos: [x, 0.025, z], outline: false });
      });
      bp(frameG, new T.BoxGeometry(0.06, 0.06, 1.44), C.ink, { pos: [x, 0.32, 0], outline: false });
      const bolt = new T.Mesh(new T.SphereGeometry(0.035, 10, 8), toon(C.yellow)); bolt.position.set(x + 0.35, BELT_Y - 0.04, 0.895); frameG.add(bolt);
    }
    const sh = new T.Mesh(new T.PlaneGeometry(L, 2.2), shadowMat(0.8));
    sh.rotation.x = -Math.PI / 2; sh.position.y = 0.004; frameG.add(sh);
  };

  // ---------- parcels ----------
  const proto = TEAM.map((_, i) => {
    const [w, h] = SIZES[i % SIZES.length], d = 0.9;
    const g = new T.Group();
    bp(g, rbox(w, h, d, 0.04, 0.025), C.kraft, { pos: [0, h / 2, 0] });
    bp(g, new T.BoxGeometry(w * 0.98, 0.012, 0.16), C.tape, { pos: [0, h + 0.004, 0], outline: false });
    bp(g, new T.BoxGeometry(0.16, 0.1, 0.012), C.tape, { pos: [0, h - 0.05, d / 2 + 0.004], outline: false });
    const lw = w * 0.86, lh = lw * 448 / 640;
    const lab = new T.Mesh(new T.PlaneGeometry(lw, lh), toon(0xffffff, { map: labels[i] }));
    lab.position.set(0, Math.min(h * 0.46, h - lh / 2 - 0.12), d / 2 + 0.008); lab.rotation.z = (i % 2 ? 1 : -1) * 0.018; g.add(lab);
    return g;
  });
  interface Box { g: T.Object3D; slot: number; drop: number }
  const boxes: Box[] = [];
  let total = TEAM.length * SPACING;
  const layout = (copies: number) => {
    boxes.forEach(b => sc.remove(b.g)); boxes.length = 0;
    for (let c = 0; c < copies; c++) TEAM.forEach((_, i) => {
      const g = c === 0 ? proto[i] : proto[i].clone(true);
      g.rotation.y = ((i * 7 + c * 3) % 5 - 2) * 0.025;
      sc.add(g); boxes.push({ g, slot: c * TEAM.length + i, drop: 0 });
    });
    total = boxes.length * SPACING;
  };

  // ---------- motion state ----------
  const st = { off: 0, speed: 0, hover: false, drag: false, live: false, dropped: false, dropping: false };
  const SPEED = 0.55;                                  // world units per second (≈ 45px/s on desktop)
  let visHalf = 6;
  const place = () => {
    boxes.forEach(b => {
      const x = (((b.slot * SPACING + st.off) % total) + total) % total - total / 2;
      const bump = Math.abs(Math.sin(x / 0.75 * Math.PI)) * 0.012;
      b.g.position.set(x, BELT_Y + bump + b.drop * 2.6, 0.02);
      b.g.rotation.z = Math.sin(x * 3.1) * 0.012 + b.drop * 0.4 * (b.slot % 2 ? 1 : -1);
    });
    rollers.forEach(r => { r.rotation.z = -st.off / 0.065; });
    beltTex.offset.x = -st.off / 0.42;
  };
  const draw = () => { place(); br.render(sc, cam); };
  kit.whenFonts([`900 80px ${FONT.display}`, `600 46px ${FONT.mono}`, `600 31px ${FONT.mono}`], () => { labels.forEach(t => t.redraw()); draw(); });

  const buf = new T.Vector2();
  const size = () => {
    const w = cv.clientWidth, h = cv.clientHeight;
    if (!w || !h) return;
    br.setSize(w, h, false); br.getDrawingBufferSize(buf); om.uniforms.resolution.value.copy(buf);
    cam.aspect = w / h;
    const visW = w < 640 ? 2.9 : w < 1024 ? 5.6 : 8.2;    // how much belt is on screen (closer = bigger labels)
    const dist = (visW / 2) / (Math.tan(T.MathUtils.degToRad(cam.fov / 2)) * cam.aspect);
    cam.position.set(0, 1.25 + dist * 0.15, dist); cam.lookAt(0, 1.0, 0);
    cam.updateProjectionMatrix();
    visHalf = visW / 2 + 1;
    L = visW + 8; buildFrame();
    const copies = Math.max(1, Math.ceil((visW + 2 * SPACING + 2) / (TEAM.length * SPACING)));
    if (copies * TEAM.length !== boxes.length) layout(copies);
    draw();
  };

  // ---------- loop: eases to its target speed; stops drawing once settled or off screen ----------
  let on = false, visible = false, last = 0;
  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now;
    const target = st.live && !st.hover && !st.drag ? 1 : 0;
    st.speed += (target - st.speed) * Math.min(1, dt * 3);
    st.off += st.speed * SPEED * dt;
    draw();
    const settled = target === 0 && st.speed < 0.002 && !st.dropping;
    on = visible && !settled;
    if (on) scope.raf(frame);
  };
  const kick = () => { if (!on && visible) { on = true; last = performance.now(); scope.raf(frame); } };
  scope.observe(([en]) => { visible = en.isIntersecting; kick(); }, cv);
  // hover / focus pause, drag to scroll
  scope.on(host, 'pointerenter', () => { st.hover = true; });
  scope.on(host, 'pointerleave', () => { st.hover = false; kick(); });
  scope.on(host, 'focusin', () => { st.hover = true; });
  scope.on(host, 'focusout', () => { st.hover = false; kick(); });
  let dragX = 0;
  scope.on(cv, 'pointerdown', e => { st.drag = true; dragX = e.clientX; cv.setPointerCapture(e.pointerId); });
  scope.on(cv, 'pointermove', e => {
    if (!st.drag) return;
    const unitsPerPx = (visHalf - 1) * 2 / cv.clientWidth;
    st.off += (e.clientX - dragX) * unitsPerPx; dragX = e.clientX; draw();
  });
  const endDrag = () => { st.drag = false; kick(); };
  scope.on(cv, 'pointerup', endDrag); scope.on(cv, 'pointercancel', endDrag);
  scope.on(window, 'resize', size);
  size();

  let dropTl: gsap.core.Timeline | null = null;
  scope.add(() => dropTl?.kill());
  const api: BeltApi = {
    mode(m) {
      if (m === 'still') { st.live = false; boxes.forEach(b => { b.drop = 0; }); st.dropped = true; draw(); }
      if (m === 'live') { st.live = true; if (!st.dropped) boxes.forEach(b => { b.drop = 1; }); draw(); kick(); }
    },
    drop() {
      if (st.dropped) return;
      st.dropped = true; st.dropping = true;
      // parcels land on the belt one after another, left to right as you see them
      const order = boxes.slice().sort((a, b) => a.g.position.x - b.g.position.x);
      dropTl = gsap.timeline({ onUpdate: draw, onComplete: () => { st.dropping = false; } });
      order.forEach((b, k) => dropTl!.to(b, { drop: 0, duration: 0.75, ease: 'bounce.out' }, 0.15 + k * 0.09));
      kick();
    },
  };
  return api;
}

/** Geometry only: materials in the belt frame are shared between rebuilds. */
function disposeGeometry(o: T.Object3D) {
  o.traverse(c => (c as T.Mesh).geometry?.dispose());
}
