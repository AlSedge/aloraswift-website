import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Draft preview (local only).
// Opening any page with ?preview=1 asks Sanity for unpublished drafts. Those requests
// need a token, and putting one in the browser is exactly what you should not do, so
// they are proxied through this dev server instead: the token is added here, server
// side, and never appears in the bundle. The deployed site is unaffected because the
// proxy only exists while `npm run dev` is running, and the client only switches to
// drafts when the ?preview flag is present.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const projectId = env.VITE_SANITY_PROJECT_ID || '2fs2ltni'
  const token = env.SANITY_PREVIEW_TOKEN

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/sanity-preview': {
          target: `https://${projectId}.api.sanity.io`,
          changeOrigin: true,
          // strip the proxy prefix, and add the API version if the client did not
          rewrite: (p) => {
            const rest = p.replace(/^\/sanity-preview/, '')
            return /^\/v\d{4}-/.test(rest) ? rest : `/v2021-06-07${rest}`
          },
          ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
          // Dev-only visibility: prints what the app asks for and what came back.
          configure: (proxy) => {
            proxy.on('proxyReq', (_proxyReq, req) => console.log('[preview] ->', req.method, req.url?.slice(0, 120)));
            proxy.on('proxyRes', (proxyRes, req) => console.log('[preview] <-', proxyRes.statusCode, req.url?.slice(0, 80)));
          },
        },
      },
    },
  }
})
