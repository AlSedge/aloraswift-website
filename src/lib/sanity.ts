import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Draft preview: on the local dev server, any page opened with ?preview=1 reads
// unpublished drafts. Those requests go through the dev-server proxy (vite.config.ts)
// so the token stays server side, and the deployed site is unaffected - without the
// flag the client behaves exactly as before.
const previewRequested =
  typeof window !== 'undefined' &&
  // Local only: the proxy that supplies the token exists solely on the dev server, so on
  // the live site ?preview=1 must change nothing at all.
  ['localhost', '127.0.0.1'].includes(window.location.hostname) &&
  new URLSearchParams(window.location.search).has('preview');

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || '2fs2ltni',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  useCdn: !previewRequested,
  apiVersion: '2023-05-03',
  // Drafts are written by the import tooling for review; the live site must not show them.
  perspective: previewRequested ? 'previewDrafts' : 'published',
  // In preview, requests go through the dev server, which adds the token server side.
  // apiHost is the option the client actually honours (it rebuilds `url` from it):
  // with useProjectHostname off, the URL becomes protocol://<apiHost>/v<apiVersion>.
  ...(previewRequested
    ? {
        useProjectHostname: false,
        apiHost: `${window.location.protocol}//${window.location.host}/sanity-preview`,
      }
    : {}),
});

// Images always resolve against the Sanity CDN. The preview client's apiHost points at
// the local proxy, so the builder deliberately uses its own plain client.
const imageClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || '2fs2ltni',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: true,
});
const builder = imageUrlBuilder(imageClient);
export function urlFor(source: any) {
  return builder.image(source);
}

// --- BOOKS ---
export interface SanityBook {
  _id: string;
  title: string;
  slug: { current: string };
  coverImage: any;
  tagline: string;
  synopsis: string | null;
  reviewQuote: string | null;
  reviewAuthor: string | null;
  buyLink: string | null;
  buyLinkUS: string | null;
  excerptLink: string | null;
  ageRange: string | null;
  category: string;
  isNewRelease: boolean;
}

const BOOK_PROJECTION = `_id, title, slug, coverImage, tagline, synopsis,
  reviewQuote, reviewAuthor, buyLink, buyLinkUS, excerptLink, ageRange, category, isNewRelease`;

export async function fetchSanityBooks(): Promise<SanityBook[]> {
  const query = `*[_type == "book"] | order(publishedAt desc) { ${BOOK_PROJECTION} }`;
  return await client.fetch(query);
}

export async function fetchBookBySlug(slug: string): Promise<SanityBook | null> {
  const query = `*[_type == "book" && slug.current == $slug][0] { ${BOOK_PROJECTION} }`;
  return await client.fetch(query, { slug });
}

// --- REVIEWS ---
export interface SanityReview {
  _id: string;
  title: string;
  type: string;
  image: any;
  description: string;
  link: string;
}

export async function fetchSanityReviews(): Promise<SanityReview[]> {
  const query = `*[_type == "review"] | order(publishedAt desc) {
    _id, title, type, image, description, link
  }`;
  return await client.fetch(query);
}

// --- JOURNAL POSTS ---
export interface SanityJournalPost {
  _id: string;
  title: string;
  slug: { current: string };
  tag: string;
  excerpt: string;
  body: any;
  coverImage: any;
  publishedAt: string;
}

export async function fetchJournalPosts(): Promise<SanityJournalPost[]> {
  const query = `*[_type == "journalPost"] | order(publishedAt desc) {
    _id, title, slug, tag, excerpt, body, coverImage, publishedAt
  }`;
  return await client.fetch(query);
}

export async function fetchJournalPostBySlug(slug: string): Promise<SanityJournalPost | null> {
  const query = `*[_type == "journalPost" && slug.current == $slug][0] {
    _id, title, slug, tag, excerpt, body, coverImage, publishedAt
  }`;
  return await client.fetch(query, { slug });
}

// --- ABOUT PAGE (singleton) ---
export interface SanityAboutFact {
  title: string;
  text: string;
}

export interface SanityAbout {
  headline: string;
  homeHeading: string;
  intro: any;
  photo: any;
  facts: SanityAboutFact[];
  ctaTitle: string;
  ctaText: string;
}

export async function fetchAbout(): Promise<SanityAbout | null> {
  const query = `*[_type == "aboutPage"][0] { headline, homeHeading, intro, photo, facts, ctaTitle, ctaText }`;
  return await client.fetch(query);
}
