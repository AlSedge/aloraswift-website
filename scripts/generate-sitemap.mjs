// Generates public/sitemap.xml at build time from Sanity content.
// Runs before `vite build` (see package.json), so new books / journal posts
// are always included automatically.
const PROJECT = process.env.VITE_SANITY_PROJECT_ID || '2fs2ltni';
const DATASET = process.env.VITE_SANITY_DATASET || 'production';
const BASE = 'https://www.aloraswift.com';
const API = `https://${PROJECT}.api.sanity.io/v2023-05-03/data/query/${DATASET}`;

async function q(query) {
  const r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query }) });
  if (!r.ok) throw new Error('Sanity query failed: ' + r.status);
  return (await r.json()).result || [];
}

const STATIC_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/books', priority: '0.9', changefreq: 'weekly' },
  { path: '/about', priority: '0.7', changefreq: 'monthly' },
  { path: '/journal', priority: '0.7', changefreq: 'weekly' },
  { path: '/disclosure', priority: '0.3', changefreq: 'yearly' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms', priority: '0.3', changefreq: 'yearly' },
];

const books = await q('*[_type == "book" && defined(slug.current)]{ "slug": slug.current } | order(publishedAt desc)');
const posts = await q('*[_type == "journalPost" && defined(slug.current)]{ "slug": slug.current } | order(publishedAt desc)');

const urls = [
  ...STATIC_ROUTES.map((r) => ({ loc: BASE + r.path, priority: r.priority, changefreq: r.changefreq })),
  ...books.map((b) => ({ loc: `${BASE}/books/${b.slug}`, priority: '0.8', changefreq: 'monthly' })),
  ...posts.map((p) => ({ loc: `${BASE}/journal/${p.slug}`, priority: '0.6', changefreq: 'monthly' })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

const { writeFileSync, mkdirSync } = await import('node:fs');
mkdirSync('public', { recursive: true });
writeFileSync('public/sitemap.xml', xml);
console.log(`sitemap.xml written — ${urls.length} URLs (${books.length} books, ${posts.length} journal posts)`);
