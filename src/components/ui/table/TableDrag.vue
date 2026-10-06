<script setup lang="ts">
import { provide, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { TABLE_DRAG_KEY, type TableDragMovePayload } from './table-drag'
import { createTableDrag } from './use-table-drag'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const emit = defineEmits<{
  move: [payload: TableDragMovePayload]
  'group-hover': [groupId: string]
}>()

const drag = createTableDrag({
  onMove: (payload) => emit('move', payload),
  onGroupHover: (groupId) => emit('group-hover', groupId),
})

provide(TABLE_DRAG_KEY, drag)
</script>

<template>
  <div :class="cn(props.class)" @dragover="drag.onRootDragOver">
    <slot />
  </div>
</template>

<style>
html.table-is-dragging,
html.table-is-dragging * {
  cursor: grabbing !important;
}
</style>
