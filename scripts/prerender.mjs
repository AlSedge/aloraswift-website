// Prerenders every route to static HTML after `vite build`.
// Why: this is a client-side React app, so crawl bots otherwise see the same
// empty shell (identical title/canonical/content) for every URL.
// This writes dist/<route>/index.html with a unique title, meta, canonical,
// structured data and REAL crawlable content (book details, journal text,
// internal links). React replaces this content on load, so visitors see the
// normal app.
//
// NOTE: keep the meta strings in sync with src/lib/seo.ts.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, '..', 'dist');
const SITE = 'https://www.aloraswift.com';
const API = `https://${process.env.VITE_SANITY_PROJECT_ID || '2fs2ltni'}.api.sanity.io/v2023-05-03/data/query/${process.env.VITE_SANITY_DATASET || 'production'}`;
const AUTHOR = 'Alora Swift';
const DEFAULT_DESC =
  "Magical children's picture books by Alora Swift — whimsical tales of brave platypuses, lost koala bears, and baking adventures. Perfect for bedtime reading and early readers.";

const STATIC_PAGES = {
  '/books': {
    title: "Books by Alora Swift | Children's & Senior Books",
    description: 'Browse the books of Alora Swift — whimsical picture books and early readers for children, plus quizzes and brain games for seniors.',
    heading: 'Stories for Every Age',
    intro: 'Whimsical picture books for little readers, and brain-teasers for grown-ups — browse each collection below.',
  },
  '/about': {
    title: "About Alora Swift | Children's Book Author",
    description: 'Meet Alora Swift — former kindergarten teacher, big kid at heart, and the author behind whimsical picture books for little readers.',
    heading: 'About Alora Swift',
    intro: 'Storyteller, former kindergarten teacher and big kid at heart. I write books that make little eyes light up and sleepy voices beg for "just one more page."',
  },
  '/journal': {
    title: 'The Storybook Blog | Alora Swift',
    description: "Behind-the-scenes peeks, reading lists, printable activities, and tips for reading aloud to little ones — from children's author Alora Swift.",
    heading: 'The Storybook Blog',
    intro: 'Behind-the-scenes peeks, reading lists, printable activities, and tips to share with your little ones.',
  },
  '/privacy': {
    title: 'Privacy Policy | Alora Swift',
    description: 'How Alora Swift collects, uses, and protects personal information on aloraswift.com.',
    heading: 'Privacy Policy',
    intro: 'How Alora Swift collects, uses, and protects personal information on aloraswift.com.',
  },
  '/terms': {
    title: 'Terms of Service | Alora Swift',
    description: 'The terms that apply when you use aloraswift.com.',
    heading: 'Terms of Service',
    intro: 'The terms that apply when you use aloraswift.com.',
  },
  '/disclosure': {
    title: 'Affiliate Disclosure | Alora Swift',
    description: 'Some links on aloraswift.com may earn the author a small commission at no extra cost to you.',
    heading: 'Affiliate Disclosure',
    intro: 'Some links on this site are affiliate links — if you buy through them, Alora may earn a small commission at no extra cost to you.',
  },
};

// ---------- helpers ----------
const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function portableTextToHtml(blocks = []) {
  if (!Array.isArray(blocks)) return '';
  const out = [];
  let listType = null;
  const closeList = () => { if (listType) { out.push(`</${listType}>`); listType = null; } };
  for (const b of blocks) {
    if (b._type !== 'block') continue;
    const marks = {};
    for (const md of b.markDefs || []) if (md._type === 'link') marks[md._key] = md.href;
    const inner = (b.children || [])
      .map((c) => {
        let t = esc(c.text || '');
        const cm = c.marks || [];
        if (cm.some((m) => marks[m])) t = `<a href="${esc(cm.map((m) => marks[m]).find(Boolean))}">${t}</a>`;
        if (cm.includes('strong')) t = `<strong>${t}</strong>`;
        if (cm.includes('em')) t = `<em>${t}</em>`;
        return t;
      })
      .join('');
    if (b.listItem) {
      const want = b.listItem === 'number' ? 'ol' : 'ul';
      if (listType !== want) { closeList(); out.push(`<${want}>`); listType = want; }
      out.push(`<li>${inner}</li>`);
      continue;
    }
    closeList();
    const style = b.style || 'normal';
    if (style === 'h2') out.push(`<h2>${inner}</h2>`);
    else if (style === 'h3') out.push(`<h3>${inner}</h3>`);
    else if (style === 'blockquote') out.push(`<blockquote>${inner}</blockquote>`);
    else out.push(`<p>${inner}</p>`);
  }
  closeList();
  return out.join('\n');
}

