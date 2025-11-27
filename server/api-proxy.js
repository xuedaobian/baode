import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

// 获取当前路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 加载环境变量（必须在所有环境变量使用之前）
dotenv.config({ path: path.join(__dirname, '../.env') });

// API配置 - 使用加载的环境变量
console.log('🔍 环境变量加载完成');
console.log('📋 API_BASE_URL:', process.env.API_BASE_URL || '未设置，使用默认值');
console.log('📋 API_KEY:', process.env.API_KEY ? process.env.API_KEY.substring(0, 15) + '...' : '未设置，使用默认值');
console.log('📋 API_MODEL:', process.env.API_MODEL || '未设置，使用默认值');

const API_CONFIG = {
  // 服务方提供的信息
  baseURL: process.env.API_BASE_URL || 'https://openrouter.ai/api/v1',
  apiKey: process.env.API_KEY || 'sk-or-v1-xxxxxxxxx', // 你的API密钥
  model: process.env.API_MODEL || 'deepseek/deepseek-chat-v2.1:free', // 模型ID

  // 可选项
  organization: process.env.API_ORG || undefined,
  project: process.env.API_PROJECT || undefined,
};

const app = express();
const PORT = process.env.PORT || 3001;

// CORS 配置 - 允许局域网访问
app.use(cors({
  origin: true, // 允许所有来源，方便局域网调试
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// 配置 OpenAI 客户端 - 支持任何API提供方
const openai = new OpenAI({
  baseURL: API_CONFIG.baseURL,
  apiKey: API_CONFIG.apiKey,
  organization: API_CONFIG.organization,
  project: API_CONFIG.project,
});

// API 中转端点
app.post('/api/convert', async (req, res) => {
  try {
    const { input, type } = req.body;

    if (!input || !type) {
      return res.status(400).json({
        error: '缺少必要参数：input 和 type',
        input,
        type
      });
    }

    const messages = type === 'toIdiom'
      ? [
          {
            role: 'system',
            content: `你是「我们不说包的」的语言转换大师，精通古今中文表达的转换艺术。

你的任务：将网络流行语、热梗、俚语转换为意境相近的成语、古语或文言表达。

转换原则：
- 追求神似而非形似，捕捉原意的精髓
- 优先选择意境贴切、富有画面感但是广为流传的成语
- 可以是成语、诗词名句、古文短语
- 如果找不到完美对应，给出最接近的雅致表达

输出格式（严格遵守）：
📜 [转换后的古雅表达]`
          },
          {
            role: 'user',
            content: `「${input}」`
          }
        ]
      : [
          {
            role: 'system',
            content: `你是「我们不说包的」的语言转换大师，深谙网络文化与古典文学的碰撞之美。

你的任务：将成语、古语、文言表达转换为当下最鲜活的网络用语、热梗或流行表达。

转换原则：
- 追求当代年轻人的真实表达方式
- 可以用热梗、缩写、emoji、流行语
- 要接地气，像朋友聊天一样自然
- 如果原文本身就很潮，可以加倍升级

输出格式（严格遵守）：
🔥 [转换后的网络潮语]`
          },
          {
            role: 'user',
            content: `「${input}」`
          }
        ];

    console.log(`🔄 转换请求: ${type} - ${input}`);

    const response = await openai.chat.completions.create({
      model: API_CONFIG.model, // 使用服务方提供的模型ID
      messages: messages,
      max_tokens: 500,
      temperature: 0.3
    });

    const result = response.choices[0]?.message?.content || '转换失败';
    console.log(`✅ 转换结果: ${result}`);

    res.json({
      success: true,
      result,
      type,
      input
    });

  } catch (error) {
    console.error('API 中转错误:', error);
    res.status(500).json({
      error: '转换失败',
      details: error.message
    });
  }
});

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({
    status: '🟢 Server running',
    timestamp: new Date().toISOString(),
    model: API_CONFIG.model
  });
});

// 启动服务器 - 监听所有网络接口
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 服务器启动在 http://0.0.0.0:${PORT}`);
  console.log(`🔗 API 端点: http://localhost:${PORT}/api/convert`);
  console.log(`🩺 健康检查: http://localhost:${PORT}/api/health`);

  // 显示当前配置信息
  console.log(`💡 当前使用配置:`);
  console.log(`   Base URL: ${API_CONFIG.baseURL}`);
  console.log(`   Model: ${API_CONFIG.model}`);
  console.log(`   API Key: ${API_CONFIG.apiKey.substring(0, 10)}...`);
  console.log(`👆 如需修改, 请编辑 .env 文件: API_BASE_URL, API_KEY, API_MODEL`);
});

export default app;