import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      // Route all /api/* requests to CoinGecko during local development.
      // This eliminates the need for vercel.json locally and avoids
      // the "Unexpected token '/'" JSON-parse crash it caused.
      '/api/markets': {
        target: 'https://api.coingecko.com/api/v3/coins',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/markets/, '/markets'),
      },
    },
  },
})
