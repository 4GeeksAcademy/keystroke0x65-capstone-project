import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

// application.html shares the home page's footer. Builds inline it in scripts/prerender.mjs;
// the dev server renders it here so both pages always show the same component.
const sharedFooter = (): Plugin => ({
  name: 'trackflow-shared-footer',
  apply: 'serve',
  async transformIndexHtml(html, ctx) {
    if (!html.includes('<!--site-footer-->') || !ctx.server) return html;
    const mod = await ctx.server.ssrLoadModule('/src/entry-server.tsx');
    return html.replace('<!--site-footer-->', mod.renderFooter());
  },
});

export default defineConfig({
  plugins: [react(), tailwindcss(), sharedFooter()],
  // listen on all interfaces so Codespaces can forward the port
  server: { host: true },
  preview: { host: true },
  build: {
    rollupOptions: {
      // two pages: the React landing page and the plain-HTML application form
      input: {
        main: fileURLToPath(new URL('index.html', import.meta.url)),
        application: fileURLToPath(new URL('application.html', import.meta.url)),
      },
      // three.js is the one heavy dependency; keep it in its own chunk so the page shell loads first
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/three')) return 'three';
          if (id.includes('node_modules/gsap')) return 'motion';
          // the footer physics engine has its own chunk so the home page can load it late (when the footer is near)
          if (id.includes('node_modules/matter-js')) return 'physics';
        },
      },
    },
  },
});
