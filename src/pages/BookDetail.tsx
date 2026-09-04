import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import BookCard from '../components/BookCard';
import { Star, Heart, Quote, Sparkles } from 'lucide-react';
import { fetchBookBySlug, fetchSanityBooks, SanityBook, urlFor } from '../lib/sanity';
import { applyBookSeo } from '../lib/seo';

export default function BookDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [book, setBook] = useState<SanityBook | null>(null);
  const [otherBooks, setOtherBooks] = useState<SanityBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!slug) return;
      setLoading(true);
      try {
        const [found, all] = await Promise.all([fetchBookBySlug(slug), fetchSanityBooks()]);
        if (cancelled) return;
        setBook(found);
        const foundCategory = found?.category || "Children's Books";
        setOtherBooks(
          all
            .filter((b) => b.slug?.current !== slug && (b.category || "Children's Books") === foundCategory)
            .slice(0, 3)
        );
      } catch (error) {
        console.error('Failed to fetch book:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (book && slug) {
      const coverUrl = book.coverImage ? urlFor(book.coverImage).width(800).url() : null;
      applyBookSeo({ title: book.title, synopsis: book.synopsis, coverUrl }, `/books/${slug}`);
    }
  }, [book, slug]);

  return (
    <div className="min-h-screen bg-[#FFFBF0] font-sans selection:bg-rose-200 selection:text-slate-900 flex flex-col">
      <Navigation />

      <main className="flex-grow pt-24 md:pt-32">
        <section className="px-6 py-16 md:py-24">
          <div className="mx-auto max-w-7xl">
            {/* Breadcrumb */}
            <nav className="mb-10 flex items-center gap-2 font-bold text-sm text-slate-400">
              <Link to="/" className="hover:text-sky-500 transition-colors">Home</Link>
              <span>/</span>
              <Link to="/books" className="hover:text-sky-500 transition-colors">Books</Link>
              {book && (<><span>/</span><span className="text-slate-600">{book.title}</span></>)}
            </nav>

            {loading ? (
              <p className="text-slate-500 text-center py-20 font-medium">Opening the storybook...</p>
            ) : book ? (
              <>
                <div className="bg-white rounded-[3rem] p-8 md:p-12 lg:p-16 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border-4 border-amber-50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100 rounded-bl-full opacity-50 pointer-events-none"></div>

                  <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center relative z-10">
                    <div className="relative mx-auto w-full max-w-md lg:max-w-none group perspective-1000">
                      <div className="relative z-10 w-full rounded-3xl shadow-2xl overflow-hidden transform transition-transform duration-500 group-hover:rotate-y-12">
                        <img
                          src={book.coverImage ? urlFor(book.coverImage).width(800).url() : "https://images.unsplash.com/photo-1531281530990-2c70030dff75?q=80&w=2070&auto=format&fit=crop"}
                          alt={`Cover of ${book.title} by Alora Swift`}
                          className="w-full aspect-[4/5] object-cover"
                        />
                      </div>
                      {book.isNewRelease && (
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center text-yellow-900 font-bold text-center p-2 shadow-lg transform rotate-12 z-20">
                          <span className="text-sm">NEW<br/>RELEASE!</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col justify-center">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 text-rose-600 font-bold text-sm mb-6 w-fit transform -rotate-1">
                        <Heart size={16} fill="currentColor" /> {book.tagline || 'An Outback Adventure'}
                      </div>

                      <h1 className="font-serif text-5xl md:text-6xl font-black text-slate-800 mb-6 leading-tight">
                        {book.title}
                      </h1>

                      <div className="flex flex-wrap items-center gap-4 mb-8">
                        <div className="flex gap-1 text-yellow-400">
                          {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={24} fill="currentColor" />)}
                        </div>
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-100 text-sky-800">
                          Ages {book.ageRange || '3-6'}
                        </span>
                      </div>

                      <p className="text-xl text-slate-600 leading-relaxed mb-6 font-medium whitespace-pre-wrap">
                        {book.synopsis || "A heartwarming tale of friendship, courage, and finding your way home — perfect for little readers (and the grown-ups reading to them)."}
                      </p>

                      {book.reviewQuote && (
                        <div className="bg-sky-50 rounded-2xl p-6 mb-8 border border-sky-100 relative">
                          <Quote size={32} className="absolute -top-4 -left-4 text-sky-300 bg-[#FFFBF0] rounded-full p-1" />
                          <p className="text-lg text-slate-700 italic font-medium">
                            &quot;{book.reviewQuote}&quot;
                            {book.reviewAuthor && (
                              <span className="block text-sm font-bold text-sky-600 mt-2">— {book.reviewAuthor}</span>
                            )}
                          </p>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-4">
                        {book.buyLink && (
                          <a
                            href={book.buyLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-16 items-center justify-center rounded-full bg-rose-500 px-10 text-lg font-bold text-white shadow-xl shadow-rose-200 transition-all hover:-translate-y-1 hover:bg-rose-400 hover:shadow-rose-300"
                          >
                            Buy the Book
                          </a>
                        )}
                        {book.excerptLink && (
                          <a
                            href={book.excerptLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-16 items-center justify-center rounded-full bg-white border-2 border-slate-200 px-10 text-lg font-bold text-slate-700 transition-all hover:-translate-y-1 hover:border-slate-300 hover:bg-slate-50"
                          >
                            Read an Excerpt
                          </a>
                        )}
                        <Link
                          to="/books"
                          className="inline-flex h-16 items-center justify-center rounded-full bg-white border-2 border-slate-200 px-10 text-lg font-bold text-slate-700 transition-all hover:-translate-y-1 hover:border-slate-300 hover:bg-slate-50"
                        >
                          All Books
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {otherBooks.length > 0 && (
                  <div className="mt-24">
                    <div className="text-center mb-12">
                      <h2 className="font-serif text-4xl md:text-5xl font-black text-slate-800 mb-4">
                        More from <span className="text-sky-500">Alora</span>
                      </h2>
                      <p className="text-xl text-slate-600 font-medium">
                        Keep the adventure going with these other stories.
                      </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-10">
                      {otherBooks.map((b) => (
                        <BookCard key={b._id} book={b} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-24">
                <h1 className="font-serif text-4xl font-black text-slate-800 mb-4">Hmm, this story is missing</h1>
                <p className="text-xl text-slate-600 font-medium mb-10">
                  We couldn&apos;t find that book. It may have wandered off on its own adventure!
                </p>
                <Link
                  to="/books"
                  className="inline-flex h-14 items-center justify-center rounded-full bg-sky-500 px-8 text-lg font-bold text-white shadow-lg shadow-sky-200 transition-all hover:-translate-y-1 hover:bg-sky-400"
                >
                  Browse All Books <Sparkles className="ml-2 h-5 w-5" />
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
