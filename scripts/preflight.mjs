// Build preflight.
// Vercel build logs are the only place where this environment information is
// visible, so print it explicitly: it makes "works locally, fails on Vercel"
// problems diagnosable at a glance.
const PROJECT = process.env.VITE_SANITY_PROJECT_ID || '2fs2ltni';
const DATASET = process.env.VITE_SANITY_DATASET || 'production';
const API = `https://${PROJECT}.api.sanity.io/v2023-05-03/data/query/${DATASET}`;

const major = Number(process.versions.node.split('.')[0]);
const minor = Number(process.versions.node.split('.')[1] || 0);
// vite 8 / rolldown require ^20.19.0 || >=22.12.0
const ok = (major === 20 && minor >= 19) || major > 20 || (major === 22 && minor >= 12) || major > 22;

console.log(`[preflight] node ${process.version} on ${process.platform}/${process.arch}`);
console.log(`[preflight] npm ${process.env.npm_config_user_agent || 'unknown'}`);
if (!ok) {
  console.warn(`[preflight] WARNING: this Node version does not satisfy vite 8 (needs ^20.19.0 || >=22.12.0) — the build will very likely fail.`);
}

try {
  const res = await fetch(`${API}?query=${encodeURIComponent('count(*[_type == "book"])')}`, {
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  console.log(`[preflight] Sanity reachable — ${json.result} books, ${json.ms}ms`);
} catch (err) {
  // A warning, not a failure: the sitemap and prerender steps each fail loudly
  // on their own if they cannot read content.
  console.warn(`[preflight] WARNING: Sanity not reachable from this build (${err.cause?.code || err.message})`);
}
