// Submits every URL in public/sitemap.xml to IndexNow, which instantly queues
// them for crawling on Bing, Yandex and the other participating engines.
// Google does NOT use IndexNow, so this is purely additive to the sitemap.
//
// Runs automatically at the end of a PRODUCTION build (Vercel sets
// VERCEL_ENV=production, so preview builds stay quiet), and can be run by hand:
//
//   npm run indexnow           submit the current sitemap
//   npm run indexnow -- --dry  show what would be sent, send nothing
//
// It never fails a build: a rejected ping is not worth breaking a deploy over.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITEMAP = path.join(__dirname, '..', 'public', 'sitemap.xml');
const HOST = 'www.aloraswift.com';
const KEY = '7c4e1b9a6f2d8e3b5a0c7d4f1e8b2a6c';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const dry = process.argv.includes('--dry');

function urlsFromSitemap() {
  if (!fs.existsSync(SITEMAP)) return [];
  const xml = fs.readFileSync(SITEMAP, 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

async function submit(urlList) {
  const body = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList };
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(20000),
      });
      const text = await res.text();
      // IndexNow answers 200 (accepted) or 202 (accepted, key validation pending).
      console.log(`[indexnow] submitted ${urlList.length} URLs -> HTTP ${res.status}${text ? ' ' + text.slice(0, 160) : ''}`);
      return;
    } catch (err) {
      if (attempt === 3) {
        console.warn(`[indexnow] WARNING: submission failed (${err.cause?.code || err.message}) - indexing still happens via the sitemap`);
        return;
      }
      await new Promise((r) => setTimeout(r, 4000 * attempt));
    }
  }
}

async function main() {
  const urlList = urlsFromSitemap();
  if (!urlList.length) {
    console.warn('[indexnow] no URLs found in public/sitemap.xml - nothing submitted');
    return;
  }
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production') {
    console.log(`[indexnow] skipped (VERCEL_ENV=${process.env.VERCEL_ENV}, only production builds submit)`);
    return;
  }
  if (dry) {
    console.log(`[indexnow] dry run - would submit ${urlList.length} URLs:`);
    for (const u of urlList) console.log('  ' + u);
    return;
  }
  await submit(urlList);
}

main().catch((err) => console.warn('[indexnow] WARNING:', err.message));
