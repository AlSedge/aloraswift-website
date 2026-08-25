import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { FileText } from 'lucide-react';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="font-serif text-2xl md:text-3xl font-black text-slate-800 mb-4">{title}</h2>
      <div className="space-y-4 text-lg text-slate-600 leading-relaxed font-medium">{children}</div>
    </div>
  );
}

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#FFFBF0] font-sans selection:bg-rose-200 selection:text-slate-900 flex flex-col">
      <Navigation />

      <main className="flex-grow pt-24 md:pt-32">
        <section className="px-6 py-16 md:py-20">
          <div className="mx-auto max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-amber-100 text-amber-600 font-bold text-sm mb-8 transform -rotate-2">
              <FileText size={16} /> Terms
            </div>
            <h1 className="font-serif text-5xl md:text-6xl font-black text-slate-800 leading-tight mb-6">
              Terms of Service
            </h1>
            <p className="text-slate-500 font-medium mb-14">Last updated: 24 August 2026</p>

            <div className="bg-white rounded-[2rem] p-8 md:p-12 border-2 border-amber-50 shadow-sm">
              <Section title="Using this website">
                <p>
                  By using aloraswift.com you agree to these terms. The content on this site — text,
                  images, and illustrations — belongs to Alora Swift unless stated otherwise and may
                  not be reproduced without permission.
                </p>
              </Section>

              <Section title="Content is for information and enjoyment">
                <p>
                  Blog posts, reading lists, and activity ideas are shared to inform and entertain.
                  We do our best to keep everything accurate, but content may change and is provided
                  &quot;as is&quot; without warranties of any kind.
                </p>
              </Section>

              <Section title="Buying books">
                <p>
                  When you buy a book, the purchase happens with the retailer (such as Amazon) under
                  their own terms. We are not responsible for the retailer&apos;s service, delivery, or
                  returns.
                </p>
              </Section>

              <Section title="Links to other sites">
                <p>
                  We link to third-party websites for your convenience. We don&apos;t control those sites
                  and aren&apos;t responsible for their content or privacy practices.
                </p>
              </Section>

              <Section title="Limitation of liability">
                <p>
                  To the maximum extent permitted by law, Alora Swift is not liable for any loss or
                  damage arising from your use of this website.
                </p>
              </Section>

              <Section title="Contact">
                <p>
                  Questions about these terms? Email{' '}
                  <a href="mailto:alora@aloraswift.com" className="text-sky-500 font-bold hover:underline">
                    alora@aloraswift.com
                  </a>.
                </p>
              </Section>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  to="/"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-sky-500 px-8 text-base font-bold text-white shadow-lg shadow-sky-200 transition-all hover:-translate-y-1 hover:bg-sky-400"
                >
                  ← Back to Home
                </Link>
                <Link
                  to="/privacy"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-white border-2 border-slate-200 px-8 text-base font-bold text-slate-700 transition-all hover:-translate-y-1 hover:border-slate-300 hover:bg-slate-50"
                >
                  Privacy Policy
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
