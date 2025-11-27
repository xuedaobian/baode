import type { VercelRequest, VercelResponse } from '@vercel/node'
import OpenAI from 'openai'

const API_CONFIG = {
  baseURL: process.env.API_BASE_URL || 'https://openrouter.ai/api/v1',
  apiKey: process.env.API_KEY || '',
  model: process.env.API_MODEL || 'deepseek/deepseek-chat-v2.1:free',
}

const openai = new OpenAI({
  baseURL: API_CONFIG.baseURL,
  apiKey: API_CONFIG.apiKey,
})

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { input, type } = req.body

    if (!input || !type) {
      return res.status(400).json({
        error: '缺少必要参数：input 和 type',
      })
    }

    const messages = type === 'toIdiom'
      ? [
          {
            role: 'system' as const,
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
            role: 'user' as const,
            content: `「${input}」`
          }
        ]
      : [
          {
            role: 'system' as const,
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
            role: 'user' as const,
            content: `「${input}」`
          }
        ]

    const response = await openai.chat.completions.create({
      model: API_CONFIG.model,
      messages: messages,
      max_tokens: 500,
      temperature: 0.3
    })

    const result = response.choices[0]?.message?.content || '转换失败'

    return res.status(200).json({
      success: true,
      result,
      type,
      input
    })

  } catch (error) {
    console.error('API error:', error)
    return res.status(500).json({
      error: '转换失败',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
