<script setup lang="ts">
import { computed, inject, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { TABLE_DRAG_GROUP_KEY, TABLE_DRAG_KEY } from './table-drag'
import TableDropLine from './TableDropLine.vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const drag = inject(TABLE_DRAG_KEY, null)
const dragGroup = inject(TABLE_DRAG_GROUP_KEY, null)

const showTrailingDropLine = computed(() => {
  if (!drag || !dragGroup) return false
  return drag.isDropLineAt(dragGroup.id.value, dragGroup.itemCount.value)
})
</script>

<template>
  <div :class="cn(props.class)">
    <slot />
    <TableDropLine v-if="showTrailingDropLine" />
  </div>
</template>
