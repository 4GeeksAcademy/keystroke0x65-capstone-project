import { css } from '../lib/css';

/** How it works: We store / We deliver / We bring it back. Horizontal pinned scroll on desktop. */
export default function HowItWorks() {
  return (
    <>
      <section id="how" className="how" aria-labelledby="how-title">
        <div className="how-head">
          <p className="tag label m-0">Storage to doorstep, and back</p>
          <h2 id="how-title" className="sr-only">
            How TrackFlow works: we store, we deliver, we bring it back.
          </h2>
        </div>
        <div id="how-track" className="how-track">
          <div className="step" style={css({ '--c': 'var(--svc-store)' })}>
            <span className="step-num" aria-hidden="true">
              1
            </span>
            <span className="display step-word" aria-hidden="true">
              We
            </span>
            <div className="step-card" aria-hidden="true">
              <span className="strip"></span>
              <div className="squircle">
                <svg viewBox="0 0 200 200" fill="none" stroke="#2B1D0E" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round">
                  <path d="M54 40h92v26" />
                  <path d="M54 40v26" />
                  <path d="M100 66v34" stroke="#FF1F2F" strokeWidth="5" strokeDasharray="6 6" />
                  <rect x="48" y="96" width="44" height="40" rx="5" fill="#C9965F" />
                  <path d="M70 96v40" stroke="#F3E7C9" strokeWidth="7" />
                  <rect x="112" y="104" width="36" height="32" rx="5" fill="#E7B47A" />
                  <rect x="22" y="136" width="156" height="26" rx="13" fill="#2B1D0E" />
                  <circle cx="40" cy="149" r="6" fill="#FFF8E7" strokeWidth="3" />
                  <circle cx="80" cy="149" r="6" fill="#FFF8E7" strokeWidth="3" />
                  <circle cx="120" cy="149" r="6" fill="#FFF8E7" strokeWidth="3" />
                  <circle cx="160" cy="149" r="6" fill="#FFF8E7" strokeWidth="3" />
                  <path d="M60 178v-16M140 178v-16" />
                </svg>
              </div>
            </div>
            <span className="display step-word">Store.</span>
            <p className="note step-note m-0" aria-hidden="true">
              <svg width="40" height="30" viewBox="0 0 40 30" fill="none">
                <path d="M4 26C8 14 18 6 34 4" stroke="#2B1D0E" strokeWidth="2" strokeLinecap="round" />
                <path d="M27 1l8 3-6 7" stroke="#2B1D0E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>storage, picking and packing</span>
            </p>
          </div>
          <div className="step" style={css({ '--c': 'var(--svc-same)' })}>
            <span className="step-num" aria-hidden="true">
              2
            </span>
            <span className="display step-word" aria-hidden="true">
              We
            </span>
            <div className="step-card" aria-hidden="true">
              <span className="strip"></span>
              <div className="squircle">
                <svg viewBox="0 0 200 200" fill="none" stroke="#2B1D0E" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round">
                  <path d="M58 168V44a8 8 0 018-8h52a8 8 0 018 8v124" fill="#FFF8E7" />
                  <rect x="72" y="52" width="40" height="36" rx="4" fill="#CFE9F2" strokeWidth="4" />
                  <circle cx="114" cy="112" r="5" fill="#2B1D0E" />
                  <path d="M30 168h140" />
                  <rect x="124" y="132" width="44" height="36" rx="5" fill="#C9965F" />
                  <path d="M146 132v36" stroke="#F3E7C9" strokeWidth="7" />
                  <circle cx="160" cy="58" r="20" fill="#FFFF46" />
                  <path d="M151 58l6 6 12-12" />
                </svg>
              </div>
            </div>
            <span className="display step-word">Deliver.</span>
            <p className="note step-note m-0" aria-hidden="true">
              <svg width="40" height="30" viewBox="0 0 40 30" fill="none">
                <path d="M4 26C8 14 18 6 34 4" stroke="#2B1D0E" strokeWidth="2" strokeLinecap="round" />
                <path d="M27 1l8 3-6 7" stroke="#2B1D0E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>certified carriers in both countries</span>
            </p>
          </div>
          <div className="step" style={css({ '--c': 'var(--svc-express)' })}>
            <span className="step-num" aria-hidden="true">
              3
            </span>
            <span className="display step-word" aria-hidden="true">
              We
            </span>
            <div className="step-card" aria-hidden="true">
              <span className="strip"></span>
              <div className="squircle">
                <svg viewBox="0 0 200 200" fill="none" stroke="#2B1D0E" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round">
                  <path d="M40 82L100 57l60 25-60 25z" fill="#E7B47A" />
                  <path d="M40 82l60 25v66l-60-25z" fill="#C9965F" />
                  <path d="M160 82l-60 25v66l60-25z" fill="#AD7A45" />
                  <path d="M70 69.5l60 25" strokeWidth="20" />
                  <path d="M70 69.5l60 25" stroke="#F3E7C9" strokeWidth="10" />
                  <path d="M52 112l34 14v22l-34-14z" fill="#FFF8E7" strokeWidth="4" />
                  <path d="M52 112l34 14v7l-34-14z" fill="#FF1F2F" strokeWidth="4" />
                  <path d="M146 46c-18-20-56-22-76-2" strokeWidth="6" />
                  <path d="M66 28l3 17 17-3" strokeWidth="6" />
                </svg>
              </div>
            </div>
            <span className="display step-word">Bring it back.</span>
            <p className="note step-note m-0" aria-hidden="true">
              <svg width="40" height="30" viewBox="0 0 40 30" fill="none">
                <path d="M4 26C8 14 18 6 34 4" stroke="#2B1D0E" strokeWidth="2" strokeLinecap="round" />
                <path d="M27 1l8 3-6 7" stroke="#2B1D0E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>inspected, reconditioned, restocked</span>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
