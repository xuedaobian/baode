// 简单的 API 启动脚本
import { spawn } from 'child_process';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 启动本地转换服务...');

// 启动 Express 服务器
const child = spawn('node',
  [join(__dirname, 'api-proxy.js')],
  {
    cwd: __dirname,
    stdio: 'inherit'
  }
);

child.on('error', (error) => {
  console.error('启动服务器时出错:', error);
});

child.on('exit', (code) => {
  if (code !== 0) {
    console.error(`服务器异常退出，退出码: ${code}`);
  }
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n📢 正在关闭服务器...');
  child.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n📢 正在关闭服务器...');
  child.kill('SIGTERM');
});