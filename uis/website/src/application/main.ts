/**
 * Request-information page. Static HTML (application.html) + this entry:
 * site styles and fonts, the unchanged form validation, and the page's motion:
 *   1. the tape gun lays the navbar (same piece as the home page intro, here on a timer)
 *   2. the heading rises letter by letter, the sheet gets taped down
 *   3. feedback: tick boxes are marked in red (CSS), invalid cells nudge, success gets a checkmark
 *   4. the footer box: same parcels and physics as the home page
 * Reduced motion: everything is simply there.
 */
import '@fontsource-variable/archivo/wdth.css';
import '@fontsource-variable/caveat';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import '../styles/index.css';
import './application.css';
import './validation.js';
import { gsap } from 'gsap';
import { Scope } from '../runtime/scope';
import { $, $$, $id, reducedMotion } from '../runtime/dom';
import { createTapeGun, tapeClip } from '../runtime/tape';
import { splitChars } from '../runtime/splitText';
import { initFooterPhysics } from '../runtime/footerPhysics';

const scope = new Scope();
const root = document.documentElement;
root.style.setProperty('--tape-clip', tapeClip(null));
initFooterPhysics(scope);

/* ---------- printed barcode on the sheet header (same generator as the service labels) ---------- */
$$<SVGSVGElement>('svg.wb-barcode').forEach(svg => {
  const W = +(svg.getAttribute('width') ?? 120), H = +(svg.getAttribute('height') ?? 26);
  let s = 97, bars = '';
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  for (let x = 0; x < W - 2;) { const w = 1 + Math.floor(rnd() * 3); bars += `<rect x="${x}" width="${w}" height="${H}"/>`; x += w + 1 + Math.floor(rnd() * 3); }
  svg.innerHTML = bars;
});

/* ---------- headings never spill out of their column ----------
   The display face is condensed; if a substitute font is ever used (blocked or slow fonts), a long word like
   "OPERATION." could run under the form. Shrink only when it actually overflows, re-checked when fonts land and on resize. */
const fitText = (el: HTMLElement | null) => {
  if (!el) return;
  el.style.fontSize = '';
  let fs = parseFloat(getComputedStyle(el).fontSize), guard = 40;
  while (el.scrollWidth > el.clientWidth + 1 && fs > 22 && guard--) { fs *= 0.95; el.style.fontSize = fs.toFixed(1) + 'px'; }
};
const fitAll = () => { fitText($id('form-title')); fitText($<HTMLElement>('.success-message h2')); };
fitAll();
scope.then(document.fonts?.ready, fitAll);
new MutationObserver(() => { if (!$id('success-message').classList.contains('hidden')) fitAll(); }).observe($id('success-message'), { attributes: true, attributeFilter: ['class'] });
let fitRaf = 0;
scope.on(window, 'resize', () => { cancelAnimationFrame(fitRaf); fitRaf = requestAnimationFrame(fitAll); });

