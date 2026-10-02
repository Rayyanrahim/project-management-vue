<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronLeft, Ellipsis, Plus } from '@lucide/vue'
import { StatusBadge } from '@/components/ui/status-badge'
import {
  KANBAN_COLUMN_FOOTER_TINT,
  KANBAN_COLUMN_TINT,
  KANBAN_DEFAULT_FOOTER,
  KANBAN_DEFAULT_TINT,
} from './theme'
import type { KanbanColumn } from './types'
import KanbanCard from './KanbanCard.vue'

const props = defineProps<{
  column: KanbanColumn
  draggingItemId?: string | null
  dropActive?: boolean
}>()

const emit = defineEmits<{
  'item-dragstart': [itemId: string, columnId: string]
  'item-dragend': []
  'item-drop': [columnId: string]
  'column-dragover': [columnId: string]
  'add-item': [columnId: string]
}>()

const collapsed = ref(false)

const tintClass = computed(() => {
  if (props.column.tintClass) return props.column.tintClass
  if (props.column.status) return KANBAN_COLUMN_TINT[props.column.status]
  return KANBAN_DEFAULT_TINT
})

const footerClass = computed(() => {
  if (props.column.footerClass) return props.column.footerClass
  if (props.column.status) return KANBAN_COLUMN_FOOTER_TINT[props.column.status]
  return KANBAN_DEFAULT_FOOTER
})

function onDragOver(event: DragEvent) {
  event.preventDefault()
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
  emit('column-dragover', props.column.id)
}

function onDrop(event: DragEvent) {
  event.preventDefault()
  emit('item-drop', props.column.id)
}
</script>

<template>
  <section
    class="flex max-h-full w-[280px] shrink-0 flex-col self-start rounded-xl"
    :class="[tintClass, dropActive ? 'ring-2 ring-primary/25' : '']"
    @dragover="onDragOver"
    @drop="onDrop"
  >
    <header class="flex items-center gap-1.5 px-2.5 pt-2.5 pb-1.5">
      <StatusBadge
        v-if="column.status"
        :status="column.status"
        :label="column.label"
      />
      <span
        v-else
        class="inline-flex items-center rounded-[4px] bg-surface-muted px-2 py-0.5 text-[12px] font-semibold text-app-black"
      >
        {{ column.label }}
      </span>
      <span class="text-[12px] font-semibold text-table-muted">{{ column.items.length }}</span>

      <div class="ml-auto flex items-center gap-0.5">
        <button
          type="button"
          class="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-table-muted transition-colors hover:bg-white/70 hover:text-app-black"
          :aria-label="collapsed ? 'Expand column' : 'Collapse column'"
          @click="collapsed = !collapsed"
        >
          <ChevronLeft
            class="h-3.5 w-3.5 transition-transform"
            :class="collapsed ? 'rotate-180' : ''"
          />
        </button>
        <button
          type="button"
          class="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-table-muted transition-colors hover:bg-white/70 hover:text-app-black"
          aria-label="Column options"
          @click.stop
        >
          <Ellipsis class="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          class="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-table-muted transition-colors hover:bg-white/70 hover:text-app-black"
          aria-label="Add item"
          @click.stop="emit('add-item', column.id)"
        >
          <Plus class="h-3.5 w-3.5" stroke-width="2.5" />
        </button>
      </div>
    </header>

    <div v-show="!collapsed" class="flex flex-col overflow-y-auto">
      <div >
        <div v-if="column.items.length" class="flex flex-col gap-2 px-2 py-1 ">
          <KanbanCard
            v-for="item in column.items"
            :key="item.id"
            :item="item"
            :dragging="draggingItemId === item.id"
            @dragstart="(id) => emit('item-dragstart', id, column.id)"
            @dragend="emit('item-dragend')"
          />
        </div>
        <button
            type="button"
            class="mx-2 mb-2 mt-0.5 flex h-8 w-[calc(100%-1rem)] cursor-pointer items-center gap-1 rounded-md px-2 text-[12px] font-medium transition-colors hover:bg-white/60"
            :class="footerClass"
            @click="emit('add-item', column.id)"
          >
            <Plus class="h-3.5 w-3.5" stroke-width="2.5" />
            Add Task
          </button>
      </div>
    </div>
  </section>
</template>
