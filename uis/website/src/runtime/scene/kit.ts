import * as T from 'three';
import type { Scope } from '../scope';

/** Brand palette for the 3D toys (kept separate from the CSS tokens on purpose: the toys never re-theme). */
export const C = { red: 0xFF1F2F, cream: 0xFFF8E7, ink: 0x2B1D0E, kraft: 0xD9A56C, tape: 0xF3E7C9, glass: 0x86CDEB, steel: 0xDCE1E4, yellow: 0xFFFF46, lamp: 0xFFF6C8 };

/** Canvas font stacks: the self-hosted variable Archivo first, then fallbacks with similar widths. */
export const FONT = {
  display: '"Archivo Variable", Archivo, "Arial Narrow", sans-serif',
  wide: '"Archivo Variable", Archivo, "Arial Black", sans-serif',
  mono: '"IBM Plex Mono", ui-monospace, monospace',
};

export type Vec3 = [number, number, number];
export interface PartOpts { pos?: Vec3; rot?: Vec3; outline?: boolean; om?: T.Material }
export interface CanvasTex extends T.CanvasTexture { redraw(): void }
type Draw = (x: CanvasRenderingContext2D, w: number, h: number) => void;

export type Kit = ReturnType<typeof createKit>;

/**
 * The toy kit every 3D scene is built from: a 3-step toon ramp, a screen-space ink outline that
 * matches the site's 2.5px strokes, rounded "toy" boxes, and printed graphics drawn on canvases
 * in the site's own type. Shared textures live here and are disposed with the kit.
 */
