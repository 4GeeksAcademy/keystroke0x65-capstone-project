import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Scope } from './scope';
import { Slot } from './slot';
import { $id } from './dom';
import { splitChars, unsplitAll } from './splitText';
import { tapeClip } from './tape';
import { initNav } from './nav';
import { initChoreography, type BeltApi, type PorchApi } from './choreography';
import { startIntro } from './intro';

gsap.registerPlugin(ScrollTrigger);

/**
 * Boots the motion runtime on the DOM React rendered and returns its teardown.
 * Order matters: the scroll choreography wires its triggers first; the 3D scene (which owns the
 * intro pin and the porch/conveyor scenes) is built last and picks up any commands already queued.
 */
export function bootSite(): () => void {
  const scope = new Scope();
  const root = document.documentElement;

  // registered first = undone last: the split headlines go back to plain text after every tween is reverted
  scope.add(unsplitAll);
  scope.add(() => ScrollTrigger.getAll().forEach(t => t.kill()));

  // safety net: if the intro never starts (no WebGL, blocked assets), never leave the site without its navbar
  scope.timeout(() => { if (!root.dataset.tapeLive) root.classList.remove('tf-intro'); }, 9000);
  root.style.setProperty('--tape-clip', tapeClip(null));
  scope.add(() => root.style.removeProperty('--tape-clip'));

  const heroSplit = splitChars($id('hero-title'), 9);
  initNav(scope);

  const porch = new Slot<PorchApi>(), belt = new Slot<BeltApi>();
  initChoreography(scope, heroSplit, porch, belt);
  // The 3D scene (three.js, the largest download) is fetched once the intro wordmark and scroll cue are on screen,
  // or as soon as the visitor scrolls or presses a key, so it never delays the first thing on screen.
  let sceneRequested = false;
  const loadScene = () => {
    if (sceneRequested) return;
    sceneRequested = true;
    scope.then(import('./scene'), m => m.startScene(scope, porch, belt));
  };
  startIntro(scope, loadScene);
  ['wheel', 'touchstart', 'keydown', 'scroll'].forEach(type => scope.on(window, type, loadScene, { passive: true, once: true }));
  scope.timeout(loadScene, 4000);   // safety net, e.g. if the intro timeline never runs

  // the footer's physics engine (matter-js) is only downloaded and started once the footer comes within ~1.5 screens
  scope.observe((entries, io) => {
    if (!entries.some(e => e.isIntersecting)) return;
    io.disconnect();
    scope.then(import('./footerPhysics'), m => m.initFooterPhysics(scope));
  }, $id('site-footer'), { rootMargin: '150% 0px' });

  // fonts change line lengths; re-measure every trigger once they land
  scope.then(document.fonts?.ready, () => ScrollTrigger.refresh());

  return () => scope.dispose();
}
