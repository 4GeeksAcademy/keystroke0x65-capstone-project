import { css } from '../lib/css';
import { TEAM } from '../content/team';

/**
 * Leadership: the 3D toy conveyor belt (built by the scene runtime from TEAM) with an accessible team list.
 * The list is the fallback without WebGL and stays available to screen readers when the belt is running.
 */
export default function Leadership() {
  return (
    <>
      <section id="leadership" className="relative px-5 py-24 md:py-28" aria-labelledby="leadership-title">
        <div className="stamp" style={css({ right: '4%', top: '40px', width: '132px', rotate: '6deg' })} aria-hidden="true">
          <svg viewBox="0 0 150 170" fill="none" stroke="currentColor">
            <g filter="url(#ink)">
              <path d="M75 25A50 50 0 0 1 122 58" strokeWidth="9" />
              <path d="M106 52l17 8 7-17" strokeWidth="8" strokeLinejoin="miter" />
              <g transform="rotate(120 75 75)">
                <path d="M75 25A50 50 0 0 1 122 58" strokeWidth="9" />
                <path d="M106 52l17 8 7-17" strokeWidth="8" strokeLinejoin="miter" />
              </g>
              <g transform="rotate(240 75 75)">
                <path d="M75 25A50 50 0 0 1 122 58" strokeWidth="9" />
                <path d="M106 52l17 8 7-17" strokeWidth="8" strokeLinejoin="miter" />
              </g>
              <text
                x="75"
                y="158"
                textAnchor="middle"
                fontFamily="'Archivo Variable', Archivo, Arial Narrow, sans-serif"
                fontWeight="900"
                fontStretch="62.5%"
                fill="currentColor"
                stroke="none"
                fontSize="22"
                letterSpacing="1.5"
              >
                PLEASE RECYCLE
              </text>
            </g>
          </svg>
        </div>
        <div className="mx-auto max-w-6xl">
          <p className="tag label m-0">Leadership</p>
          <h2 id="leadership-title" className="display m-0 mt-5 text-[clamp(3rem,6.4vw,5.5rem)]">
            The people behind TrackFlow.
          </h2>
        </div>
        <div id="belt-scene" className="belt-scene">
          <ul className="belt-list" aria-label="The TrackFlow leadership team">
            {TEAM.map((p) => (
              <li key={p.name}>
                <h3 className="display m-0 text-[1.6rem]">{p.name}</h3>
                <p className="label m-0 mt-1">{p.role}</p>
                {p.base && <p className="m-0 mt-1 text-sm">{p.base}</p>}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
