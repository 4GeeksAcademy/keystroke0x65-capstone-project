/** FAQ + the porch scene (courier drops a parcel, knocks, door opens, wave). */
export default function Faq() {
  return (
    <>
      <section id="faq" className="relative px-5 py-24 md:py-28" aria-labelledby="faq-title">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="tag label m-0">Questions</p>
            <h2 id="faq-title" className="display m-0 mt-5 text-[clamp(3rem,6vw,5rem)]">
              Frequently asked.
            </h2>
            <div id="door-scene" className="door-scene" aria-hidden="true">
              <p className="note door-note door-pop" id="door-knock">
                knock knock!
              </p>
              <div className="door-pop" id="door-done">
                <span className="hub-check">
                  <svg viewBox="0 0 32 32">
                    <circle className="hc-disc" cx="16" cy="16" r="14" />
                    <path className="hc-tick" d="M9.5 16.5l4.5 4.5 8.5-9.5" pathLength="1" />
                  </svg>
                </span>
                <span className="note door-note">delivered!</span>
              </div>
              <svg id="door-svg" viewBox="0 0 170 232" fill="none" stroke="#2B1D0E" strokeWidth="3" strokeLinejoin="round">
                <defs>
                  <linearGradient id="door-in" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#FFE38A" />
                    <stop offset="1" stopColor="#F2B640" />
                  </linearGradient>
                </defs>
                {/* porch lantern on the side of the frame */}
                <path d="M134 84h12" strokeWidth="3" />
                <path d="M140 76l9 -7 9 7z" fill="#2B1D0E" />
                <rect x="142" y="76" width="14" height="18" rx="2" fill="#FFF8E7" />
                <path d="M141 96h16" strokeWidth="3" strokeLinecap="round" />
                <rect x="16" y="20" width="118" height="190" rx="5" fill="#2B1D0E" />
                <rect x="26" y="28" width="98" height="180" fill="url(#door-in)" stroke="none" />
                <g id="door-slab">
                  <rect x="26" y="28" width="98" height="180" rx="2" fill="#8C8CF7" />
                  <rect x="40" y="44" width="70" height="44" rx="6" fill="#86CDEB" />
                  <path d="M48 52l14-6" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                  <rect x="40" y="104" width="70" height="88" rx="5" strokeWidth="2.5" />
                  <circle cx="110" cy="128" r="6" fill="#FFF8E7" />
                </g>
                <rect x="8" y="208" width="134" height="9" rx="2" fill="#2B1D0E" />
                <rect x="22" y="217" width="106" height="12" rx="3" fill="#FF1F2F" />
                <text
                  x="75"
                  y="227"
                  textAnchor="middle"
                  fontFamily="'Archivo Variable', Archivo, Arial Narrow, sans-serif"
                  fontWeight="900"
                  fontStretch="62.5%"
                  fontSize="11"
                  fill="#FFF8E7"
                  stroke="none"
                  letterSpacing="2"
                >
                  HELLO
                </text>
              </svg>
            </div>
          </div>
          <div className="faq glass rim blur-3 rounded-[var(--radius-panel)] px-6 md:col-span-8 md:px-8">
            <details className="border-b-2 border-dashed border-brand-ink/25 last:border-b-0">
              <summary>
                <h3 className="wide m-0 text-lg font-bold leading-snug md:text-xl">What logistics services does TrackFlow offer?</h3>
                <span className="plus" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 14 14">
                    <g stroke="#2B1D0E" strokeWidth="2.4" strokeLinecap="round">
                      <path d="M1 7h12" />
                      <path className="bar-v" d="M7 1v12" />
                    </g>
                  </svg>
                </span>
              </summary>
              <p className="m-0 max-w-2xl pb-6 text-[17px] leading-relaxed">
                TrackFlow offers warehouse management, last-mile deliveries, and reverse logistics for e-commerce brands operating in the
                United States and Spain.
              </p>
            </details>
            <details className="border-b-2 border-dashed border-brand-ink/25 last:border-b-0">
              <summary>
                <h3 className="wide m-0 text-lg font-bold leading-snug md:text-xl">Where are TrackFlow warehouses located?</h3>
                <span className="plus" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 14 14">
                    <g stroke="#2B1D0E" strokeWidth="2.4" strokeLinecap="round">
                      <path d="M1 7h12" />
                      <path className="bar-v" d="M7 1v12" />
                    </g>
                  </svg>
                </span>
              </summary>
              <p className="m-0 max-w-2xl pb-6 text-[17px] leading-relaxed">
                TrackFlow operates warehouses in Los Angeles, California (United States) and Zaragoza, Aragón (Spain), providing binational
                coverage.
              </p>
            </details>
            <details className="border-b-2 border-dashed border-brand-ink/25 last:border-b-0">
              <summary>
                <h3 className="wide m-0 text-lg font-bold leading-snug md:text-xl">Which industries does TrackFlow serve?</h3>
                <span className="plus" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 14 14">
                    <g stroke="#2B1D0E" strokeWidth="2.4" strokeLinecap="round">
                      <path d="M1 7h12" />
                      <path className="bar-v" d="M7 1v12" />
                    </g>
                  </svg>
                </span>
              </summary>
              <p className="m-0 max-w-2xl pb-6 text-[17px] leading-relaxed">
                TrackFlow specializes in fashion, electronics, and cosmetics e-commerce brands, with over 15 years of industry experience.
              </p>
            </details>
            <details className="border-b-2 border-dashed border-brand-ink/25 last:border-b-0">
              <summary>
                <h3 className="wide m-0 text-lg font-bold leading-snug md:text-xl">Does TrackFlow handle returns management?</h3>
                <span className="plus" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 14 14">
                    <g stroke="#2B1D0E" strokeWidth="2.4" strokeLinecap="round">
                      <path d="M1 7h12" />
                      <path className="bar-v" d="M7 1v12" />
                    </g>
                  </svg>
                </span>
              </summary>
              <p className="m-0 max-w-2xl pb-6 text-[17px] leading-relaxed">
                Yes, TrackFlow provides complete reverse logistics including returns management, inspection, reconditioning, and integration
                with your sales platform.
              </p>
            </details>
          </div>
        </div>
      </section>
    </>
  );
}
