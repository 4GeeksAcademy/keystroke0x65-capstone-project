import { useLayoutEffect } from 'react';
import InkFilter from './components/InkFilter';
import Header from './components/Header';
import Intro from './components/Intro';
import Hero from './components/Hero';
import Road from './components/Road';
import Services from './components/Services';
import HowItWorks from './components/HowItWorks';
import Coverage from './components/Coverage';
import WhyTrackflow from './components/WhyTrackflow';
import Leadership from './components/Leadership';
import Faq from './components/Faq';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { bootSite } from './runtime/site';

export default function App() {
  // The motion runtime (GSAP choreography, the 3D toy scene, footer physics) runs on the rendered DOM
  // and tears itself down completely on unmount, so StrictMode / HMR remounts are safe.
  useLayoutEffect(() => bootSite(), []);

  return (
    <>
      <a href="#main" className="skip">
        Skip to content
      </a>
      <InkFilter />
      <div className="paper-bg" aria-hidden="true"></div>
      {/* Background truck + plane (3D), drawn behind the page */}
      <div id="truck-layer" className="truck-layer" aria-hidden="true">
        <canvas id="truck-canvas"></canvas>
      </div>
      <Header />
      <main id="main" tabIndex={-1}>
        <Intro />
        <Hero />
        <Road />
        <Services />
        <HowItWorks />
        <Coverage />
        <WhyTrackflow />
        <Leadership />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
