<script setup lang="ts">
import { inject, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { TABLE_GRID_KEY } from './table-context'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const columns = inject(TABLE_GRID_KEY)
</script>

<template>
  <div
    :class="
      cn(
        'grid cursor-pointer items-center border-b border-table-border px-4 transition-colors hover:bg-table-hover',
        props.class,
      )
    "
    :style="{ gridTemplateColumns: columns }"
  >
    <slot />
  </div>
</template>
