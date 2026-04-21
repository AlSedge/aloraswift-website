import { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (id: string) => {
    setIsMobileMenuOpen(false);
    if (!isHome) return;
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-amber-50/90 backdrop-blur-lg py-4 shadow-sm' : 'bg-transparent py-8'
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 z-50 group">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-400 text-white shadow-lg shadow-sky-200 transition-transform group-hover:-translate-y-1 group-hover:rotate-12">
            <Sparkles size={24} fill="currentColor" />
          </div>
          <span className="font-serif text-3xl font-black tracking-tight text-slate-800">
            Alora Swift
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-8 font-sans text-[15px] font-bold text-slate-600">
            <li><button onClick={() => handleScrollTo('latest-release')} className="hover:text-sky-500 transition-colors">Books</button></li>
            <li><button onClick={() => handleScrollTo('about')} className="hover:text-sky-500 transition-colors">About</button></li>
            <li><button onClick={() => handleScrollTo('journal')} className="hover:text-sky-500 transition-colors">Journal</button></li>
            <li>
              <button 
                onClick={() => handleScrollTo('newsletter')}
                className="ml-4 rounded-full bg-rose-400 px-8 py-3.5 text-white transition-all hover:bg-rose-500 hover:shadow-lg hover:shadow-rose-200 hover:-translate-y-1"
              >
                Join the Club!
              </button>
            </li>
          </ul>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden z-50 p-2 text-slate-800 bg-white rounded-full shadow-sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Nav Overlay */}
        <div className={`fixed inset-0 z-40 bg-amber-50 transition-opacity duration-300 md:hidden flex flex-col justify-center items-center ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
          <nav className="flex flex-col items-center gap-10 font-serif text-4xl font-bold text-slate-800">
            <button onClick={() => handleScrollTo('latest-release')} className="hover:text-sky-500 transition-colors">Books</button>
            <button onClick={() => handleScrollTo('about')} className="hover:text-sky-500 transition-colors">About</button>
            <button onClick={() => handleScrollTo('journal')} className="hover:text-sky-500 transition-colors">Journal</button>
            <button 
              onClick={() => handleScrollTo('newsletter')}
              className="mt-6 rounded-full bg-rose-400 px-12 py-5 font-sans text-xl font-bold text-white shadow-xl shadow-rose-200"
            >
              Join the Club!
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}