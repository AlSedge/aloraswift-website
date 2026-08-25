import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || '2fs2ltni',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: '2023-05-03',
});

const builder = imageUrlBuilder(client);
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
  excerptLink: string | null;
  ageRange: string | null;
  isNewRelease: boolean;
}

const BOOK_PROJECTION = `_id, title, slug, coverImage, tagline, synopsis,
  reviewQuote, reviewAuthor, buyLink, excerptLink, ageRange, isNewRelease`;

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
  intro: any;
  photo: any;
  facts: SanityAboutFact[];
  ctaTitle: string;
  ctaText: string;
}

export async function fetchAbout(): Promise<SanityAbout | null> {
  const query = `*[_type == "aboutPage"][0] { headline, intro, photo, facts, ctaTitle, ctaText }`;
  return await client.fetch(query);
}
