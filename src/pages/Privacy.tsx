import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { ShieldCheck } from 'lucide-react';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="font-serif text-2xl md:text-3xl font-black text-slate-800 mb-4">{title}</h2>
      <div className="space-y-4 text-lg text-slate-600 leading-relaxed font-medium">{children}</div>
    </div>
  );
}

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#FFFBF0] font-sans selection:bg-rose-200 selection:text-slate-900 flex flex-col">
      <Navigation />

      <main className="flex-grow pt-24 md:pt-32">
        <section className="px-6 py-16 md:py-20">
          <div className="mx-auto max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-amber-100 text-amber-600 font-bold text-sm mb-8 transform -rotate-2">
              <ShieldCheck size={16} /> Privacy
            </div>
            <h1 className="font-serif text-5xl md:text-6xl font-black text-slate-800 leading-tight mb-6">
              Privacy Policy
            </h1>
            <p className="text-slate-500 font-medium mb-14">Last updated: 24 August 2026</p>

            <div className="bg-white rounded-[2rem] p-8 md:p-12 border-2 border-amber-50 shadow-sm">
              <Section title="Who we are">
                <p>
                  This website, <span className="font-bold text-slate-800">aloraswift.com</span>, is
                  the personal author site of Alora Swift, a children&apos;s book author. If you have
                  any questions about this policy, you can email{' '}
                  <a href="mailto:hello@aloraswift.com" className="text-sky-500 font-bold hover:underline">
                    hello@aloraswift.com
                  </a>.
                </p>
              </Section>

              <Section title="Information we collect">
                <p>
                  <strong className="text-slate-800">Newsletter sign-ups:</strong> if you sign up for
                  the newsletter, we collect the email address you provide, and we use it only to send
                  you the newsletter you asked for. You can unsubscribe at any time.
                </p>
                <p>
                  <strong className="text-slate-800">Usage data:</strong> like most websites, our
                  hosting provider (Vercel) and any analytics tools we use may collect basic,
                  anonymised technical data such as pages visited, device type, and approximate
                  location. This helps us understand which stories readers enjoy most.
                </p>
                <p>
                  <strong className="text-slate-800">Emails:</strong> when you email us, we keep your
                  message only as long as needed to reply and resolve your query.
                </p>
              </Section>

              <Section title="Cookies">
                <p>
                  We do not use advertising cookies. If we add analytics or other services that use
                  cookies in the future, this policy will be updated to explain them.
                </p>
              </Section>

              <Section title="Third-party services">
                <p>
                  This site is hosted on <strong className="text-slate-800">Vercel</strong> and uses{' '}
                  <strong className="text-slate-800">Sanity</strong> to serve book and blog content.
                  Purchases of books are completed on <strong className="text-slate-800">Amazon</strong>{' '}
                  (or the retailer shown on the book page), and those sites have their own privacy
                  policies — please read them before shopping.
                </p>
              </Section>

              <Section title="Children's privacy">
                <p>
                  Our books are written for children, but this website is designed for parents,
                  carers, and educators. We do not knowingly collect personal information from
                  children under 13. If you believe a child has provided us with personal
                  information, contact us and we will delete it promptly.
                </p>
              </Section>

              <Section title="Your rights">
                <p>
                  You may ask us at any time what personal information we hold about you, ask us to
                  correct or delete it, or ask us to stop using it. Just email{' '}
                  <a href="mailto:hello@aloraswift.com" className="text-sky-500 font-bold hover:underline">
                    hello@aloraswift.com
                  </a>{' '}
                  and we&apos;ll take care of it.
                </p>
              </Section>

              <Section title="Changes to this policy">
                <p>
                  If we change this policy, we&apos;ll update the &quot;last updated&quot; date at the top
                  of this page.
                </p>
              </Section>

              <div className="pt-4">
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
