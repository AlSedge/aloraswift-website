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

// Fallbacks for the About page (mirror src/pages/About.tsx) — used when the
// Sanity aboutPage document is empty.
const FALLBACK_ABOUT_INTRO = [
  'Before I was an author, I was a kindergarten teacher who loved storytime more than anything else in the world. I saw firsthand how a good book could make a child\u2019s eyes light up — and I never forgot it.',
  'Now, I spend my spare time dreaming up silly characters, painting colorful worlds, and trying to answer life\u2019s biggest questions (like "what if clouds tasted like cotton candy?").',
  'My stories are full of brave platypuses, lost koala bears, and little heroes who find magic hiding in the most unexpected places — because that\u2019s what childhood feels like when you\u2019re paying attention.',
];
const FALLBACK_ABOUT_FACTS = [
  { title: 'Teacher first', text: 'A decade of kindergarten storytimes taught me what makes a book magical for little listeners.' },
  { title: 'Characters with heart', text: 'Every hero in my books faces a big scary problem — and finds brave, silly, kind ways through it.' },
  { title: 'Home is Ireland', text: 'I live in rural Ireland with my husband. Our kids are grown and living their own adventures, and we share our home with Loki, a golden retriever who thinks he\u2019s everyone\u2019s friend.' },
];

// Book meta description: Sanity synopses are authoritative, but a page with no
// synopsis (or a very short one) would otherwise ship a useless 22-character
// description, so build a real sentence from the fields we do have.
function bookDescription(b) {
  const syn = String(b.synopsis || '').trim();
  if (syn.length >= 60) return syn.slice(0, 300);
  const grownUp = (b.category || "Children's Books") !== "Children's Books";
  const kind = grownUp ? 'book for grown-ups' : "children's picture book";
  const lead = `${b.title}${b.tagline ? ` — ${b.tagline}` : ''}.`;
  const body = `A ${kind} by ${AUTHOR}${b.ageRange ? `, for ages ${b.ageRange}` : ''}.`;
  return [lead, body, syn].filter(Boolean).join(' ');
}

