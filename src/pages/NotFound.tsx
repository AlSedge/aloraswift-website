import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFBF0] font-sans">
      <div className="text-center">
        <h1 className="text-6xl font-serif font-black text-slate-800 mb-4">404</h1>
        <p className="text-xl text-slate-600 mb-8 font-medium">Oops! It looks like you've wandered off the trail.</p>
        <Link 
          to="/" 
          className="inline-flex h-14 items-center justify-center rounded-full bg-sky-500 px-8 text-lg font-bold text-white shadow-lg shadow-sky-200 transition-all hover:-translate-y-1 hover:shadow-sky-300 hover:bg-sky-400"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;