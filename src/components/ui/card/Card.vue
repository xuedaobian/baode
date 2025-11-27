<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <div :class="cn('rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm', props.class)">
    <slot />
  </div>
</template>
