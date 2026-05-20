import { createServer } from 'vite'
import detectPort from 'detect-port'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const defaultPort = 5173

async function startDevServer() {
  const port = await detectPort(defaultPort)
  
  console.log(`\n🚀 正在启动开发服务器...`)
  if (port !== defaultPort) {
    console.log(`⚠️  端口 ${defaultPort} 已被占用，将使用端口 ${port}`)
  }
  
  const server = await createServer({
    root,
    server: {
      port,
      host: true
    }
  })
  
  await server.listen()
  
  console.log(`\n✅ 开发服务器已启动!`)
  console.log(`📍 本地访问: http://localhost:${port}`)
  console.log(`🌐 网络访问: http://${server.config.server.host ? '0.0.0.0' : 'localhost'}:${port}`)
  console.log(`\n按 Ctrl+C 停止服务器\n`)
}

startDevServer().catch((err) => {
  console.error('启动失败:', err)
  process.exit(1)
})
