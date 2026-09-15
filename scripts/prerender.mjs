// Prerenders per-route HTML heads after `vite build`.
// For every route it writes dist/<route>/index.html containing the correct
// <title>, description, canonical, Open Graph / Twitter tags and JSON-LD —
// so Google sees a distinct, properly-canonicalised page per URL instead of
// the same shell everywhere. The SPA bundle still hydrates as normal.
//
// NOTE: keep the meta strings in sync with src/lib/seo.ts.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const PROJECT = process.env.VITE_SANITY_PROJECT_ID || '2fs2ltni';
const DATASET = process.env.VITE_SANITY_DATASET || 'production';
const BASE = 'https://www.aloraswift.com';
const API = `https://${PROJECT}.api.sanity.io/v2023-05-03/data/query/${DATASET}`;
const DEFAULT_DESC =
  "Magical children's picture books by Alora Swift — whimsical tales of brave platypuses, lost koala bears, and baking adventures. Perfect for bedtime reading and early readers.";

async function q(query) {
  const r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query }) });
  return (await r.json()).result || [];
}

const STATIC = [
  { path: '/books', title: "Books by Alora Swift | Children's & Senior Books", desc: 'Browse the books of Alora Swift — whimsical picture books and early readers for children, plus quizzes and brain games for seniors.', type: 'website' },
  { path: '/about', title: "About Alora Swift | Children's Book Author", desc: 'Meet Alora Swift — former kindergarten teacher, big kid at heart, and the author behind whimsical picture books for little readers.', type: 'website' },
  { path: '/journal', title: 'The Storybook Blog | Alora Swift', desc: "Behind-the-scenes peeks, reading lists, printable activities, and tips for reading aloud to little ones — from children's author Alora Swift.", type: 'website' },
  { path: '/privacy', title: 'Privacy Policy | Alora Swift', desc: 'How Alora Swift collects, uses, and protects personal information on aloraswift.com.', type: 'website' },
  { path: '/terms', title: 'Terms of Service | Alora Swift', desc: 'The terms that apply when you use aloraswift.com.', type: 'website' },
  { path: '/disclosure', title: 'Affiliate Disclosure | Alora Swift', desc: 'Some links on aloraswift.com may earn the author a small commission at no extra cost to you.', type: 'website' },
];

const books = await q(`*[_type == "book" && defined(slug.current)]{ title, "slug": slug.current, synopsis, "cover": coverImage.asset->url } | order(publishedAt desc)`);
const posts = await q(`*[_type == "journalPost" && defined(slug.current)]{ title, "slug": slug.current, excerpt, "cover": coverImage.asset->url, publishedAt } | order(publishedAt desc)`);

const author = { '@type': 'Person', name: 'Alora Swift', url: BASE };

const routes = [
  { path: '/', title: "Alora Swift | Magical Children's Books", desc: DEFAULT_DESC, type: 'website', jsonLd: [
    { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Alora Swift', url: BASE, author },
    { '@context': 'https://schema.org', '@type': 'Person', name: 'Alora Swift', url: BASE, image: `${BASE}/aloraforweb.png`, jobTitle: "Children's Book Author" },
  ] },
  ...STATIC.map((s) => ({ ...s, jsonLd: null })),
  ...books.map((b) => ({
    path: `/books/${b.slug}`,
    title: `${b.title} | Alora Swift`,
    desc: b.synopsis || "A whimsical children's picture book by Alora Swift.",
    type: 'book',
    image: b.cover || `${BASE}/aloraforweb.png`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'Book', name: b.title, author, url: `${BASE}/books/${b.slug}`, ...(b.synopsis ? { description: b.synopsis } : {}), ...(b.cover ? { image: b.cover } : {}), inLanguage: 'en' },
  })),
  ...posts.map((p) => ({
    path: `/journal/${p.slug}`,
    title: `${p.title} | Alora Swift`,
    desc: p.excerpt || 'A storybook blog post from Alora Swift.',
    type: 'article',
    image: p.cover || `${BASE}/aloraforweb.png`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'Article', headline: p.title, description: p.excerpt || '', url: `${BASE}/journal/${p.slug}`, author, ...(p.cover ? { image: p.cover } : {}), ...(p.publishedAt ? { datePublished: p.publishedAt } : {}) },
  })),
];

const shell = readFileSync('dist/index.html', 'utf8');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function render(route) {
  let html = shell;
  const url = BASE + (route.path === '/' ? '/' : route.path);
  const image = route.image || `${BASE}/aloraforweb.png`;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(route.title)}</title>`);
  html = html.replace(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${esc(route.desc)}" />`);
  const setMeta = (attr, key, content) => {
    const re = new RegExp(`<meta ${attr}="${key}" content="[^"]*"\\s*/?>`);
    if (re.test(html)) html = html.replace(re, `<meta ${attr}="${key}" content="${esc(content)}" />`);
    else html = html.replace('</head>', `  <meta ${attr}="${key}" content="${esc(content)}" />\n</head>`);
  };
  setMeta('property', 'og:title', route.title);
  setMeta('property', 'og:description', route.desc);
  setMeta('property', 'og:type', route.type || 'website');
  setMeta('property', 'og:url', url);
  setMeta('property', 'og:image', image);
  setMeta('name', 'twitter:title', route.title);
  setMeta('name', 'twitter:description', route.desc);
  setMeta('name', 'twitter:image', image);
  // canonical (insert if the shell has none — it is intentionally absent from index.html)
  const canon = `<link rel="canonical" href="${url}" />`;
  if (/<link rel="canonical"[^>]*>/.test(html)) html = html.replace(/<link rel="canonical"[^>]*>/, canon);
  else html = html.replace('</head>', `  ${canon}\n</head>`);
  if (route.jsonLd) html = html.replace('</head>', `  <script type="application/ld+json">${JSON.stringify(route.jsonLd)}</script>\n</head>`);
  return html;
}

let written = 0;
for (const route of routes) {
  if (route.path === '/') continue; // root index.html already correct
  const out = 'dist' + route.path + '/index.html';
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, render(route));
  written++;
}
console.log(`prerendered ${written} route heads (${books.length} books, ${posts.length} journal posts)`);
