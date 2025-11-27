<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Moon, Sun } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { ConverterCard } from '@/features/converter'

const isDark = ref(false)

const toggleDark = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  const saved = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  isDark.value = saved ? saved === 'dark' : prefersDark
  document.documentElement.classList.toggle('dark', isDark.value)
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-cyan-50 dark:from-stone-950 dark:via-gray-900 dark:to-cyan-950 transition-colors duration-300">
    <!-- Header -->
    <header class="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div class="container mx-auto px-4 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-700 to-cyan-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
            <span class="text-xl">📜</span>
          </div>
          <div>
            <h1 class="font-bold text-lg">
              <span class="text-amber-800 dark:text-amber-400">我们不说</span><span class="text-cyan-600 dark:text-cyan-400">包的</span>
            </h1>
            <p class="text-xs text-muted-foreground">古风雅韵 ↔ 网络潮语</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            @click="toggleDark"
            class="rounded-full"
          >
            <Sun v-if="isDark" class="h-5 w-5" />
            <Moon v-else class="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 pt-24 pb-16">
      <!-- Hero Section -->
      <div class="text-center mb-12 space-y-4">
        <h2 class="text-4xl md:text-5xl font-bold tracking-tight">
          <span class="text-amber-800 dark:text-amber-400">
            古韵新声
          </span>
          <span class="text-cyan-600 dark:text-cyan-400">
            · 雅俗共赏
          </span>
        </h2>
        <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
          输入网络热梗，化作古风雅韵；输入传统成语，秒变潮流表达。
          <br class="hidden sm:block" />
          古今对话，妙趣横生。
        </p>
      </div>

      <!-- Converter Card -->
      <ConverterCard />

    </main>

    <!-- Footer -->
    <footer class="border-t border-border/40 py-6">
      <div class="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p><span class="text-amber-700 dark:text-amber-400">我们不说包的</span> - <span class="text-cyan-600 dark:text-cyan-400">让语言穿越古今</span></p>
      </div>
    </footer>
  </div>
</template>