export function createKit(scope: Scope, DPR: number) {
  const owned: Array<{ dispose(): void }> = [];
  const keep = <O extends { dispose(): void }>(o: O) => { owned.push(o); return o; };

  const ramp = keep(new T.DataTexture(new Uint8Array([105, 185, 255]), 3, 1, T.RedFormat));
  ramp.minFilter = ramp.magFilter = T.NearestFilter;
  ramp.needsUpdate = true;
  const toon = (c: number, o: T.MeshToonMaterialParameters = {}) => new T.MeshToonMaterial({ color: c, gradientMap: ramp, ...o });

  /* ---------- Ink outline: an inverted hull pushed out in SCREEN space, so the line weight matches
     the site's 2.5px strokes at any distance. Hull normals are averaged per corner so boxes don't crack. ---------- */
  const outlineMat = keep(new T.ShaderMaterial({
    uniforms: { thickness: { value: 2.5 * DPR }, resolution: { value: new T.Vector2(1, 1) }, color: { value: new T.Color(C.ink) } },
    vertexShader: `attribute vec3 oNormal; uniform float thickness; uniform vec2 resolution;
      void main() {
        vec4 clip = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        vec3 vn = normalize(normalMatrix * oNormal);
        vec2 dir = (projectionMatrix * vec4(vn, 0.0)).xy;
        float l = length(dir);
        dir = l > 1e-5 ? dir / l : vec2(0.0);
        clip.xy += dir * thickness * 2.0 / resolution * clip.w;
        gl_Position = clip;
      }`,
    fragmentShader: `uniform vec3 color; void main() { gl_FragColor = vec4(color, 1.0); }`,
    side: T.BackSide,
  }));
  /** A copy of the outline material for another renderer (each canvas has its own resolution). */
  const outlineFor = () => { const om = outlineMat.clone(); om.uniforms.thickness.value = 2.5 * DPR; return om; };

  const withOutlineNormals = (geo: T.BufferGeometry) => {
    if (geo.getAttribute('oNormal')) return geo;
    if (!geo.getAttribute('normal')) geo.computeVertexNormals();
    const p = geo.getAttribute('position') as T.BufferAttribute, n = geo.getAttribute('normal') as T.BufferAttribute;
    const sums = new Map<string, [number, number, number]>(), keys: string[] = new Array(p.count);
    for (let i = 0; i < p.count; i++) {
      const k = `${Math.round(p.getX(i) * 1e3)},${Math.round(p.getY(i) * 1e3)},${Math.round(p.getZ(i) * 1e3)}`;
      keys[i] = k;
      const a = sums.get(k) ?? [0, 0, 0];
      a[0] += n.getX(i); a[1] += n.getY(i); a[2] += n.getZ(i);
      sums.set(k, a);
    }
    const out = new Float32Array(p.count * 3);
    for (let i = 0; i < p.count; i++) { const a = sums.get(keys[i])!, l = Math.hypot(a[0], a[1], a[2]) || 1; out[i * 3] = a[0] / l; out[i * 3 + 1] = a[1] / l; out[i * 3 + 2] = a[2] / l; }
    geo.setAttribute('oNormal', new T.BufferAttribute(out, 3));
    return geo;
  };

  /** One toy part: the mesh plus (optionally) its ink hull. A number material is a toon colour. */
  const part = (parent: T.Object3D, geo: T.BufferGeometry, mat: number | T.Material, { pos, rot, outline = true, om = outlineMat }: PartOpts = {}) => {
    const g = new T.Group();
    g.add(new T.Mesh(geo, typeof mat === 'number' ? toon(mat) : mat));
    if (outline) g.add(new T.Mesh(withOutlineNormals(geo), om));
    if (pos) g.position.set(...pos);
    if (rot) g.rotation.set(...rot);
    parent.add(g);
    return g;
  };
  const rrect = (w: number, h: number, r: number) => {
    const s = new T.Shape(), x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r);
    s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    return s;
  };
  /** A toy-like rounded box with exact outer size w × h × d. */
  const rbox = (w: number, h: number, d: number, r = 0.05, bev = 0.035) => {
    const g = new T.ExtrudeGeometry(rrect(w - 2 * bev, h - 2 * bev, Math.min(r, (Math.min(w, h) - 2 * bev) / 2 - 0.001)), { depth: d - 2 * bev, bevelEnabled: true, bevelThickness: bev, bevelSize: bev, bevelSegments: 3, curveSegments: 6 });
    g.center();
    return g;
  };

  /* ---------- Printed graphics, drawn on canvases in the site's own type and colours ---------- */
  const canvasTex = (w: number, h: number, draw: Draw) => {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const t = new T.CanvasTexture(c) as CanvasTex;
    t.anisotropy = 4;
    t.redraw = () => { const x = c.getContext('2d')!; x.clearRect(0, 0, w, h); draw(x, w, h); t.needsUpdate = true; };
    t.redraw();
    return t;
  };
  const setStretch = (x: CanvasRenderingContext2D, v: CanvasFontStretch) => { try { x.fontStretch = v; } catch { /* older browsers */ } };
  const roundPath = (x: CanvasRenderingContext2D, X: number, Y: number, W: number, H: number, r: number) => {
    x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + W, Y, X + W, Y + H, r); x.arcTo(X + W, Y + H, X, Y + H, r); x.arcTo(X, Y + H, X, Y, r); x.arcTo(X, Y, X + W, Y, r); x.closePath();
  };
  /** Redraw canvas graphics once the given fonts have loaded (canvas text doesn't reflow on its own). */
  const whenFonts = (specs: string[], fn: () => void) => {
    scope.then(document.fonts?.ready.then(() => Promise.all(specs.map(s => document.fonts.load(s)))), fn);
  };

  // shipping label for the cargo box: same label as the footer parcels, with the real tagline
  const labelTex = keep(canvasTex(512, 344, (x, w, h) => {
    roundPath(x, 8, 8, w - 16, h - 16, 26); x.fillStyle = '#FFF8E7'; x.fill();
    x.save(); roundPath(x, 8, 8, w - 16, h - 16, 26); x.clip(); x.fillStyle = '#FF1F2F'; x.fillRect(0, 0, w, 118); x.restore();
    x.lineWidth = 12; x.strokeStyle = '#2B1D0E'; roundPath(x, 8, 8, w - 16, h - 16, 26); x.stroke();
    x.beginPath(); x.moveTo(8, 118); x.lineTo(w - 8, 118); x.lineWidth = 7; x.stroke();
    // logo mark + wordmark (white on red, like the navbar)
    x.fillStyle = '#fff'; x.strokeStyle = '#fff';
    x.beginPath(); x.arc(46, 88, 12, 0, 7); x.fill(); x.beginPath(); x.arc(94, 40, 12, 0, 7); x.fill();
    x.setLineDash([9, 7]); x.lineWidth = 6; x.beginPath(); x.moveTo(46, 88); x.bezierCurveTo(46, 50, 94, 78, 94, 40); x.stroke(); x.setLineDash([]);
    setStretch(x, 'expanded'); x.font = `800 60px ${FONT.wide}`; x.textBaseline = 'alphabetic';
    x.fillText('TrackFlow', 124, 86);
    // tagline in the condensed display voice
    setStretch(x, 'ultra-condensed'); x.fillStyle = '#2B1D0E'; x.font = `900 70px ${FONT.display}`;
    x.fillText('FROM CLICK', 30, 194); x.fillText('TO DOORSTEP', 30, 262);
    setStretch(x, 'condensed'); x.font = `800 24px ${FONT.display}`;
    x.fillText('LOS ANGELES · ZARAGOZA', 30, 310);
    let bx = 352, s = 9; while (bx < 478) { const bw = 2 + ((s = (s * 7 + 3) % 11) % 3) * 2; x.fillRect(bx, 270, bw, 50); bx += bw + 3 + (s % 2) * 2; }
  }));
  const labelMat = keep(toon(0xffffff, { map: labelTex }));
  const treadTex = keep(canvasTex(64, 64, x => {
    x.fillStyle = '#2B1D0E';
    x.beginPath(); x.moveTo(4, 42); x.lineTo(32, 16); x.lineTo(60, 42); x.lineTo(60, 56); x.lineTo(32, 30); x.lineTo(4, 56); x.closePath(); x.fill();
  }));
  treadTex.wrapS = T.ClampToEdgeWrapping; treadTex.wrapT = T.RepeatWrapping;
  const puffTex = keep(canvasTex(128, 128, x => {
    const blobs = [[64, 72, 32], [38, 78, 21], [90, 76, 23], [60, 46, 23], [82, 52, 15]];
    x.fillStyle = '#2B1D0E'; blobs.forEach(([cx, cy, r]) => { x.beginPath(); x.arc(cx, cy, r + 5.5, 0, 7); x.fill(); });
    x.fillStyle = '#FFF8E7'; blobs.forEach(([cx, cy, r]) => { x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill(); });
    x.fillStyle = 'rgba(43,29,14,0.13)'; blobs.forEach(([cx, cy, r]) => { x.beginPath(); x.arc(cx + r * 0.28, cy + r * 0.3, r * 0.55, 0, 7); x.fill(); });
  }));
  const glowTex = keep(canvasTex(64, 64, x => {
    const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,252,220,0.95)'); g.addColorStop(0.35, 'rgba(255,248,170,0.55)'); g.addColorStop(1, 'rgba(255,240,120,0)');
    x.fillStyle = g; x.fillRect(0, 0, 64, 64);
  }));
  const shadowTex = keep(canvasTex(128, 64, x => {
    // an ellipse that fades to nothing on every edge (drawn as a circle, squashed)
    x.setTransform(1, 0, 0, 0.5, 0, 0);
    const g = x.createRadialGradient(64, 64, 0, 64, 64, 62);
    g.addColorStop(0, 'rgba(43,29,14,0.34)'); g.addColorStop(0.6, 'rgba(43,29,14,0.27)'); g.addColorStop(0.82, 'rgba(43,29,14,0.08)'); g.addColorStop(1, 'rgba(43,29,14,0)');
    x.fillStyle = g; x.fillRect(0, 0, 128, 128);
    x.setTransform(1, 0, 0, 1, 0, 0);
  }));
  const white = keep(new T.MeshBasicMaterial({ color: 0xffffff }));
  const shadowMat = (opacity = 1) => new T.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity });

  scope.add(() => owned.forEach(o => o.dispose()));

  return {
    DPR, ramp, toon, outlineMat, outlineFor, part, rbox, canvasTex, setStretch, roundPath, whenFonts,
    labelTex, labelMat, treadTex, puffTex, glowTex, shadowTex, shadowMat, white,
  };
}

/** Free a scene's geometries, materials and their maps (shared kit textures are freed by the kit). */
export function disposeScene(root: T.Object3D) {
  root.traverse(o => {
    const m = o as T.Mesh;
    m.geometry?.dispose();
    const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
    mats.forEach(mat => mat.dispose());
  });
}

/** A renderer that never throws: returns null where WebGL isn't available. */
export function makeRenderer(canvas: HTMLCanvasElement, DPR: number) {
  try {
    const r = new T.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
    r.setPixelRatio(DPR);
    r.setClearColor(0x000000, 0);
    return r;
  } catch {
    return null;
  }
}
