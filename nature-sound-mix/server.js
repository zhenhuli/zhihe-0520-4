import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.map': 'application/json'
};

const server = http.createServer((req, res) => {
  let filePath = path.join(
    __dirname,
    req.url === '/' ? 'dist/index.html' : 'dist' + req.url
  );

  if (req.url === '/' || req.url === '') {
    filePath = path.join(__dirname, 'dist', 'index.html');
  }

  const extname = path.extname(filePath);
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        const publicPath = path.join(__dirname, 'public' + req.url);
        fs.readFile(publicPath, (err2, data2) => {
          if (err2) {
            res.writeHead(404);
            res.end('404 - File Not Found');
          } else {
            res.writeHead(200, { 'Content-Type': MIME_TYPES[path.extname(publicPath)] || 'text/html' });
            res.end(data2);
          }
        });
      } else {
        res.writeHead(500);
        res.end('500 - Internal Server Error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  console.log(`🌿 自然白噪音混音工具已启动`);
  console.log(`🚀 服务器运行在: http://localhost:${PORT}`);
  console.log(`📁 服务目录: ${path.join(__dirname, 'dist')}`);
});
