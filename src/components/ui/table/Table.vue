<script setup lang="ts">
import { computed, provide, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { TABLE_GRID_KEY } from './table-context'

const props = defineProps<{
  columns?: string
  class?: HTMLAttributes['class']
}>()

provide(
  TABLE_GRID_KEY,
  computed(() => props.columns),
)
</script>

<template>
  <div :class="cn('w-full', props.class)">
    <slot />
  </div>
</template>
