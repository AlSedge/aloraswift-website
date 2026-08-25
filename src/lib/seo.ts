// Per-route SEO metadata.
// Every route gets a unique <title>, meta description, canonical URL,
// Open Graph / Twitter tags, and (where useful) JSON-LD structured data.

export interface SeoMeta {
  title: string;
  description: string;
  type?: 'website' | 'article' | 'book';
  jsonLd?: object | null;
}

export const SITE_URL = 'https://www.aloraswift.com';
export const SITE_NAME = 'Alora Swift';

const DEFAULT_DESCRIPTION =
  "Magical children's picture books by Alora Swift — whimsical tales of brave platypuses, lost koala bears, and baking adventures. Perfect for bedtime reading and early readers.";

export const authorJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Alora Swift',
  url: SITE_URL,
  image: `${SITE_URL}/aloraforweb.png`,
  jobTitle: "Children's Book Author",
  description:
    "Alora Swift is a children's book author and former kindergarten teacher. She writes whimsical picture books about brave platypuses, lost koala bears, and adventures in unexpected places.",
  knowsAbout: ["Children's literature", 'Picture books', 'Early readers'],
};

const webSiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  author: authorJsonLd,
};

const ROUTE_META: Record<string, SeoMeta> = {
  '/': {
    title: "Alora Swift | Magical Children's Books",
    description: DEFAULT_DESCRIPTION,
    jsonLd: [webSiteJsonLd, authorJsonLd],
  },
  '/books': {
    title: "Books by Alora Swift | Picture Books & Early Readers",
    description:
      "Explore the full collection of Alora Swift's picture books and early readers — stories about brave platypuses, lost koala bears, and first baking adventures.",
  },
  '/books/:slug': {
    title: 'Book | Alora Swift',
    description: "A whimsical children's picture book by Alora Swift.",
    type: 'book',
  },
  '/about': {
    title: "About Alora Swift | Children's Book Author",
    description:
      'Meet Alora Swift — former kindergarten teacher, big kid at heart, and the author behind whimsical picture books for little readers.',
  },
  '/journal': {
    title: 'The Storybook Blog | Alora Swift',
    description:
      "Behind-the-scenes peeks, reading lists, printable activities, and tips for reading aloud to little ones — from children's author Alora Swift.",
  },
  '/journal/:slug': {
    title: 'Journal Post | Alora Swift',
    description: 'A storybook blog post from children\u2019s author Alora Swift.',
    type: 'article',
  },
  '/privacy': {
    title: 'Privacy Policy | Alora Swift',
    description: 'How Alora Swift collects, uses, and protects personal information on aloraswift.com.',
  },
  '/terms': {
    title: 'Terms of Service | Alora Swift',
    description: 'The terms that apply when you use aloraswift.com.',
  },
  '/disclosure': {
    title: 'Affiliate Disclosure | Alora Swift',
    description:
      'Some links on aloraswift.com may earn the author a small commission at no extra cost to you. Learn how that works.',
  },
};

const FALLBACK_META: SeoMeta = {
  title: `${SITE_NAME} | Magical Children's Books`,
  description: DEFAULT_DESCRIPTION,
};

export function getRouteMeta(pathname: string): SeoMeta {
  if (ROUTE_META[pathname]) return ROUTE_META[pathname];
  if (pathname.startsWith('/books/')) return ROUTE_META['/books/:slug'];
  if (pathname.startsWith('/journal/')) return ROUTE_META['/journal/:slug'];
  return FALLBACK_META;
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

export function setJsonLd(id: string, data: object | null | undefined) {
  const existing = document.getElementById(id);
  if (existing) existing.remove();
  if (!data) return;
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = id;
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

export function applySeo(meta: SeoMeta, pathname: string) {
  document.title = meta.title;
  setMeta('name', 'description', meta.description);
  setMeta('property', 'og:title', meta.title);
  setMeta('property', 'og:description', meta.description);
  setMeta('property', 'og:type', meta.type || 'website');
  setMeta('property', 'og:url', SITE_URL + pathname);
  setMeta('property', 'og:site_name', SITE_NAME);
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', meta.title);
  setMeta('name', 'twitter:description', meta.description);
  setCanonical(SITE_URL + pathname);
  setJsonLd('seo-jsonld', meta.jsonLd);
}

// Book detail pages: called once Sanity content has loaded so each book
// gets its own title, description, and Book structured data.
export function applyBookSeo(
  book: { title: string; synopsis?: string | null; coverUrl?: string | null },
  pathname: string
) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    author: authorJsonLd,
    url: SITE_URL + pathname,
    ...(book.synopsis ? { description: book.synopsis } : {}),
    ...(book.coverUrl ? { image: book.coverUrl } : {}),
    inLanguage: 'en',
  };
  applySeo(
    {
      title: `${book.title} | ${SITE_NAME}`,
      description: book.synopsis || `A whimsical children's picture book by Alora Swift.`,
      type: 'book',
      jsonLd,
    },
    pathname
  );
}

// Homepage: once books load, publish an ItemList of the collection.
export function applyBookListJsonLd(
  books: { title: string; slug: string; coverUrl?: string | null }[]
) {
  setJsonLd(
    'seo-jsonld-books',
    books.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Books by Alora Swift',
          itemListElement: books.map((b, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: b.title,
            url: `${SITE_URL}/books/${b.slug}`,
            ...(b.coverUrl ? { image: b.coverUrl } : {}),
          })),
        }
      : null
  );
}

// Journal post pages: Article structured data once content loads.
export function applyJournalSeo(
  post: { title: string; excerpt?: string | null; coverUrl?: string | null; publishedAt?: string | null },
  pathname: string
) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || `A storybook blog post from children's author Alora Swift.`,
    url: SITE_URL + pathname,
    ...(post.coverUrl ? { image: post.coverUrl } : {}),
    author: authorJsonLd,
    publisher: {
      '@type': 'Person',
      name: 'Alora Swift',
      url: SITE_URL,
    },
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
  };
  applySeo(
    {
      title: `${post.title} | ${SITE_NAME}`,
      description: post.excerpt || 'A storybook blog post from Alora Swift.',
      type: 'article',
      jsonLd,
    },
    pathname
  );
}
