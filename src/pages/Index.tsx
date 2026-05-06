import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Sparkles, Star, BookOpen, Quote, Heart, Send } from 'lucide-react';
import { fetchSanityBooks, SanityBook, urlFor } from '../lib/sanity';

export default function Index() {
  const [books, setBooks] = useState<SanityBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBooks() {
      try {
        const fetchedBooks = await fetchSanityBooks();
        setBooks(fetchedBooks);
      } catch (error) {
        console.error("Failed to fetch books from Sanity:", error);
      } finally {
        setLoading(false);
      }
    }
    loadBooks();
  }, []);

  // Use the first returned book as the "Latest Release Spotlight"
  const latestBook = books.length > 0 ? books[0] : null;
  // Use the rest of the books for the grid
  const otherBooks = books.length > 1 ? books.slice(1) : [];

  return (
    <div className="min-h-screen bg-[#FFFBF0] font-sans selection:bg-rose-200 selection:text-slate-900 flex flex-col">
      <Navigation />

      <main className="flex-grow pt-24 md:pt-32">
        
        {/* Hero Section */}
        <section className="relative px-6 py-20 md:py-32 overflow-hidden flex flex-col items-center justify-center text-center">
          {/* Playful Background Blobs */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-64 h-64 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 right-20 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-1/2 w-80 h-80 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto animate-in slide-in-from-bottom-8 duration-1000 fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-amber-100 text-amber-600 font-bold text-sm mb-8 transform -rotate-2">
              <Star size={16} fill="currentColor" /> Bestselling Children&apos;s Author
            </div>
            
            <h1 className="font-serif text-6xl md:text-8xl lg:text-[7rem] text-slate-800 font-black leading-[1.1] tracking-tight mb-8">
              Where imagination <br />
              <span className="text-sky-500 relative inline-block mt-2">
                takes flight!
                <svg className="absolute w-full h-4 -bottom-1 left-0 text-sky-300 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 15 100 5" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-12 font-medium">
              Join the adventure with whimsical tales of bravery, friendship, and magic hidden in the most unexpected places.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => document.getElementById('latest-release')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex h-16 items-center justify-center rounded-full bg-sky-500 px-10 text-lg font-bold text-white shadow-xl shadow-sky-200 transition-all hover:-translate-y-1 hover:shadow-sky-300 hover:bg-sky-400"
              >
                Discover the Books <Sparkles className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </section>

        {/* Latest Release Spotlight */}
        <section id="latest-release" className="px-6 py-24">
          <div className="mx-auto max-w-7xl bg-white rounded-[3rem] p-8 md:p-12 lg:p-20 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border-4 border-amber-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100 rounded-bl-full opacity-50 pointer-events-none"></div>
            
            {loading ? (
              <p className="text-slate-500 text-center py-20 font-medium">Loading magical stories from Sanity...</p>
            ) : latestBook ? (
              <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center relative z-10">
                <div className="relative mx-auto w-full max-w-md lg:max-w-none group perspective-1000">
                  <div className="relative z-10 w-full rounded-3xl shadow-2xl overflow-hidden transform transition-transform duration-500 group-hover:rotate-y-12">
                    <img
                      src={latestBook.coverImage ? urlFor(latestBook.coverImage).width(800).url() : "https://images.unsplash.com/photo-1531281530990-2c70030dff75?q=80&w=2070&auto=format&fit=crop"}
                      alt={latestBook.title}
                      className="w-full aspect-[4/5] object-cover"
                    />
                    {!latestBook.coverImage && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                        <h3 className="text-4xl font-serif font-black text-white leading-tight">{latestBook.title}</h3>
                      </div>
                    )}
                  </div>
                  
                  {latestBook.isNewRelease && (
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center text-yellow-900 font-bold text-center p-2 shadow-lg transform rotate-12 z-20">
                      <span className="text-sm">NEW<br/>RELEASE!</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 text-rose-600 font-bold text-sm mb-6 w-fit transform -rotate-1">
                    <Heart size={16} fill="currentColor" /> {latestBook.tagline || "An Outback Adventure"}
                  </div>
                  
                  <h2 className="font-serif text-5xl md:text-6xl font-black text-slate-800 mb-6 leading-tight">{latestBook.title}</h2>
                  
                  <div className="flex gap-1 text-yellow-400 mb-8">
                    {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={24} fill="currentColor" />)}
                    <span className="ml-3 text-lg font-bold text-slate-500 mt-0.5">Over 1,400+ happy kids!</span>
                  </div>
                  
                  <p className="text-xl text-slate-600 leading-relaxed mb-6 font-medium whitespace-pre-wrap">
                    {latestBook.synopsis || "When a giant storm sweeps through the eucalyptus trees, little Cuddles, a fluffy blue-eyed koala bear, finds himself on the forest floor! Join him on a brave, silly, and heartwarming journey back up to the canopy, making new animal friends along the way."}
                  </p>
                  
                  <div className="bg-sky-50 rounded-2xl p-6 mb-8 border border-sky-100 relative">
                    <Quote size={32} className="absolute -top-4 -left-4 text-sky-300 bg-[#FFFBF0] rounded-full p-1" />
                      <p className="text-lg text-slate-700 italic font-medium">
                        &quot;{latestBook.reviewQuote || "A beautiful story about resilience and friendship. My kids ask to read it every single night!"}&quot;
                        <span className="block text-sm font-bold text-sky-600 mt-2">— {latestBook.reviewAuthor || "Sarah T., Mom of two"}</span>
                      </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    {latestBook.buyLink && (
                      <a href={latestBook.buyLink} target="_blank" rel="noreferrer" className="inline-flex h-16 items-center justify-center rounded-full bg-rose-500 px-10 text-lg font-bold text-white shadow-xl shadow-rose-200 transition-all hover:-translate-y-1 hover:bg-rose-400 hover:shadow-rose-300">
                        Buy the Book
                      </a>
                    )}
                    {latestBook.excerptLink && (
                      <a href={latestBook.excerptLink} target="_blank" rel="noreferrer" className="inline-flex h-16 items-center justify-center rounded-full bg-white border-2 border-slate-200 px-10 text-lg font-bold text-slate-700 transition-all hover:-translate-y-1 hover:border-slate-300 hover:bg-slate-50">
                        Read an Excerpt
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-center py-20 font-medium">No books found in Sanity yet. Add some in your Sanity Studio!</p>
            )}
          </div>
        </section>

        {/* Previous Works */}
        <section className="px-6 py-24 relative">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 text-center md:text-left">
              <div>
                <h2 className="font-serif text-5xl font-black text-slate-800 mb-4">More Magical Adventures</h2>
                <p className="text-xl text-slate-600 font-medium max-w-xl">Explore the full collection of Alora&apos;s beloved picture books and early readers.</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-10">
              {otherBooks.map((book) => (
                <div key={book._id} className="group cursor-pointer bg-white rounded-[2rem] p-6 shadow-sm border border-amber-50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col">
                  <div className="overflow-hidden rounded-2xl mb-6 aspect-square relative">
                    <img 
                      src={book.coverImage ? urlFor(book.coverImage).width(600).url() : "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=1974&auto=format&fit=crop"} 
                      alt={book.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                  </div>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider w-fit mb-3 bg-sky-100 text-sky-800`}>
                    {book.ageRange || "All Ages"}
                  </div>
                  <h3 className="font-serif text-3xl font-bold text-slate-800 mb-3 group-hover:text-sky-500 transition-colors">{book.title}</h3>
                  <p className="text-slate-600 font-medium leading-relaxed mb-6 flex-grow line-clamp-3">{book.synopsis}</p>
                  
                  {book.buyLink && (
                    <a href={book.buyLink} target="_blank" rel="noreferrer" className="text-rose-500 font-bold hover:text-rose-600 mt-auto inline-flex items-center gap-2">
                      Get your copy <Sparkles size={16} />
                    </a>
                  )}
                </div>
              ))}
              
              {!loading && otherBooks.length === 0 && (
                <p className="text-slate-500 col-span-3">More books coming soon!</p>
              )}
            </div>
          </div>
        </section>

       {/* My Reviews Section */}
        <section id="reviews" className="px-6 py-24 relative">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 text-center md:text-left">
              <div>
                <h2 className="font-serif text-5xl font-black text-slate-800 mb-4">My Reviews & Recommendations</h2>
                <p className="text-xl text-slate-600 font-medium max-w-xl">Curated picks of my absolute favorite books, games, and toys for little ones.</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-10">
              {[
                { 
                  title: "The Very Hungry Caterpillar", 
                  type: "Picture Book",
                  desc: "A timeless classic that every child should have on their bookshelf. The interactive pages are brilliant for toddlers.",
                  color: "bg-emerald-100 text-emerald-800",
                  img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2098&auto=format&fit=crop",
                  link: "https://amazon.com"
                },
                { 
                  title: "Magnetic Building Tiles", 
                  type: "Educational Toy",
                  desc: "These have kept my kids entertained for hours! Fantastic for building spatial awareness and creativity.",
                  color: "bg-purple-100 text-purple-800",
                  img: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=2070&auto=format&fit=crop",
                  link: "https://amazon.com"
                },
                { 
                  title: "Where the Wild Things Are", 
                  type: "Picture Book",
                  desc: "A beautiful exploration of big emotions and imagination. The artwork is breathtaking and the story is unforgettable.",
                  color: "bg-sky-100 text-sky-800",
                  img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1974&auto=format&fit=crop",
                  link: "https://amazon.com"
                }
              ].map((review, i) => (
                <div key={i} className="group bg-white rounded-[2rem] p-6 shadow-sm border border-amber-50 flex flex-col">
                  <div className="overflow-hidden rounded-2xl mb-6 aspect-video relative">
                    <img src={review.img} alt={review.title} className="w-full h-full object-cover" />
                  </div>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 w-fit ${review.color}`}>
                    {review.type}
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-slate-800 mb-3">{review.title}</h3>
                  <p className="text-slate-600 font-medium leading-relaxed mb-6 flex-grow">{review.desc}</p>
                  
                  <a href={review.link} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center justify-center rounded-full bg-slate-100 px-6 text-sm font-bold text-slate-700 transition-all hover:-translate-y-1 hover:bg-yellow-400 hover:text-yellow-900 mt-auto">
                    View on Amazon <Sparkles className="ml-2 w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
       
        {/* About Section */}
        <section id="about" className="px-6 py-24 md:py-32 bg-amber-100 rounded-[4rem] mx-4 md:mx-8 mb-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
          
          <div className="mx-auto max-w-6xl relative z-10 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="relative group perspective-1000">
              <div className="overflow-hidden rounded-[3rem] aspect-square shadow-2xl border-8 border-white transform transition-transform duration-500 group-hover:rotate-y-6">
                <img 
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1974&auto=format&fit=crop" 
                  alt="Alora Swift in a bright room" 
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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-amber-600 font-bold text-sm mb-6 shadow-sm">
                👋 Hello there!
              </div>
              
              <h2 className="font-serif text-5xl md:text-6xl font-black text-slate-800 mb-8 leading-tight">
                I&apos;m Alora. I write books about <span className="text-rose-500">brave frogs</span> and <span className="text-sky-500">lost koalas.</span>
              </h2>
              
              <div className="space-y-6 text-xl text-slate-700 leading-relaxed font-medium mb-10">
                  <p>
                    Before I was an author, I was a kindergarten teacher who loved storytime more than anything else in the world. I saw firsthand how a good book could make a child&apos;s eyes light up.
                  </p>
                  <p>
                    Now, I spend my days dreaming up silly characters, painting colorful worlds, and trying to answer life&apos;s biggest questions (like &quot;what if clouds tasted like cotton candy?&quot;).
                  </p>
                <p>
                  I live in a very squeaky old house with my husband, our two kids, and a golden retriever named Pancake who thinks he&apos;s a lap dog.
                </p>
              </div>
              
              <a href="#" className="inline-flex h-16 items-center justify-center rounded-full bg-slate-800 px-10 text-lg font-bold text-white transition-all hover:bg-slate-700 hover:-translate-y-1 hover:shadow-xl">
                Read My Full Story
              </a>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section id="newsletter" className="px-6 py-32 bg-sky-400 mt-12 rounded-t-[4rem] relative overflow-hidden">
          <div className="absolute top-10 right-10 text-sky-300 opacity-50 transform rotate-12">
            <Sparkles size={120} fill="currentColor" />
          </div>
          <div className="absolute bottom-10 left-10 text-sky-300 opacity-50 transform -rotate-12">
            <Star size={100} fill="currentColor" />
          </div>
          
          <div className="mx-auto max-w-3xl text-center relative z-10">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-rose-500 mb-8 transform rotate-6 shadow-xl">
              <Send size={40} />
            </div>
            
            <h2 className="font-serif text-5xl md:text-6xl font-black text-white mb-6">Join the Adventure Club!</h2>
            <p className="text-2xl text-sky-50 mb-12 font-medium leading-relaxed">
              Sign up for my newsletter and get a <span className="font-bold text-yellow-300">FREE printable coloring book</span> instantly! Plus updates on new books and events.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto" onSubmit={(e) => { e.preventDefault(); alert('Yay! Welcome to the club!'); }}>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-grow rounded-full bg-white border-4 border-sky-300 px-8 py-5 text-slate-800 font-sans text-xl font-medium focus:outline-none focus:border-yellow-400 transition-colors shadow-lg placeholder:text-slate-400"
                required
              />
              <button type="submit" className="whitespace-nowrap rounded-full bg-yellow-400 px-10 py-5 font-sans text-xl font-black text-yellow-900 hover:bg-yellow-300 transition-all hover:-translate-y-1 shadow-lg hover:shadow-yellow-400/50">
                Send it!
              </button>
            </form>
            <p className="font-sans text-sky-100 font-medium mt-6 text-lg">No spam, just fun stuff. Unsubscribe anytime.</p>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}