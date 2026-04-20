import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: 'hb5scemv',
  dataset: 'production',
  useCdn: true, // `false` if you want to ensure fresh data
  apiVersion: '2023-05-03', // use a UTC date string
});

export interface SanityPost {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  excerpt: string;
  mainImage?: {
    asset: {
      url: string;
    };
  };
  categorySlug?: string;
  body: any[]; 
}

// Fetch all posts, optionally filtered by category
export async function fetchSanityPosts(categorySlug?: string | null): Promise<SanityPost[]> {
  let query = '';
  
  if (categorySlug) {
    query = `*[_type == "post" && $categorySlug in categories[]->slug.current] | order(publishedAt desc)[0...6] {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      mainImage {
        asset->{
          url
        }
      },
      "categorySlug": categories[0]->slug.current
    }`;
    return sanityClient.fetch(query, { categorySlug });
  } else {
    query = `*[_type == "post"] | order(publishedAt desc)[0...6] {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      mainImage {
        asset->{
          url
        }
      },
      "categorySlug": categories[0]->slug.current
    }`;
    return sanityClient.fetch(query);
  }
}

export async function fetchSanityPostBySlug(slug: string): Promise<SanityPost | null> {
  const query = `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage {
      asset->{
        url
      }
    },
    body
  }`;
  
  const post = await sanityClient.fetch(query, { slug });
  return post || null;
}