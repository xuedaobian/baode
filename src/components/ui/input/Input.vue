<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: HTMLAttributes['class']
  defaultValue?: string | number
  modelValue?: string | number
}

const props = defineProps<Props>()

const emits = defineEmits<{
  'update:modelValue': [value: string | number]
}>()
</script>

<template>
  <input
    :class="cn(
      'flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      props.class
    )"
    :value="modelValue ?? defaultValue"
    @input="emits('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
