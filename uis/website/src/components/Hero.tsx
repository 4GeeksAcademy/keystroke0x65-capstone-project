import { css } from '../lib/css';

/** Hero: split headline, the order-journey card, the on-time sticker. */
export default function Hero() {
  return (
    <>
      <section id="home" tabIndex={-1} className="relative pb-16 pt-32 md:min-h-[100svh] md:pb-24 md:pt-36" aria-labelledby="hero-title">
        <div className="stamp" style={css({ right: '5%', bottom: '4%', width: '150px', rotate: '-5deg' })} aria-hidden="true">
          <svg viewBox="0 0 160 150" fill="none" stroke="currentColor">
            <g filter="url(#ink)">
              <path d="M45 100V44M115 100V44" strokeWidth="12" />
              <path d="M45 14l26 34H19zM115 14l26 34H89z" fill="currentColor" />
              <path d="M14 112h132" strokeWidth="7" />
              <text
                x="80"
                y="144"
                textAnchor="middle"
                fontFamily="'Archivo Variable', Archivo, Arial Narrow, sans-serif"
                fontWeight="900"
                fontStretch="62.5%"
                fill="currentColor"
                stroke="none"
                fontSize="26"
                letterSpacing="1.5"
              >
                THIS SIDE UP
              </text>
            </g>
          </svg>
        </div>
        <div className="relative mx-auto grid max-w-6xl gap-14 px-5 md:grid-cols-12 md:items-center md:gap-10">
          <div className="md:col-span-7">
            <p className="tag label m-0">Logistics, made intelligent</p>
            <h1 id="hero-title" className="display split m-0 mt-5 text-[clamp(3.4rem,7.4vw,6.75rem)]">
              Logistics that scales with your e-commerce.
            </h1>
            <p className="mt-6 max-w-[34rem] text-lg leading-relaxed">
              Warehouse management, last-mile deliveries, and reverse logistics in the United States and Spain. Over 15 years helping
              fashion, electronics, and cosmetics brands grow without worrying about operations.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a href="/application.html" className="btn-red on-red">
                Request information{' '}
                <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" width="16" height="16">
                  <path d="M5 15 15 5M7 5h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a href="#services" className="font-semibold underline decoration-2 underline-offset-4">
                See our services
              </a>
            </div>
          </div>

          <div className="relative md:col-span-5">
            <span className="strip" style={css({ top: '-16px', left: '28px', rotate: '-6deg' })} aria-hidden="true"></span>
            <div className="sticker" style={css({ right: 'clamp(-22px, -1.5vw, -8px)', top: '-56px' })} aria-hidden="true">
              <svg viewBox="0 0 140 140">
                <defs>
                  <path id="st-ring" d="M70 70m-49 0a49 49 0 1 1 98 0a49 49 0 1 1 -98 0" />
                </defs>
                <circle cx="70" cy="70" r="66" fill="#FF1F2F" stroke="#2B1D0E" strokeWidth="3.5" />
                <circle cx="70" cy="70" r="60" fill="none" stroke="#2B1D0E" strokeWidth="1.5" strokeDasharray="3 4" opacity="0.6" />
                <g className="spin">
                  <text
                    fontFamily="'Archivo Variable', Archivo, Arial Narrow, sans-serif"
                    fontWeight="900"
                    fontStretch="75%"
                    fontSize="13"
                    fill="#2B1D0E"
                  >
                    <textPath href="#st-ring" textLength="300" lengthAdjust="spacing">
                      ON-TIME DELIVERY • ON-TIME DELIVERY •
                    </textPath>
                  </text>
                </g>
                <circle cx="70" cy="70" r="33" fill="#FFF8E7" stroke="#2B1D0E" strokeWidth="3" />
                <text
                  id="stat-num"
                  x="70"
                  y="77"
                  textAnchor="middle"
                  fontFamily="'Archivo Variable', Archivo, Arial Narrow, sans-serif"
                  fontWeight="900"
                  fontStretch="62.5%"
                  fontSize="25"
                  fill="#2B1D0E"
                >
                  98.6%
                </text>
              </svg>
            </div>
            <article className="glass rim blur-3 rounded-[var(--radius-panel)] p-6 md:p-7" aria-labelledby="journey-title">
              <p className="label m-0">How an order moves</p>
              <h2 id="journey-title" className="display m-0 mt-2 pr-20 text-[2.6rem]">
                From click to doorstep.
              </h2>
              <ol className="journey">
                <li style={css({ '--c': 'var(--svc-store)' })}>
                  <span className="dot" aria-hidden="true"></span>
                  <p className="m-0 font-bold">Stored</p>
                  <p className="m-0 text-sm">Warehouses in Los Angeles and Zaragoza</p>
                </li>
                <li style={css({ '--c': 'var(--svc-store)' })}>
                  <span className="dot" aria-hidden="true"></span>
                  <p className="m-0 font-bold">Picked and packed</p>
                  <p className="m-0 text-sm">Real-time inventory</p>
                </li>
                <li className="live" style={css({ '--c': 'var(--svc-same)' })}>
                  <span className="dot" aria-hidden="true"></span>
                  <p className="m-0 font-bold">Delivered</p>
                  <p className="m-0 text-sm">Certified carrier network, unified tracking</p>
                </li>
                <li style={css({ '--c': 'var(--svc-express)' })}>
                  <span className="dot" aria-hidden="true"></span>
                  <p className="m-0 font-bold">Returned, if needed</p>
                  <p className="m-0 text-sm">Inspection and reconditioning</p>
                </li>
              </ol>
              <p className="sr-only">98.6% on-time delivery</p>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
