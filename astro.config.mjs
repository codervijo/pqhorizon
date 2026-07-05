// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Build a slug → last_updated map from the ./content/*.md frontmatter so the
// generated sitemap carries a per-page <lastmod>. @astrojs/sitemap's serialize()
// only receives the URL (not the collection data), so we read the frontmatter
// dates here and look them up by URL path. `_`-prefixed files (the cluster
// index) aren't pages, so they're skipped — same rule as the glob loader.
const contentDir = fileURLToPath(new URL('./content', import.meta.url));
const lastmodBySlug = {};
let newestLastmod = '';
for (const file of readdirSync(contentDir)) {
  if (!file.endsWith('.md') || file.startsWith('_')) continue;
  const fm = readFileSync(`${contentDir}/${file}`, 'utf8').split(/^---$/m)[1] ?? '';
  const slug = fm.match(/^slug:\s*(.+?)\s*$/m)?.[1];
  const date = fm.match(/^last_updated:\s*(.+?)\s*$/m)?.[1];
  if (slug && date) {
    lastmodBySlug[slug] = date;
    if (date > newestLastmod) newestLastmod = date;
  }
}

export default defineConfig({
  site: 'https://pqhorizon.com',
  // trailingSlash: 'always' — directory format serves /<page>/ and
  // @astrojs/sitemap lists /<page>/, so a page's <link rel="canonical">
  // MUST also end in a slash. A canonical of /<page> (no slash) 308-redirects
  // to /<page>/ — Google then can't settle on a canonical and the page comes
  // back "URL is unknown to Google". Make it explicit so every page's
  // canonical matches its served URL. Enforced by CHECK_161.
  trailingSlash: 'always',
  integrations: [
    sitemap({
      // Attach <lastmod> per URL. The homepage (path '') has no content file,
      // so it inherits the newest content date. Dates are YYYY-MM-DD in
      // frontmatter; the sitemap spec wants W3C datetime, so emit full ISO.
      serialize(item) {
        const path = new URL(item.url).pathname.replace(/^\/|\/$/g, '');
        const date = path === '' ? newestLastmod : lastmodBySlug[path];
        if (date) item.lastmod = new Date(`${date}T00:00:00Z`).toISOString();
        return item;
      },
    }),
    react(),
  ],
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
