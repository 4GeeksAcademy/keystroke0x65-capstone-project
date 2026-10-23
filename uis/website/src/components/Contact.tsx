import LocalTime from './LocalTime';
import { css } from '../lib/css';

/** Contact: CTA hanging from a thumbtack, offices sheet stapled to the board. */
export default function Contact() {
  return (
    <>
      <section id="contact" tabIndex={-1} className="px-5 pb-24 pt-24 md:pt-32" aria-labelledby="contact-title">
        <div className="contact-board mx-auto grid max-w-6xl gap-10 md:grid-cols-12 md:items-stretch">
          <div className="cta-panel pinned on-ink flex flex-col items-start md:col-span-6">
            <span className="tack" aria-hidden="true">
              <svg viewBox="0 0 46 50">
                <defs>
                  <radialGradient id="tack-sh" cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0" stopColor="#2B1D0E" stopOpacity="0.42" />
                    <stop offset="1" stopColor="#2B1D0E" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <ellipse cx="29" cy="37" rx="17" ry="9" fill="url(#tack-sh)" />
                <circle cx="23" cy="23" r="17" fill="#C8102E" stroke="#2B1D0E" strokeWidth="2.5" />
                <circle cx="21.5" cy="20.5" r="11" fill="#FF1F2F" stroke="#2B1D0E" strokeWidth="2" />
                <ellipse cx="17.5" cy="15.5" rx="4.6" ry="2.6" transform="rotate(-32 17.5 15.5)" fill="#fff" opacity="0.75" />
                <path d="M9.5 30a17 17 0 0 0 12 9" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity="0.35" />
              </svg>
            </span>
            <p className="label m-0 text-brand-cream">Contact TrackFlow</p>
            <h2 id="contact-title" className="display m-0 mt-4 text-[clamp(3.5rem,6.6vw,6rem)]">
              Let’s make it flow.
            </h2>
            <a href="/application.html" className="btn-yellow mt-8">
              Request information{' '}
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" width="16" height="16">
                <path d="M5 15 15 5M7 5h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <p className="mt-8 mb-0">
              <a
                className="font-semibold text-brand-yellow underline decoration-2 underline-offset-4"
                href="mailto:comercial@trackflow.com"
              >
                comercial@trackflow.com
              </a>
            </p>
          </div>
          <div className="contact-card md:col-span-6">
            <span className="staple" style={css({ left: '30px', rotate: '-11deg' })} aria-hidden="true">
              <svg viewBox="0 0 54 14">
                <defs>
                  <linearGradient id="staple-steel" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#F6F8F9" />
                    <stop offset="0.55" stopColor="#C3CACE" />
                    <stop offset="1" stopColor="#8D969B" />
                  </linearGradient>
                </defs>
                <rect x="4.5" y="5.5" width="46" height="5" rx="1.6" fill="#2B1D0E" opacity="0.22" />
                <rect x="1.5" y="4" width="4" height="5.5" rx="1" fill="#2B1D0E" />
                <rect x="47.5" y="4" width="4" height="5.5" rx="1" fill="#2B1D0E" />
                <rect x="3" y="3.2" width="47" height="5" rx="1.6" fill="url(#staple-steel)" stroke="#2B1D0E" strokeWidth="1.3" />
                <path d="M6 4.8h41" stroke="#fff" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
              </svg>
            </span>
            <span className="staple" style={css({ right: '30px', rotate: '8deg' })} aria-hidden="true">
              <svg viewBox="0 0 54 14">
                <rect x="4.5" y="5.5" width="46" height="5" rx="1.6" fill="#2B1D0E" opacity="0.22" />
                <rect x="1.5" y="4" width="4" height="5.5" rx="1" fill="#2B1D0E" />
                <rect x="47.5" y="4" width="4" height="5.5" rx="1" fill="#2B1D0E" />
                <rect x="3" y="3.2" width="47" height="5" rx="1.6" fill="url(#staple-steel)" stroke="#2B1D0E" strokeWidth="1.3" />
                <path d="M6 4.8h41" stroke="#fff" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
              </svg>
            </span>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 pt-3">
              <p className="label m-0">Warehouses &amp; sales</p>
              <p className="cc-ref m-0" aria-hidden="true">
                TF·OFFICES·02
              </p>
            </div>
            <ul className="cc-offices">
              <li className="cc-office">
                <p className="m-0 flex items-center gap-2">
                  <span className="cc-code" aria-hidden="true">
                    US
                  </span>
                  <span className="label">United States</span>
                </p>
                <h3 className="display m-0 mt-3 whitespace-nowrap text-[clamp(2.1rem,2.9vw,2.65rem)]">Los Angeles</h3>
                <p className="m-0 mt-1">California</p>
                <p className="cc-time">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <circle cx="8" cy="8" r="6.5" />
                    <path d="M8 4.5V8l2.5 1.6" />
                  </svg>
                  <span>
                    <LocalTime tz="America/Los_Angeles" /> local time
                  </span>
                </p>
                <a className="cc-phone" href="tel:+12135550147">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 2.5h3l1.5 4-2 1.3a10 10 0 0 0 4.7 4.7l1.3-2 4 1.5v3a2 2 0 0 1-2 2A15 15 0 0 1 3 4.5a2 2 0 0 1 2-2z" />
                  </svg>
                  +1 213 555 0147
                </a>
              </li>
              <li className="cc-office">
                <p className="m-0 flex items-center gap-2">
                  <span className="cc-code" aria-hidden="true">
                    ES
                  </span>
                  <span className="label">Spain</span>
                </p>
                <h3 className="display m-0 mt-3 whitespace-nowrap text-[clamp(2.1rem,2.9vw,2.65rem)]">Zaragoza</h3>
                <p className="m-0 mt-1">Aragón</p>
                <p className="cc-time">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <circle cx="8" cy="8" r="6.5" />
                    <path d="M8 4.5V8l2.5 1.6" />
                  </svg>
                  <span>
                    <LocalTime tz="Europe/Madrid" /> local time
                  </span>
                </p>
                <a className="cc-phone" href="tel:+34976123456">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 2.5h3l1.5 4-2 1.3a10 10 0 0 0 4.7 4.7l1.3-2 4 1.5v3a2 2 0 0 1-2 2A15 15 0 0 1 3 4.5a2 2 0 0 1 2-2z" />
                  </svg>
                  +34 976 123 456
                </a>
              </li>
            </ul>
            <div className="cc-foot">
              <p className="m-0">
                Our sales team speaks <strong>English</strong> and <strong>Spanish</strong>.
              </p>
              <a className="cc-link" href="https://linkedin.com/company/trackflow" target="_blank" rel="noreferrer">
                TrackFlow on LinkedIn{' '}
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M5 15 15 5M7 5h8v8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
