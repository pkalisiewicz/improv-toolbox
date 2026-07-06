import { defineConfig } from 'vite'
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'

// SSG migration: switched from @vitejs/plugin-react to React Router framework
// mode (reactRouter plugin) to use RR7's built-in build-time prerendering.
//
// vite-plugin-pwa is temporarily disabled: RR framework mode changes the build
// pipeline (multi-environment, output under build/client), so the PWA service
// worker + manifest need deliberate re-integration. Tracked as its own
// follow-up milestone; the previous VitePWA config lives in git history.

export default defineConfig({
  plugins: [
    reactRouter(),
    tailwindcss(),
  ],
})