async function querySanity(groq) {
  const res = await fetch(`${API}?query=${encodeURIComponent(groq)}`, {
    headers: { 'user-agent': 'AloraSwiftPrerender/1.0' },
    signal: AbortSignal.timeout(30000),
  });
  if (!res.ok) throw new Error(`Sanity HTTP ${res.status}`);
  return (await res.json()).result || [];
}

function buildHtml(template, { title, description, canonical, image, type, bodyHtml, jsonLd }) {
  let html = template;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  html = html.replace(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${esc(description)}" />`);
  const setMeta = (attr, key, content) => {
    const re = new RegExp(`<meta ${attr}="${key}" content="[^"]*"\\s*/?>`);
    if (re.test(html)) html = html.replace(re, `<meta ${attr}="${key}" content="${esc(content)}" />`);
    else html = html.replace('</head>', `  <meta ${attr}="${key}" content="${esc(content)}" />\n</head>`);
  };
  const img = image || `${SITE}/aloraforweb.png`;
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', description);
  setMeta('property', 'og:type', type || 'website');
  setMeta('property', 'og:url', canonical);
  setMeta('property', 'og:image', img);
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', description);
  setMeta('name', 'twitter:image', img);
  const head = [
    `<link rel="canonical" href="${esc(canonical)}" />`,
    jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : '',
  ].filter(Boolean).join('\n    ');
  html = html.replace('<link rel="canonical"[^>]*>', ''); // drop the homepage canonical if this route already has one
  html = html.replace(/<link rel="canonical"[^>]*>/, '');
  html = html.replace('</head>', `  ${head}\n</head>`);
  // Crawlable content inside #root (React replaces this on load)
  html = html.replace('<div id="root"></div>', `<div id="root"><main>${bodyHtml}</main></div>`);
  return html;
}

const author = { '@type': 'Person', name: AUTHOR, url: SITE };
const bookUrl = (slug) => `${SITE}/books/${slug}`;

async function main() {
  const templatePath = path.join(DIST, 'index.html');
  if (!fs.existsSync(templatePath)) throw new Error('dist/index.html not found — run vite build first');
  const template = fs.readFileSync(templatePath, 'utf8');

  const books = await querySanity('*[_type == "book" && defined(slug.current)]{title, "slug": slug.current, synopsis, tagline, ageRange, category, buyLink, "cover": coverImage.asset->url, publishedAt} | order(publishedAt desc)');
  const posts = await querySanity('*[_type == "journalPost" && defined(slug.current)]{title, "slug": slug.current, tag, excerpt, body, "cover": coverImage.asset->url, publishedAt} | order(publishedAt desc)');

  let written = 0;
  const write = (route, html) => {
    const dir = route === '/' ? DIST : path.join(DIST, route.replace(/^\//, ''));
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
    written++;
  };

  // 1) Home
  const homeBooks = books.filter((b) => (b.category || "Children's Books") === "Children's Books");
  write('/', buildHtml(template, {
    title: "Alora Swift | Magical Children's Books",
    description: DEFAULT_DESC,
    canonical: SITE + '/',
    bodyHtml: [
      '<h1>Where imagination takes flight</h1>',
      `<p>${esc(DEFAULT_DESC)}</p>`,
      '<h2>Books</h2><ul>',
      ...homeBooks.map((b) => `<li><a href="/books/${esc(b.slug)}">${esc(b.title)}</a>${b.synopsis ? ` — ${esc(String(b.synopsis).slice(0, 160))}` : ''}</li>`),
      '</ul>',
      '<h2>Explore</h2><ul>',
      '<li><a href="/books">All books (children\'s &amp; senior)</a></li>',
      '<li><a href="/journal">The Storybook Blog</a></li>',
      '<li><a href="/about">About Alora Swift</a></li>',
      '</ul>',
    ].join('\n'),
    jsonLd: [
      { '@context': 'https://schema.org', '@type': 'WebSite', name: AUTHOR, url: SITE, author },
      { '@context': 'https://schema.org', '@type': 'Person', name: AUTHOR, url: SITE, image: `${SITE}/aloraforweb.png`, jobTitle: "Children's Book Author" },
    ],
  }));

  // 2) Static pages (+ the Books hub, which lists the collections)
  for (const [route, meta] of Object.entries(STATIC_PAGES)) {
    let body = [`<h1>${esc(meta.heading)}</h1>`, `<p>${esc(meta.intro)}</p>`];
    let jsonLd = { '@context': 'https://schema.org', '@type': 'WebPage', name: meta.heading, description: meta.description, url: SITE + route };

    if (route === '/books') {
      const cats = ["Children's Books", 'Senior Books'];
      const items = [];
      for (const cat of cats) {
        const list = books.filter((b) => (b.category || "Children's Books") === cat);
        if (!list.length) continue;
        body.push(`<h2>${esc(cat)}</h2><ul>`);
        for (const b of list) {
          body.push(`<li><a href="/books/${esc(b.slug)}">${esc(b.title)}</a>${b.tagline ? ` — ${esc(b.tagline)}` : ''}${b.ageRange ? ` (ages ${esc(b.ageRange)})` : ''}</li>`);
          items.push({ '@type': 'ListItem', position: items.length + 1, name: b.title, url: bookUrl(b.slug) });
        }
        body.push('</ul>');
      }
      body.push('<p><a href="/journal">Read the Storybook Blog</a></p>');
      jsonLd = [
        { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Books by Alora Swift', description: meta.description, url: SITE + route },
        { '@context': 'https://schema.org', '@type': 'ItemList', name: 'Books by Alora Swift', itemListElement: items },
      ];
    }

    if (route === '/journal') {
      if (posts.length) {
        body.push('<h2>Latest posts</h2><ul>');
        for (const p of posts) body.push(`<li><a href="/journal/${esc(p.slug)}">${esc(p.title)}</a>${p.excerpt ? ` — ${esc(p.excerpt)}` : ''}</li>`);
        body.push('</ul>');
      }
      const items = posts.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.title, url: `${SITE}/journal/${p.slug}` }));
      jsonLd = [
        { '@context': 'https://schema.org', '@type': 'Blog', name: 'The Storybook Blog', url: SITE + route, author },
        ...(items.length ? [{ '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: items }] : []),
      ];
    }

    if (route === '/about') {
      jsonLd = { '@context': 'https://schema.org', '@type': 'AboutPage', name: meta.heading, description: meta.description, url: SITE + route, mainEntity: author };
    }

    write(route, buildHtml(template, {
      title: meta.title, description: meta.description, canonical: SITE + route,
      bodyHtml: body.join('\n'), jsonLd,
    }));
  }

  // 3) Book detail pages
  for (const b of books) {
    const url = bookUrl(b.slug);
    const body = [
      '<article>',
      `<h1>${esc(b.title)}</h1>`,
      b.tagline ? `<p><em>${esc(b.tagline)}</em></p>` : '',
      b.cover ? `<img src="${esc(b.cover)}" alt="${esc(b.title)} cover" width="600" />` : '',
      b.synopsis ? `<p>${esc(b.synopsis)}</p>` : '',
      b.ageRange ? `<p>Ages: ${esc(b.ageRange)}</p>` : '',
      b.buyLink ? `<p><a href="${esc(b.buyLink)}" rel="nofollow sponsored noopener" target="_blank">Buy the book</a></p>` : '',
      `<p><a href="/books">Back to all books</a></p>`,
      '</article>',
    ].filter(Boolean).join('\n');
    write(`/books/${b.slug}`, buildHtml(template, {
      title: `${b.title} | ${AUTHOR}`,
      description: b.synopsis || `A book by ${AUTHOR}.`,
      canonical: url,
      image: b.cover || undefined,
      type: 'book',
      bodyHtml: body,
      jsonLd: {
        '@context': 'https://schema.org', '@type': 'Book', name: b.title, author, url,
        ...(b.synopsis ? { description: b.synopsis } : {}),
        ...(b.cover ? { image: b.cover } : {}),
        inLanguage: 'en',
      },
    }));
  }

  // 4) Journal posts
  for (const p of posts) {
    const url = `${SITE}/journal/${p.slug}`;
    const body = [
      '<article>',
      `<h1>${esc(p.title)}</h1>`,
      p.tag ? `<p><em>${esc(p.tag)}</em></p>` : '',
      p.cover ? `<img src="${esc(p.cover)}" alt="${esc(p.title)}" width="800" />` : '',
      p.excerpt ? `<p>${esc(p.excerpt)}</p>` : '',
      portableTextToHtml(p.body),
      '<p><a href="/journal">Back to the Journal</a></p>',
      '</article>',
    ].filter(Boolean).join('\n');
    write(`/journal/${p.slug}`, buildHtml(template, {
      title: `${p.title} | ${AUTHOR}`,
      description: p.excerpt || `A storybook blog post from ${AUTHOR}.`,
      canonical: url,
      image: p.cover || undefined,
      type: 'article',
      bodyHtml: body,
      jsonLd: {
        '@context': 'https://schema.org', '@type': 'Article', headline: p.title,
        description: p.excerpt || '', url, author,
        ...(p.cover ? { image: p.cover } : {}),
        ...(p.publishedAt ? { datePublished: p.publishedAt } : {}),
      },
    }));
  }

  console.log(`Prerendered ${written} pages (${books.length} books, ${posts.length} journal posts)`);
}

main().catch((err) => {
  console.error('Prerender failed:', err.message);
  process.exit(1);
});
