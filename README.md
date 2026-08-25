# Alora Swift — aloraswift.com

The official website of **Alora Swift**, children's picture book author.

- **Stack:** React 19 + TypeScript + Vite + Tailwind CSS v4
- **CMS:** Sanity (`2fs2ltni` / dataset `production`) — books, reviews, journal posts
- **Deploy:** Vercel (auto-deploys from `main` on GitHub)
- **Repo:** https://github.com/AlSedge/aloraswift-website

## Pages

| Route | Page |
|-------|------|
| `/` | Home (hero, latest release, book grid, reviews, about, journal, newsletter) |
| `/books` | All books |
| `/books/:slug` | Book detail page (cover, synopsis, review quote, buy link) |
| `/about` | Author story |
| `/journal` | Storybook blog index (Sanity `journalPost`, teaser fallback) |
| `/journal/:slug` | Blog post |
| `/privacy`, `/terms`, `/disclosure` | Legal pages |

## Local development

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build
npm run preview    # serve the production build
```

Environment: `.env` needs

```
VITE_SANITY_PROJECT_ID=2fs2ltni
VITE_SANITY_DATASET=production
```

## Content

Content lives in the Sanity project (`2fs2ltni`, dataset `production`). The schema is defined in
the sibling repo `alora-swift-studio` (`book`, `review`, `journalPost`). Run that studio locally
with `npm run dev` to add/edit content; the site fetches it client-side.

## SEO notes

- `public/robots.txt` + `public/sitemap.xml` are static.
- Per-route titles/descriptions/canonical/OG/JSON-LD are applied at runtime via `src/lib/seo.ts`.
- **New book:** add its URL to `public/sitemap.xml` (or move the site to prerendering/SSG — the
  long-term fix).
- `vercel.json` rewrites every route to `/` so client-side routes survive refreshes (static files
  like `robots.txt` still win, same as the Awakesol setup).
