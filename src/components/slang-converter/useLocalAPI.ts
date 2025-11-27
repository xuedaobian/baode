import { ref } from 'vue'

// 本地服务器配置
const LOCAL_SERVER_URL = 'http://localhost:3001'

export function useLocalAPI() {
  const isLoading = ref(false)

  // 调用本地中转服务器
  const callLocalAPI = async (input: string, type: 'toIdiom' | 'toSlang'): Promise<string> => {
    try {
      isLoading.value = true

      const response = await fetch(`${LOCAL_SERVER_URL}/api/convert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input,
          type
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.details || error.error || 'API调用失败')
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || '转换失败')
      }

      return data.result
    } catch (error) {
      console.error(`Local API ${type} error:`, error)
      throw new Error(`转换失败: ${error.message}`)
    } finally {
      // 关键：确保无论成功还是失败都要重置加载状态
      isLoading.value = false
    }
  }

  const convertSlang = async (input: string): Promise<string> => {
    return await callLocalAPI(input, 'toIdiom')
  }

  const convertIdiom = async (input: string): Promise<string> => {
    return await callLocalAPI(input, 'toSlang')
  }

  return {
    convertSlang,
    convertIdiom,
    isLoading
  }
}