import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  base: "/fatuus/",
  server: {
    middlewareMode: false,
  },
  configureServer(server) {
    server.middlewares.use('/api/shutdown', (req, res) => {
      if (req.method === 'POST' || req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Shutting down...' }));
        
        // Kill the server after sending response
        setTimeout(() => {
          process.exit(0);
        }, 100);
      }
    });
  }
})
