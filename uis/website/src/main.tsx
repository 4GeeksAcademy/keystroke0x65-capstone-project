import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import '@fontsource-variable/archivo/wdth.css';
import '@fontsource-variable/caveat';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import './styles/index.css';
import App from './App';

const container = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// Production builds ship the page pre-rendered (see scripts/prerender.mjs): hydrate it. The dev server starts empty.
if (container.hasChildNodes()) hydrateRoot(container, app);
else createRoot(container).render(app);
