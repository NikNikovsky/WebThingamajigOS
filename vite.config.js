import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

const shutdownPlugin = {
  name: 'shutdown-plugin',
  apply: 'serve',
  configureServer(server) {
    return () => {
      server.httpServer?.on('request', (req, res) => {
        if (req.url === '/api/shutdown' && (req.method === 'POST' || req.method === 'GET')) {
          console.log('[Shutdown] Intercepted request');
          // Only write if headers haven't been sent
          if (!res.headersSent) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Shutting down...' }));
          } else {
            res.end();
          }
          
          setTimeout(() => {
            console.log('[Shutdown] Killing server');
            process.exit(0);
          }, 200);
          return;
        }
      });
    };
  }
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte(), shutdownPlugin],
  base: "/fatuus/",
})
