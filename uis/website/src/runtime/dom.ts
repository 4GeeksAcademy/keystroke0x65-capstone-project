/** Element lookups for the runtime. The markup is React's, so a missing id is a real bug: fail loudly. */
export function $id(id: string): HTMLElement;
export function $id<T extends Element>(id: string): T;
export function $id(id: string): Element {
  const el = document.getElementById(id);
  if (!el) throw new Error(`TrackFlow runtime: #${id} not found`);
  return el;
}

export const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
export const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
