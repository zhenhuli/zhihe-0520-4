import { spawn } from 'child_process';
import net from 'net';

async function findAvailablePort(startPort = 5173, maxAttempts = 50) {
  for (let i = 0; i < maxAttempts; i++) {
    const port = startPort + i;
    const available = await checkPort(port);
    if (available) {
      return port;
    }
  }
  return startPort;
}

function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    server.listen(port, '0.0.0.0');
  });
}

async function startDevServer() {
  const port = await findAvailablePort(5179);
  console.log(`Starting development server on port ${port}...`);
  
  const vite = spawn('npx', ['vite', '--port', port.toString(), '--host'], {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: process.platform === 'win32'
  });

  vite.on('error', (err) => {
    console.error('Failed to start dev server:', err);
    process.exit(1);
  });

  vite.on('exit', (code) => {
    process.exit(code);
  });
}

startDevServer();
