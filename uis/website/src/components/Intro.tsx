/** Scroll-driven intro: the logo, then the tape gun lays the navbar. */
export default function Intro() {
  return (
    <>
      {/* The intro's scroll pin uses this wrapper as its spacer, so pinning never moves the intro in the DOM
          (moving it makes the browser treat everything inside as newly painted content) */}
      <div id="intro-spacer">
        <section id="intro" className="intro" aria-hidden="true">
          <div id="intro-logo" className="intro-logo">
            <svg className="il-mark" viewBox="2 2 24 24" fill="none">
              <defs>
                <mask id="il-line-mask" maskUnits="userSpaceOnUse" x="-2" y="-2" width="32" height="32">
                  <path
                    id="il-line-reveal"
                    d="M6 22C6 13 22 15 22 6"
                    pathLength="1"
                    stroke="#fff"
                    strokeWidth="5"
                    strokeLinecap="butt"
                    strokeDasharray="1 1"
                    strokeDashoffset="1"
                  />
                </mask>
              </defs>
              <path
                className="il-line"
                d="M6 22C6 13 22 15 22 6"
                stroke="currentColor"
                strokeWidth="2.5"
                pathLength="10"
                strokeDasharray="1 0.567"
                strokeDashoffset="0.984"
                mask="url(#il-line-mask)"
              />
              <circle className="il-dot il-dot-a" cx="6" cy="22" r="4" fill="currentColor" />
              <circle className="il-dot il-dot-b" cx="22" cy="6" r="4" fill="currentColor" />
            </svg>
            <span className="il-word-clip">
              <span className="il-word">TrackFlow</span>
            </span>
          </div>
          <p id="scroll-cue" className="scroll-cue">
            <span className="cue-inner">
              Scroll to start
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </p>
        </section>
      </div>
      {/* Outside the aria-hidden intro so it stays reachable; shown and hidden together with the scroll cue */}
      <div id="skip-intro" className="skip-intro">
        <button type="button" className="skip-intro-btn">
          Skip intro
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 3.5l4.5 4.5L3 12.5M8.5 3.5L13 8l-4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </>
  );
}
