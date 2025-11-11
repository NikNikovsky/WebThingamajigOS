import http from 'http';
import { exec } from 'child_process';

const server = http.createServer((req, res) => {
  if (req.url === '/api/shutdown' && (req.method === 'POST' || req.method === 'GET')) {
    console.log('[Shutdown Server] Shutdown requested');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Shutting down dev server...' }), () => {
      // Wait for response to be sent, then gracefully exit
      setTimeout(() => {
        console.log('[Shutdown Server] Exiting gracefully...');
        // Send SIGTERM to parent process (concurrently will handle it)
        process.emit('SIGTERM');
        process.exit(0);
      }, 500);
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

// Handle shutdown signals
process.on('SIGTERM', () => {
  console.log('[Shutdown Server] Received SIGTERM');
  server.close(() => {
    process.exit(0);
  });
});

server.listen(5174, 'localhost', () => {
  console.log('[Shutdown Server] Running on http://localhost:5174');
});
