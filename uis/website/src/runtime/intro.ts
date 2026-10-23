import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Scope } from './scope';
import { $, $id } from './dom';

/**
 * The intro wordmark (dots, line, the word driving in), the scroll cue and the Skip intro button.
 * Plain DOM + GSAP with no three.js, so it plays as soon as the page boots. The 3D scene (intro pin,
 * tape-gun navbar, truck and plane) is loaded separately; `onShown` fires once the wordmark and the
 * scroll cue are on screen, which is the signal to fetch it (so it never competes with the first paint).
 */
export function startIntro(scope: Scope, onShown: () => void) {
  const introEl = $id('intro');
  const skip = $id('skip-intro');
  const skipBtn = $<HTMLButtonElement>('.skip-intro-btn', skip)!;
  const mm = gsap.matchMedia();
  scope.add(() => mm.revert());
  mm.add({ still: '(prefers-reduced-motion: reduce)', moving: '(prefers-reduced-motion: no-preference)' }, ctx => {
    if ((ctx.conditions as Record<string, boolean>).still) {
      // no intro at all; the scene still loads for the static truck
      introEl.style.display = 'none';
      ScrollTrigger.refresh();
      onShown();
      return () => { introEl.style.display = ''; };
    }

    // Skip intro: jump to the hero, then finish the scrubbed catch-up at once (navbar laid, truck in place)
    const skipIntro = () => {
      const home = $id('home');
      home.scrollIntoView();
      ScrollTrigger.update();
      ScrollTrigger.getAll().forEach(t => { const tw = t.getTween(); if (tw) tw.progress(1); });   // 0 when not scrubbed
      home.focus({ preventScroll: true });
    };
    skipBtn.addEventListener('click', skipIntro);

    // Pin the intro now rather than when the 3D scene arrives. The spacer is a wrapper already in the markup
    // (#intro-spacer): if ScrollTrigger had to insert its own, the move would make the browser record everything
    // in the intro again as newly painted content.
    // The scene attaches its scrubbed timeline (truck, tape gun, logo fade) to the same scroll range.
    ScrollTrigger.create({ id: 'intro-pin', trigger: introEl, start: 'top top', end: '+=250%', pin: true, pinSpacer: '#intro-spacer', refreshPriority: 10 });
    ScrollTrigger.sort();
    ScrollTrigger.refresh();

    // Phones get a quicker intro (no lead-in, faster drive-in and wobble) so the wordmark lands sooner on slower devices
    const phone = window.matchMedia('(max-width: 767px)').matches;
    const pace = phone ? 0.65 : 1;   // multiplier on the wordmark's drive-in and settle timings

    // the intro wordmark drives in, brakes, and rocks to a stop
    const word = $<HTMLElement>('.il-word')!;
    const wordHTML = word.innerHTML;
    const truckStop = () => {
      if (phone) {
        // Phones: the word drives in, brakes and rocks as one piece (no per-letter bunching). Kept whole on purpose:
        // it first paints fully behind the clip edge, so the browser doesn't count it as the page's main content,
        // which stays the scroll cue and Skip intro painted straight from the HTML.
        const DRIVE = 0.9 * pace, BRAKE = 0.42 * pace;
        const em = () => parseFloat(getComputedStyle(word).fontSize);
        gsap.set(word, { transformOrigin: '50% 100%', force3D: true });
        return gsap.timeline()
          .fromTo(word, { xPercent: -118, autoAlpha: 1 }, { xPercent: 0, duration: DRIVE, ease: 'power1.out' }, 0)
          .fromTo(word, { skewX: 0, y: 0, scaleY: 1 }, { skewX: -12, y: () => em() * 0.04, scaleY: 0.96, duration: DRIVE - BRAKE, ease: 'power2.in' }, BRAKE)
          .to(word, { skewX: 0, duration: 1.35 * pace, ease: 'elastic.out(1.15, 0.28)' }, DRIVE)
          .to(word, { y: 0, scaleY: 1, duration: 1.1 * pace, ease: 'elastic.out(1, 0.32)' }, DRIVE);
      }
      if (!word.querySelector('.il-ch')) word.innerHTML = [...(word.textContent ?? '')].map(c => `<span class="il-ch">${c}</span>`).join('');
      const wch = gsap.utils.toArray<HTMLElement>('.il-ch', word);
      const n = wch.length;
      const em = () => parseFloat(getComputedStyle(word).fontSize);
      const DRIVE = 0.9 * pace, BRAKE = 0.42 * pace;
      // Each letter stays hidden until it reaches the clip edge (it is fully clipped before that, so nothing looks different).
      // Browsers ignore text whose first paint is fully clipped, which left the page with no Largest Contentful Paint.
      const clip = word.parentElement!;
      const shown = new Set<HTMLElement>();
      wch.forEach(c => { c.style.visibility = 'hidden'; });
      const revealEntering = () => {
        const edge = clip.getBoundingClientRect().left;
        wch.forEach(c => { if (!shown.has(c) && c.getBoundingClientRect().right > edge + 0.5) { shown.add(c); c.style.visibility = ''; } });
      };
      const revealAll = () => wch.forEach(c => { shown.add(c); c.style.visibility = ''; });
      gsap.set(word, { transformOrigin: '50% 100%', force3D: true });
      return gsap.timeline({ onComplete: revealAll })
        .fromTo(word, { xPercent: -118, autoAlpha: 1 }, { xPercent: 0, duration: DRIVE, ease: 'power1.out', onUpdate: revealEntering, onComplete: revealAll }, 0)
        .fromTo(word, { skewX: 0, y: 0, scaleY: 1 }, { skewX: -12, y: () => em() * 0.04, scaleY: 0.96, duration: DRIVE - BRAKE, ease: 'power2.in' }, BRAKE)
        .fromTo(wch, { x: 0 }, { x: i => ((n - 1 - i) / (n - 1)) * em() * 0.12, duration: 0.16, ease: 'power2.out' }, DRIVE - 0.1)
        .to(word, { skewX: 0, duration: 1.35 * pace, ease: 'elastic.out(1.15, 0.28)' }, DRIVE)
        .to(word, { y: 0, scaleY: 1, duration: 1.1 * pace, ease: 'elastic.out(1, 0.32)' }, DRIVE)
        .to(wch, { x: 0, duration: 1.0 * pace, ease: 'elastic.out(1, 0.38)', stagger: { each: 0.022 * pace, from: 'end' } }, DRIVE + 0.06 * pace);
    };
    if (phone) {
      // Phones: no lead-in. The wordmark starts driving in at once while the dots pop and the line draws, and the
      // scroll cue and Skip intro are on screen from the first paint (index.css shows them; this keeps them shown
      // after the intro class is removed). The 3D scene is fetched once the wordmark has arrived.
      gsap.set(['.cue-inner', skipBtn], { autoAlpha: 1 });
      const pop = { scale: 1, autoAlpha: 1, duration: 0.25, ease: 'back.out(2.6)' };
      gsap.timeline()
        // the word is placed behind the clip edge right away and starts moving 0.1s later, so its first paint is fully clipped
        .add(truckStop(), 0.1)
        .fromTo('.il-dot-a', { scale: 0, autoAlpha: 0, transformOrigin: '50% 50%' }, pop, 0)
        .fromTo('.il-dot-b', { scale: 0, autoAlpha: 0, transformOrigin: '50% 50%' }, pop, 0.1)
        .to('#il-line-reveal', { attr: { 'stroke-dashoffset': 0 }, duration: 0.3, ease: 'power2.inOut' }, 0.15)
        .fromTo('.il-dot-b', { scale: 1 }, { keyframes: { scale: [1, 1.22, 1] }, duration: 0.45, ease: 'power2.out', immediateRender: false }, 0.45)
        .call(onShown, undefined, 0.9 * pace);
    } else {
      const pop = { scale: 1, autoAlpha: 1, duration: 0.6, ease: 'back.out(2.6)' };
      gsap.timeline({ delay: 0.35 })
        .fromTo('.il-dot-a', { scale: 0, autoAlpha: 0, transformOrigin: '50% 50%' }, pop)
        .fromTo('.il-dot-b', { scale: 0, autoAlpha: 0, transformOrigin: '50% 50%' }, pop, '-=0.3')
        .to('#il-line-reveal', { attr: { 'stroke-dashoffset': 0 }, duration: 0.8, ease: 'power2.inOut' }, '+=0.05')
        .fromTo('.il-dot-b', { scale: 1 }, { keyframes: { scale: [1, 1.22, 1] }, duration: 0.45, ease: 'power2.out', immediateRender: false }, '-=0.08')
        .add(truckStop(), '<')
        .fromTo('.cue-inner', { y: 8, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: 'power3.out' }, '-=0.9')
        .addLabel('cueShown', '>')
        .fromTo(skipBtn, { y: 8, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: 'power3.out' }, '<0.1')
        .call(onShown, undefined, 'cueShown');
    }

    return () => { skipBtn.removeEventListener('click', skipIntro); word.innerHTML = wordHTML; };
  });
}
