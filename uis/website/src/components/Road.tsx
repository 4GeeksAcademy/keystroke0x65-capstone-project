import { Fragment } from 'react';

const STOPS = ['FROM CLICK TO DOORSTEP', 'LOS ANGELES', 'ZARAGOZA', 'LET’S MAKE IT FLOW'];
const REPEAT = 5; // enough copies to cover the widest screens; the runtime slides startOffset by one copy's length

/** Road marquee: the phrase drives along a curved road as you scroll. */
export default function Road() {
  return (
    <section className="road" aria-label="From click to doorstep. Los Angeles. Zaragoza. Let’s make it flow.">
      <svg viewBox="0 0 1600 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <path id="road-path" d="M-80 205C240 70 520 60 800 160S1340 270 1680 105" />
        </defs>
        <use href="#road-path" fill="none" stroke="#FF1F2F" strokeWidth="110" strokeLinecap="butt" />
        <use href="#road-path" fill="none" stroke="#2B1D0E" strokeWidth="94" />
        <text id="road-text" dy="0.36em" fill="#FFFF46">
          <textPath id="road-tp" href="#road-path" startOffset="0">
            {Array.from({ length: REPEAT }, (_, r) => (
              <Fragment key={r}>
                {STOPS.map((stop) => (
                  <Fragment key={stop}>
                    {stop} <tspan fill="#FF1F2F">●</tspan>{' '}
                  </Fragment>
                ))}
              </Fragment>
            ))}
          </textPath>
        </text>
      </svg>
    </section>
  );
}
