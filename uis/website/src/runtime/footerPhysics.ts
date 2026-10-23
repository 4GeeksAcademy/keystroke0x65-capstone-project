import Matter from 'matter-js';
import type { Scope } from './scope';
import { $$, $id, reducedMotion } from './dom';

interface Item { el: HTMLElement; w: number; h: number }

/**
 * Footer physics: parcels and stickers drop into the open box and pile up on its floor.
 * Drag them with a mouse; they can't leave the box. Pauses while the footer is off screen.
 * Reduced motion: the pile is simulated instantly, so it simply appears settled.
 */
export function initFooterPhysics(scope: Scope) {
  const root = document.documentElement;
  const footer = $id('site-footer');
  const zone = $id('drop-zone');
  const hint = $id('drag-hint');
  const items: Item[] = $$('.drop-item', zone).map(el => ({ el, w: 0, h: 0 }));
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const still = reducedMotion();
  if (finePointer) root.classList.add('fine-pointer');
  if (finePointer && !still) hint.classList.remove('hidden');
  scope.add(() => {
    root.classList.remove('fine-pointer');
    hint.classList.add('hidden');
    items.forEach(({ el }) => { el.style.cssText = el.style.cssText.replace(/(width|height|transform|visibility):[^;]+;?/g, ''); });
  });

  let k = 1;
  const sizeItems = () => {
    k = Math.min(1, Math.max(0.55, zone.clientWidth / 1280));
    items.forEach(it => {
      const { el } = it;
      const w = +(el.dataset.w ?? 0) * k, h = (el.dataset.shape === 'disc' ? +(el.dataset.w ?? 0) : +(el.dataset.h ?? 0)) * k;
      el.style.width = w + 'px'; el.style.height = h + 'px';
      $$('.disc span', el).forEach(sp => { sp.style.transform = `scale(${k})`; });
      it.w = w; it.h = h;
    });
  };
  sizeItems();

  const { Engine, Bodies, Body, Composite, Mouse, MouseConstraint } = Matter;
  const engine = Engine.create({ enableSleeping: false });
  engine.gravity.y = 1.15;
  scope.add(() => { Composite.clear(engine.world, false); Engine.clear(engine); });
  let walls: Matter.Body[] = [];
  let lid: Matter.Body | null = null;
  const bodies: Array<{ body: Matter.Body; item: Item }> = [];
  let raf = 0, visible = false, dropped = false, closed = false;

  const buildWalls = () => {
    walls.forEach(w => Composite.remove(engine.world, w));
    // the zone is the box's inside (CSS): floor at its bottom, side walls at its edges
    const W = zone.clientWidth, H = zone.clientHeight, T = 200;
    walls = [
      Bodies.rectangle(W / 2, H + T / 2, W * 3, T, { isStatic: true }),
      Bodies.rectangle(-T / 2, H / 2 - H, T, H * 4, { isStatic: true }),
      Bodies.rectangle(W + T / 2, H / 2 - H, T, H * 4, { isStatic: true }),
    ];
    Composite.add(engine.world, walls);
    if (closed) closeLid();
  };
  // Once everything has dropped in, a lid at the box's top edge keeps parcels from being thrown back out
  const closeLid = () => {
    closed = true;
    if (lid) Composite.remove(engine.world, lid);
    const W = zone.clientWidth, T = 200;
    lid = Bodies.rectangle(W / 2, -T / 2, W * 3, T, { isStatic: true });
    Composite.add(engine.world, lid);
    bodies.forEach(({ body, item }) => { if (body.position.y < item.h) Body.setPosition(body, { x: body.position.x, y: item.h }); });
  };
  buildWalls();

  // A fast drag can tunnel through a wall; put anything that escaped back inside and stop it
  const keepInside = () => {
    const W = zone.clientWidth, H = zone.clientHeight;
    for (const { body, item } of bodies) {
      const r = Math.min(item.w, item.h) / 2;
      const { x, y } = body.position;
      const nx = Math.min(W - r, Math.max(r, x));
      const ny = Math.min(H - r, closed ? Math.max(r, y) : y);
      if (nx !== x || ny !== y) { Body.setPosition(body, { x: nx, y: ny }); Body.setVelocity(body, { x: 0, y: 0 }); }
    }
  };

  const makeBody = (item: Item, x: number, y: number) => {
    const { el } = item;
    const opts = { restitution: el.dataset.shape === 'disc' ? 0.5 : 0.28, friction: 0.45, frictionAir: 0.012, density: 0.0018, angle: (Math.random() - 0.5) * 1.4 };
    const body = el.dataset.shape === 'disc'
      ? Bodies.circle(x, y, item.w / 2, opts)
      : Bodies.rectangle(x, y, item.w, item.h, { ...opts, chamfer: { radius: 10 * k } });
    Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.12);
    el.style.visibility = 'visible';
    bodies.push({ body, item });
    Composite.add(engine.world, body);
  };

  const render = () => {
    for (const { body, item } of bodies) {
      item.el.style.transform = `translate(${(body.position.x - item.w / 2).toFixed(1)}px, ${(body.position.y - item.h / 2).toFixed(1)}px) rotate(${body.angle.toFixed(3)}rad)`;
    }
  };
  const loop = () => { Engine.update(engine, 1000 / 60); keepInside(); render(); raf = visible ? scope.raf(loop) : 0; };

  const dropAll = (instant: boolean) => {
    dropped = true;
    const W = zone.clientWidth;
    items.forEach((item, i) => {
      const x = W * (0.12 + 0.76 * ((i * 0.618) % 1));
      if (instant) makeBody(item, x, -120 - i * 160);
      else scope.timeout(() => makeBody(item, x, -item.h), 140 * i);
    });
    if (instant) { for (let n = 0; n < 900; n++) Engine.update(engine, 1000 / 60); closeLid(); keepInside(); render(); }
    else scope.timeout(closeLid, 140 * items.length + 1400);
  };

  if (finePointer && !still) {
    const mouse = Mouse.create(zone) as Matter.Mouse & Record<string, EventListener>;
    // Matter grabs the wheel and touch scrolling by default; give the page its scroll back
    ['mousewheel', 'DOMMouseScroll', 'wheel'].forEach(t => zone.removeEventListener(t, mouse.mousewheel));
    zone.removeEventListener('touchmove', mouse.mousemove); zone.removeEventListener('touchstart', mouse.mousedown); zone.removeEventListener('touchend', mouse.mouseup);
    Composite.add(engine.world, MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.2, render: { visible: false } } as Matter.IConstraintDefinition }));
    // Only parcels take the mouse (CSS); during a drag the whole zone does, so the parcel can be pulled anywhere in the box
    scope.on(zone, 'mousedown', () => zone.classList.add('is-dragging'));
    scope.on(window, 'mouseup', e => {
      zone.classList.remove('is-dragging');
      mouse.mouseup(e);   // a release outside the zone still drops the parcel
    });
    scope.add(() => zone.classList.remove('is-dragging'));
    scope.add(() => {
      (['mousemove', 'mousedown', 'mouseup'] as const).forEach(t => zone.removeEventListener(t, mouse[t]));
      (Mouse as unknown as { clearSourceEvents?: (m: Matter.Mouse) => void }).clearSourceEvents?.(mouse);
    });
  }

  scope.observe(([en]) => {
    visible = en.isIntersecting;
    if (!visible) return;
    if (still) { if (!dropped) dropAll(true); return; }
    if (!dropped) dropAll(false);
    if (!raf) raf = scope.raf(loop);
  }, footer, { threshold: 0.3 });

  let rt = 0;
  scope.on(window, 'resize', () => {
    clearTimeout(rt);
    rt = scope.timeout(() => {
      buildWalls();
      const W = zone.clientWidth;
      bodies.forEach(({ body, item }) => { if (body.position.x > W - item.w / 2) Body.setPosition(body, { x: W - item.w, y: body.position.y - 120 }); });
      keepInside();
      if (still && dropped) { for (let n = 0; n < 300; n++) { Engine.update(engine, 1000 / 60); keepInside(); } render(); }
    }, 150);
  });
}
