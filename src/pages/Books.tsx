import { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import BookCard from '../components/BookCard';
import { Sparkles, Heart, Brain } from 'lucide-react';
import { fetchSanityBooks, SanityBook } from '../lib/sanity';

const CHILDRENS = "Children's Books";

// Ordered list of collections shown on the page. Books are grouped under
// their Sanity `category`; add a new entry here (and to the studio schema)
// whenever Alora starts a new collection, e.g. "Senior Books".
const CATEGORIES: {
  key: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  teaser?: boolean;
}[] = [
  {
    key: CHILDRENS,
    title: "Children's Books",
    subtitle: 'Whimsical picture books and early readers for little ones — perfect for bedtime and storytime.',
    icon: <Sparkles size={26} />,
    color: 'bg-sky-100 text-sky-500',
  },
  {
    key: 'Senior Books',
    title: 'Senior Books',
    subtitle: 'Brain games, quizzes and light reads for grown-ups who love to keep their minds busy.',
    icon: <Brain size={26} />,
    color: 'bg-emerald-100 text-emerald-600',
    teaser: true,
  },
];

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

  const group = (key: string) => books.filter((b) => (b.category || CHILDRENS) === key);
  const knownKeys = CATEGORIES.map((c) => c.key);
  const otherBooks = books.filter((b) => !knownKeys.includes(b.category || CHILDRENS));

  return (
    <div className="min-h-screen bg-[#FFFBF0] font-sans selection:bg-rose-200 selection:text-slate-900 flex flex-col">
      <Navigation />

      <main className="flex-grow pt-24 md:pt-32">
        <section className="px-6 py-16 md:py-24 text-center relative overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-20 w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

          <div className="relative z-10 max-w-3xl mx-auto animate-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-amber-100 text-amber-600 font-bold text-sm mb-8 transform -rotate-2">
              <Heart size={16} fill="currentColor" /> The Book Collection
            </div>
            <h1 className="font-serif text-6xl md:text-7xl font-black text-slate-800 leading-[1.1] tracking-tight mb-8">
              Stories for <span className="text-sky-500">Every Age</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
              Whimsical picture books for little readers, and brain-teasers for grown-ups — browse
              each collection below.
            </p>
          </div>
        </section>

        <section className="px-6 pb-32">
          <div className="mx-auto max-w-7xl space-y-24">
            {loading ? (
              <p className="text-slate-500 text-center py-20 font-medium">
                Gathering stories from the bookshelf...
              </p>
            ) : (
              <>
                {CATEGORIES.map((cat) => {
                  const catBooks = group(cat.key);
                  return (
                    <div key={cat.key} id={cat.key.toLowerCase().replace(/[^a-z]+/g, '-')}>
                      <div className="flex items-center gap-4 mb-8">
                        <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl transform -rotate-6 ${cat.color}`}>
                          {cat.icon}
                        </div>
                        <div>
                          <h2 className="font-serif text-4xl md:text-5xl font-black text-slate-800 leading-tight">
                            {cat.title}
                          </h2>
                          <p className="text-lg md:text-xl text-slate-600 font-medium mt-1">{cat.subtitle}</p>
                        </div>
                      </div>

                      {catBooks.length > 0 ? (
                        <div className="grid md:grid-cols-3 gap-10">
                          {catBooks.map((book) => (
                            <BookCard key={book._id} book={book} />
                          ))}
                        </div>
                      ) : cat.teaser ? (
                        <div className="bg-white rounded-[2rem] border-2 border-dashed border-emerald-200 p-10 text-center shadow-sm">
                          <Brain size={36} className="mx-auto text-emerald-300 mb-4" />
                          <h3 className="font-serif text-2xl font-bold text-slate-700 mb-2">Coming soon</h3>
                          <p className="text-lg text-slate-500 font-medium">
                            Alora is busy putting the finishing touches on this collection — check back soon!
                          </p>
                        </div>
                      ) : null}
                    </div>
                  );
                })}

                {otherBooks.length > 0 && (
                  <div>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl transform -rotate-6 bg-amber-100 text-amber-600">
                        <Sparkles size={26} />
                      </div>
                      <div>
                        <h2 className="font-serif text-4xl md:text-5xl font-black text-slate-800 leading-tight">More Books</h2>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-10">
                      {otherBooks.map((book) => (
                        <BookCard key={book._id} book={book} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
