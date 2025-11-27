<template>
  <div class="w-full max-w-2xl mx-auto p-6">
    <Card>
      <CardHeader>
        <CardTitle class="text-2xl font-bold text-center">
          网络用语 ↔ 成语 转换器
        </CardTitle>
        <CardDescription class="text-center">
          输入网络用语或成语，AI帮您转换为对应的表达
        </CardDescription>
      </CardHeader>

      <CardContent class="space-y-6">
        <!-- Input Section -->
        <div class="space-y-4">
          <div class="space-y-2">
            <Label for="input-text">输入内容</Label>
            <Textarea
              id="input-text"
              v-model="inputText"
              placeholder="请输入网络用语或成语..."
              class="min-h-[100px]"
              :disabled="isLoading"
            />
          </div>

          <!-- Conversion Options -->
          <div class="flex gap-4 justify-center">
            <Button
              @click="convertToIdiom"
              :disabled="isLoading || !inputText.trim()"
              class="flex-1"
            >
              <ArrowRight class="w-4 h-4 mr-2" />
              转为成语
            </Button>
            <Button
              @click="convertToSlang"
              :disabled="isLoading || !inputText.trim()"
              variant="outline"
              class="flex-1"
            >
              转为网络用语
              <ArrowRight class="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        <!-- Result Section -->
        <div v-if="result || isLoading" class="space-y-4">
          <div class="h-px bg-border" />

          <div class="space-y-2">
            <Label>转换结果</Label>
            <div class="min-h-[100px] p-4 bg-muted rounded-lg border">
              <div v-if="isLoading" class="flex items-center justify-center py-8">
                <Loader2 class="w-6 h-6 animate-spin mr-2" />
                <span class="text-muted-foreground">正在转换中...</span>
              </div>
              <div
                v-else-if="result"
                class="whitespace-pre-wrap text-base leading-relaxed"
              >
                {{ result }}
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div v-if="result && !isLoading" class="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              @click="copyToClipboard"
            >
              <Copy class="w-4 h-4 mr-2" />
              复制结果
            </Button>
            <Button
              variant="outline"
              size="sm"
              @click="clearAll"
            >
              <RotateCcw class="w-4 h-4 mr-2" />
              清空
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowRight, Copy, RotateCcw, Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useLocalAPI } from './useLocalAPI'

const { convertSlang, convertIdiom, isLoading } = useLocalAPI()
const showMessage = ref(false)
const messageText = ref('')
const messageType = ref<'success' | 'error' | 'info'>('info')

const inputText = ref('')
const result = ref('')

const convertToIdiom = async () => {
  if (!inputText.value.trim()) return

  try {
    result.value = await convertSlang(inputText.value.trim())
  } catch (error) {
    result.value = '转换失败，请检查网络连接或稍后重试'
  }
}

const convertToSlang = async () => {
  if (!inputText.value.trim()) return

  try {
    result.value = await convertIdiom(inputText.value.trim())
  } catch (error) {
    result.value = '转换失败，请检查网络连接或稍后重试'
  }
}

const copyToClipboard = async () => {
  if (!result.value) return

  try {
    await navigator.clipboard.writeText(result.value)
    // Temporary feedback - could be replaced with proper notification later
    showMessage.value = true
    messageText.value = '已复制到剪贴板'
    messageType.value = 'success'
    setTimeout(() => showMessage.value = false, 2000)
  } catch (error) {
    showMessage.value = true
    messageText.value = '复制失败，请手动复制'
    messageType.value = 'error'
    setTimeout(() => showMessage.value = false, 2000)
  }
}

const clearAll = () => {
  inputText.value = ''
  result.value = ''
}
</script>