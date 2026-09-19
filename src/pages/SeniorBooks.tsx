import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import BookCard from '../components/BookCard';
import { Brain, BookOpen, ArrowLeft } from 'lucide-react';
import { fetchSanityBooks, SanityBook } from '../lib/sanity';

const CHILDRENS = "Children's Books";

// /senior-books — the grown-up shelf.
// Kept off /books so the children's hub stays purely for little readers. This page
// collects everything that is NOT a children's title (matched on the Sanity `category`
// field), so future collections can never be orphaned by the split.
export default function SeniorBooks() {
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

  const grownUpBooks = books.filter((b) => (b.category || CHILDRENS) !== CHILDRENS);

  return (
    <div className="min-h-screen bg-[#FFFBF0] font-sans selection:bg-emerald-200 selection:text-slate-900 flex flex-col">
      <Navigation />

      <main className="flex-grow pt-24 md:pt-32">
        <section className="px-6 py-16 md:py-24 text-center relative overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-20 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

          <div className="relative z-10 max-w-3xl mx-auto animate-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-emerald-100 text-emerald-600 font-bold text-sm mb-8 transform -rotate-2">
              <Brain size={16} /> For Grown-Ups
            </div>
            <h1 className="font-serif text-6xl md:text-7xl font-black text-slate-800 leading-[1.1] tracking-tight mb-8">
              Books for <span className="text-emerald-600">Grown-Ups</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
              Nostalgia quizzes, brain games and light reads — for parents, grandparents and anyone
              who likes to keep their mind busy.
            </p>
          </div>
        </section>

        <section className="px-6 pb-32">
          <div className="mx-auto max-w-7xl space-y-16">
            {loading ? (
              <p className="text-slate-500 text-center py-20 font-medium">
                Gathering books from the shelf...
              </p>
            ) : grownUpBooks.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-10">
                {grownUpBooks.map((book) => (
                  <BookCard key={book._id} book={book} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[2rem] border-2 border-dashed border-emerald-200 p-10 text-center shadow-sm">
                <Brain size={36} className="mx-auto text-emerald-300 mb-4" />
                <h3 className="font-serif text-2xl font-bold text-slate-700 mb-2">Coming soon</h3>
                <p className="text-lg text-slate-500 font-medium">
                  The grown-up collection is being finished off — check back soon!
                </p>
              </div>
            )}

            {/* Cross-link back to the children's hub, which is the main event */}
            <div className="bg-white rounded-[2rem] border-2 border-sky-100 p-10 md:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-5">
                <div className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transform -rotate-6 bg-sky-100 text-sky-500">
                  <BookOpen size={26} />
                </div>
                <div>
                  <h2 className="font-serif text-2xl md:text-3xl font-black text-slate-800">
                    Looking for stories for little ones?
                  </h2>
                  <p className="text-lg text-slate-600 font-medium mt-1">
                    Picture books, bedtime stories and read-aloud favourites for ages 3–7.
                  </p>
                </div>
              </div>
              <Link
                to="/books"
                className="inline-flex h-14 items-center justify-center rounded-full bg-sky-500 px-8 text-lg font-bold text-white shadow-lg shadow-sky-200 transition-all hover:-translate-y-1 hover:bg-sky-400"
              >
                <ArrowLeft className="mr-2 h-5 w-5" /> Children&apos;s Books
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
