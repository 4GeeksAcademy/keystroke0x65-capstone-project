# TrackFlow website

Vite + React 19 + TypeScript (strict) + Tailwind CSS v4. A port of the single-file TrackFlow page. At the same scroll positions, the static frames render pixel-identical to the original on desktop, mobile and reduced motion; frames that are mid-animation differ only in timing.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck → client build → prerender into dist/index.html
npm run preview    # serve dist/
```

Requires Node `^20.19` or `>=22.12` (Vite 8).

## Run it locally or in Codespaces (npx)

From `uis/website`:

```bash
npm install
npx vite --host 0.0.0.0 --port 5173            # dev server
npx vite build && npx vite preview --host 0.0.0.0 --port 4173   # production build (use this for Lighthouse)
```

Then open:

- Landing page: `http://localhost:5173/`
- Request-information form: `http://localhost:5173/application.html`

**GitHub Codespaces:** run the same commands in the Codespace terminal. Codespaces detects the port and offers to forward it. In the **Ports** tab, right-click the port → **Port Visibility → Public** so PageSpeed Insights can reach the `https://<codespace>-5173.app.github.dev` URL. `vite.config.ts` already sets `server.host` and `preview.host` to `true`, so `--host` is optional; it is there so the command also works with any other config.

## Dropping it into the monorepo

Copy this folder to `uis/website`. It is self-contained (its own `package.json`, `tsconfig*.json`, `vite.config.ts`).

- **Workspace name**: `package.json` → `"name": "website"`. Rename to your scope (e.g. `@uis/website`) if your workspace uses one.
- **Shared configs**: if the repo has a base tsconfig, make `tsconfig.app.json` extend it. The code compiles under `strict` with `noUnusedLocals`/`noUnusedParameters`.
- **Lockfile**: `package-lock.json` is included for reproducibility. With pnpm/yarn workspaces, delete it and install from the repo root.
- **Tailwind**: v4 via `@tailwindcss/vite`, no `tailwind.config.js`. If another app in the repo is on v3, they can coexist (each app has its own build).

## How it's put together

```
index.html                 SEO head: meta, Open Graph, JSON-LD graph, favicon; intro guard script
application.html           request-information form page (plain HTML + Tailwind, shares the site footer)
public/                    favicon, robots.txt, sitemap.xml
scripts/prerender.mjs      build step: renders the React page and the shared footer into dist/
src/
  application/             form page entry (main.ts), field validation (validation.js), form styles
  main.tsx                 hydrates the prerendered page (createRoot in dev)
  entry-server.tsx         build-time render used by scripts/prerender.mjs
  App.tsx                  page layout; boots the motion runtime once, tears it down on unmount
  components/              one component per section (Header, Intro, Hero, Road, Services,
                           HowItWorks, Coverage, WhyTrackflow, Leadership, Faq, Contact, Footer)
  content/team.ts          leadership data: drives the list AND the 3D conveyor labels
  styles/index.css         Tailwind import, @theme brand colours, the brand layer (tokens, glass, tape, cards)
  assets/                  cardboard textures, tape relief overlay
  runtime/                 everything that moves (imperative, framework-free, fully typed)
    site.ts                bootSite(): wires the modules below, returns teardown
    scope.ts               teardown registry (listeners, timers, observers, RAF, WebGL, injected DOM)
    choreography.ts        GSAP ScrollTrigger entrances (RISE / SLAP / WRITE), road drive, pinned "how it works"
    nav.ts                 section underline + in-page anchor focus
    tape.ts                tape-gun intro that lays the navbar (pure function of scroll)
    splitText.ts           reversible letter splitting with a screen-reader copy
    footerPhysics.ts       Matter.js parcel pile in the footer
    slot.ts                late-bound API between scroll triggers and 3D scenes
    scene/kit.ts           toon + ink-outline kit shared by every 3D toy
    scene/index.ts         truck, cargo plane, journey legs, intro pin
    scene/porch.ts         courier drops the parcel, knocks, door opens, waves
    scene/conveyor.ts      leadership conveyor belt
```

**Why a runtime instead of hooks per component:** the motion is one choreography. The intro pin, the truck legs that start and end on neighbouring sections, the horizontal pin, and the porch and belt triggers all share ScrollTrigger ordering and one WebGL kit. Keeping it in one typed runtime that boots on the rendered DOM is the standard pattern for GSAP-heavy sites. React owns the markup and the plain-UI state (mobile menu, office clocks, barcodes). The runtime owns motion. Its teardown restores the DOM exactly, so StrictMode's double mount and HMR are safe (verified: one belt canvas, one porch canvas, no duplicate splits).

## Editing

- **Copy**: edit the section components. The runtime finds elements by id or class (`#hero-title`, `#belt-scene`, `.nav-link`, …). Search `src/runtime/` before renaming one.
- **Team**: `src/content/team.ts` updates the accessible list and the conveyor labels together.
- **Brand colours**: CSS tokens in `styles/index.css` (`--tf-yellow`, `--tf-red`, `--glass-red`, `--svc-*`), exposed to Tailwind as `brand-yellow`, `brand-red`, `brand-ink` and `brand-cream`. The 3D toys use their own palette in `runtime/scene/kit.ts` (`C`) on purpose.
- **Texture/stamp strength**: `--tex` (0–1) and `--stamp` in `styles/index.css`.

## Notes and choices

- **Pinned versions**: `three@0.149` and `matter-js@0.19` are the exact versions the design was built and tuned on. Newer three (r152+) changes colour management and light units, which would shift every toy colour. To upgrade, set `ColorManagement.enabled = false`, `renderer.outputColorSpace = LinearSRGBColorSpace` and re-tune light intensities, then compare screenshots.
- **Fonts are self-hosted** (`@fontsource`): Archivo variable with its width axis, Caveat, IBM Plex Mono, Permanent Marker. There are no Google Fonts requests, which also avoids the EU (Spain) GDPR issue with Google-hosted fonts.
- **Prerendered HTML**: the full page content ships in `dist/index.html`, so crawlers and AI engines read the real copy, not an empty `#root`.
- **Code-split**: three.js and GSAP/Matter load as separate chunks.
- **Accessibility**: reduced motion places everything at rest (no intro, static belt, settled footer pile). Split headings keep a single screen-reader copy. The belt has a pause control. The 3D canvases are `aria-hidden`, with an HTML team list behind them.
- **`/application.html`** is the "Request information" form. It is a second Vite entry (see `build.rollupOptions.input`), validated client-side by `src/application/validation.js`; submission is simulated (no backend yet). `/sitemap.xml` and `/robots.txt` are served from `public/`.
