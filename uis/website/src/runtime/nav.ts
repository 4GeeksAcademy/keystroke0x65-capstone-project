import type { Scope } from './scope';
import { $$, $id } from './dom';

/** Nav: the marker underline follows the section you're reading; in-page links scroll and move focus. */
export function initNav(scope: Scope) {
  const list = $id('nav-list');
  const ind = $id('nav-indicator');
  const deskLinks = $$<HTMLAnchorElement>('.nav-link', list);
  const allLinks = () => $$<HTMLAnchorElement>('.nav-link[data-section]');
  let current: string | null = null;

  const moveTo = (id: string) => {
    allLinks().forEach(l => (l.dataset.section === id ? l.setAttribute('aria-current', 'true') : l.removeAttribute('aria-current')));
    const link = deskLinks.find(l => l.dataset.section === id);
    if (!link || !list.offsetParent) return;
    ind.style.transform = `translateX(${link.offsetLeft + 14}px) scaleX(${(link.offsetWidth - 28) / 100})`;
    ind.style.setProperty('--ul-on', '1');
  };

  scope.observe(entries => {
    entries.forEach(en => { if (en.isIntersecting && en.target.id !== current) { current = en.target.id; moveTo(current); } });
  }, ['home', 'services', 'coverage', 'contact'].map(id => $id(id)), { rootMargin: '-45% 0px -50% 0px' });

  scope.on(window, 'resize', () => current && moveTo(current));
  scope.then(document.fonts?.ready, () => current && moveTo(current));

  scope.on(document, 'click', e => {
    const a = (e.target as Element | null)?.closest?.('a[href^="#"]');
    if (!a) return;
    const target = document.querySelector<HTMLElement>(a.getAttribute('href') ?? '');
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView();
    target.focus({ preventScroll: true });
  });

  scope.add(() => {
    ind.style.transform = '';
    ind.style.removeProperty('--ul-on');
    allLinks().forEach(l => l.removeAttribute('aria-current'));
  });
}