/* ---------- mobile menu ---------- */
const menuBtn = $id<HTMLButtonElement>('menu-btn'), menu = $id('mobile-menu'), icon = $id<SVGPathElement>('menu-icon');
const setMenu = (open: boolean) => {
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  icon.setAttribute('d', open ? 'M5 5l12 12M17 5L5 17' : 'M3 6h16M3 11h16M3 16h16');
  menu.hidden = !open;
};
scope.on(menuBtn, 'click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
scope.on(menu, 'click', e => { if ((e.target as Element).closest('a')) setMenu(false); });
scope.on(document, 'keydown', e => { if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') { setMenu(false); menuBtn.focus(); } });

/* ---------- motion ---------- */
const tape = createTapeGun(scope);
const form = $id<HTMLFormElement>('application-form');
const success = $id('success-message');
const errorsBanner = $id('form-errors');
const still = reducedMotion();

const rise = (el: HTMLElement | null, amp = 3, amount = 0.5) => {
  const sp = splitChars(el, amp);
  if (!el || !sp) return gsap.timeline();
  const fs = parseFloat(getComputedStyle(el).fontSize);
  gsap.set(sp.chars, { rotation: i => sp.rest[i].r, y: i => sp.rest[i].y * fs });
  el.classList.add('rising');
  return gsap.from(sp.chars, {
    yPercent: 125, rotation: () => gsap.utils.random(-24, 24), duration: 0.45, ease: 'back.out(1.5)', force3D: true,
    stagger: { amount: Math.min(amount, sp.chars.length * 0.03), from: 'random' },
    onComplete: () => el.classList.remove('rising'),
  });
};

if (still) {
  tape.whole();
  splitChars($id('form-title'), 3)?.applyRest();
  fitAll();
} else {
  // 1. the tape gun runs across and lays the navbar, then the links are written on it
  const p = { t: 0 };
  tape.draw(0);
  gsap.to(p, { t: 1, duration: 1.9, ease: 'none', delay: 0.1, onUpdate: () => tape.draw(p.t) });

  // 2. heading, then the sheet: slapped down with an overshoot, tape pressed on
  const tag = $<HTMLElement>('.application-intro .tag');
  gsap.timeline({ delay: 0.25 })
    .from(tag, { scaleX: 0, transformOrigin: '0% 50%', duration: 0.35, ease: 'power3.out' }, 0)
    .add(rise($id('form-title'), 3, 0.6), 0.12)
    .call(fitAll, undefined, 0.13)
    .from('.intro-lede', { autoAlpha: 0, y: 14, duration: 0.5, ease: 'power3.out' }, 0.45)
    .from('.intro-parcel', { scale: 0.6, rotation: -20, autoAlpha: 0, duration: 0.7, ease: 'back.out(2)' }, 0.55)
    .from(form, { autoAlpha: 0, scale: 1.06, rotation: -3, y: -16, duration: 0.6, ease: 'back.out(2.2)', clearProps: 'transform,opacity,visibility' }, 0.4)
    .from('.wb-tape', { scaleX: 0, transformOrigin: '0% 50%', duration: 0.4, ease: 'power3.out', stagger: 0.1 }, 0.85);

  // 3. Request information: a quick barcode scan by the button before the form gives its verdict.
  //    The form's own validation (validation.js, untouched) still decides; the scanner only stages the result:
  //    valid   → the line locks onto the bars, beeps (READ), then the thank-you appears
  //    invalid → the line can't lock on, flickers out (NO READ), then the messages appear
  const tagEl = $<HTMLElement>('.scan-tag')!, line = $<HTMLElement>('.scan-line')!;
  const fieldsBox = $id('form-fields');
  let releasing = false, scanning = false;
  let scanTl: gsap.core.Timeline | null = null;
  const isBad = (c: Element) => !!c.querySelector('.invalid') || $$('.error', c).some(e => e.textContent);

  const errorsFX = () => {
    gsap.fromTo(errorsBanner, { scale: 1.08, rotation: -3 }, { scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(2.4)', clearProps: 'transform' });
    gsap.fromTo($$('.cell').filter(isBad), { x: -7 }, { x: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)', stagger: 0.03, clearProps: 'transform' });
  };
  const successFX = () => gsap.timeline()
    .fromTo(form, { scale: 0.985 }, { scale: 1, duration: 0.5, ease: 'back.out(3)', clearProps: 'transform' }, 0)
    .from('.success-check', { scale: 0, rotation: -90, duration: 0.55, ease: 'back.out(2.6)' }, 0.05)
    .fromTo('.success-check .hc-tick', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.35, ease: 'power2.out' }, 0.35)
    .add(rise($<HTMLElement>('.success-message h2'), 2, 0.5), 0.2)
    .from($$('.success-message p'), { autoAlpha: 0, y: 10, duration: 0.45, ease: 'power3.out', stagger: 0.08 }, 0.5);

  const sweep = { y: 0.5 };
  const setLine = () => line.style.setProperty('--sy', sweep.y.toFixed(3));
  const resetScanner = () => {
    tagEl.classList.remove('ok', 'bad');
    gsap.set(['.scan-gun', '.scan-fan', '.scan-line', '.scan-verdict'], { clearProps: 'all' });
    line.style.removeProperty('--sy');
  };

  scope.on(document, 'submit', e => {
    if (e.target !== form || releasing) return;            // the replayed submit goes through to validation.js
    e.preventDefault();
    e.stopImmediatePropagation();
    if (scanning) return;
    scanning = true;
    form.classList.add('is-scanning');
    // a form can't be re-submitted from inside its own submit event, so the real submit is replayed on the next task
    scope.timeout(() => scan(), 0);
  }, { capture: true });

  function scan() {
    // run the real validation now, but hold its result back until the scan finishes
    const y0 = window.scrollY;
    releasing = true;
    form.requestSubmit();
    releasing = false;
    const ok = !success.classList.contains('hidden');
    const focusAfter = (document.activeElement as HTMLElement | null) ?? null;
    if (ok) { success.classList.add('hidden'); fieldsBox.classList.remove('hidden'); }
    else focusAfter?.blur();
    window.scrollTo(0, y0);

    scanTl?.kill();
    resetScanner();
    sweep.y = 0.05; setLine();
    const tl = (scanTl = gsap.timeline({ onComplete: () => { scanning = false; } }));
    // the gun pops in beside the code and switches on
    tl.fromTo('.scan-gun', { x: 26, rotation: 12, autoAlpha: 0 }, { x: 0, rotation: 0, autoAlpha: 1, duration: 0.25, ease: 'back.out(2.4)' }, 0)
      .to(['.scan-fan', '.scan-line'], { autoAlpha: 1, duration: 0.08 }, 0.2)
      // one sweep down across the bars, and back up
      .to(sweep, { y: 0.95, duration: 0.26, ease: 'sine.inOut', onUpdate: setLine }, 0.22)
      .to(sweep, { y: ok ? 0.5 : 0.25, duration: 0.2, ease: 'sine.inOut', onUpdate: setLine }, '>');

    if (ok) {
      tl.call(() => tagEl.classList.add('ok'))
        // locked on: the line flashes, the code pops, READ is stamped on
        .to(line, { scaleY: 2.4, background: '#ffffff', duration: 0.07, yoyo: true, repeat: 3, ease: 'none' })
        .fromTo('.scan-code', { scale: 1 }, { keyframes: { scale: [1, 1.08, 1] }, duration: 0.3, ease: 'power2.out' }, '<')
        .fromTo('.scan-verdict', { autoAlpha: 0, scale: 1.6, rotation: -8 }, { autoAlpha: 1, scale: 1, rotation: -4, duration: 0.25, ease: 'back.out(3)' }, '<0.05')
        .to(['.scan-fan', '.scan-line'], { autoAlpha: 0, duration: 0.12 }, '>-0.05')
        .to('.scan-gun', { x: 26, autoAlpha: 0, duration: 0.2, ease: 'power2.in' }, '+=0.15')
        .call(() => {
          form.classList.remove('is-scanning');
          fieldsBox.classList.add('hidden'); success.classList.remove('hidden');
          resetScanner();
          success.focus();
          successFX();
        });
    } else {
      tl.call(() => tagEl.classList.add('bad'))
        // can't lock on: the line jitters across the bars, flickers out, the gun shakes, NO READ
        .to(sweep, { keyframes: { y: [0.25, 0.7, 0.35, 0.6, 0.45] }, duration: 0.3, ease: 'none', onUpdate: setLine })
        .to('.scan-line', { autoAlpha: 0.15, duration: 0.04, yoyo: true, repeat: 5, ease: 'none' }, '<')
        .fromTo('.scan-gun', { rotation: 0 }, { keyframes: { rotation: [0, -9, 8, -6, 3, 0] }, duration: 0.4, ease: 'none' }, '<')
        .to(['.scan-fan', '.scan-line'], { autoAlpha: 0, duration: 0.1 })
        .fromTo('.scan-verdict', { autoAlpha: 0, scale: 1.6, rotation: 8 }, { autoAlpha: 1, scale: 1, rotation: 3, duration: 0.25, ease: 'back.out(3)' }, '<')
        // the verdict lands with the stamp: messages appear, focus goes to the first problem
        .call(() => {
          form.classList.remove('is-scanning');
          scanning = false;                                  // free to fix and send again right away
          errorsFX();
          focusAfter?.focus();
        }, undefined, '>-0.05')
        .to('.scan-gun', { x: 26, autoAlpha: 0, duration: 0.22, ease: 'power2.in' }, '+=0.2')
        .to('.scan-verdict', { autoAlpha: 0, duration: 0.3 }, '+=0.9')
        .call(resetScanner);
    }
  }
}
