import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Download, Sparkles, Ghost, Mail, Palette } from 'lucide-react';

const WEB3FORMS_KEY = '83d75253-87c1-4e99-8652-d983928f1d38';

// Seasonal landing page for the free Halloween printable. The PDF lives at
// /free-halloween-coloring-book.pdf. Everything here is friendly rather than spooky -
// no witches, no monsters, nothing that would trouble a three-year-old at bedtime.
const PAGES = [
  { img: '/coloring/halloween-1.webp', title: 'The cover', text: 'A moon, two bats and a smiling pumpkin, with a line for their name.' },
  { img: '/coloring/halloween-2.webp', title: 'The pumpkin', text: 'A big jack-o\'-lantern with a happy face and plenty of open space to colour.' },
  { img: '/coloring/halloween-3.webp', title: 'The friendly ghost', text: 'This ghost only says hello - and "boo" is ghost for hello.' },
  { img: '/coloring/halloween-4.webp', title: 'The bat', text: 'A bat out for a moonlit fly, with three stars to count and colour.' },
  { img: '/coloring/halloween-5.webp', title: 'The cat', text: 'A calm cat on the step, with whiskers to colour and a tail to finish.' },
  { img: '/coloring/halloween-6.webp', title: 'The web and goodnight', text: 'A spider\'s web with a smiling spider, plus a "Coloured by" line to sign.' },
];

export default function HalloweenColoringBook() {
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
          message: `Please add ${email.trim()} to the newsletter list (signed up on the Halloween colouring page).`,
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
    <div className="min-h-screen bg-[#FFFBF0] font-sans selection:bg-rose-200 selection:text-slate-900 flex flex-col">
      <Navigation />

      <main className="flex-grow pt-24 md:pt-32">
        {/* Hero */}
        <section className="relative px-6 py-16 md:py-20 text-center overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-20 w-72 h-72 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

          <div className="relative z-10 max-w-3xl mx-auto animate-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-amber-100 text-amber-600 font-bold text-sm mb-8 transform -rotate-2">
              <Ghost size={16} /> Free Halloween printable
            </div>
            <h1 className="font-serif text-5xl md:text-6xl font-black text-slate-800 leading-tight mb-6">
              Halloween Colouring Pages
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 leading-relaxed font-medium mb-10">
              Six friendly pages for ages 2 to 7 - a smiling pumpkin, a ghost who only says hello, a bat, a cat and a
              spider&apos;s web with its very calm spider. Nothing spooky, everything colour-in-able.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/free-halloween-coloring-book.pdf"
                className="inline-flex h-16 items-center justify-center rounded-full bg-amber-500 px-10 text-lg font-black text-white shadow-lg shadow-amber-200 transition-all hover:-translate-y-1 hover:bg-amber-400"
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
              Free, no signup - print the set for a party, a wet afternoon, or the run-up to trick-or-treating.
            </p>
          </div>
        </section>

        {/* What is inside */}
        <section className="px-6 py-16" data-artwork-version="halloween-1">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-serif text-4xl md:text-5xl font-black text-slate-800 text-center mb-4">
              What&apos;s inside
            </h2>
            <p className="text-lg text-slate-600 text-center font-medium mb-14 max-w-2xl mx-auto">
              Six pages, printed and coloured in any order. Here they are, so you know what you are printing.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {PAGES.map((p) => (
                <div key={p.title} className="bg-white rounded-[2rem] p-5 shadow-sm border border-amber-50 flex flex-col">
                  <div className="rounded-2xl overflow-hidden mb-5 bg-slate-50">
                    <img src={p.img} alt={`Halloween colouring page: ${p.title}`} loading="lazy" className="w-full h-auto" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-slate-800 mb-2">{p.title}</h3>
                  <p className="text-slate-600 font-medium leading-relaxed">{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why friendly */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-4xl bg-white rounded-[3rem] p-8 md:p-14 border-4 border-amber-50 shadow-sm">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-600 font-bold text-sm mb-6">
              <Palette size={16} /> Friendly, not frightening
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-black text-slate-800 mb-8">
              Why these pages are gentle on purpose
            </h2>
            <div className="space-y-6 text-lg text-slate-600 font-medium leading-relaxed">
              <p>
                Halloween is a lot for a small child: dark evenings, costumes, strangers at the door. The pictures here
                are the friendly half of the season - a pumpkin with a big grin, a ghost who only says hello, a cat who
                is frankly asleep.
              </p>
              <p>
                Colouring is also the calmest thing you can hand a child in a week full of sugar and excitement. It
                gives their hands something to do while the day settles down, and it works just as well at a party table
                as it does on a rainy Tuesday.
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
          <div className="mx-auto max-w-3xl bg-amber-500 rounded-[3rem] p-10 md:p-14 text-center relative overflow-hidden">
            <div className="absolute top-8 right-8 text-amber-300 opacity-50 transform rotate-12">
              <Sparkles size={80} fill="currentColor" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-black text-white mb-4 relative z-10">
              New printables, straight to your inbox
            </h2>
            <p className="text-xl text-amber-50 font-medium mb-8 relative z-10">
              A short note when there is a new printable, a reading idea or a new book.
            </p>
            {subscribed ? (
              <div className="relative z-10 bg-white/95 rounded-2xl p-8">
                <p className="text-xl font-bold text-slate-800 mb-2">You&apos;re on the list - thank you!</p>
                <p className="text-slate-600 font-medium mb-6">Keep an eye on your inbox for the next printable.</p>
                <a
                  href="/free-halloween-coloring-book.pdf"
                  className="inline-flex h-14 items-center justify-center rounded-full bg-amber-500 px-8 font-black text-white hover:bg-amber-400 transition-all"
                >
                  <Download className="mr-2 h-5 w-5" /> Download the Halloween pages
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative z-10 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                <label className="sr-only" htmlFor="halloween-email">Email address</label>
                <input
                  id="halloween-email"
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
