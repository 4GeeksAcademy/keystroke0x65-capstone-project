/**
 * Teardown bookkeeping for the motion runtime. Everything the runtime starts (listeners, timers,
 * observers, animation frames, WebGL contexts, injected DOM) registers here, so bootSite()'s cleanup
 * leaves the page exactly as React rendered it. That keeps StrictMode double-mounts and HMR safe.
 */
export class Scope {
  private disposers: Array<() => void> = [];
  dead = false;

  /** Run `fn` on dispose (last registered runs first). */
  add(fn: () => void) {
    this.disposers.push(fn);
  }

  on<K extends keyof WindowEventMap>(target: Window, type: K, fn: (e: WindowEventMap[K]) => void, opts?: AddEventListenerOptions): void;
  on<K extends keyof DocumentEventMap>(target: Document, type: K, fn: (e: DocumentEventMap[K]) => void, opts?: AddEventListenerOptions): void;
  on<K extends keyof HTMLElementEventMap>(target: HTMLElement, type: K, fn: (e: HTMLElementEventMap[K]) => void, opts?: AddEventListenerOptions): void;
  on(target: EventTarget, type: string, fn: (e: Event) => void, opts?: AddEventListenerOptions): void;
  on(target: EventTarget, type: string, fn: (e: never) => void, opts?: AddEventListenerOptions) {
    const h = fn as unknown as EventListener;
    target.addEventListener(type, h, opts);
    this.add(() => target.removeEventListener(type, h, opts));
  }

  timeout(fn: () => void, ms: number) {
    const id = window.setTimeout(() => { if (!this.dead) fn(); }, ms);
    this.add(() => clearTimeout(id));
    return id;
  }

  interval(fn: () => void, ms: number) {
    const id = window.setInterval(fn, ms);
    this.add(() => clearInterval(id));
    return id;
  }

  /** requestAnimationFrame that stops scheduling once the scope is disposed. */
  raf = (fn: FrameRequestCallback): number => {
    if (this.dead) return 0;
    const id = requestAnimationFrame(t => { if (!this.dead) fn(t); });
    this.lastRaf = id;
    return id;
  };
  private lastRaf = 0;

  observe(cb: IntersectionObserverCallback, targets: Element | Element[], opts?: IntersectionObserverInit) {
    const io = new IntersectionObserver(cb, opts);
    (Array.isArray(targets) ? targets : [targets]).forEach(t => io.observe(t));
    this.add(() => io.disconnect());
    return io;
  }

  /** Resolve a promise only while the scope is alive (fonts.ready etc.). */
  then<T>(p: Promise<T> | undefined, fn: (v: T) => void) {
    p?.then(v => { if (!this.dead) fn(v); }).catch(() => {});
  }

  dispose() {
    if (this.dead) return;
    this.dead = true;
    cancelAnimationFrame(this.lastRaf);
    for (let i = this.disposers.length - 1; i >= 0; i--) {
      try { this.disposers[i](); } catch (e) { console.error(e); }
    }
    this.disposers = [];
  }
}
