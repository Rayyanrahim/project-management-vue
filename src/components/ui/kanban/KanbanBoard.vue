<script setup lang="ts">
import { ref } from 'vue'
import type { KanbanColumn, KanbanMovePayload } from './types'
import KanbanColumnView from './KanbanColumn.vue'

const columns = defineModel<KanbanColumn[]>('columns', { required: true })

const emit = defineEmits<{
  /** Fired after a successful move — wire to API here */
  move: [payload: KanbanMovePayload]
  /** Fired when user clicks add — parent can create via API then push into columns */
  'add-item': [columnId: string]
}>()

const draggingItemId = ref<string | null>(null)
const dragFromColumnId = ref<string | null>(null)
const dropTargetColumnId = ref<string | null>(null)

function findItem(itemId: string) {
  for (const column of columns.value) {
    const index = column.items.findIndex((item) => item.id === itemId)
    if (index !== -1) {
      return { column, index, item: column.items[index]! }
    }
  }
  return null
}

function onItemDragStart(itemId: string, columnId: string) {
  draggingItemId.value = itemId
  dragFromColumnId.value = columnId
}

function onItemDragEnd() {
  draggingItemId.value = null
  dragFromColumnId.value = null
  dropTargetColumnId.value = null
}

function onColumnDragOver(columnId: string) {
  if (!draggingItemId.value) return
  dropTargetColumnId.value = columnId
}

function onItemDrop(toColumnId: string) {
  const itemId = draggingItemId.value
  const fromColumnId = dragFromColumnId.value
  if (!itemId || !fromColumnId) return

  if (fromColumnId !== toColumnId) {
    const found = findItem(itemId)
    if (found) {
      found.column.items.splice(found.index, 1)
      const target = columns.value.find((column) => column.id === toColumnId)
      if (target) {
        target.items.push(found.item)
        emit('move', {
          taskId: itemId,
          fromColumnId,
          toColumnId,
          item: found.item,
        })
      }
    }
  }

  onItemDragEnd()
}
</script>

<template>
  <!-- Board: no vertical page scroll — only OPEN column scrolls inside itself -->
  <div class="flex min-h-0 flex-1 flex-col overflow-x-auto overflow-y-hidden">
    <div class="flex h-full min-h-0 items-start gap-3 px-3 py-3">
      <KanbanColumnView
        v-for="column in columns"
        :key="column.id"
        :column="column"
        :dragging-item-id="draggingItemId"
        :drop-active="dropTargetColumnId === column.id && dragFromColumnId !== column.id"
        @item-dragstart="onItemDragStart"
        @item-dragend="onItemDragEnd"
        @item-drop="onItemDrop"
        @column-dragover="onColumnDragOver"
        @add-item="emit('add-item', $event)"
      />
      <slot name="after-columns" />
    </div>
  </div>
</template>
