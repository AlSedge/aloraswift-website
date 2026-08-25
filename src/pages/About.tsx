import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PortableText } from '@portabletext/react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Heart, Sparkles, BookOpen, Star } from 'lucide-react';
import { fetchAbout, SanityAbout, urlFor } from '../lib/sanity';

const FALLBACK_INTRO = [
  'Before I was an author, I was a kindergarten teacher who loved storytime more than anything else in the world. I saw firsthand how a good book could make a child\u2019s eyes light up \u2014 and I never forgot it.',
  'Now, I spend my spare time dreaming up silly characters, painting colorful worlds, and trying to answer life\u2019s biggest questions (like \u201cwhat if clouds tasted like cotton candy?\u201d).',
  'My stories are full of brave platypuses, lost koala bears, and little heroes who find magic hiding in the most unexpected places \u2014 because that\u2019s what childhood feels like when you\u2019re paying attention.',
];

const FALLBACK_FACTS = [
  {
    icon: <BookOpen size={28} />,
    color: 'bg-sky-100 text-sky-600',
    title: 'Teacher first',
    text: 'A decade of kindergarten storytimes taught me what makes a book magical for little listeners.',
  },
  {
    icon: <Star size={28} />,
    color: 'bg-rose-100 text-rose-500',
    title: 'Characters with heart',
    text: 'Every hero in my books faces a big scary problem \u2014 and finds brave, silly, kind ways through it.',
  },
  {
    icon: <Heart size={28} />,
    color: 'bg-amber-100 text-amber-600',
    title: 'Home is Ireland',
    text: 'I live in rural Ireland with my husband. Our kids are grown and living their own adventures, and we share our home with Loki, a golden retriever who thinks he\u2019s everyone\u2019s friend.',
  },
];

export default function About() {
  const [about, setAbout] = useState<SanityAbout | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchAbout()
      .then((data) => {
        if (!cancelled) setAbout(data);
      })
      .catch((error) => console.error('Failed to fetch about page:', error));
    return () => {
      cancelled = true;
    };
  }, []);

  const headline = about?.headline || 'About Alora Swift';
  const photoUrl = about?.photo ? urlFor(about.photo).width(1000).url() : '/aloraforweb.png';
  const facts = about?.facts?.length
    ? about.facts.map((f, i) => ({ ...FALLBACK_FACTS[i % FALLBACK_FACTS.length], title: f.title, text: f.text }))
    : FALLBACK_FACTS;
  const ctaTitle = about?.ctaTitle || 'Ready to meet Cuddles & Penny?';
  const ctaText = about?.ctaText || "Jump into the adventures and find your family's new favourite bedtime story.";

  return (
    <div className="min-h-screen bg-[#FFFBF0] font-sans selection:bg-rose-200 selection:text-slate-900 flex flex-col">
      <Navigation />

      <main className="flex-grow pt-24 md:pt-32">
        {/* Header */}
        <section className="px-6 py-16 md:py-24 text-center relative overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-20 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

          <div className="relative z-10 max-w-3xl mx-auto animate-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-amber-100 text-amber-600 font-bold text-sm mb-8 transform -rotate-2">
              <Heart size={16} fill="currentColor" /> Nice to meet you!
            </div>
            <h1 className="font-serif text-6xl md:text-7xl font-black text-slate-800 leading-[1.1] tracking-tight mb-8">
              {headline}
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
              Storyteller, former kindergarten teacher, and big kid at heart — I write books that
              make little eyes light up and sleepy voices beg for &quot;just one more page.&quot;
            </p>
          </div>
        </section>

        {/* Photo + story */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-6xl bg-white rounded-[3rem] p-8 md:p-14 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border-4 border-amber-50 grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <div className="relative group perspective-1000">
              <div className="overflow-hidden rounded-[3rem] aspect-square shadow-2xl border-8 border-white transform transition-transform duration-500 group-hover:rotate-y-6">
                <img
                  src={photoUrl}
                  alt="Alora Swift in her study"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-white text-slate-800 p-6 rounded-[2rem] shadow-xl transform rotate-3">
                <p className="font-sans font-bold text-lg text-rose-500 flex items-center gap-2">
                  <Heart fill="currentColor" /> Big kid at heart!
                </p>
              </div>
            </div>

            <div>
              <h2 className="font-serif text-4xl md:text-5xl font-black text-slate-800 mb-8 leading-tight">
                From the classroom to <span className="text-rose-500">the storybook page</span>
              </h2>
              {about?.intro ? (
                <div className="space-y-6 text-xl text-slate-700 leading-relaxed font-medium">
                  <PortableText value={about.intro} />
                </div>
              ) : (
                <div className="space-y-6 text-xl text-slate-700 leading-relaxed font-medium">
                  {FALLBACK_INTRO.map((paragraph) => (
                    <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Three little facts */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-7xl grid md:grid-cols-3 gap-10">
            {facts.map((item) => (
              <div key={item.title} className="bg-white rounded-[2rem] p-8 shadow-sm border border-amber-50">
                <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl mb-6 transform -rotate-6 ${item.color}`}>
                  {item.icon}
                </div>
                <h3 className="font-serif text-2xl font-bold text-slate-800 mb-3">{item.title}</h3>
                <p className="text-lg text-slate-600 font-medium leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-20 pb-32">
          <div className="mx-auto max-w-4xl bg-sky-400 rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-10 right-10 text-sky-300 opacity-50 transform rotate-12">
              <Sparkles size={90} fill="currentColor" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-black text-white mb-6 relative z-10">
              {ctaTitle}
            </h2>
            <p className="text-2xl text-sky-50 font-medium mb-10 relative z-10">
              {ctaText}
            </p>
            <Link
              to="/books"
              className="inline-flex h-16 items-center justify-center rounded-full bg-yellow-400 px-10 text-lg font-black text-yellow-900 shadow-xl hover:bg-yellow-300 hover:-translate-y-1 transition-all relative z-10"
            >
              Explore the Books <Sparkles className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
