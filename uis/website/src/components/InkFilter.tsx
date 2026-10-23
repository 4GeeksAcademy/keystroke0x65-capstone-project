import { css } from '../lib/css';

/** SVG filter that gives every rubber stamp its uneven ink edge (referenced as url(#ink)). */
export default function InkFilter() {
  return (
    <>
      <svg width="0" height="0" style={css({ position: 'absolute' })} aria-hidden="true" focusable="false">
        <filter id="ink" x="-6%" y="-6%" width="112%" height="112%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="3" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  3.2 0 0 0 -0.85" result="m" />
          <feComposite in="d" in2="m" operator="in" />
        </filter>
      </svg>
    </>
  );
}
