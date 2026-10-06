import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Books from "./pages/Books";
import SeniorBooks from "./pages/SeniorBooks";
import BookDetail from "./pages/BookDetail";
import Journal from "./pages/Journal";
import JournalPost from "./pages/JournalPost";
import ColoringBook from "./pages/ColoringBook";
import HalloweenColoringBook from "./pages/HalloweenColoringBook";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Disclosure from "./pages/Disclosure";
import NotFound from "./pages/NotFound";
import Seo from "./components/Seo";

function App() {
  return (
    <BrowserRouter>
      <Seo />
      {/* Shows only with ?preview=1 on the local dev server: drafts are visible. */}
      {typeof window !== 'undefined' &&
        ['localhost', '127.0.0.1'].includes(window.location.hostname) &&
        new URLSearchParams(window.location.search).has('preview') && (
        <div className="preview-banner fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-2xl">
          Draft preview - unpublished changes are visible
        </div>
      )}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/books" element={<Books />} />
        <Route path="/books/:slug" element={<BookDetail />} />
        <Route path="/senior-books" element={<SeniorBooks />} />
        <Route path="/about" element={<About />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/journal/:slug" element={<JournalPost />} />
        <Route path="/free-coloring-book" element={<ColoringBook />} />
        <Route path="/free-halloween-coloring-book" element={<HalloweenColoringBook />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/disclosure" element={<Disclosure />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
