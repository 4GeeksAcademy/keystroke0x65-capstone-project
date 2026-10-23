import { StrictMode } from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import App from './App';
import Footer from './components/Footer';

/** Build-time render: the full page markup goes into index.html so search engines and AI crawlers read real content. */
export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

/** The same footer as static markup for application.html (no React on that page; its physics boots from application/main.ts). */
export function renderFooter() {
  return renderToStaticMarkup(<Footer onHomePage={false} />);
}
