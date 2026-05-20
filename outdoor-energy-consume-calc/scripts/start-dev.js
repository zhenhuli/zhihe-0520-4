import { spawn } from 'child_process';
import net from 'net';

function isPortInUse(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(true));
    server.once('listening', () => {
      server.close();
      resolve(false);
    });
    server.listen(port);
  });
}

async function findAvailablePort(startPort = 5173, maxAttempts = 50) {
  for (let i = 0; i < maxAttempts; i++) {
    const port = startPort + i;
    const inUse = await isPortInUse(port);
    if (!inUse) {
      return port;
    }
  }
  return startPort;
}

async function startDevServer() {
  const port = await findAvailablePort();
  console.log(`\n🚀 启动户外徒步体能消耗计算器开发服务器...`);
  console.log(`📍 服务地址: http://localhost:${port}\n`);
  
  const child = spawn('npx', ['vite', '--port', port.toString()], {
    stdio: 'inherit',
    shell: process.platform === 'win32'
  });
  
  child.on('exit', (code) => {
    process.exit(code);
  });
}

startDevServer();
