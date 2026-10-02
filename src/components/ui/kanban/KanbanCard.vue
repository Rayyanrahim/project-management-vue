<script setup lang="ts">
import { AlignLeft, Calendar, Ellipsis, Flag, UserRound } from '@lucide/vue'
import type { KanbanCardItem, KanbanPriority } from './types'

const props = defineProps<{
  item: KanbanCardItem
  dragging?: boolean
}>()

const emit = defineEmits<{
  dragstart: [itemId: string, event: DragEvent]
  dragend: []
}>()

const priorityFlagClass: Record<KanbanPriority, string> = {
  urgent: 'text-priority-urgent',
  high: 'text-priority-high',
  normal: 'text-priority-normal',
  low: 'text-priority-low',
  none: 'text-priority-none',
}

const priorityLabel: Record<KanbanPriority, string> = {
  urgent: 'Urgent',
  high: 'High',
  normal: 'Normal',
  low: 'Low',
  none: '',
}

function onDragStart(event: DragEvent) {
  if (!event.dataTransfer) return
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', props.item.id)
  emit('dragstart', props.item.id, event)
}
</script>

<template>
  <article
    draggable="true"
    class="group cursor-grab rounded-lg border border-table-border bg-white px-3 py-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-shadow active:cursor-grabbing"
    :class="dragging ? 'opacity-50 ring-2 ring-primary/30' : 'hover:shadow-[0_2px_8px_rgba(15,23,42,0.08)]'"
    @dragstart="onDragStart"
    @dragend="emit('dragend')"
  >
    <div class="flex items-start justify-between gap-2">
      <p class="min-w-0 flex-1 text-[13px] font-semibold leading-5 text-table-title">
        {{ item.title }}
      </p>
      <button
        type="button"
        class="inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-md text-table-icon opacity-0 transition-opacity hover:bg-table-head-hover hover:text-app-black group-hover:opacity-100"
        aria-label="Card options"
        @click.stop
      >
        <Ellipsis class="h-3.5 w-3.5" />
      </button>
    </div>

    <div v-if="item.meta?.hasDescription || item.meta?.tags" class="mt-1.5 flex items-center gap-1 text-table-icon">
      <AlignLeft v-if="item.meta?.hasDescription" class="h-3.5 w-3.5" />
    </div>

    <div class="mt-2 flex flex-wrap items-center gap-1.5">
      <span
        v-if="item.assignee"
        class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#7c4dff] text-[10px] font-semibold text-white"
      >
        {{ item.assignee }}
      </span>
      <UserRound v-else class="h-4 w-4 text-table-icon" />

      <span
        v-if="item.dueDate"
        class="inline-flex items-center gap-1 rounded-md border border-table-border bg-white px-1.5 py-0.5"
      >
        <Calendar class="h-3 w-3 text-table-icon" />
        <span class="text-[11px] font-medium text-danger">{{ item.dueDate }}</span>
      </span>

      <span
        v-if="item.priority && item.priority !== 'none'"
        class="inline-flex items-center gap-1 rounded-md border border-table-border bg-white px-1.5 py-0.5"
      >
        <Flag
          class="h-3 w-3"
          :class="priorityFlagClass[item.priority]"
          fill="currentColor"
        />
        <span class="text-[11px] font-medium text-table-muted">
          {{ priorityLabel[item.priority] }}
        </span>
      </span>
    </div>
  </article>
</template>
