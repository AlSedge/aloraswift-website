import { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import BookCard from '../components/BookCard';
import { Sparkles } from 'lucide-react';
import { fetchSanityBooks, SanityBook } from '../lib/sanity';

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
              More Magical <span className="text-sky-500">Adventures</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
              Explore the full collection of Alora&apos;s beloved picture books and early readers —
              perfect for bedtime, storytime, and little hands learning to love reading.
            </p>
          </div>
        </section>

        <section className="px-6 pb-32">
          <div className="mx-auto max-w-7xl">
            {loading ? (
              <p className="text-slate-500 text-center py-20 font-medium">
                Gathering stories from the bookshelf...
              </p>
            ) : books.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-10">
                {books.map((book) => (
                  <BookCard key={book._id} book={book} />
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-20 font-medium">
                New books are on the way! Check back soon.
              </p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
