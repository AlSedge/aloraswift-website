import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getRouteMeta, applySeo } from '../lib/seo';

// Applies the per-route <title>, meta description, canonical, OG/Twitter
// tags and JSON-LD whenever the route changes, and resets scroll position.
export default function Seo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = getRouteMeta(pathname);
    applySeo(meta, pathname);
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return null;
}
