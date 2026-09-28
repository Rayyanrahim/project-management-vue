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
        'grid h-8 items-center border-b-[1.5px] border-table-border px-4 text-[12px] font-medium text-table-head',
        props.class,
      )
    "
    :style="{ gridTemplateColumns: columns }"
  >
    <slot />
  </div>
</template>
