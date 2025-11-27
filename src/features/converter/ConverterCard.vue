<template>
  <div class="w-full max-w-2xl mx-auto">
    <div class="relative">
      <!-- Glow Effect -->
      <div class="absolute -inset-1 bg-gradient-to-r from-amber-500 via-stone-400 to-cyan-500 rounded-3xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity"></div>

      <!-- Card -->
      <div class="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl shadow-amber-500/10 overflow-hidden">
        <!-- Card Header -->
        <div class="p-6 pb-0">
          <div class="flex items-center justify-center gap-3 mb-2">
            <div class="flex items-center gap-2">
              <span class="text-2xl">🔥</span>
              <span class="text-sm font-medium text-muted-foreground">网络用语</span>
            </div>
            <div class="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-cyan-100 dark:from-amber-900/50 dark:to-cyan-900/50">
              <ArrowLeftRight class="w-4 h-4 text-amber-700 dark:text-amber-400" />
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium text-muted-foreground">成语典故</span>
              <span class="text-2xl">📜</span>
            </div>
          </div>
        </div>

        <!-- Card Content -->
        <div class="p-6 space-y-5">
          <!-- Input Section -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <Label for="input-text" class="text-sm font-medium">输入内容</Label>
              <span class="text-xs text-muted-foreground">{{ inputText.length }} 字</span>
            </div>
            <div class="relative">
              <Textarea
                id="input-text"
                v-model="inputText"
                placeholder="在这里输入网络用语或成语..."
                class="min-h-[120px] resize-none bg-gray-50/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-amber-500 focus:ring-amber-500/20 transition-all"
                :disabled="isLoading"
              />
              <div v-if="inputText" class="absolute right-3 bottom-3">
                <Button
                  variant="ghost"
                  size="icon"
                  class="h-7 w-7 text-muted-foreground hover:text-foreground"
                  @click="inputText = ''"
                >
                  <X class="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <!-- Conversion Buttons -->
          <div class="flex gap-3">
            <Button
              @click="convertToIdiom"
              :disabled="isLoading || !inputText.trim()"
              class="flex-1 h-12 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-800 hover:to-amber-700 text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all"
            >
              <Sparkles v-if="!isLoading" class="w-4 h-4 mr-2" />
              <Loader2 v-else class="w-4 h-4 mr-2 animate-spin" />
              转为成语
            </Button>
            <Button
              @click="convertToSlang"
              :disabled="isLoading || !inputText.trim()"
              class="flex-1 h-12 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all"
            >
              <Zap v-if="!isLoading" class="w-4 h-4 mr-2" />
              <Loader2 v-else class="w-4 h-4 mr-2 animate-spin" />
              转为网络用语
            </Button>
          </div>

          <!-- Result Section -->
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <div v-if="result || isLoading || error" class="space-y-3">
              <div class="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <Label class="text-sm font-medium flex items-center gap-2">
                    <Wand2 class="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    转换结果
                  </Label>
                  <span v-if="lastConversion" class="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800">
                    {{ lastConversion === 'idiom' ? '成语' : '网络用语' }}
                  </span>
                </div>

                <!-- Loading State -->
                <div v-if="isLoading" class="min-h-[100px] p-6 bg-gradient-to-br from-amber-50/50 to-cyan-50/50 dark:from-amber-950/30 dark:to-cyan-950/30 rounded-xl border border-amber-100 dark:border-amber-900/50">
                  <div class="flex flex-col items-center justify-center py-4 space-y-3">
                    <div class="relative">
                      <div class="w-12 h-12 rounded-full border-4 border-amber-200 dark:border-amber-800"></div>
                      <div class="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-amber-600 dark:border-amber-400 border-t-transparent animate-spin"></div>
                    </div>
                    <span class="text-sm text-muted-foreground">AI 正在思考中...</span>
                  </div>
                </div>

                <!-- Error State -->
                <div v-else-if="error" class="min-h-[100px] p-4 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-900/50">
                  <div class="flex items-start gap-3">
                    <div class="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center flex-shrink-0">
                      <AlertCircle class="w-4 h-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p class="font-medium text-red-700 dark:text-red-400">转换失败</p>
                      <p class="text-sm text-red-600/80 dark:text-red-400/80 mt-1">{{ error }}</p>
                    </div>
                  </div>
                </div>

                <!-- Result State -->
                <div v-else-if="result" class="min-h-[100px] p-4 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl border border-green-200 dark:border-green-900/50">
                  <div class="flex items-start gap-3">
                    <div class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center flex-shrink-0">
                      <Check class="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <p class="whitespace-pre-wrap text-base leading-relaxed pt-1 flex-1">{{ result }}</p>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div v-if="result && !isLoading" class="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  @click="useAsInput"
                  class="text-xs"
                >
                  <RefreshCw class="w-3.5 h-3.5 mr-1.5" />
                  用作输入
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  @click="copyToClipboard"
                  :class="copied ? 'bg-green-50 border-green-300 text-green-700 dark:bg-green-950 dark:border-green-700 dark:text-green-400' : ''"
                  class="text-xs transition-colors"
                >
                  <Check v-if="copied" class="w-3.5 h-3.5 mr-1.5" />
                  <Copy v-else class="w-3.5 h-3.5 mr-1.5" />
                  {{ copied ? '已复制' : '复制结果' }}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  @click="clearAll"
                  class="text-xs"
                >
                  <Trash2 class="w-3.5 h-3.5 mr-1.5" />
                  清空
                </Button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  ArrowLeftRight,
  Sparkles,
  Zap,
  Loader2,
  Copy,
  Trash2,
  RefreshCw,
  Check,
  X,
  Wand2,
  AlertCircle
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useConverter } from '@/composables/useConverter'

const { convertSlang, convertIdiom, isLoading } = useConverter()

const inputText = ref('')
const result = ref('')
const error = ref('')
const copied = ref(false)
const lastConversion = ref<'idiom' | 'slang' | null>(null)

const convertToIdiom = async () => {
  if (!inputText.value.trim()) return
  error.value = ''

  try {
    result.value = await convertSlang(inputText.value.trim())
    lastConversion.value = 'idiom'
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : '请检查网络连接或稍后重试'
    result.value = ''
  }
}

const convertToSlang = async () => {
  if (!inputText.value.trim()) return
  error.value = ''

  try {
    result.value = await convertIdiom(inputText.value.trim())
    lastConversion.value = 'slang'
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : '请检查网络连接或稍后重试'
    result.value = ''
  }
}

const copyToClipboard = async () => {
  if (!result.value) return

  try {
    await navigator.clipboard.writeText(result.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    error.value = '复制失败，请手动复制'
  }
}

const useAsInput = () => {
  if (!result.value) return
  inputText.value = result.value
  result.value = ''
  lastConversion.value = null
}

const clearAll = () => {
  inputText.value = ''
  result.value = ''
  error.value = ''
  lastConversion.value = null
}
</script>
