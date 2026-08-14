<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  label?: string
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div :class="cn(label ? 'flex items-center gap-3' : 'h-px bg-gray-200', props.class)" role="separator">
    <template v-if="label">
      <div class="h-px flex-1 bg-gray-200" />
      <span class="text-sm text-gray-500">{{ label }}</span>
      <div class="h-px flex-1 bg-gray-200" />
    </template>
  </div>
</template>
