import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { BookOpen, Sparkles } from 'lucide-react';
import { fetchJournalPosts, SanityJournalPost, urlFor } from '../lib/sanity';

const FALLBACK_POSTS = [
  {
    title: '10 Books That Make Perfect Bedtime Stories',
    tag: 'Book Lists',
    color: 'bg-purple-100 text-purple-700',
  },
  {
    title: 'Free Printable: Color Your Own Koala Mask!',
    tag: 'Activities',
    color: 'bg-rose-100 text-rose-700',
  },
  {
    title: 'How I created the illustrations for Cuddles',
    tag: 'Behind the Scenes',
    color: 'bg-sky-100 text-sky-700',
  },
  {
    title: 'Tips for reading aloud to energetic toddlers',
    tag: 'Parenting',
    color: 'bg-emerald-100 text-emerald-700',
  },
];

export default function Journal() {
  const [posts, setPosts] = useState<SanityJournalPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchJournalPosts()
      .then((data) => {
        if (!cancelled) setPosts(data);
      })
      .catch((error) => console.error('Failed to fetch journal posts:', error))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const showFallback = !loading && posts.length === 0;

  return (
    <div className="min-h-screen bg-[#FFFBF0] font-sans selection:bg-rose-200 selection:text-slate-900 flex flex-col">
      <Navigation />

      <main className="flex-grow pt-24 md:pt-32">
        <section className="px-6 py-16 md:py-24 text-center relative overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
          <div className="absolute top-0 right-20 w-72 h-72 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>

          <div className="relative z-10 max-w-3xl mx-auto animate-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-sky-500 mb-6 transform -rotate-6">
              <BookOpen size={32} />
            </div>
            <h1 className="font-serif text-6xl md:text-7xl font-black text-slate-800 leading-[1.1] tracking-tight mb-8">
              The Storybook <span className="text-sky-500">Blog</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
              Behind-the-scenes peeks, reading lists, printable activities, and tips to share with
              your little ones.
            </p>
          </div>
        </section>

        <section className="px-6 pb-32">
          <div className="mx-auto max-w-5xl">
            {loading ? (
              <p className="text-slate-500 text-center py-20 font-medium">Turning the pages...</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {posts.map((post) => (
                  <Link
                    key={post._id}
                    to={`/journal/${post.slug?.current || ''}`}
                    className="bg-white p-8 rounded-[2rem] border-2 border-amber-50 hover:border-amber-200 transition-all duration-300 hover:shadow-lg group flex flex-col justify-between"
                  >
                    <div>
                      {post.coverImage && (
                        <img
                          src={urlFor(post.coverImage).width(800).url()}
                          alt={post.title}
                          loading="lazy"
                          className="w-full aspect-video object-cover rounded-2xl mb-6"
                        />
                      )}
                      <div className="flex items-center gap-3 mb-6">
                        <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-sky-100 text-sky-700">
                          {post.tag || 'Journal'}
                        </span>
                        {post.publishedAt && (
                          <span className="text-sm font-bold text-slate-400">
                            {new Date(post.publishedAt).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </span>
                        )}
                      </div>
                      <h2 className="font-serif text-3xl font-bold text-slate-800 mb-4 group-hover:text-sky-500 transition-colors leading-tight">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-slate-600 font-medium leading-relaxed line-clamp-3">{post.excerpt}</p>
                      )}
                    </div>
                    <div className="mt-8 flex items-center font-bold text-slate-500 group-hover:text-sky-500">
                      Read Post <Sparkles className="ml-2 w-4 h-4" />
                    </div>
                  </Link>
                ))}

                {showFallback &&
                  FALLBACK_POSTS.map((post) => (
                    <article
                      key={post.title}
                      className="bg-white p-8 rounded-[2rem] border-2 border-amber-50 hover:border-amber-200 transition-all duration-300 hover:shadow-lg group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${post.color}`}>{post.tag}</span>
                          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">Coming soon</span>
                        </div>
                        <h2 className="font-serif text-3xl font-bold text-slate-800 mb-4 leading-tight">
                          {post.title}
                        </h2>
                        <p className="text-slate-600 font-medium leading-relaxed">
                          Alora is busy writing this one — it will be here before you know it!
                        </p>
                      </div>
                      <div className="mt-8 flex items-center font-bold text-slate-400">
                        Full post coming soon <Sparkles className="ml-2 w-4 h-4" />
                      </div>
                    </article>
                  ))}
              </div>
            )}

            {showFallback && (
              <p className="text-center text-slate-500 font-medium mt-16">
                New posts are on the way — check back soon for printables, reading lists, and
                behind-the-scenes peeks!
              </p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
