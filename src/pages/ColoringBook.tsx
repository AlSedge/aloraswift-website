import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Download, Sparkles, Palette, Heart, Mail } from 'lucide-react';

const WEB3FORMS_KEY = '83d75253-87c1-4e99-8652-d983928f1d38';

// Landing page for the free printable colouring book. The PDF itself lives at
// /free-coloring-book.pdf; before this page existed the file had no landing
// page, so nothing could link to it except the raw download.
const PAGES = [
  { img: '/coloring/page-1.webp', title: 'The cover', text: 'A title page for them to colour and sign — theirs before they have drawn a thing.' },
  { img: '/coloring/page-2.webp', title: 'Cuddles the koala', text: 'The lost koala bear from Cuddles Loses His Home, up in his gum tree.' },
  { img: '/coloring/page-3.webp', title: 'Penny the platypus', text: 'Penny from The Silver Stream, in the water she spends the story trying to save.' },
  { img: '/coloring/page-4.webp', title: 'A seven-band rainbow', text: 'Left empty on purpose — seven separate bands, one for every colour they can name.' },
  { img: '/coloring/page-5.webp', title: 'A full moon', text: 'With a face and craters, for the child who likes to talk while they colour.' },
  { img: '/coloring/page-6.webp', title: 'A "The End" page', text: 'Because finishing something and signing your name is a big deal at four.' },
];

const WHY = [
  { title: 'Pencil grip and control', text: 'Staying inside a line is the same small-muscle work as forming letters, so handwriting arrives with less of a struggle.' },
  { title: 'Left to right, top to bottom', text: 'We read in a direction, and children have to be taught the rule. Filling in a picture rehearses it without a single instruction.' },
  { title: 'Naming things', text: '"What colour is his nose?" adds a word. Vocabulary is the strongest predictor of how easily a child learns to read.' },
  { title: 'Owning the character', text: 'A child who has coloured Cuddles for twenty minutes knows Cuddles — and asks for the story that evening.' },
];

export default function ColoringBook() {
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
          subject: 'Newsletter signup — Alora Swift',
          message: `Please add ${email.trim()} to the newsletter list (signed up on the free colouring book page).`,
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
          <div className="absolute top-10 left-10 w-64 h-64 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-20 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

          <div className="relative z-10 max-w-3xl mx-auto animate-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-amber-100 text-amber-600 font-bold text-sm mb-8 transform -rotate-2">
              <Palette size={16} /> Free printable
            </div>
            <h1 className="font-serif text-5xl md:text-6xl font-black text-slate-800 leading-tight mb-6">
              The Free Colouring Book
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 leading-relaxed font-medium mb-10">
              Six printable A4 pages for ages 3–7 — Cuddles the koala, Penny the platypus, a seven-band rainbow
              and a very full moon. Print one at a time, and let them choose.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/free-coloring-book.pdf"
                className="inline-flex h-16 items-center justify-center rounded-full bg-sky-500 px-10 text-lg font-black text-white shadow-lg shadow-sky-200 transition-all hover:-translate-y-1 hover:bg-sky-400"
              >
                <Download className="mr-2 h-5 w-5" /> Download the PDF
              </a>
              <Link
                to="/books"
                className="inline-flex h-16 items-center justify-center rounded-full bg-white border-2 border-slate-200 px-10 text-lg font-black text-slate-700 transition-all hover:-translate-y-1 hover:border-slate-300 hover:bg-slate-50"
              >
                See the books
              </Link>
            </div>
            <p className="text-sm text-slate-500 font-medium mt-6">
              No signup needed — the download is free. It is yours to photocopy for a classroom or playgroup.
            </p>
          </div>
        </section>

        {/* What's inside */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-serif text-4xl md:text-5xl font-black text-slate-800 text-center mb-4">
              What&apos;s inside
            </h2>
            <p className="text-lg text-slate-600 text-center font-medium mb-14 max-w-2xl mx-auto">
              Six pages, printed and coloured in any order. Here they are, so you know what you&apos;re printing.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {PAGES.map((p) => (
                <div key={p.title} className="bg-white rounded-[2rem] p-5 shadow-sm border border-amber-50 flex flex-col">
                  <div className="rounded-2xl overflow-hidden mb-5 bg-slate-50">
                    <img src={p.img} alt={`Colouring page: ${p.title}`} loading="lazy" className="w-full h-auto" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-slate-800 mb-2">{p.title}</h3>
                  <p className="text-slate-600 font-medium leading-relaxed">{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why colouring helps */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-4xl bg-white rounded-[3rem] p-8 md:p-14 border-4 border-amber-50 shadow-sm">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 text-rose-500 font-bold text-sm mb-6">
              <Heart size={16} fill="currentColor" /> More than busywork
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-black text-slate-800 mb-8">
              Why colouring helps early reading
            </h2>
            <div className="space-y-6">
              {WHY.map((w) => (
                <div key={w.title}>
                  <h3 className="font-serif text-2xl font-bold text-slate-800 mb-1">{w.title}</h3>
                  <p className="text-lg text-slate-600 font-medium leading-relaxed">{w.text}</p>
                </div>
              ))}
            </div>
            <p className="text-lg text-slate-600 font-medium leading-relaxed mt-8">
              There&apos;s more on this in{' '}
              <Link to="/journal/free-colouring-pages-early-reading" className="text-sky-500 font-bold hover:underline">
                why colouring helps early reading
              </Link>
              .
            </p>
          </div>
        </section>

        {/* Newsletter */}
        <section className="px-6 py-16 pb-28">
          <div className="mx-auto max-w-3xl bg-sky-400 rounded-[3rem] p-10 md:p-14 text-center relative overflow-hidden">
            <div className="absolute top-8 right-8 text-sky-300 opacity-50 transform rotate-12">
              <Sparkles size={80} fill="currentColor" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-black text-white mb-4 relative z-10">
              New printables, straight to your inbox
            </h2>
            <p className="text-xl text-sky-50 font-medium mb-8 relative z-10">
              I send a short note when there&apos;s a new colouring page, a reading idea or a new book.
            </p>
            {subscribed ? (
              <div className="relative z-10 bg-white/95 rounded-2xl p-8">
                <p className="text-xl font-bold text-slate-800 mb-2">You&apos;re on the list — thank you!</p>
                <p className="text-slate-600 font-medium mb-6">Keep an eye on your inbox for the next printable.</p>
                <a
                  href="/free-coloring-book.pdf"
                  className="inline-flex h-14 items-center justify-center rounded-full bg-sky-500 px-8 font-black text-white hover:bg-sky-400 transition-all"
                >
                  <Download className="mr-2 h-5 w-5" /> Download the colouring book
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative z-10 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                <label className="sr-only" htmlFor="coloring-email">Email address</label>
                <input
                  id="coloring-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-grow h-14 rounded-full px-6 text-lg font-medium text-slate-800 outline-none border-2 border-transparent focus:border-yellow-400"
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="h-14 rounded-full bg-yellow-400 px-8 text-lg font-black text-yellow-900 hover:bg-yellow-300 transition-all disabled:opacity-60 inline-flex items-center justify-center"
                >
                  <Mail className="mr-2 h-5 w-5" /> {sending ? 'Sending…' : 'Join the club'}
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
