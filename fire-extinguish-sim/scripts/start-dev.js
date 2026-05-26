const detect = require('detect-port');
const { spawn } = require('child_process');
const path = require('path');

const DEFAULT_PORT = 8080;

detect(DEFAULT_PORT).then((port) => {
  if (port === DEFAULT_PORT) {
    console.log(`端口 ${DEFAULT_PORT} 可用，正在启动开发服务器...`);
    startServer(DEFAULT_PORT);
  } else {
    console.log(`端口 ${DEFAULT_PORT} 被占用，正在使用端口 ${port}...`);
    startServer(port);
  }
}).catch((err) => {
  console.error('检测端口失败:', err);
  console.log(`使用默认端口 ${DEFAULT_PORT} 启动...`);
  startServer(DEFAULT_PORT);
});

function startServer(port) {
  process.env.PORT = port;
  process.env.NODE_ENV = 'development';
  
  const webpackDevServerPath = path.join(__dirname, '../node_modules/.bin/webpack');
  const isWin = process.platform === 'win32';
  const cmd = isWin ? webpackDevServerPath + '.cmd' : webpackDevServerPath;
  
  const child = spawn(cmd, ['serve', '--mode', 'development'], {
    stdio: 'inherit',
    env: { ...process.env, PORT: port }
  });
  
  child.on('close', (code) => {
    console.log(`开发服务器已退出，代码: ${code}`);
    process.exit(code);
  });
  
  child.on('error', (err) => {
    console.error('启动服务器失败:', err);
    process.exit(1);
  });
}
