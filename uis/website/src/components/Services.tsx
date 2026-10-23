import Barcode from './Barcode';
import { css } from '../lib/css';

/** Services: three shipping-label cards. */
export default function Services() {
  return (
    <>
      <section id="services" tabIndex={-1} className="relative px-5 py-24 md:py-32" aria-labelledby="services-title">
        <div className="stamp lg-only" style={css({ right: '3%', top: '56px', width: '250px', rotate: '3deg' })} aria-hidden="true">
          <svg viewBox="0 0 260 120" fill="none" stroke="currentColor">
            <g filter="url(#ink)">
              <rect x="4" y="4" width="252" height="112" rx="8" strokeWidth="6" />
              <path d="M30 22h44l-4 34c-2 14-10 20-18 20s-16-6-18-20zM52 76v22M36 100h32" strokeWidth="5" strokeLinejoin="round" />
              <path d="M47 24l7 12-7 9 9 10" strokeWidth="3" />
              <text
                x="164"
                y="64"
                textAnchor="middle"
                fontFamily="'Archivo Variable', Archivo, Arial Narrow, sans-serif"
                fontWeight="900"
                fontStretch="62.5%"
                fill="currentColor"
                stroke="none"
                fontSize="48"
                letterSpacing="1"
              >
                FRAGILE
              </text>
              <text
                x="164"
                y="96"
                textAnchor="middle"
                fontFamily="'Archivo Variable', Archivo, Arial Narrow, sans-serif"
                fontWeight="900"
                fontStretch="62.5%"
                fill="currentColor"
                stroke="none"
                fontSize="19"
                letterSpacing="2.5"
              >
                HANDLE WITH CARE
              </text>
            </g>
          </svg>
        </div>
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="tag label m-0">Our services</p>
              <h2 id="services-title" className="display m-0 mt-5 text-[clamp(3rem,6.4vw,5.5rem)]">
                Everything your operation needs to keep moving.
              </h2>
            </div>
            <p className="m-0 max-w-sm text-lg leading-relaxed md:col-span-5">
              From storage to doorstep and back again, TrackFlow manages the complete logistics journey for growing e-commerce brands.
            </p>
          </div>
          <ul id="svc-grid" className="m-0 mt-14 grid list-none gap-8 p-0 md:grid-cols-3 md:gap-8">
            <li className="svc">
              <article className="label-card glass rim blur-3" style={css({ '--c': 'var(--svc-store)', '--tilt': '-1.5deg' })}>
                <div className="flex items-center justify-between gap-4">
                  <span className="svc-disc" aria-hidden="true">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#2B1D0E" strokeWidth="2.6" strokeLinejoin="round">
                      <path d="M3 11L14 4l11 7v13H3z" />
                      <path d="M8 24v-9h12v9M8 19h12" />
                    </svg>
                  </span>
                  <span className="pill label" aria-hidden="true">
                    01
                  </span>
                </div>
                <h3 className="display m-0 mt-5 text-[2.6rem]">Warehouse management</h3>
                <ul className="m-0 mt-4 list-none space-y-2.5 p-0">
                  <li className="flex gap-2.5 leading-snug">
                    <span
                      className="mt-[0.4em] h-2.5 w-2.5 shrink-0 rounded-full border-2 border-brand-ink"
                      style={css({ background: 'rgb(var(--svc-store))' })}
                      aria-hidden="true"
                    ></span>
                    Storage, picking and packing
                  </li>
                  <li className="flex gap-2.5 leading-snug">
                    <span
                      className="mt-[0.4em] h-2.5 w-2.5 shrink-0 rounded-full border-2 border-brand-ink"
                      style={css({ background: 'rgb(var(--svc-store))' })}
                      aria-hidden="true"
                    ></span>
                    Real-time inventory
                  </li>
                  <li className="flex gap-2.5 leading-snug">
                    <span
                      className="mt-[0.4em] h-2.5 w-2.5 shrink-0 rounded-full border-2 border-brand-ink"
                      style={css({ background: 'rgb(var(--svc-store))' })}
                      aria-hidden="true"
                    ></span>
                    We operate warehouses in Los Angeles and Zaragoza
                  </li>
                </ul>
                <div
                  className="mt-6 flex items-center justify-between gap-3 border-t-2 border-dashed border-brand-ink/30 pt-3"
                  aria-hidden="true"
                >
                  <Barcode seed={0} />
                  <span className="label">TF·SVC·01</span>
                </div>
              </article>
            </li>
            <li className="svc">
              <article className="label-card glass rim blur-3" style={css({ '--c': 'var(--svc-same)', '--tilt': '1.2deg' })}>
                <div className="flex items-center justify-between gap-4">
                  <span className="svc-disc" aria-hidden="true">
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="#2B1D0E" strokeWidth="2.4" strokeLinejoin="round">
                      <path d="M2 8h15v12H2zM17 12h6l4 4v4H17z" />
                      <circle cx="8" cy="22" r="2.6" fill="#FFF8E7" />
                      <circle cx="22" cy="22" r="2.6" fill="#FFF8E7" />
                    </svg>
                  </span>
                  <span className="pill label" aria-hidden="true">
                    02
                  </span>
                </div>
                <h3 className="display m-0 mt-5 text-[2.6rem]">Last-mile deliveries</h3>
                <ul className="m-0 mt-4 list-none space-y-2.5 p-0">
                  <li className="flex gap-2.5 leading-snug">
                    <span
                      className="mt-[0.4em] h-2.5 w-2.5 shrink-0 rounded-full border-2 border-brand-ink"
                      style={css({ background: 'rgb(var(--svc-same))' })}
                      aria-hidden="true"
                    ></span>
                    Certified carrier network in both countries
                  </li>
                  <li className="flex gap-2.5 leading-snug">
                    <span
                      className="mt-[0.4em] h-2.5 w-2.5 shrink-0 rounded-full border-2 border-brand-ink"
                      style={css({ background: 'rgb(var(--svc-same))' })}
                      aria-hidden="true"
                    ></span>
                    Unified shipment tracking
                  </li>
                  <li className="flex gap-2.5 leading-snug">
                    <span
                      className="mt-[0.4em] h-2.5 w-2.5 shrink-0 rounded-full border-2 border-brand-ink"
                      style={css({ background: 'rgb(var(--svc-same))' })}
                      aria-hidden="true"
                    ></span>
                    Incident and returns management
                  </li>
                </ul>
                <div
                  className="mt-6 flex items-center justify-between gap-3 border-t-2 border-dashed border-brand-ink/30 pt-3"
                  aria-hidden="true"
                >
                  <Barcode seed={1} />
                  <span className="label">TF·SVC·02</span>
                </div>
              </article>
            </li>
            <li className="svc">
              <article className="label-card glass rim blur-3" style={css({ '--c': 'var(--svc-express)', '--tilt': '-1deg' })}>
                <div className="flex items-center justify-between gap-4">
                  <span className="svc-disc" aria-hidden="true">
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 28 28"
                      fill="none"
                      stroke="#2B1D0E"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 10h12a6 6 0 010 12H9" />
                      <path d="M10 5L5 10l5 5" />
                    </svg>
                  </span>
                  <span className="pill label" aria-hidden="true">
                    03
                  </span>
                </div>
                <h3 className="display m-0 mt-5 text-[2.6rem]">Reverse logistics</h3>
                <ul className="m-0 mt-4 list-none space-y-2.5 p-0">
                  <li className="flex gap-2.5 leading-snug">
                    <span
                      className="mt-[0.4em] h-2.5 w-2.5 shrink-0 rounded-full border-2 border-brand-ink"
                      style={css({ background: 'rgb(var(--svc-express))' })}
                      aria-hidden="true"
                    ></span>
                    Complete returns management
                  </li>
                  <li className="flex gap-2.5 leading-snug">
                    <span
                      className="mt-[0.4em] h-2.5 w-2.5 shrink-0 rounded-full border-2 border-brand-ink"
                      style={css({ background: 'rgb(var(--svc-express))' })}
                      aria-hidden="true"
                    ></span>
                    Inspection and reconditioning
                  </li>
                  <li className="flex gap-2.5 leading-snug">
                    <span
                      className="mt-[0.4em] h-2.5 w-2.5 shrink-0 rounded-full border-2 border-brand-ink"
                      style={css({ background: 'rgb(var(--svc-express))' })}
                      aria-hidden="true"
                    ></span>
                    Integration with your sales platform
                  </li>
                </ul>
                <div
                  className="mt-6 flex items-center justify-between gap-3 border-t-2 border-dashed border-brand-ink/30 pt-3"
                  aria-hidden="true"
                >
                  <Barcode seed={2} />
                  <span className="label">TF·SVC·03</span>
                </div>
              </article>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
