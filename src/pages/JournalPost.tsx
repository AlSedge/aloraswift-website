import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PortableText } from '@portabletext/react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Sparkles } from 'lucide-react';
import { fetchJournalPostBySlug, SanityJournalPost, urlFor } from '../lib/sanity';
import { applyJournalSeo } from '../lib/seo';

export default function JournalPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<SanityJournalPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (!slug) return;
    setLoading(true);
    fetchJournalPostBySlug(slug)
      .then((data) => {
        if (!cancelled) setPost(data);
      })
      .catch((error) => console.error('Failed to fetch post:', error))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (post && slug) {
      const coverUrl = post.coverImage ? urlFor(post.coverImage).width(1200).url() : null;
      applyJournalSeo(
        { title: post.title, excerpt: post.excerpt, coverUrl, publishedAt: post.publishedAt },
        `/journal/${slug}`
      );
    }
  }, [post, slug]);

  return (
    <div className="min-h-screen bg-[#FFFBF0] font-sans selection:bg-rose-200 selection:text-slate-900 flex flex-col">
      <Navigation />

      <main className="flex-grow pt-24 md:pt-32">
        <section className="px-6 py-16 md:py-24">
          <div className="mx-auto max-w-3xl">
            <nav className="mb-10 flex items-center gap-2 font-bold text-sm text-slate-400">
              <Link to="/" className="hover:text-sky-500 transition-colors">Home</Link>
              <span>/</span>
              <Link to="/journal" className="hover:text-sky-500 transition-colors">Journal</Link>
              {post && (<><span>/</span><span className="text-slate-600">{post.title}</span></>)}
            </nav>

            {loading ? (
              <p className="text-slate-500 text-center py-20 font-medium">Turning the pages...</p>
            ) : post ? (
              <article>
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

                <h1 className="font-serif text-5xl md:text-6xl font-black text-slate-800 leading-tight mb-8">
                  {post.title}
                </h1>

                {post.coverImage && (
                  <img
                    src={urlFor(post.coverImage).width(1200).url()}
                    alt={post.title}
                    className="w-full aspect-video object-cover rounded-[2rem] mb-10 shadow-lg"
                  />
                )}

                <div className="bg-white rounded-[2rem] p-8 md:p-12 border-2 border-amber-50 shadow-sm">
                  {post.body ? (
                    <div className="prose-alora space-y-6 text-xl text-slate-700 leading-relaxed font-medium">
                      <PortableText value={post.body} />
                    </div>
                  ) : (
                    <p className="text-xl text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
                      {post.excerpt || 'Full post coming soon!'}
                    </p>
                  )}
                </div>

                <div className="mt-12 flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/journal"
                    className="inline-flex h-14 items-center justify-center rounded-full bg-white border-2 border-slate-200 px-8 text-lg font-bold text-slate-700 transition-all hover:-translate-y-1 hover:border-slate-300 hover:bg-slate-50"
                  >
                    ← Back to the Journal
                  </Link>
                  <Link
                    to="/books"
                    className="inline-flex h-14 items-center justify-center rounded-full bg-sky-500 px-8 text-lg font-bold text-white shadow-lg shadow-sky-200 transition-all hover:-translate-y-1 hover:bg-sky-400"
                  >
                    Explore the Books <Sparkles className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </article>
            ) : (
              <div className="text-center py-24">
                <h1 className="font-serif text-4xl font-black text-slate-800 mb-4">Post not found</h1>
                <p className="text-xl text-slate-600 font-medium mb-10">
                  That post seems to have wandered off the page.
                </p>
                <Link
                  to="/journal"
                  className="inline-flex h-14 items-center justify-center rounded-full bg-sky-500 px-8 text-lg font-bold text-white shadow-lg shadow-sky-200 transition-all hover:-translate-y-1 hover:bg-sky-400"
                >
                  Back to the Journal
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
