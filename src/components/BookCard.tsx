import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { SanityBook, urlFor } from '../lib/sanity';

export default function BookCard({ book }: { book: SanityBook }) {
  return (
    <Link
      to={`/books/${book.slug?.current || ''}`}
      className="group cursor-pointer bg-white rounded-[2rem] p-6 shadow-sm border border-amber-50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col"
    >
      <div className="overflow-hidden rounded-2xl mb-6 aspect-square relative">
        <img
          src={book.coverImage ? urlFor(book.coverImage).width(600).url() : "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=1974&auto=format&fit=crop"}
          alt={book.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
      </div>
      <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider w-fit mb-3 bg-sky-100 text-sky-800">
        {book.ageRange || 'All Ages'}
      </div>
      <h3 className="font-serif text-3xl font-bold text-slate-800 mb-3 group-hover:text-sky-500 transition-colors">
        {book.title}
      </h3>
      <p className="text-slate-600 font-medium leading-relaxed mb-6 flex-grow line-clamp-3">
        {book.synopsis}
      </p>
      <span className="text-rose-500 font-bold hover:text-rose-600 mt-auto inline-flex items-center gap-2">
        Get your copy <Sparkles size={16} />
      </span>
    </Link>
  );
}
