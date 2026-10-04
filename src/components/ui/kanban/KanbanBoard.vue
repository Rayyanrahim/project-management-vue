<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import type { KanbanColumn, KanbanMovePayload } from './types'
import KanbanColumnView from './KanbanColumn.vue'

const columns = defineModel<KanbanColumn[]>('columns', { required: true })

const emit = defineEmits<{
  move: [payload: KanbanMovePayload]
  'add-item': [columnId: string]
  'add-group': []
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

function onColumnDragOver(columnId: string | null) {
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
  <div class="min-h-0 flex-1 overflow-x-auto overflow-y-hidden">
    <div class="flex h-full w-max min-w-full items-start gap-3 px-3 py-3">
      <KanbanColumnView
        v-for="column in columns"
        :key="column.id"
        :column="column"
        :dragging-item-id="draggingItemId"
        :drop-active="
          !!dropTargetColumnId &&
          dropTargetColumnId === column.id &&
          dragFromColumnId !== column.id
        "
        @item-dragstart="onItemDragStart"
        @item-dragend="onItemDragEnd"
        @item-drop="onItemDrop"
        @column-dragover="onColumnDragOver"
        @add-item="emit('add-item', $event)"
      />
      <slot name="after-columns">
        <div class="w-[280px] shrink-0">
          <Button
            variant="ghost"
            size="md"
            class="h-7 gap-1 px-2 text-[13px] font-medium text-table-muted"
            @click="emit('add-group')"
          >
            <Plus class="h-3.5 w-3.5" stroke-width="2.5" />
            Add group
          </Button>
        </div>
      </slot>
    </div>
  </div>
</template>
