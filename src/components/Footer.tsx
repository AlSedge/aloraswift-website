import { Sparkles, Mail } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const goToSection = (id: string) => {
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/', { state: { scrollTo: id } });
    }
  };

  return (
    <footer className="bg-sky-900 px-6 py-20 md:px-12 text-sky-100 font-sans rounded-t-[3rem] mt-12 relative overflow-hidden">
      {/* Playful Background Elements */}
      <div className="absolute top-0 left-10 w-32 h-32 bg-sky-800 rounded-full blur-2xl opacity-50"></div>
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-sky-700 rounded-full blur-3xl opacity-40"></div>

      <div className="mx-auto max-w-7xl relative z-10">
        <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-4 lg:gap-12 mb-16 border-b border-sky-800 pb-16">
          <div className="lg:col-span-2">
            <div className="mb-6 flex items-center gap-3 w-fit text-white">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-400 text-white transform -rotate-6">
                <Sparkles size={24} fill="currentColor" />
              </div>
              <span className="font-serif text-4xl font-black tracking-tight">Alora Swift</span>
            </div>
            <p className="max-w-md text-sky-200 leading-relaxed text-lg mb-8 font-medium">
              Creating magical worlds and unforgettable adventures for little readers everywhere.
              Sparking imagination, one page at a time!
            </p>
            <div className="flex gap-4">
              <a
                href="mailto:hello@aloraswift.com"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-800 text-sky-200 hover:bg-emerald-500 hover:text-white transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/50"
                aria-label="Email Alora"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-8 font-sans text-lg font-bold text-white">Explore</h4>
            <ul className="space-y-4 font-medium">
              <li>
                <Link to="/books" className="hover:text-white hover:translate-x-1 transition-all text-lg flex items-center gap-2">📚 My Books</Link>
              </li>
              <li>
                <button onClick={() => goToSection('reviews')} className="hover:text-white hover:translate-x-1 transition-all text-lg flex items-center gap-2">⭐ My Reviews</button>
              </li>
              <li>
                <Link to="/journal" className="hover:text-white hover:translate-x-1 transition-all text-lg flex items-center gap-2">🎨 Journal</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white hover:translate-x-1 transition-all text-lg flex items-center gap-2">👋 About Alora</Link>
              </li>
              <li>
                <button onClick={() => goToSection('newsletter')} className="hover:text-white hover:translate-x-1 transition-all text-lg flex items-center gap-2">💌 Free Printables</button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-8 font-sans text-lg font-bold text-white">Contact & Rep</h4>
            <div className="space-y-6 font-medium">
              <div>
                <p className="text-sky-300 mb-1">Literary Agent</p>
                <p className="text-white">Sarah Jenkins</p>
                <a href="mailto:sarah@jenkinslit.com" className="hover:text-sky-300 transition-colors">sarah@jenkinslit.com</a>
              </div>
              <div>
                <p className="text-sky-300 mb-1">School Visits</p>
                <a href="mailto:schools@aloraswift.com" className="hover:text-sky-300 transition-colors">schools@aloraswift.com</a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 font-medium text-sky-300">
          <p>© {new Date().getFullYear()} Alora Swift. All rights reserved.</p>
          <div className="flex gap-8">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/disclosure" className="hover:text-white transition-colors">Affiliate Disclosure</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
