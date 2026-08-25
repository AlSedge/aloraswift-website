import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Info } from 'lucide-react';

export default function Disclosure() {
  return (
    <div className="min-h-screen bg-[#FFFBF0] font-sans selection:bg-rose-200 selection:text-slate-900 flex flex-col">
      <Navigation />

      <main className="flex-grow pt-24 md:pt-32">
        <section className="px-6 py-16 md:py-20">
          <div className="mx-auto max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-amber-100 text-amber-600 font-bold text-sm mb-8 transform -rotate-2">
              <Info size={16} /> Disclosure
            </div>
            <h1 className="font-serif text-5xl md:text-6xl font-black text-slate-800 leading-tight mb-6">
              Affiliate Disclosure
            </h1>
            <p className="text-slate-500 font-medium mb-14">Last updated: 24 August 2026</p>

            <div className="bg-white rounded-[2rem] p-8 md:p-12 border-2 border-amber-50 shadow-sm">
              <div className="space-y-6 text-xl text-slate-600 leading-relaxed font-medium">
                <p className="text-2xl font-bold text-slate-800">
                  Some links on this site are affiliate links.
                </p>
                <p>
                  This means that if you click a book or product link and make a purchase, Alora
                  Swift may earn a small commission — <strong className="text-slate-800">at no extra
                  cost to you</strong>.
                </p>
                <p>
                  Where we recommend a book, game, or toy on this site, it&apos;s because we genuinely
                  love it and think your family will too — not because of the commission. Affiliate
                  earnings help support the time and care that goes into writing and sharing these
                  stories.
                </p>
                <p>
                  Book purchases are completed with the retailer (such as Amazon) under their own
                  terms and privacy policies. We never recommend anything we wouldn&apos;t happily read
                  (or play) ourselves.
                </p>
                <p className="font-bold text-slate-700">
                  Thank you so much for supporting independent children&apos;s authors! 💛
                </p>
              </div>

              <div className="pt-8">
                <Link
                  to="/"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-sky-500 px-8 text-base font-bold text-white shadow-lg shadow-sky-200 transition-all hover:-translate-y-1 hover:bg-sky-400"
                >
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
