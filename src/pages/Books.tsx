import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import BookCard from '../components/BookCard';
import { Sparkles, Brain, ArrowRight } from 'lucide-react';
import { fetchSanityBooks, SanityBook } from '../lib/sanity';

const CHILDRENS = "Children's Books";

// /books is the CHILDREN'S hub — picture books only.
// Grown-up titles (nostalgia quizzes, brain games) live at /senior-books, so a parent
// browsing picture books never lands next to retirement planning or men's health.
// Books are matched on the Sanity `category` field; anything without one is treated
// as a children's book (so existing content keeps working).
export default function Books() {
  const [books, setBooks] = useState<SanityBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchSanityBooks()
      .then((data) => {
        if (!cancelled) setBooks(data);
      })
      .catch((error) => console.error('Failed to fetch books:', error))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const childrensBooks = books.filter((b) => (b.category || CHILDRENS) === CHILDRENS);

  return (
    <div className="min-h-screen bg-[#FFFBF0] font-sans selection:bg-rose-200 selection:text-slate-900 flex flex-col">
      <Navigation />

      <main className="flex-grow pt-24 md:pt-32">
        <section className="px-6 py-16 md:py-24 text-center relative overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-20 w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

          <div className="relative z-10 max-w-3xl mx-auto animate-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-amber-100 text-amber-600 font-bold text-sm mb-8 transform -rotate-2">
              <Sparkles size={16} /> The Book Collection
            </div>
            <h1 className="font-serif text-6xl md:text-7xl font-black text-slate-800 leading-[1.1] tracking-tight mb-8">
              Picture Books for <span className="text-sky-500">Little Readers</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
              Whimsical animal adventures, bedtime stories and read-aloud favourites for ages 3–7
              — every one made to be read together.
            </p>
          </div>
        </section>

        <section className="px-6 pb-32">
          <div className="mx-auto max-w-7xl space-y-16">
            {loading ? (
              <p className="text-slate-500 text-center py-20 font-medium">
                Gathering stories from the bookshelf...
              </p>
            ) : childrensBooks.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-10">
                {childrensBooks.map((book) => (
                  <BookCard key={book._id} book={book} />
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-20 font-medium">
                New stories are on their way — check back soon.
              </p>
            )}

            {/* Quiet cross-link to the grown-up shelf, kept well away from the picture books */}
            <div className="bg-white rounded-[2rem] border-2 border-emerald-100 p-10 md:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-5">
                <div className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transform -rotate-6 bg-emerald-100 text-emerald-600">
                  <Brain size={26} />
                </div>
                <div>
                  <h2 className="font-serif text-2xl md:text-3xl font-black text-slate-800">
                    Looking for books for grown-ups?
                  </h2>
                  <p className="text-lg text-slate-600 font-medium mt-1">
                    Nostalgia quizzes, brain games and light reads — on their own shelf.
                  </p>
                </div>
              </div>
              <Link
                to="/senior-books"
                className="inline-flex h-14 items-center justify-center rounded-full bg-emerald-500 px-8 text-lg font-bold text-white shadow-lg shadow-emerald-200 transition-all hover:-translate-y-1 hover:bg-emerald-400"
              >
                Books for Grown-Ups <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
