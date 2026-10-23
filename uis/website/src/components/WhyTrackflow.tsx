import { css } from '../lib/css';

/** Why TrackFlow: the three reasons with their discs. */
export default function WhyTrackflow() {
  return (
    <>
      <section id="why-trackflow" className="relative px-5 py-24 md:py-28" aria-labelledby="why-title">
        <div className="stamp lg-only" style={css({ right: '4%', top: '30px', width: '210px', rotate: '-9deg' })} aria-hidden="true">
          <svg viewBox="0 0 220 220" fill="none" stroke="currentColor">
            <g filter="url(#ink)">
              <defs>
                <path id="cert-ring" d="M110 110m-84 0a84 84 0 1 1 168 0a84 84 0 1 1 -168 0" />
              </defs>
              <circle cx="110" cy="110" r="104" strokeWidth="5" />
              <circle cx="110" cy="110" r="66" strokeWidth="3" />
              <text
                fontFamily="'Archivo Variable', Archivo, Arial Narrow, sans-serif"
                fontWeight="900"
                fontStretch="62.5%"
                fill="currentColor"
                stroke="none"
                fontSize="17"
                letterSpacing="2"
              >
                <textPath href="#cert-ring" textLength="520" lengthAdjust="spacing">
                  BOX CERTIFICATE • TRACKFLOW • LOS ANGELES • ZARAGOZA •
                </textPath>
              </text>
              <text
                x="110"
                y="98"
                textAnchor="middle"
                fontFamily="'Archivo Variable', Archivo, Arial Narrow, sans-serif"
                fontWeight="900"
                fontStretch="62.5%"
                fill="currentColor"
                stroke="none"
                fontSize="20"
              >
                SINGLE WALL
              </text>
              <text
                x="110"
                y="120"
                textAnchor="middle"
                fontFamily="'Archivo Variable', Archivo, Arial Narrow, sans-serif"
                fontWeight="900"
                fontStretch="62.5%"
                fill="currentColor"
                stroke="none"
                fontSize="20"
              >
                CORRUGATED
              </text>
              <text
                x="110"
                y="142"
                textAnchor="middle"
                fontFamily="'Archivo Variable', Archivo, Arial Narrow, sans-serif"
                fontWeight="900"
                fontStretch="62.5%"
                fill="currentColor"
                stroke="none"
                fontSize="16"
              >
                SINCE 2009
              </text>
            </g>
          </svg>
        </div>
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="tag label m-0">Why TrackFlow</p>
              <h2 id="why-title" className="display m-0 mt-5 max-w-4xl text-[clamp(3rem,6.4vw,5.5rem)]">
                Logistics expertise with a global point of view.
              </h2>
            </div>
            <p className="note m-0" aria-hidden="true">
              since 2009, from Los Angeles
            </p>
          </div>
          <ul className="m-0 mt-14 grid list-none gap-12 p-0 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            <li style={css({ '--c': 'var(--svc-express)' })}>
              <span className="why-disc" aria-hidden="true">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#2B1D0E" strokeWidth="2.6">
                  <circle cx="18" cy="18" r="13" />
                  <path d="M5 18h26M18 5c-5 6-5 20 0 26M18 5c5 6 5 20 0 26" />
                </svg>
              </span>
              <h3 className="display m-0 mt-6 text-[2.25rem]">Binational operation</h3>
              <p className="m-0 mt-2 max-w-[16rem] leading-relaxed">
                The only operator with own infrastructure in the United States and Spain
              </p>
            </li>
            <li style={css({ '--c': 'var(--svc-freight)' })}>
              <span className="why-disc" aria-hidden="true">
                <svg width="38" height="38" viewBox="0 0 38 38" fill="none" stroke="#2B1D0E" strokeWidth="2.6" strokeLinecap="round">
                  <circle cx="14" cy="13" r="5" />
                  <circle cx="26" cy="15" r="4" />
                  <path d="M5 30c1-6 5-9 9-9s8 3 9 9M23 30c.5-4 2.5-7 5-7s5 2.5 6 7" />
                </svg>
              </span>
              <h3 className="display m-0 mt-6 text-[2.25rem]">+130 professionals</h3>
              <p className="m-0 mt-2 max-w-[16rem] leading-relaxed">Dedicated to your logistics</p>
            </li>
            <li style={css({ '--c': 'var(--svc-store)' })}>
              <span className="why-disc" aria-hidden="true">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#2B1D0E" strokeWidth="2.6" strokeLinejoin="round">
                  <rect x="5" y="7" width="26" height="17" rx="3" />
                  <path d="M13 30h10M18 24v6M10 19l5-5 4 3 6-6" />
                </svg>
              </span>
              <h3 className="display m-0 mt-6 text-[2.25rem]">Own technology</h3>
              <p className="m-0 mt-2 max-w-[16rem] leading-relaxed">For total visibility of your inventory</p>
            </li>
            <li style={css({ '--c': 'var(--svc-same)' })}>
              <span className="why-disc" aria-hidden="true">
                <svg width="34" height="34" viewBox="0 0 34 34" fill="none" stroke="#2B1D0E" strokeWidth="2.6" strokeLinejoin="round">
                  <path d="M6 11h22l-2 19H8z" />
                  <path d="M12 14V9a5 5 0 0110 0v5" />
                </svg>
              </span>
              <h3 className="display m-0 mt-6 text-[2.25rem]">E-commerce specialization</h3>
              <p className="m-0 mt-2 max-w-[16rem] leading-relaxed">In fashion, electronics, and cosmetics</p>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
