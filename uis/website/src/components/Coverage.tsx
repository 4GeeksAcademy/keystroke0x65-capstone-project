/** Coverage: one partner, two markets, with the two warehouse checkmarks. */
export default function Coverage() {
  return (
    <>
      <section id="coverage" tabIndex={-1} className="px-5 py-24 md:py-32" aria-labelledby="coverage-title">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="tag label m-0">Coverage</p>
            <h2 id="coverage-title" className="display m-0 mt-5 text-[clamp(3rem,6.4vw,5.5rem)]">
              One partner. Two markets.
            </h2>
            <p className="mt-5 max-w-sm text-lg leading-relaxed">
              Our own warehouses and a certified carrier network on both sides of the Atlantic, with unified shipment tracking.
            </p>
            <p className="note m-0 mt-6" aria-hidden="true">
              Los Angeles + Zaragoza
            </p>
          </div>
          <div className="glass rim blur-3 self-start rounded-[var(--radius-panel)] px-6 py-2 md:col-span-7">
            <div id="cov-list" className="relative">
              <ul className="m-0 list-none divide-y-2 divide-dashed divide-brand-ink/15 p-0">
                <li className="relative py-5 pl-11">
                  <span className="hub-check" aria-hidden="true">
                    <svg viewBox="0 0 32 32">
                      <circle className="hc-disc" cx="16" cy="16" r="14" />
                      <path className="hc-tick" d="M9.5 16.5l4.5 4.5 8.5-9.5" pathLength="1" />
                    </svg>
                  </span>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                    <h3 className="display m-0 text-[2.4rem]">United States</h3>
                    <p className="pill label m-0">Los Angeles</p>
                  </div>
                  <ul className="m-0 mt-3 list-none space-y-1.5 p-0 text-[17px]">
                    <li>Warehouse in Los Angeles</li>
                    <li>National coverage</li>
                    <li>Carriers: UPS, FedEx, DHL</li>
                  </ul>
                </li>
                <li className="relative py-5 pl-11">
                  <span className="hub-check" aria-hidden="true">
                    <svg viewBox="0 0 32 32">
                      <circle className="hc-disc" cx="16" cy="16" r="14" />
                      <path className="hc-tick" d="M9.5 16.5l4.5 4.5 8.5-9.5" pathLength="1" />
                    </svg>
                  </span>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                    <h3 className="display m-0 text-[2.4rem]">Spain</h3>
                    <p className="pill label m-0">Zaragoza</p>
                  </div>
                  <ul className="m-0 mt-3 list-none space-y-1.5 p-0 text-[17px]">
                    <li>Warehouse in Zaragoza</li>
                    <li>Peninsular and island coverage</li>
                    <li>Carriers: MRW, SEUR, DHL</li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
