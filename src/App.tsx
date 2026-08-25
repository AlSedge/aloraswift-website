import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Books from "./pages/Books";
import BookDetail from "./pages/BookDetail";
import Journal from "./pages/Journal";
import JournalPost from "./pages/JournalPost";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Disclosure from "./pages/Disclosure";
import NotFound from "./pages/NotFound";
import Seo from "./components/Seo";

function App() {
  return (
    <BrowserRouter>
      <Seo />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/books" element={<Books />} />
        <Route path="/books/:slug" element={<BookDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/journal/:slug" element={<JournalPost />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/disclosure" element={<Disclosure />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