const STATIC_PAGES = {
  '/books': {
    title: "Children's Picture Books by Alora Swift",
    description: 'Whimsical picture books and early readers for little ones by Alora Swift — bedtime stories, animal adventures and read-aloud favourites for ages 3-7.',
    heading: 'Picture Books for Little Readers',
    intro: 'Whimsical animal adventures, bedtime stories and read-aloud favourites for ages 3-7 — every one made to be read together.',
  },
  '/senior-books': {
    title: 'Books for Grown-Ups | Quizzes & Brain Games by Alora Swift',
    description: 'Nostalgia quizzes, brain games and light reads for grown-ups — books for parents, grandparents and anyone keeping their mind busy, by Alora Swift.',
    heading: 'Books for Grown-Ups',
    intro: 'Nostalgia quizzes, brain games and light reads — for parents, grandparents and anyone who likes to keep their mind busy.',
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
    // Full text mirrored from src/pages/Privacy.tsx — keep the two in sync.
    body: [
      '<p>Last updated: 24 August 2026</p>',
      '<h2>Who we are</h2>',
      '<p>This website, aloraswift.com, is the personal author site of Alora Swift, a children\'s book author. If you have any questions about this policy, you can email <a href="mailto:alora@aloraswift.com">alora@aloraswift.com</a>.</p>',
      '<h2>Information we collect</h2>',
      '<p><strong>Newsletter sign-ups:</strong> if you sign up for the newsletter, we collect the email address you provide, and we use it only to send you the newsletter you asked for. You can unsubscribe at any time.</p>',
      '<p><strong>Usage data:</strong> like most websites, our hosting provider (Vercel) and any analytics tools we use may collect basic, anonymised technical data such as pages visited, device type, and approximate location. This helps us understand which stories readers enjoy most.</p>',
      '<p><strong>Emails:</strong> when you email us, we keep your message only as long as needed to reply and resolve your query.</p>',
      '<h2>Cookies</h2>',
      '<p>We do not use advertising cookies. If we add analytics or other services that use cookies in the future, this policy will be updated to explain them.</p>',
      '<h2>Third-party services</h2>',
      '<p>This site is hosted on <strong>Vercel</strong> and uses <strong>Sanity</strong> to serve book and blog content. Purchases of books are completed on <strong>Amazon</strong> (or the retailer shown on the book page), and those sites have their own privacy policies — please read them before shopping.</p>',
      "<h2>Children's privacy</h2>",
      '<p>Our books are written for children, but this website is designed for parents, carers, and educators. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, contact us and we will delete it promptly.</p>',
      '<h2>Your rights</h2>',
      '<p>You may ask us at any time what personal information we hold about you, ask us to correct or delete it, or ask us to stop using it. Just email <a href="mailto:alora@aloraswift.com">alora@aloraswift.com</a> and we\'ll take care of it.</p>',
      '<h2>Changes to this policy</h2>',
      '<p>If we change this policy, we\'ll update the "last updated" date at the top of this page.</p>',
    ],
  },
  '/terms': {
    title: 'Terms of Service | Alora Swift',
    description: 'The terms that apply when you use aloraswift.com.',
    heading: 'Terms of Service',
    intro: 'The terms that apply when you use aloraswift.com.',
    // Full text mirrored from src/pages/Terms.tsx — keep the two in sync.
    body: [
      '<h2>Using this website</h2>',
      '<p>By using aloraswift.com you agree to these terms. The content on this site — text, images, and illustrations — belongs to Alora Swift unless stated otherwise and may not be reproduced without permission.</p>',
      '<h2>Content is for information and enjoyment</h2>',
      '<p>Blog posts, reading lists, and activity ideas are shared to inform and entertain. We do our best to keep everything accurate, but content may change and is provided "as is" without warranties of any kind.</p>',
      '<h2>Buying books</h2>',
      '<p>When you buy a book, the purchase happens with the retailer (such as Amazon) under their own terms. We are not responsible for the retailer\'s service, delivery, or returns.</p>',
      '<h2>Links to other sites</h2>',
      '<p>We link to third-party websites for your convenience. We don\'t control those sites and aren\'t responsible for their content or privacy practices.</p>',
      '<h2>Limitation of liability</h2>',
      '<p>To the maximum extent permitted by law, Alora Swift is not liable for any loss or damage arising from your use of this website.</p>',
      '<h2>Contact</h2>',
      '<p>Questions about these terms? Email <a href="mailto:alora@aloraswift.com">alora@aloraswift.com</a>.</p>',
      '<p><a href="/privacy">Read the Privacy Policy</a></p>',
    ],
  },
  '/disclosure': {
    title: 'Affiliate Disclosure | Alora Swift',
    description: 'Some links on aloraswift.com may earn the author a small commission at no extra cost to you.',
    heading: 'Affiliate Disclosure',
    intro: 'Some links on this site are affiliate links — if you buy through them, Alora may earn a small commission at no extra cost to you.',
    // Full text mirrored from src/pages/Disclosure.tsx — keep the two in sync.
    body: [
      '<p>Last updated: 24 August 2026</p>',
      '<p><strong>Some links on this site are affiliate links.</strong></p>',
      '<p>This means that if you click a book or product link and make a purchase, Alora Swift may earn a small commission — <strong>at no extra cost to you</strong>.</p>',
      "<p>Where we recommend a book, game, or toy on this site, it's because we genuinely love it and think your family will too — not because of the commission. Affiliate earnings help support the time and care that goes into writing and sharing these stories.</p>",
      "<p>Book purchases are completed with the retailer (such as Amazon) under their own terms and privacy policies. We never recommend anything we wouldn't happily read (or play) ourselves.</p>",
      "<p>Thank you so much for supporting independent children's authors! 💛</p>",
    ],
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

function buildHtml(template, { title, description, canonical, image, type, bodyHtml, jsonLd, extraMeta }) {
  let html = template;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  html = html.replace(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${esc(description)}" />`);
  const setMeta = (attr, key, content) => {
    const re = new RegExp(`<meta ${attr}="${key}" content="[^"]*"\\s*/?>`);
    if (re.test(html)) html = html.replace(re, `<meta ${attr}="${key}" content="${esc(content)}" />`);
    else html = html.replace('</head>', `  <meta ${attr}="${key}" content="${esc(content)}" />\n</head>`);
  };
  const img = image || `${SITE}/og-image.jpg`;
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', description);
  setMeta('property', 'og:type', type || 'website');
  setMeta('property', 'og:url', canonical);
  setMeta('property', 'og:image', img);
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', description);
  setMeta('name', 'twitter:image', img);
  // Route-specific extras — e.g. the article:* tags Pinterest Rich Pins require on Article pages.
  for (const [attr, key, content] of extraMeta || []) if (content) setMeta(attr, key, content);
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
      '<li><a href="/books">Children\'s picture books</a></li>',
      '<li><a href="/senior-books">Books for grown-ups</a></li>',
      '<li><a href="/journal">The Storybook Blog</a></li>',
      '<li><a href="/about">About Alora Swift</a></li>',
      '</ul>',
    ].join('\n'),
    jsonLd: [
      { '@context': 'https://schema.org', '@type': 'WebSite', name: AUTHOR, url: SITE, author },
      { '@context': 'https://schema.org', '@type': 'Person', name: AUTHOR, url: SITE, image: `${SITE}/og-image.jpg`, jobTitle: "Children's Book Author" },
    ],
  }));

  // 2) Static pages (+ the Books hub, which lists the collections)
  for (const [route, meta] of Object.entries(STATIC_PAGES)) {
    let body = [`<h1>${esc(meta.heading)}</h1>`, `<p>${esc(meta.intro)}</p>`];
    if (meta.body) body.push(...meta.body);
    let jsonLd = { '@context': 'https://schema.org', '@type': 'WebPage', name: meta.heading, description: meta.description, url: SITE + route };

    const CHILDRENS_CAT = "Children's Books";
    const childrensBooks = books.filter((b) => (b.category || CHILDRENS_CAT) === CHILDRENS_CAT);
    const grownUpBooks = books.filter((b) => (b.category || CHILDRENS_CAT) !== CHILDRENS_CAT);

    if (route === '/books') {
      const cats = [CHILDRENS_CAT];
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
      body.push('<p><a href="/senior-books">Looking for books for grown-ups?</a> · <a href="/journal">Read the Storybook Blog</a></p>');
      jsonLd = [
        { '@context': 'https://schema.org', '@type': 'CollectionPage', name: "Children's Picture Books by Alora Swift", description: meta.description, url: SITE + route },
        { '@context': 'https://schema.org', '@type': 'ItemList', name: "Children's Picture Books by Alora Swift", itemListElement: items },
      ];
    }

    if (route === '/senior-books') {
      const items = [];
      if (grownUpBooks.length) {
        body.push('<h2>Books for Grown-Ups</h2><ul>');
        for (const b of grownUpBooks) {
          body.push(`<li><a href="/books/${esc(b.slug)}">${esc(b.title)}</a>${b.tagline ? ` — ${esc(b.tagline)}` : ''}</li>`);
          items.push({ '@type': 'ListItem', position: items.length + 1, name: b.title, url: bookUrl(b.slug) });
        }
        body.push('</ul>');
      }
      body.push('<p><a href="/books">Browse the children&apos;s picture books</a></p>');
      jsonLd = [
        { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Books for Grown-Ups', description: meta.description, url: SITE + route },
        { '@context': 'https://schema.org', '@type': 'ItemList', name: 'Books for Grown-Ups', itemListElement: items },
      ];
    }

    if (route === '/journal') {
      if (posts.length) {
        body.push('<h2>Latest posts</h2><ul>');
        for (const p of posts) body.push(`<li><a href="/journal/${esc(p.slug)}">${esc(p.title)}</a>${p.excerpt ? ` — ${esc(p.excerpt)}` : ''}</li>`);
        body.push('</ul>');
      }
      body.push('<p><a href="/">Join the Storybook Club</a> for new posts, reading lists and free printables.</p>');
      const items = posts.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.title, url: `${SITE}/journal/${p.slug}` }));
      jsonLd = [
        { '@context': 'https://schema.org', '@type': 'Blog', name: 'The Storybook Blog', url: SITE + route, author },
        ...(items.length ? [{ '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: items }] : []),
      ];
    }

    if (route === '/about') {
      // Pull the real About copy from Sanity so the crawlable HTML matches the page.
      const about = await querySanity('*[_type == "aboutPage"][0]{headline, intro, facts[]{title, text}, ctaTitle, ctaText}');
      const introHtml = about && Array.isArray(about.intro) && about.intro.length
        ? portableTextToHtml(about.intro)
        : FALLBACK_ABOUT_INTRO.map((p) => `<p>${esc(p)}</p>`).join('\n');
      const facts = about && Array.isArray(about.facts) && about.facts.length ? about.facts : FALLBACK_ABOUT_FACTS;
      body.push('<h2>From the classroom to the storybook page</h2>', introHtml);
      body.push('<h2>A few things about me</h2>');
      for (const f of facts) body.push(`<h3>${esc(f.title)}</h3>`, `<p>${esc(f.text)}</p>`);
      if (about && about.ctaTitle) body.push(`<h2>${esc(about.ctaTitle)}</h2>`, about.ctaText ? `<p>${esc(about.ctaText)}</p>` : '');
      body.push('<p><a href="/books">Explore the children&apos;s books</a> · <a href="/journal">Read the Storybook Blog</a></p>');
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
    const description = bookDescription(b);
    const body = [
      '<article>',
      `<h1>${esc(b.title)}</h1>`,
      b.tagline ? `<p><em>${esc(b.tagline)}</em></p>` : '',
      b.cover ? `<img src="${esc(b.cover)}" alt="${esc(b.title)} cover" width="600" />` : '',
      `<p>${esc(description)}</p>`,
      b.ageRange ? `<p>Ages: ${esc(b.ageRange)}</p>` : '',
      b.buyLink ? `<p><a href="${esc(b.buyLink)}" rel="nofollow sponsored noopener" target="_blank">Buy the book</a></p>` : '',
      `<p><a href="${(b.category || "Children\'s Books") === "Children\'s Books" ? '/books' : '/senior-books'}">Back to all books</a></p>`,
      '</article>',
    ].filter(Boolean).join('\n');
    write(`/books/${b.slug}`, buildHtml(template, {
      title: `${b.title} | ${AUTHOR}`,
      description,
      canonical: url,
      image: b.cover || undefined,
      type: 'book',
      bodyHtml: body,
      jsonLd: {
        '@context': 'https://schema.org', '@type': 'Book', name: b.title, author, url,
        description,
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
      // Pinterest Rich Pins (Article) require these two alongside og:type=article.
      extraMeta: [
        ['property', 'article:published_time', p.publishedAt],
        ['property', 'article:author', `${SITE}/about`],
      ],
      bodyHtml: body,
      jsonLd: {
        '@context': 'https://schema.org', '@type': 'Article', headline: p.title,
        description: p.excerpt || '', url, author,
        ...(p.cover ? { image: p.cover } : {}),
        ...(p.publishedAt ? { datePublished: p.publishedAt } : {}),
      },
    }));
  }

  // 5) 404 page.
  // Vercel serves dist/404.html (with a real HTTP 404) for any path that does
  // not match a static file, so unknown URLs stop answering "200 OK" (soft
  // 404s are indexable). It is the app shell, so React still renders the
  // friendly "page not found" screen; the noindex tag keeps it out of search.
  const homePath = path.join(DIST, 'index.html');
  const homeHtml = fs.readFileSync(homePath, 'utf8');
  fs.writeFileSync(path.join(DIST, '404.html'), homeHtml.replace('</head>', '  <meta name="robots" content="noindex" />\n</head>'), 'utf8');

  console.log(`Prerendered ${written} pages (${books.length} books, ${posts.length} journal posts) + 404.html`);
}

main().catch((err) => {
  console.error('Prerender failed:', err.message);
  process.exit(1);
});
