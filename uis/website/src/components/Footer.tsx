import { css } from '../lib/css';

/**
 * Footer: an open shipping box; parcels and stickers drop in and pile up inside it (Matter.js), draggable with a mouse.
 * Also rendered as static markup into application.html (see entry-server.tsx); there `onHomePage` is false,
 * so the links point back to the home page's sections.
 */
export default function Footer({ onHomePage = true }: { onHomePage?: boolean }) {
  const to = (id: string) => (onHomePage ? `#${id}` : id === 'home' ? '/' : `/#${id}`);
  return (
    <>
      <footer id="site-footer" className="site-footer">
        {/* An open shipping box, front panel cut away: back wall, side walls, floor and flaps, as wide as the navbar */}
        <div className="crate">
          <div className="crate-shell" aria-hidden="true">
            <div className="cr-flap-back"></div>
            <div className="cr-flap cr-flap-l"></div>
            <div className="cr-flap cr-flap-r"></div>
            <div className="cr-body"></div>
            <div className="cr-back"></div>
            <div className="cr-floor"></div>
            <div className="cr-seam cr-seam-tl"></div>
            <div className="cr-seam cr-seam-tr"></div>
            <div className="cr-seam cr-seam-bl"></div>
            <div className="cr-seam cr-seam-br"></div>
            <div className="cr-cut cr-cut-l"></div>
            <div className="cr-cut cr-cut-r"></div>
            <div className="cr-cut cr-cut-b"></div>
          </div>
          <nav aria-label="Footer" className="footer-nav flex flex-wrap items-start justify-center gap-x-[clamp(20px,4vw,44px)] gap-y-1">
            <a href={to('home')}>Home</a>
            <a href={to('services')}>Services</a>
            <a href={to('coverage')}>Coverage</a>
            <a href={to('contact')}>Contact</a>
            <a href="https://linkedin.com/company/trackflow" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </nav>
          <div className="footer-mark text-center">
            <p className="m-0 inline-flex items-center gap-2 text-brand-ink">
              <svg width="26" height="26" viewBox="2 2 24 24" fill="none" aria-hidden="true" style={css({ overflow: 'visible' })}>
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
              <span className="wide text-[28px] font-extrabold leading-none">TrackFlow</span>
            </p>
            <p className="display m-0 mt-3 text-[clamp(3rem,10vw,9rem)] text-brand-ink">
              From click
              <br />
              to doorstep.
            </p>
            <p className="note m-0 mt-3 hidden" id="drag-hint">
              go on, throw the parcels around ↓
            </p>
            <address className="mt-4 text-sm not-italic text-brand-ink">
              <a href="mailto:comercial@trackflow.com">comercial@trackflow.com</a>
              {' · '}
              Los Angeles <a href="tel:+12135550147">+1 213 555 0147</a>
              {' · '}
              Zaragoza <a href="tel:+34976123456">+34 976 123 456</a>
            </address>
          </div>
          <div id="drop-zone" className="drop-zone" aria-hidden="true">
            <div className="drop-item" data-shape="box" data-w="150" data-h="112" style={css({ '--c': 'var(--svc-same)' })}>
              <div className="box">
                <span className="tag-label"></span>
              </div>
            </div>
            <div className="drop-item" data-shape="disc" data-w="140" style={css({ '--c': 'var(--svc-express)' })}>
              <div className="disc">
                <span style={css({ fontSize: '26px' })}>
                  Los
                  <br />
                  Angeles<small>United States</small>
                </span>
              </div>
            </div>
            <div className="drop-item" data-shape="box" data-w="118" data-h="96" style={css({ '--c': 'var(--svc-express)' })}>
              <div className="box">
                <span className="tag-label"></span>
              </div>
            </div>
            <div className="drop-item" data-shape="disc" data-w="128" style={css({ '--c': 'var(--svc-same)' })}>
              <div className="disc">
                <span style={css({ fontSize: '28px' })}>
                  Last
                  <br />
                  mile<small>TrackFlow</small>
                </span>
              </div>
            </div>
            <div className="drop-item" data-shape="box" data-w="186" data-h="124" style={css({ '--c': 'var(--svc-freight)' })}>
              <div className="box">
                <span className="tag-label"></span>
              </div>
            </div>
            <div className="drop-item" data-shape="disc" data-w="150" style={css({ '--c': 'var(--svc-freight)' })}>
              <div className="disc">
                <span style={css({ fontSize: '27px' })}>
                  Zaragoza<small>Spain</small>
                </span>
              </div>
            </div>
            <div className="drop-item" data-shape="box" data-w="104" data-h="104" style={css({ '--c': 'var(--svc-store)' })}>
              <div className="box">
                <span className="tag-label"></span>
              </div>
            </div>
            <div className="drop-item" data-shape="disc" data-w="134" style={css({ '--c': 'var(--svc-store)' })}>
              <div className="disc">
                <span style={css({ fontSize: '28px' })}>
                  Stored<small>Real-time</small>
                </span>
              </div>
            </div>
            <div className="drop-item" data-shape="disc" data-w="132" style={css({ '--c': 'var(--svc-express)' })}>
              <div className="disc">
                <span style={css({ fontSize: '28px' })}>
                  Returns<small>Reconditioned</small>
                </span>
              </div>
            </div>
            <div className="drop-item" data-shape="disc" data-w="120" style={css({ '--c': '255 255 70' })}>
              <div className="disc">
                <span style={css({ fontSize: '30px' })}>
                  98.6%<small>On time</small>
                </span>
              </div>
            </div>
            <div className="drop-item" data-shape="box" data-w="160" data-h="100" style={css({ '--c': 'var(--svc-express)' })}>
              <div className="box">
                <span className="tag-label"></span>
              </div>
            </div>
          </div>
        </div>
        <p className="footer-copy">© 2026 TrackFlow. All rights reserved.</p>
      </footer>
    </>
  );
}
