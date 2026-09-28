<script setup lang="ts">
import { computed, provide, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { TABLE_GRID_KEY } from './table-context'

const props = withDefaults(
  defineProps<{
    /** CSS grid-template-columns value */
    columns?: string
    class?: HTMLAttributes['class']
  }>(),
  {
    columns: 'minmax(0, 1fr) 120px 110px 36px',
  },
)

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
