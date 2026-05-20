import { createServer } from 'http';
import { readFile, readFileSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT_START = 8000;
const PORT_MAX = 65535;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.ico': 'image/x-icon'
};

function checkPort(port) {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false);
      } else {
        reject(err);
      }
    });
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    server.listen(port);
  });
}

async function findFreePort(startPort = PORT_START) {
  for (let port = startPort; port <= PORT_MAX; port++) {
    const isFree = await checkPort(port);
    if (isFree) return port;
  }
  throw new Error('No free ports found');
}

function serveStatic(req, res) {
  const baseDir = join(__dirname, 'dist');
  let filePath = join(baseDir, req.url === '/' ? 'index.html' : req.url);

  const ext = extname(filePath).toLowerCase();
  const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

  readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
      }
      return;
    }
    res.writeHead(200, { 'Content-Type': mimeType });
    res.end(data);
  });
}

async function startServer() {
  const port = await findFreePort();
  const server = createServer(serveStatic);
  
  server.listen(port, () => {
    console.log('\n========================================');
    console.log('  民族打击乐节奏编辑器');
    console.log('========================================');
    console.log(`  服务器已启动: http://localhost:${port}`);
    console.log(`  项目目录: ${__dirname}`);
    console.log('========================================\n');
  });

  server.on('error', (err) => {
    console.error('服务器错误:', err);
  });
}

startServer();
