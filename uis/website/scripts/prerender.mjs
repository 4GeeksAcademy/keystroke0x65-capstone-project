// Inlines the server-rendered page into dist/index.html (the client then hydrates it),
// and the shared footer into dist/application.html (static there).
import { readFile, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('..', import.meta.url);
const { render, renderFooter } = await import(new URL('dist-ssr/entry-server.js', root).href);
const indexPath = fileURLToPath(new URL('dist/index.html', root));
const html = await readFile(indexPath, 'utf8');
if (!html.includes('<div id="root"></div>')) throw new Error('prerender: #root placeholder not found in dist/index.html');
await writeFile(indexPath, html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`));
const appPath = fileURLToPath(new URL('dist/application.html', root));
const appHtml = await readFile(appPath, 'utf8');
if (!appHtml.includes('<!--site-footer-->')) throw new Error('prerender: <!--site-footer--> placeholder not found in dist/application.html');
await writeFile(appPath, appHtml.replace('<!--site-footer-->', renderFooter()));
await rm(fileURLToPath(new URL('dist-ssr', root)), { recursive: true, force: true });
console.log('prerendered dist/index.html and the footer in dist/application.html');
