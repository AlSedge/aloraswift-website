import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'your-project-id',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: '2023-05-03',
});

const builder = imageUrlBuilder(client);
export function urlFor(source: any) {
  return builder.image(source);
}

export interface SanityBook {
  _id: string;
  title: string;
  slug: { current: string };
  coverImage: any;
  tagline: string;
  synopsis: string;
  reviewQuote: string;
  reviewAuthor: string;
  buyLink: string;
  excerptLink: string;
  ageRange: string;
  isNewRelease: boolean;
}

export async function fetchSanityBooks(): Promise<SanityBook[]> {
  const query = `*[_type == "book"] | order(publishedAt desc) {
    _id, title, slug, coverImage, tagline, synopsis, 
    reviewQuote, reviewAuthor, buyLink, excerptLink, 
    ageRange, isNewRelease
  }`;
  return await client.fetch(query);
}