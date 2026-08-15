<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { sheetContentVariants, type SheetContentVariants } from '.'

const props = defineProps<{
  side?: SheetContentVariants['side']
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div :class="cn(sheetContentVariants({ side }), props.class)">
    <slot />
  </div>
</template>
