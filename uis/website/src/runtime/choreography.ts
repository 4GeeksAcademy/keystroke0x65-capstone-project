import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Scope } from './scope';
import type { Slot } from './slot';
import { $, $$, $id } from './dom';
import { splitChars, type Split } from './splitText';

export interface PorchApi { play(): void; final(): void; reset(): void }
export interface BeltApi { mode(m: 'live' | 'still'): void; drop(): void }

interface RiseOpts { amp?: number; amount?: number; each?: number; dur?: number; ease?: string; tilt?: number }
interface EnterOpts { start?: string; ca?: gsap.core.Animation | null }

/**
 * Motion system. Three entrance rules, used everywhere:
 *   RISE  letters come up from behind their own baseline, in random order, tilted on the way
 *   SLAP  stickers, tape and badges get stuck down with an overshoot
 *   WRITE handwriting and marker appear left to right at writing speed
 * Plus a few live loops: the road keeps driving, the delivery step pulses, buttons lean in.
 * Reduced motion: everything is placed at rest, nothing moves on its own.
 */
export function initChoreography(scope: Scope, heroSplit: Split | null, porch: Slot<PorchApi>, belt: Slot<BeltApi>) {
  const root = document.documentElement;
  const title = $id('hero-title');
  const mm = gsap.matchMedia();
  scope.add(() => mm.revert());

  mm.add({
    still: '(prefers-reduced-motion: reduce)',
    moving: '(prefers-reduced-motion: no-preference)',
    wide: '(min-width: 768px)',
    fine: '(pointer: fine)',
  }, ctx => {
    const { still, wide, fine } = ctx.conditions as Record<string, boolean>;
    if (still) { heroSplit?.applyRest(); porch.call(p => p.final()); belt.call(b => b.mode('still'), 'mode'); return; }
    belt.call(b => b.mode('live'), 'mode');
    const cleanups: Array<() => void> = [];

    /* ---------- the three rules ---------- */
    const rise = (el: HTMLElement | null, { amp = 0, amount = 0.5, each = 0.03, dur = 0.45, ease = 'back.out(1.5)', tilt = 24 }: RiseOpts = {}) => {
      const sp = splitChars(el, amp);
      if (!el || !sp) return gsap.timeline();
      const fs = parseFloat(getComputedStyle(el).fontSize);
      gsap.set(sp.chars, { rotation: i => sp.rest[i].r, y: i => sp.rest[i].y * fs });
      el.classList.add('rising');
      cleanups.push(() => el.classList.remove('rising'));
      return gsap.from(sp.chars, {
        yPercent: 125, rotation: () => gsap.utils.random(-tilt, tilt), duration: dur, ease, force3D: true,
        stagger: { amount: Math.min(amount, sp.chars.length * each), from: 'random' },
        onComplete: () => el.classList.remove('rising'),
      });
    };
    const tagIn = (el: HTMLElement | null) => {
      const tl = gsap.timeline();
      if (!el) return tl;
      return tl.from(el, { scaleX: 0, transformOrigin: '0% 50%', duration: 0.35, ease: 'power3.out' })
        .add(rise(el, { amount: 0.28, dur: 0.32, ease: 'power3.out', tilt: 0 }), 0.12);
    };
    const slapTape = (el: Element | null) => (el ? gsap.from(el, { scaleX: 0, transformOrigin: '0% 50%', duration: 0.4, ease: 'power3.out' }) : gsap.timeline());
    const write = (el: HTMLElement | null) => (el
      ? gsap.fromTo(el, { clipPath: 'inset(-25% 100% -25% -6%)' },
        { clipPath: 'inset(-25% -6% -25% -6%)', duration: Math.min(1.3, 0.35 + (el.textContent ?? '').trim().length * 0.028), ease: 'none' })
      : gsap.timeline());
    const onEnter = (trigger: string | Element | null, build: (tl: gsap.core.Timeline) => void, o: EnterOpts = {}) => {
      if (!trigger) return;
      const tl = gsap.timeline({ scrollTrigger: { trigger, start: o.start || 'top 85%', once: true, containerAnimation: o.ca ?? undefined } });
      build(tl);
    };

    /* ---------- HERO: tag, headline, card, sticker, in that order ---------- */
    const stat = $id('stat-num');
    onEnter('#home', tl => {
      tl.add(tagIn($('#home .tag')), 0)
        .add(rise(title, { amp: 9, amount: 0.62, dur: 0.46 }), 0.1)
        .add(slapTape($('#home .strip')), 0.34)
        .add(rise($('#home article .label'), { amount: 0.22, dur: 0.3, ease: 'power3.out', tilt: 0 }), 0.42)
        .add(rise($id('journey-title'), { amp: 3, amount: 0.36 }), 0.46)
        .from('#home .journey .dot', { scale: 0, duration: 0.45, ease: 'back.out(3)', stagger: 0.07 }, 0.62)
        .from('#home .sticker', { scale: 0, rotation: -150, duration: 0.85, ease: 'back.out(1.8)' }, 0.64)
        .fromTo({ v: 0 }, { v: 0 }, { v: 98.6, duration: 1.1, ease: 'power2.out', onUpdate() { stat.textContent = (this.targets()[0] as { v: number }).v.toFixed(1) + '%'; } }, 0.68);
    }, { start: 'top 38%' });
    cleanups.push(() => { stat.textContent = '98.6%'; });

    /* ---------- SECTION HEADS: tag pill unrolls, then the heading rises ---------- */
    ['#services', '#coverage', '#why-trackflow', '#leadership', '#faq'].forEach(id => {
      const sec = $(id); if (!sec) return;
      const tag = $('.tag', sec), h = $('h2.display', sec);
      onEnter(tag || h, tl => { tl.add(tagIn(tag), 0).add(rise(h, { amp: 3, amount: 0.5 }), 0.12); });
    });
    /* ---------- CONTACT: an invisible hand puts up one finished card at a time ----------
       Each card follows one continuous path driven from a single state object (no competing tweens):
       carried in and held just off the board → fastened (pushpin / staples) → let go, settles flat.
       The lifted shadow is its own pre-blurred layer that only moves and fades, so it stays smooth. */
    const board = $('#contact .contact-board');
    const cta = $<HTMLElement>('#contact .cta-panel'), tack = $('#contact .tack');
    const sheet = $<HTMLElement>('#contact .contact-card'), [st1, st2] = $$('#contact .staple');

    const holdable = (tl: gsap.core.Timeline, card: HTMLElement, origin: string) => {
      const sh = document.createElement('div');
      sh.className = 'lift-shadow'; sh.setAttribute('aria-hidden', 'true');
      card.before(sh);                                   // earlier in the DOM = painted under the card
      cleanups.push(() => sh.remove());
      const place = () => {
        const cs = getComputedStyle(card);
        Object.assign(sh.style, { left: `${card.offsetLeft}px`, top: `${card.offsetTop}px`, width: `${card.offsetWidth}px`, height: `${card.offsetHeight}px`, borderRadius: cs.borderRadius, rotate: cs.rotate });
      };
      const p = { x: 0, y: 0, r: 0, s: 1, lift: 0 };
      const apply = () => {
        gsap.set(card, { x: p.x, y: p.y, rotation: p.r, scale: p.s, force3D: true });
        gsap.set(sh, { x: p.x + 12 * p.lift, y: p.y + 36 * p.lift, rotation: p.r, scale: p.s * (1 + 0.03 * p.lift), opacity: 0.5 * p.lift, force3D: true });
      };
      gsap.set([card, sh], { transformOrigin: origin });
      const move = (to: Partial<typeof p>, dur: number, ease: string, at: number) => tl.to(p, { ...to, duration: dur, ease, onUpdate: apply }, at);
      const start = (from: typeof p, to: Partial<typeof p>, dur: number, at: number) => {
        tl.call(place, [], at)
          .fromTo(card, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: 'power1.out' }, at)
          .fromTo(p, { ...from }, { ...to, duration: dur, ease: 'power3.out', onUpdate: apply }, at);
        apply();
      };
      const finish = (at: number) => tl.call(() => { gsap.set(card, { clearProps: 'transform,opacity,visibility' }); sh.remove(); }, [], at);
      return { start, move, finish };
    };
    // a fastener (pin or staple) comes down onto the held card and goes in
    const fasten = (tl: gsap.core.Timeline, el: Element, hit: number, from: gsap.TweenVars, dur: number) => tl
      .fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.06 }, hit - dur)
      .fromTo(el, from, { x: 0, y: 0, scale: 1, rotation: 0, duration: dur, ease: 'power2.in' }, hit - dur)   // lands on contact
      .to(el, { keyframes: { scale: [1, 0.92, 1] }, duration: 0.28, ease: 'power1.inOut' }, hit)
      .set(el, { clearProps: 'transform,opacity,visibility' }, hit + 0.3);

    // 1. the CTA: carried in, held, pinned through the top, let go, swings softly to rest on the pin
    const putUpCta = (tl: gsap.core.Timeline, a: number) => {
      if (!cta || !tack) return a;
      const c = holdable(tl, cta, '50% 0%'), PIN = a + 1.3;
      c.start({ x: -30, y: 150, r: -9, s: 1.07, lift: 1 }, { x: 0, y: -12, r: -3.5, s: 1.035 }, 1.0, a);
      fasten(tl, tack, PIN, { x: 18, y: -70, scale: 1.7, rotation: -14 }, 0.45);
      c.move({ y: 0, s: 1, lift: 0 }, 0.35, 'power2.out', PIN);
      c.move({ r: 0 }, 1.0, 'elastic.out(1, 0.65)', PIN + 0.1);
      c.finish(PIN + 1.15);
      return PIN + 1.15;
    };
    // 2. the offices sheet: carried in, held; a staple fixes one corner (it settles a little), the second fixes it flat
    const putUpSheet = (tl: gsap.core.Timeline, b: number) => {
      if (!sheet || !st1 || !st2) return b;
      const c = holdable(tl, sheet, '65px 23px'), S1 = b + 1.25, S2 = b + 1.85;   // pivot = the first staple
      c.start({ x: 60, y: 150, r: 8, s: 1.07, lift: 1 }, { x: 0, y: -12, r: 3.5, s: 1.035 }, 1.0, b);
      fasten(tl, st1, S1, { y: -34, scale: 1.5 }, 0.28);
      c.move({ y: 0, s: 1.015, lift: 0.45 }, 0.25, 'power2.out', S1);
      c.move({ r: 1.6 }, 0.55, 'sine.inOut', S1);
      fasten(tl, st2, S2, { y: -34, scale: 1.5 }, 0.28);
      c.move({ r: 0, s: 1, lift: 0 }, 0.35, 'power2.out', S2);
      c.finish(S2 + 0.4);
      return S2 + 0.4;
    };
    if (wide) {
      // side by side: one after the other, the hand moving on as the first card settles
      onEnter(board, tl => { putUpSheet(tl, putUpCta(tl, 0) - 0.5); }, { start: 'top 75%' });
    } else {
      // stacked: each card goes up as you reach it
      onEnter(cta, tl => { putUpCta(tl, 0); }, { start: 'top 80%' });
      onEnter(sheet, tl => { putUpSheet(tl, 0); }, { start: 'top 80%' });
    }
    onEnter('#site-footer', tl => {
      tl.add(rise($('.footer-mark .display'), { amp: 4, amount: 0.55, dur: 0.5 }), 0)
        .add(write($id('drag-hint')), 0.6);
    }, { start: 'top 75%' });

    /* ---------- WRITE: handwritten notes ---------- */
    $$('main .note:not(.door-note)').forEach(n => { if (!n.closest('#how')) onEnter(n, tl => { tl.add(write(n)); }, { start: 'top 88%' }); });

    /* ---------- SLAP: label cards, discs, ID badges ---------- */
    gsap.fromTo('#svc-grid .svc',
      { autoAlpha: 0, scale: 1.14, rotation: i => (i % 2 ? 7 : -7), y: -18 },
      { autoAlpha: 1, scale: 1, rotation: 0, y: 0, duration: 0.6, ease: 'back.out(2.4)', stagger: 0.12, force3D: true, clearProps: 'transform',
        scrollTrigger: { trigger: '#svc-grid', start: 'top 78%', once: true } });
    onEnter('#why-trackflow ul', tl => { tl.from('#why-trackflow .why-disc', { scale: 0, rotation: () => gsap.utils.random(-60, 60), duration: 0.6, ease: 'back.out(2.4)', stagger: 0.1, clearProps: 'transform' }); }, { start: 'top 82%' });
    // conveyor: parcels drop onto the belt when the section arrives
    onEnter('#belt-scene', tl => { tl.call(() => belt.call(b => b.drop(), 'drop')); }, { start: 'top 80%' });

    /* ---------- How it works: pinned + sideways on wide screens; each stop builds itself as it enters ---------- */
    let hs: gsap.core.Tween | null = null;
    if (wide) {
      root.classList.add('hs-on');
      const track = $id('how-track');
      const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
      hs = gsap.to(track, {
        x: () => -dist(), ease: 'none', force3D: true,
        scrollTrigger: { trigger: '#how', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 },
      });
    }
    onEnter('#how .how-head', tl => { tl.add(tagIn($('#how .tag'))); }, { start: 'top 85%' });
    $$('#how .step').forEach(step => {
      const words = $$('.step-word', step), card = $('.step-card', step);
      onEnter(step, tl => {
        tl.from($('.step-num', step), { scale: 0, rotation: -90, duration: 0.5, ease: 'back.out(2.4)' }, 0);
        words.forEach((w, k) => tl.add(rise(w, { amp: 3, amount: 0.3, dur: 0.5 }), k ? 0.32 : 0.04));
        tl.from(card, { scale: 0.4, rotation: -18, autoAlpha: 0, duration: 0.6, ease: 'back.out(2)' }, 0.16)
          .add(slapTape(card && $('.strip', card)), 0.46)
          .add(write($('.note', step)), 0.62);
      }, hs ? { ca: hs, start: 'left 80%' } : { start: 'top 80%' });
    });

    /* ---------- Road: keeps driving; scroll direction steers it, scroll speed pushes it ---------- */
    const tp = $id<SVGTextPathElement>('road-tp'), roadText = $id<SVGTextElement>('road-text');
    let off = 0, dir = 1, vel = 0, len = 0, roadOn = false;
    const measure = () => { len = roadText.getComputedTextLength() / 5; };
    measure(); scope.then(document.fonts?.ready, measure);
    ScrollTrigger.create({ trigger: '.road', start: 'top bottom', end: 'bottom top', onToggle: st => { roadOn = st.isActive; }, onRefresh: measure });
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: st => { dir = st.direction; vel = Math.min(3000, Math.abs(st.getVelocity())); } });
    const drive = (_time: number, dt: number) => {
      vel *= 0.9;
      if (!roadOn || !len) return;
      off -= dir * (40 + vel * 0.14) * Math.min(dt, 50) / 1000;
      if (off > 0) off -= len;
      if (off <= -len) off += len;
      tp.setAttribute('startOffset', off.toFixed(1));
    };
    gsap.ticker.add(drive);
    cleanups.push(() => { gsap.ticker.remove(drive); tp.setAttribute('startOffset', '0'); });

    /* ---------- Buttons lean toward the cursor (mouse only) ---------- */
    if (fine) $$('.btn-red, .btn-yellow').forEach(b => {
      const xTo = gsap.quickTo(b, 'x', { duration: 0.35, ease: 'power3' }), yTo = gsap.quickTo(b, 'y', { duration: 0.35, ease: 'power3' });
      const move = (e: PointerEvent) => { const r = b.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * 0.22); yTo((e.clientY - r.top - r.height / 2) * 0.32); };
      const leave = () => { gsap.to(b, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' }); };
      b.addEventListener('pointermove', move); b.addEventListener('pointerleave', leave);
      cleanups.push(() => { b.removeEventListener('pointermove', move); b.removeEventListener('pointerleave', leave); gsap.set(b, { clearProps: 'transform' }); });
    });

    /* ---------- Delivery: when the FAQ door comes into view, the driver drops the parcel, the door opens, he waves ---------- */
    // starts once the whole porch is on screen; scroll away and back and it plays again
    const play = () => porch.call(p => p.play()), reset = () => porch.call(p => p.reset());
    ScrollTrigger.create({ trigger: '#door-scene', start: 'bottom 92%', end: 'top 8%', onEnter: play, onEnterBack: play, onLeave: reset, onLeaveBack: reset });

    /* ---------- Coverage: each warehouse gets its own checkmark — disc pops, tick draws on ---------- */
    $$('#cov-list > ul > li').forEach(row => {
      onEnter(row, tl => {
        tl.from($('.hc-disc', row), { scale: 0, rotation: -90, transformOrigin: '50% 50%', duration: 0.5, ease: 'back.out(2.6)' }, 0)
          .fromTo($('.hc-tick', row), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.35, ease: 'power2.out' }, 0.28)
          .from($('.pill', row), { scale: 0, rotation: 8, transformOrigin: '0% 50%', duration: 0.45, ease: 'back.out(2.2)' }, 0.34);
      }, { start: 'top 80%' });
    });

    return () => { cleanups.forEach(f => f()); root.classList.remove('hs-on'); heroSplit?.applyRest(); };
  });
}
