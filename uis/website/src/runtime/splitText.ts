/**
 * Letter splitting: words stay whole, every letter can move on its own.
 * Screen readers get one clean copy of the text; the split copy is hidden from them.
 * The original markup is kept so the split can be undone on teardown.
 */
export interface Split {
  chars: HTMLElement[];
  rest: Array<{ r: number; y: number }>;
  applyRest: () => void;
}

const cache = new Map<HTMLElement, Split & { original: string; hadClass: boolean }>();
const esc = (c: string) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' } as Record<string, string>)[c] ?? c;

export function splitChars(el: HTMLElement | null, restAmp = 0): Split | null {
  if (!el) return null;
  const hit = cache.get(el);
  if (hit) return hit;
  const original = el.innerHTML;
  const hadClass = el.classList.contains('split');
  const tmp = document.createElement('div');
  const segs = original.split(/<br\s*\/?>/i).map(h => { tmp.innerHTML = h; return (tmp.textContent ?? '').replace(/\s+/g, ' ').trim(); });
  el.innerHTML = `<span class="sr-only">${segs.join(' ').replace(/[&<>]/g, esc)}</span><span aria-hidden="true">` +
    segs.map(seg => seg.split(' ').map(w => `<span class="w">${[...w].map(c => `<span class="ch">${esc(c)}</span>`).join('')}</span>`).join(' ')).join('<br>') + '</span>';
  el.classList.add('split');
  let sd = 7 + segs.join('').length * 13;
  const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
  const chars = [...el.querySelectorAll<HTMLElement>('.ch')];
  // fixed resting pose: every letter lands slightly crooked, the same way on every visit
  const rest = chars.map(() => ({ r: (rnd() - 0.5) * restAmp, y: (rnd() - 0.5) * restAmp * 0.007 }));
  const applyRest = () => chars.forEach((c, i) => { c.style.transform = restAmp ? `translateY(${rest[i].y.toFixed(3)}em) rotate(${rest[i].r.toFixed(2)}deg)` : ''; });
  applyRest();
  const split = { chars, rest, applyRest, original, hadClass };
  cache.set(el, split);
  return split;
}

/** Put every split element back to the markup React rendered. */
export function unsplitAll() {
  for (const [el, hit] of cache) {
    el.innerHTML = hit.original;
    el.classList.remove('rising');
    if (!hit.hadClass) el.classList.remove('split');
  }
  cache.clear();
}
