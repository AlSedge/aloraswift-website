import { useEffect, useState } from 'react';
import { fetchSanityPosts, SanityPost } from '../lib/sanity';
import { ArrowRight, Calendar, FileQuestion } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LatestPostsProps {
  categorySlug?: string | null;
}

export default function LatestPosts({ categorySlug }: LatestPostsProps) {
  const [posts, setPosts] = useState<SanityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      setIsLoading(true);
      try {
        const data = await fetchSanityPosts(categorySlug || undefined);
        setPosts(data);
      } catch (error) {
        console.error("Failed to load posts", error);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadPosts();
  }, [categorySlug]);

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-[2rem] bg-stone-200 h-[28rem] border border-stone-100"></div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-[2.5rem] border border-stone-100">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 text-stone-400 mb-6">
          <FileQuestion size={32} />
        </div>
        <h3 className="text-xl font-bold text-stone-900 mb-2">No articles found</h3>
        <p className="text-stone-500 max-w-md">
          {categorySlug 
            ? "We couldn't find any articles in this category right now. Check back soon for updates!"
            : "No articles have been published yet. Check back soon for updates!"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      {posts.map((post) => {
        const featuredImage = post.mainImage?.asset?.url || 
          'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop';
        
        const cleanExcerpt = post.excerpt && post.excerpt.length > 100 
          ? post.excerpt.substring(0, 100) + '...' 
          : post.excerpt;

        const postDate = new Date(post.publishedAt || new Date()).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });

        return (
          <div key={post._id} className="group flex flex-col overflow-hidden rounded-[2rem] bg-white border border-stone-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="relative h-48 overflow-hidden bg-stone-100">
              <img 
                src={featuredImage} 
                alt={post.title} 
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col flex-grow p-6 sm:p-8">
              <div className="flex items-center gap-2 text-stone-400 text-sm mb-4 font-medium">
                <Calendar size={14} />
                <time dateTime={post.publishedAt}>{postDate}</time>
              </div>
              <h3 className="mb-3 text-xl font-bold text-stone-900 group-hover:text-orange-500 transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="mb-6 text-stone-500 line-clamp-3 flex-grow">
                {cleanExcerpt}
              </p>
              <Link 
                to={`/article/${post.slug.current}`} 
                className="inline-flex items-center text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors mt-auto w-fit"
              >
                Read Article
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}