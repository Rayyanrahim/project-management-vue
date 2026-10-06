<script setup lang="ts">
import { computed, inject, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { TABLE_GRID_KEY } from './table-context'
import { TABLE_DRAG_GROUP_KEY, TABLE_DRAG_KEY } from './table-drag'
import TableDropLine from './TableDropLine.vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
  draggable?: boolean | 'true' | 'false'
  /** Enable HTML5 row drag when used inside TableDrag + TableDragGroup */
  dragId?: string
  dragIndex?: number
}>()

const columns = inject(TABLE_GRID_KEY)
const drag = inject(TABLE_DRAG_KEY, null)
const dragGroup = inject(TABLE_DRAG_GROUP_KEY, null)

const dragEnabled = computed(
  () => !!(drag && dragGroup && props.dragId != null && props.dragIndex != null),
)

const nativeDraggable = computed(() => {
  if (dragEnabled.value) return 'true'
  if (props.draggable === true || props.draggable === 'true') return 'true'
  return undefined
})

const showDropLineBefore = computed(() => {
  if (!dragEnabled.value || !drag || !dragGroup || props.dragIndex == null) return false
  return drag.isDropLineAt(dragGroup.id.value, props.dragIndex)
})

const isDragging = computed(() => {
  if (!dragEnabled.value || !drag || !props.dragId) return false
  return drag.isDragging(props.dragId)
})

function onDragStart(e: DragEvent) {
  if (!dragEnabled.value || !drag || !dragGroup || !props.dragId || props.dragIndex == null) return
  drag.onRowDragStart(e, props.dragId, dragGroup.id.value, props.dragIndex)
}

function onDragOver(e: DragEvent) {
  if (!dragEnabled.value || !drag || !dragGroup || props.dragIndex == null) return
  drag.onRowDragOver(e, dragGroup.id.value, props.dragIndex)
}
</script>

<template>
  <div>
    <TableDropLine v-if="showDropLineBefore" />
    <div
      :draggable="nativeDraggable"
      :data-table-drag-id="dragId"
      :class="
        cn(
          'grid cursor-pointer items-center border-b border-table-border px-4 transition-colors hover:bg-table-hover',
          isDragging ? 'opacity-40' : '',
          props.class,
        )
      "
      :style="{ gridTemplateColumns: columns }"
      @dragstart="onDragStart"
      @dragover="onDragOver"
      @drop="drag?.onDrop($event)"
      @dragend="drag?.onDragEnd()"
    >
      <slot />
    </div>
  </div>
</template>
