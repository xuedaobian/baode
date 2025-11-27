import { ref } from 'vue'

// 动态获取 API 地址，支持局域网访问
const API_URL = `http://${window.location.hostname}:3001`

export function useConverter() {
  const isLoading = ref(false)

  const callAPI = async (input: string, type: 'toIdiom' | 'toSlang'): Promise<string> => {
    isLoading.value = true

    try {
      const response = await fetch(`${API_URL}/api/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, type })
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.details || err.error || '服务器响应异常')
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || '转换失败')
      }

      return data.result
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : '未知错误'
      throw new Error(message)
    } finally {
      isLoading.value = false
    }
  }

  const convertSlang = (input: string) => callAPI(input, 'toIdiom')
  const convertIdiom = (input: string) => callAPI(input, 'toSlang')

  return { convertSlang, convertIdiom, isLoading }
}