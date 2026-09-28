import { useState, useRef, useCallback, useEffect } from 'react'
import './App.css'

const ArrowUpRight = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4">
    <path d="M5 15 15 5M7 5h8v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const leadership = [
  { name: 'Thomas Harry', role: 'Founder & CEO', location: 'Los Angeles' },
  { name: 'Andrés Kim', role: 'CTO', location: 'Zaragoza' },
  { name: 'Ana Whitfield', role: 'Warehouse Operations', location: 'Los Angeles & Zaragoza' },
  { name: 'Carlos Vega', role: 'Last Mile & Carrier Mgmt', location: '' },
  { name: 'Sofía Ramos', role: 'Reverse Logistics', location: '' },
  { name: 'Valentina Cruz', role: 'Customer Experience', location: 'Los Angeles & Zaragoza' },
  { name: 'Miguel Torres', role: 'Commercial & Client Relations', location: '' },
]

const services = [
  { number: '01', title: 'Warehouse Management', items: ['Storage, picking and packing', 'Real-time inventory', 'We operate warehouses in Los Angeles and Zaragoza'] },
  { number: '02', title: 'Last-Mile Deliveries', items: ['Certified carrier network in both countries', 'Unified shipment tracking', 'Incident and returns management'] },
  { number: '03', title: 'Reverse Logistics', items: ['Complete returns management', 'Inspection and reconditioning', 'Integration with your sales platform'] },
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const dragStartX = useRef(0)
  const dragScrollLeft = useRef(0)
  const autoScrollRef = useRef<number>()

  const startAutoScroll = useCallback(() => {
    stopAutoScroll()
    autoScrollRef.current = window.setInterval(() => {
      const el = trackRef.current
      if (!el || isDragging.current) return
      el.scrollLeft += 1
      const half = el.scrollWidth / 2
      if (el.scrollLeft >= half) {
        el.scrollLeft = 0
      }
    }, 20)
  }, [])

  const stopAutoScroll = useCallback(() => {
    if (autoScrollRef.current !== undefined) {
      clearInterval(autoScrollRef.current)
      autoScrollRef.current = undefined
    }
  }, [])

  useEffect(() => {
    startAutoScroll()
    return stopAutoScroll
  }, [startAutoScroll, stopAutoScroll])

  const handleMouseDown = (e: React.MouseEvent) => {
    stopAutoScroll()
    isDragging.current = true
    dragStartX.current = e.pageX
    if (trackRef.current) {
      dragScrollLeft.current = trackRef.current.scrollLeft
      trackRef.current.style.scrollBehavior = 'auto'
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !trackRef.current) return
    e.preventDefault()
    const dx = e.pageX - dragStartX.current
    trackRef.current.scrollLeft = dragScrollLeft.current - dx
  }

  const handleDragEnd = () => {
    isDragging.current = false
    if (trackRef.current) {
      trackRef.current.style.scrollBehavior = ''
    }
    // Give a brief pause before auto-scroll kicks back in
    setTimeout(startAutoScroll, 1200)
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <div className="sticky-nav-wrap">
      <header className="navbar flex items-center justify-between px-4 py-3 sm:px-6">
        <a href="#top" className="flex items-center gap-3" aria-label="TrackFlow home">
          <span className="brand-dot grid h-9 w-9 place-items-center rounded-full text-sm font-bold">T</span>
          <span className="text-xl font-semibold tracking-[-0.04em]">trackflow<span className="text-[#ffe99a]">.</span></span>
        </a>
        <nav aria-label="Main navigation" className="nav-links flex items-center gap-4 text-xs font-medium sm:gap-6 sm:text-sm lg:gap-8">
          <a href="#top">Home</a>
          <a href="#services">Services</a>
          <a href="#coverage">Coverage</a>
          <a href="#contact">Contact</a>
        </nav>
        <button
          className="hamburger flex flex-col items-center justify-center gap-1.5 border-0 bg-transparent p-2 cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
        >
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
        </button>
      </header>

      {/* Mobile menu dropdown — appears below the navbar */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <nav aria-label="Mobile navigation" className="mobile-menu-links">
          <a href="#top" onClick={closeMenu}>Home</a>
          <a href="#services" onClick={closeMenu}>Services</a>
          <a href="#coverage" onClick={closeMenu}>Coverage</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
        </nav>
      </div>
      </div>

      <div className="page-shell">
      <div className="page-content">

      <main id="top">
        <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-20 md:pt-28 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-10 lg:pb-32" aria-labelledby="hero-title">
          <div>
            <p className="eyebrow mb-7 flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#d92f3d]" /> Logistics, made intelligent</p>
            <h1 id="hero-title" className="hero-copy max-w-3xl text-5xl font-medium sm:text-7xl lg:text-[6.5rem]">Logistics that scales with your <em className="font-normal">e-commerce.</em></h1>
            <p className="mt-8 max-w-lg text-lg leading-8 text-[#5d716d]">Warehouse management, last-mile deliveries, and reverse logistics in the United States and Spain. Over 15 years helping fashion, electronics, and cosmetics brands grow without worrying about operations.</p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a href="/application.html" className="primary-button inline-flex items-center justify-center gap-3 rounded-full px-6 py-4 text-sm font-bold">Request information <ArrowUpRight /></a>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-xl lg:pl-8">
            <div className="hero-art glass p-5 sm:p-8">
              <div className="orbit" /><div className="orbit two" /><div className="warehouse" />
              <div className="hero-tag rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.16em]">From click to doorstep</div>
              <div className="hero-stat rounded-2xl p-4 shadow-xl"><span className="block text-2xl font-semibold">98.6%</span><span className="text-[10px] uppercase tracking-widest text-[#a91f2e]">on-time delivery</span></div>
            </div>
          </div>
        </section>

        <section id="services" className="section-dark px-6 py-20 lg:px-10 lg:py-28" aria-labelledby="services-title">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div><p className="eyebrow mb-5">Our services</p><h2 id="services-title" className="section-title max-w-md text-4xl font-medium leading-tight tracking-[-0.05em] sm:text-5xl">Everything your operation needs to keep moving.</h2></div>
              <p className="section-copy max-w-xl text-lg leading-8">From storage to doorstep and back again, TrackFlow manages the complete logistics journey for growing e-commerce brands.</p>
            </div>
            <div className="service-grid mt-16 grid gap-px overflow-hidden rounded-2xl md:grid-cols-3">{services.map((service) => <article key={service.number} className="service-card p-7 sm:p-9"><span className="service-number text-sm font-bold">{service.number}</span><h3 className="mt-16 text-2xl font-medium tracking-[-0.04em]">{service.title}</h3><ul className="mt-5 space-y-3">{service.items.map((item) => <li className="flex gap-2 leading-6" key={item}><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ffe99a]" />{item}</li>)}</ul></article>)}</div>
          </div>
        </section>

        <section id="coverage" className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28" aria-labelledby="coverage-title">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div><p className="eyebrow mb-5">Coverage</p><h2 id="coverage-title" className="section-title max-w-md text-4xl font-medium leading-tight tracking-[-0.05em] sm:text-5xl">One partner. Two markets.</h2></div>
            <div className="grid gap-5 sm:grid-cols-2">{[['United States', ['Warehouse in Los Angeles', 'National coverage', 'Carriers: UPS, FedEx, DHL']], ['Spain', ['Warehouse in Zaragoza', 'Peninsular and island coverage', 'Carriers: MRW, SEUR, DHL']]].map(([country, items]) => <article className="coverage-card rounded-2xl p-7" key={country as string}><h3 className="section-title text-2xl font-medium tracking-[-0.04em]">{country}</h3><ul className="mt-6 space-y-3 text-[#6d5c55]">{(items as string[]).map((item) => <li className="flex gap-2 leading-6" key={item}><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d92f3d]" />{item}</li>)}</ul></article>)}</div>
          </div>
        </section>

        <section id="why-trackflow" className="px-6 py-20 lg:px-10 lg:py-24" aria-labelledby="why-title"><div className="why-panel mx-auto max-w-7xl rounded-[2rem] p-8 sm:p-12"><p className="eyebrow mb-5">Why TrackFlow</p><h2 id="why-title" className="section-title max-w-xl text-4xl font-medium leading-tight tracking-[-0.05em] sm:text-5xl">Logistics expertise with a global point of view.</h2><div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">{[['Binational operation', 'The only operator with own infrastructure in the United States and Spain'], ['+130 professionals', 'Dedicated to your logistics'], ['Own technology', 'For total visibility of your inventory'], ['E-commerce specialization', 'In fashion, electronics, and cosmetics']].map(([title, text]) => <article key={title}><h3 className="text-xl font-semibold tracking-[-0.03em]">{title}</h3><p className="mt-3 leading-7 text-[#6d5c55]">{text}</p></article>)}</div></div></section>

        <section id="leadership" className="leadership-section px-6 py-20 lg:px-10 lg:py-24" aria-labelledby="leadership-title">
          <div className="mx-auto max-w-7xl">
            <p className="eyebrow mb-5">Leadership</p>
            <h2 id="leadership-title" className="section-title max-w-xl text-4xl font-medium leading-tight tracking-[-0.05em] sm:text-5xl">The people behind trackflow.</h2>
            <div
              className="leadership-carousel-wrap mt-12"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
            >
              <div className="leadership-track" ref={trackRef}>
                {leadership.concat(leadership).map((person, i) => (
                  <div className="leadership-card" key={i}>
                    <span className="leadership-avatar">{person.name.split(' ').map(n => n[0]).join('')}</span>
                    <span className="leadership-name">{person.name}</span>
                    <span className="leadership-role">{person.role}</span>
                    {person.location && <span className="leadership-location">{person.location}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="contact-panel mx-6 mb-12 rounded-[2rem] px-6 py-14 text-center sm:px-10 lg:mx-10 lg:py-20" aria-labelledby="contact-title"><p className="eyebrow">Contact TrackFlow</p><h2 id="contact-title" className="section-title mx-auto mt-5 max-w-2xl text-4xl font-medium leading-tight tracking-[-0.06em] sm:text-6xl">Let's make it flow.</h2><div className="mx-auto mt-7 flex flex-col gap-2 text-sm text-[#6d5c55]"><a className="font-semibold underline underline-offset-4" href="mailto:comercial@trackflow.com">comercial@trackflow.com</a><span>Los Angeles: +1 213 555 0147 · Zaragoza: +34 976 123 456</span></div><a href="/application.html" className="dark-button mt-8 inline-flex items-center gap-3 rounded-full px-7 py-4 text-sm font-bold transition-transform hover:-translate-y-1">Request information <ArrowUpRight /></a></section>
      </main>

      <footer className="mx-auto flex max-w-7xl flex-col gap-8 px-6 pb-10 pt-4 text-sm text-[#6d5c55] sm:flex-row sm:items-end sm:justify-between lg:px-10"><div><a href="#top" className="text-xl font-semibold tracking-[-0.04em]">TrackFlow<span className="text-[#d92f3d]">.</span></a></div><div className="sm:text-right"><a className="underline underline-offset-4" href="https://www.linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a><p className="mt-5 text-xs">© 2025 TrackFlow. All rights reserved.</p></div></footer>
      </div>
    </div>
    </>
  )
}

export default App
