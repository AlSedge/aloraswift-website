import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Loader2 } from 'lucide-react';
import { PortableText } from '@portabletext/react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { fetchSanityPostBySlug, SanityPost } from '../lib/sanity';

export default function Article() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<SanityPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    async function loadPost() {
      if (!slug) return;
      setIsLoading(true);
      try {
        const data = await fetchSanityPostBySlug(slug);
        setPost(data);
      } catch (error) {
        console.error("Failed to load post", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadPost();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
        <Navigation />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center text-stone-400">
            <Loader2 size={48} className="animate-spin mb-4 text-orange-500" />
            <p className="text-lg font-medium">Loading article...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
        <Navigation />
        <main className="flex-grow px-4 py-20 flex items-center justify-center">
          <div className="text-center max-w-md">
            <h1 className="text-4xl font-extrabold text-stone-900 mb-4">Article Not Found</h1>
            <p className="text-stone-500 mb-8">We couldn't find the article you're looking for. It might have been moved or deleted.</p>
            <Link 
              to="/" 
              className="inline-flex h-12 items-center justify-center rounded-full bg-orange-500 px-8 text-sm font-bold text-white transition-transform hover:-translate-y-1"
            >
              Return Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const featuredImage = post.mainImage?.asset?.url;
  const postDate = new Date(post.publishedAt || new Date()).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans selection:bg-orange-200 selection:text-orange-900 flex flex-col">
      <Navigation />
      <main className="flex-grow px-4 py-12 md:px-8 lg:py-20">
        <article className="mx-auto max-w-4xl bg-white rounded-[3rem] shadow-sm border border-stone-100 overflow-hidden">
          {featuredImage ? (
            <div className="relative h-64 sm:h-80 md:h-[400px] w-full">
              <img 
                src={featuredImage} 
                alt={post.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                <Link to="/#articles" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 text-sm font-semibold transition-colors">
                  <ArrowLeft size={16} />
                  Back to Articles
                </Link>
                <div className="flex items-center gap-2 text-orange-300 text-sm mb-4 font-semibold">
                  <Calendar size={16} />
                  <time dateTime={post.publishedAt}>{postDate}</time>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
                  {post.title}
                </h1>
              </div>
            </div>
          ) : (
            <div className="p-8 md:p-12 md:pb-0">
              <Link to="/#articles" className="inline-flex items-center gap-2 text-stone-500 hover:text-orange-500 mb-8 text-sm font-semibold transition-colors">
                <ArrowLeft size={16} />
                Back to Articles
              </Link>
              <div className="flex items-center gap-2 text-stone-400 text-sm mb-4 font-semibold">
                <Calendar size={16} />
                <time dateTime={post.publishedAt}>{postDate}</time>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 leading-tight">
                {post.title}
              </h1>
            </div>
          )}

          <div className="p-8 md:p-12">
            <div 
              className="prose prose-stone lg:prose-lg max-w-none
                         prose-img:rounded-[2rem] prose-img:shadow-md
                         prose-a:text-orange-500 hover:prose-a:text-orange-600 prose-a:font-semibold
                         [&>p]:text-stone-600 [&>p]:leading-relaxed [&>p]:mb-8
                         [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:text-stone-900 [&>h2]:mt-12 [&>h2]:mb-6 [&>h2]:tracking-tight
                         [&>h3]:text-2xl [&>h3]:font-bold [&>h3]:text-stone-900 [&>h3]:mt-8 [&>h3]:mb-4
                         [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-8 [&>ul>li]:mb-2 [&>ul>li]:text-stone-600
                         [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-8 [&>ol>li]:mb-2 [&>ol>li]:text-stone-600
                         [&>blockquote]:border-l-4 [&>blockquote]:border-orange-500 [&>blockquote]:pl-6 [&>blockquote]:italic [&>blockquote]:text-stone-700"
            >
              {post.body ? <PortableText value={post.body} /> : null}
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}