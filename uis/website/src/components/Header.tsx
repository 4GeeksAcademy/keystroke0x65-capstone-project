import { useEffect, useRef, useState } from 'react';
import { css } from '../lib/css';
import Barcode from './Barcode';

const LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'coverage', label: 'Coverage' },
  { id: 'contact', label: 'Contact' },
] as const;

/** One service colour per menu row, like the numbered discs on the service cards. */
const MENU_COLORS = ['var(--svc-same)', 'var(--svc-store)', 'var(--svc-express)', 'var(--svc-freight)'];

/** Navbar: a strip of red tape laid by the tape gun during the intro. */
export default function Header() {
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);

  // Escape closes the mobile menu and returns focus to its button
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        btn.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <header className="site-header">
        <div className="rg-shape rg-nav-shadow" aria-hidden="true"></div>
        <div id="dispenser" className="dispenser" aria-hidden="true">
          <div className="dp-body">
            <svg viewBox="0 0 176 96" fill="none" strokeLinejoin="round">
              <defs>
                <linearGradient id="dp-roll" x1="0" x2="1">
                  <stop offset="0" stopColor="#A3000D" />
                  <stop offset="0.28" stopColor="#FF1F2F" />
                  <stop offset="0.44" stopColor="#FF9AA1" />
                  <stop offset="0.58" stopColor="#FF1F2F" />
                  <stop offset="1" stopColor="#8F000B" />
                </linearGradient>
                <clipPath id="dp-roll-clip">
                  <rect x="20" y="16" width="64" height="64" rx="7" />
                </clipPath>
              </defs>
              <path d="M58 11L118 36v24L58 85" stroke="#2B1D0E" strokeWidth="9" strokeLinecap="round" />
              <rect x="112" y="31" width="60" height="34" rx="15" fill="#2B1D0E" />
              <path d="M130 38v20M140 38v20M150 38v20M160 38v20" stroke="#FFF8E7" strokeWidth="3" strokeLinecap="round" opacity="0.45" />
              <rect x="4" y="16" width="20" height="64" fill="#FF1F2F" fillOpacity="0.7" />
              <rect x="20" y="16" width="64" height="64" rx="7" fill="url(#dp-roll)" fillOpacity="0.94" />
              <g id="dp-seams" clipPath="url(#dp-roll-clip)" stroke="#6E0008" strokeWidth="2">
                <line y1="16" y2="80" />
                <line y1="16" y2="80" />
                <line y1="16" y2="80" />
                <line y1="16" y2="80" />
                <line y1="16" y2="80" />
                <line y1="16" y2="80" />
              </g>
              <rect x="20" y="16" width="64" height="64" rx="7" stroke="#2B1D0E" strokeWidth="3.5" />
              <rect x="10" y="4" width="88" height="13" rx="6.5" fill="#2B1D0E" />
              <rect x="10" y="79" width="88" height="13" rx="6.5" fill="#2B1D0E" />
              <circle cx="52" cy="10.5" r="4" fill="#FFF8E7" />
              <circle cx="52" cy="85.5" r="4" fill="#FFF8E7" />
              <path
                d="M15 12H7 L1 16 L7 20 L1 24 L7 28 L1 32 L7 36 L1 40 L7 44 L1 48 L7 52 L1 56 L7 60 L1 64 L7 68 L1 72 L7 76 L1 80 L7 84 L7 84H15Z"
                fill="#C9D1D6"
                stroke="#2B1D0E"
                strokeWidth="3"
              />
            </svg>
          </div>
        </div>
        <div className="rg-shape rg-nav rg-blur" aria-hidden="true"></div>
        <div className="rg-shape rg-nav rg-tint" aria-hidden="true"></div>
        <nav aria-label="Primary" className="rg-shape rg-nav rg-face on-red flex items-center justify-between pl-5 pr-2">
          <a href="#home" className="flex items-center gap-1 text-white no-underline" aria-label="TrackFlow home">
            <svg width="16" height="16" viewBox="2 2 24 24" aria-hidden="true" fill="none" style={css({ overflow: 'visible' })}>
              <path
                d="M6 22C6 13 22 15 22 6"
                stroke="currentColor"
                strokeWidth="2.5"
                pathLength="10"
                strokeDasharray="1 0.567"
                strokeDashoffset="0.984"
              />
              <circle cx="6" cy="22" r="4" fill="currentColor" />
              <circle cx="22" cy="6" r="4" fill="currentColor" />
            </svg>
            <span className="wide text-[22px] font-extrabold leading-none tracking-[-0.01em]">TrackFlow</span>
          </a>
          <ul id="nav-list" className="relative m-0 hidden list-none items-center gap-1 p-0 md:flex">
            <span id="nav-indicator" aria-hidden="true"></span>
            {LINKS.map((l) => (
              <li key={l.id}>
                <a className="nav-link" href={`#${l.id}`} data-section={l.id}>
                  <span className="ink">{l.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <button
            ref={btn}
            id="menu-btn"
            type="button"
            className="grid h-12 w-12 place-items-center rounded-xl text-white md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
              <path
                id="menu-icon"
                d={open ? 'M5 5l12 12M17 5L5 17' : 'M3 6h16M3 11h16M3 16h16'}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </nav>
        <div
          id="mobile-menu"
          className="md:hidden"
          hidden={!open}
          onClick={(e) => {
            if ((e.target as Element).closest('a')) setOpen(false);
          }}
        >
          {/* A shipping label taped under the navbar, in the same style as the service cards */}
          <div className="menu-label">
            <div className="menu-head" aria-hidden="true">
              <span className="label">Ship to</span>
              <span className="label">No. 04</span>
            </div>
            <ul className="menu-list">
              {LINKS.map((l, i) => (
                <li key={l.id}>
                  <a className="nav-link" href={`#${l.id}`} data-section={l.id} style={css({ '--c': MENU_COLORS[i] })}>
                    <span className="menu-num" aria-hidden="true">
                      0{i + 1}
                    </span>
                    <span className="ink">{l.label}</span>
                    <svg className="menu-arrow" width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                      <path d="M4 11h13M12 5.5l5.5 5.5-5.5 5.5" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
            <div className="menu-foot" aria-hidden="true">
              <Barcode seed={9} />
              <span className="label">TF·NAV·04</span>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
