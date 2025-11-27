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

// CORS 配置
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
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
            content: '你是一个专业的中文语言转换助手，专门负责网络用语和成语之间的转换。请确保回答准确、简洁，并给出适当的解释。'
          },
          {
            role: 'user',
            content: `请将以下网络用语或表达转换为对应的成语或正式表达：

输入内容："${input}"

转换要求：
1. 如果是网络用语，转换为对应的成语或正式表达
2. 如果是成语，保持原样即可
3. 给出简要的含义解释
4. 用中文回复
5. 格式要简洁明了

请按以下格式回复：
转换结果：[转换后的内容]
含义：[简要解释]`
          }
        ]
      : [
          {
            role: 'system',
            content: '你是一个专业的中文语言转换助手，专门负责成语和网络用语之间的转换。请确保回答准确、简洁，并给出适当的解释。'
          },
          {
            role: 'user',
            content: `请将以下成语或正式表达转换为对应的网络用语或流行表达：

输入内容："${input}"

转换要求：
1. 如果是成语，转换为对应的网络用语或现代流行表达
2. 如果是网络用语，保持原样即可
3. 给出简要的含义解释
4. 用中文回复
5. 格式要简洁明了

请按以下格式回复：
转换结果：[转换后的内容]
含义：[简要解释]`
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

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 服务器启动在 http://localhost:${PORT}`);
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