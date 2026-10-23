import { gsap } from 'gsap';
import type { Scope } from './scope';
import { $, $$, $id } from './dom';

/* Navbar tape shape: serrated ends, like tape torn on a dispenser.
   R = px width laid so far (animation); null = full width (static CSS) */
const TEETH = 8, DEPTH = 5, NAV_H = 64;
export const tapeClip = (R: number | null) => {
  if (R !== null && R < DEPTH * 2.5) return 'inset(0 100% 0 0)';
  const xr = (off: number) => (R === null ? `calc(100% - ${off}px)` : `${(R - off).toFixed(1)}px`);
  const pts = [`${DEPTH}px 0px`];
  for (let i = 0; i <= TEETH * 2; i++) pts.push(`${xr(i % 2 ? 0 : DEPTH)} ${(i * NAV_H / (TEETH * 2)).toFixed(2)}px`);
  for (let i = TEETH * 2; i >= 0; i--) pts.push(`${i % 2 ? 0 : DEPTH}px ${(i * NAV_H / (TEETH * 2)).toFixed(2)}px`);
  return `polygon(${pts.join(', ')})`;
};

const c01 = (v: number) => Math.min(1, Math.max(0, v));
const seg = (t: number, [a, b]: readonly [number, number]) => c01((t - a) / (b - a));
const out2 = (x: number) => 1 - (1 - x) * (1 - x), in2 = (x: number) => x * x;
const inOut = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
const PH = { enter: [0, 0.13], lay: [0.15, 0.69], tear: [0.69, 0.72], exit: [0.72, 0.85], write: 0.74, line: [0.95, 1] } as const;

/**
 * Tape gun lays the navbar.
 * Every frame is computed from one number: how far the intro has scrolled (t = 0..1 of the tape step).
 * No nested tweens hold state, so reloads, fast scrolling, jumping back and late-loading assets
 * can't leave the gun stranded. Phases (fractions of t):
 *   enter 0–.13   gun slides in from the left at the navbar's height
 *   lay   .15–.69 it rolls right; the tape left behind IS the navbar; the roll spins
 *   tear  .69–.72 it snaps up on its teeth
 *   exit  .72–.85 it lifts off the page and away
 *   write .74–.97 the links are written on the tape, one after another
 *   line  .95–1   the current-section underline appears
 */
export function createTapeGun(scope: Scope) {
  const root = document.documentElement;
  const navLayers = gsap.utils.toArray<HTMLElement>('.rg-nav');
  const navFace = $<HTMLElement>('.rg-nav.rg-face')!;
  const navShadow = $<HTMLElement>('.rg-nav-shadow')!;
  const navList = $id('nav-list');
  const disp = $id('dispenser');
  const dpBody = $<HTMLElement>('.dp-body', disp)!;
  const seams = $$<SVGLineElement>('#dp-seams line', disp);
  const inks = $$('#nav-list .ink, #mobile-menu .ink');
  const navBox = () => { const b = navFace.getBoundingClientRect(); return { left: b.left, W: b.width }; };
  const spin = (R: number) => {
    const ph = R / 32;
    seams.forEach((l, i) => {
      const th = ph + i * Math.PI / 3, c = Math.cos(th), x = (52 + 32 * Math.sin(th)).toFixed(1);
      l.setAttribute('x1', x); l.setAttribute('x2', x);
      l.setAttribute('stroke-opacity', c > 0 ? (0.15 + 0.45 * c).toFixed(2) : '0');
    });
  };

  let tapeT: number | null = null;
  const draw = (raw: number) => {
    const t = c01(raw);
    tapeT = t;
    root.dataset.tapeLive = '1';
    root.classList.remove('tf-intro');
    const { left, W } = navBox();
    // the tape (navbar)
    const r = inOut(seg(t, PH.lay)), R = r * W, done = r >= 0.999;
    const cp = done ? '' : tapeClip(R);
    navLayers.forEach(el => { el.style.clipPath = cp; });
    navShadow.style.transform = done ? '' : `scaleX(${r.toFixed(4)})`;
    navFace.inert = !done;
    // the gun: only on screen between entering and lifting away
    const show = t > 0.0005 && t < PH.exit[1];
    disp.style.visibility = show ? 'visible' : 'hidden';
    if (show) {
      const e = out2(seg(t, PH.enter));
      const x = t < PH.lay[0] ? -200 + (left - 4 + 200) * e : left + R - 4;
      disp.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
      spin(t < PH.lay[0] ? e * 60 : R);
      const k = out2(seg(t, PH.tear)), q = in2(seg(t, PH.exit));
      dpBody.style.transform = `translate(${(90 * q).toFixed(1)}px, ${(-5 * k - 85 * q).toFixed(1)}px) rotate(${(-12 * k + 30 * q).toFixed(2)}deg) scale(${(1 + 0.18 * q).toFixed(3)})`;
      dpBody.style.opacity = (1 - q).toFixed(3);
    }
    // the marker: each link written left to right, staggered (desktop and mobile lists both)
    inks.forEach((el, i) => {
      const a = PH.write + (i % 4) * 0.05, w = seg(t, [a, a + 0.08]);
      el.style.clipPath = w >= 1 ? '' : `inset(-30% ${(100 - 110 * w).toFixed(1)}% -30% -10%)`;
    });
    navList.style.setProperty('--ul-ready', seg(t, PH.line).toFixed(3));
  };
  /** The finished navbar, no gun (reduced motion, or no intro). */
  const whole = () => {
    tapeT = null;
    root.classList.remove('tf-intro');
    navLayers.forEach(el => { el.style.clipPath = ''; });
    navShadow.style.transform = ''; navFace.inert = false;
    inks.forEach(el => { el.style.clipPath = ''; });
    navList.style.setProperty('--ul-ready', '1');
    disp.style.visibility = 'hidden';
  };
  scope.on(window, 'resize', () => { if (tapeT !== null) draw(tapeT); });
  scope.add(() => {
    whole();
    delete root.dataset.tapeLive;
    navList.style.removeProperty('--ul-ready');
    disp.style.cssText = ''; dpBody.style.cssText = '';
  });
  return { draw, whole };
}
