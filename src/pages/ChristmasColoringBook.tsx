import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Download, Sparkles, Snowflake, Mail, Palette } from 'lucide-react';

const WEB3FORMS_KEY = '83d75253-87c1-4e99-8652-d983928f1d38';

// Seasonal landing page for the free Christmas printable. The PDF lives at
// /free-christmas-coloring-book.pdf. Same six-page structure as the Halloween book and the
// everyday colouring book, drawn by the author, so the whole line looks like one series.
const PAGES = [
  { img: '/coloring/christmas-1.webp', title: 'The cover' },
  { img: '/coloring/christmas-2.webp', title: 'The Christmas tree' },
  { img: '/coloring/christmas-3.webp', title: 'The friendly snowman' },
  { img: '/coloring/christmas-4.webp', title: 'The little robin' },
  { img: '/coloring/christmas-5.webp', title: 'The gingerbread man' },
  { img: '/coloring/christmas-6.webp', title: 'The stocking and Happy Christmas' },
];

export default function ChristmasColoringBook() {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSending(true);
    setFormError(null);
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          email: email.trim(),
          subject: 'Newsletter signup - Alora Swift',
          message: `Please add ${email.trim()} to the newsletter list (signed up on the Christmas colouring page).`,
        }),
      });
      const data = await res.json();
      if (data.success) setSubscribed(true);
      else setFormError(data.message || 'Something went wrong. Please try again.');
    } catch {
      setFormError('Could not reach the signup service. Please try again or email alora@aloraswift.com.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FBFD] font-sans selection:bg-rose-200 selection:text-slate-900 flex flex-col">
      <Navigation />

      <main className="flex-grow pt-24 md:pt-32">
        {/* Hero */}
        <section className="relative px-6 py-16 md:py-20 text-center overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-20 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

          <div className="relative z-10 max-w-3xl mx-auto animate-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-sky-100 text-sky-600 font-bold text-sm mb-8 transform -rotate-2">
              <Snowflake size={16} /> Free Christmas printable
            </div>
            <h1 className="font-serif text-5xl md:text-6xl font-black text-slate-800 leading-tight mb-6">
              Christmas Colouring Pages
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 leading-relaxed font-medium mb-10">
              Six friendly pages for ages 2 to 7 - a Christmas tree, a smiling snowman, a little robin, a gingerbread
              man and a stocking to colour. Nothing fussy, everything colour-in-able.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/free-christmas-coloring-book.pdf"
                className="inline-flex h-16 items-center justify-center rounded-full bg-emerald-600 px-10 text-lg font-black text-white shadow-lg shadow-emerald-200 transition-all hover:-translate-y-1 hover:bg-emerald-500"
              >
                <Download className="mr-2 h-5 w-5" /> Download the PDF
              </a>
              <Link
                to="/free-coloring-book"
                className="inline-flex h-16 items-center justify-center rounded-full bg-white border-2 border-slate-200 px-10 text-lg font-black text-slate-700 transition-all hover:-translate-y-1 hover:border-slate-300 hover:bg-slate-50"
              >
                The everyday colouring book
              </Link>
            </div>
            <p className="text-sm text-slate-500 font-medium mt-6">
              Free, no signup - print the set for a wet afternoon, a classroom party, or the long wait for Christmas
              morning.
            </p>
          </div>
        </section>

        {/* What is inside */}
        <section className="px-6 py-16" data-artwork-version="christmas-1">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-serif text-4xl md:text-5xl font-black text-slate-800 text-center mb-4">
              What&apos;s inside
            </h2>
            <p className="text-lg text-slate-600 text-center font-medium mb-14 max-w-2xl mx-auto">
              Six pages, printed and coloured in any order. Here they are, so you know what you are printing.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {PAGES.map((p) => (
                <div key={p.title} className="bg-white rounded-[2rem] p-5 shadow-sm border border-sky-50 flex flex-col">
                  {/* Name first, then the drawing: each drawing already ends with aloraswift.com, so the
                      name belongs above it rather than underneath that line (author's instruction). */}
                  <h3 className="font-serif text-2xl font-bold text-slate-800 mb-3">{p.title}</h3>
                  <div className="rounded-2xl overflow-hidden bg-slate-50">
                    <img src={p.img} alt={`Christmas colouring page: ${p.title}`} loading="lazy" className="w-full h-auto" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why these pages */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-4xl bg-white rounded-[3rem] p-8 md:p-14 border-4 border-sky-50 shadow-sm">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50 text-sky-600 font-bold text-sm mb-6">
              <Palette size={16} /> Quiet, in a loud month
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-black text-slate-800 mb-8">
              Why these pages are simple on purpose
            </h2>
            <div className="space-y-6 text-lg text-slate-600 font-medium leading-relaxed">
              <p>
                December is exciting and long at the same time. A tree, a snowman and a gingerbread man are all things
                a small child already knows, so there is nothing to explain before the crayons come out - they can
                start straight away.
              </p>
              <p>
                Chunky outlines also mean a two-year-old with a fat crayon gets a good result, and an older one can
                take their time on the baubles and the icing. Print one page rather than all six, and let them choose
                which.
              </p>
              <p>
                There is more on this in{' '}
                <Link to="/journal/free-colouring-pages-early-reading" className="text-sky-500 font-bold hover:underline">
                  why colouring helps early reading
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="px-6 py-16 pb-28">
          <div className="mx-auto max-w-3xl bg-emerald-600 rounded-[3rem] p-10 md:p-14 text-center relative overflow-hidden">
            <div className="absolute top-8 right-8 text-emerald-300 opacity-50 transform rotate-12">
              <Sparkles size={80} fill="currentColor" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-black text-white mb-4 relative z-10">
              New printables, straight to your inbox
            </h2>
            <p className="text-xl text-emerald-50 font-medium mb-8 relative z-10">
              A short note when there is a new printable, a reading idea or a new book.
            </p>
            {subscribed ? (
              <div className="relative z-10 bg-white/95 rounded-2xl p-8">
                <p className="text-xl font-bold text-slate-800 mb-2">You&apos;re on the list - thank you!</p>
                <p className="text-slate-600 font-medium mb-6">Keep an eye on your inbox for the next printable.</p>
                <a
                  href="/free-christmas-coloring-book.pdf"
                  className="inline-flex h-14 items-center justify-center rounded-full bg-emerald-600 px-8 font-black text-white hover:bg-emerald-500 transition-all"
                >
                  <Download className="mr-2 h-5 w-5" /> Download the Christmas pages
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative z-10 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                <label className="sr-only" htmlFor="christmas-email">Email address</label>
                <input
                  id="christmas-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-grow h-14 rounded-full px-6 text-lg font-medium text-slate-800 outline-none border-2 border-transparent focus:border-yellow-300"
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="h-14 rounded-full bg-slate-900 px-8 text-lg font-black text-white hover:bg-slate-800 transition-all disabled:opacity-60 inline-flex items-center justify-center"
                >
                  <Mail className="mr-2 h-5 w-5" /> {sending ? 'Sending...' : 'Join the club'}
                </button>
              </form>
            )}
            {formError && <p className="relative z-10 text-white font-bold mt-4">{formError}</p>}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
