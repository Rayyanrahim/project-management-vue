<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { ChevronLeft, Ellipsis, Plus } from '@lucide/vue'
import { StatusBadge } from '@/components/ui/status-badge'
import {
  KANBAN_ADD_BUTTON_COLOR,
  KANBAN_COLUMN_FOOTER_TINT,
  KANBAN_COLUMN_TINT,
  KANBAN_DEFAULT_ADD_BUTTON_COLOR,
  KANBAN_DEFAULT_FOOTER,
  KANBAN_DEFAULT_TINT,
} from './theme'
import type { KanbanCardItem, KanbanColumn } from './types'
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
  'column-dragover': [columnId: string | null]
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

const addButtonStyle = computed(() => {
  const color = props.column.status
    ? KANBAN_ADD_BUTTON_COLOR[props.column.status]
    : KANBAN_DEFAULT_ADD_BUTTON_COLOR
  return { '--add-button-color': color } as Record<string, string>
})

/* ── Pointer drag (same pattern as reference) ── */
const dragging = ref(false)
const dragEl = ref<HTMLElement | null>(null)
const dragTask = ref<KanbanCardItem | null>(null)
const offset = ref({ x: 0, y: 0 })
let placeholderEl: HTMLElement | null = null
let lastOverColumnId: string | null = null

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return false
  return !!target.closest('button, a, input, textarea, select, [data-no-drag]')
}

function findOverColumnId(clientX: number, clientY: number) {
  const els = document.elementsFromPoint?.(clientX, clientY) || []
  for (const el of els) {
    if (!(el instanceof Element)) continue
    const column = el.closest('[data-kanban-column-id]')
    if (column) return column.getAttribute('data-kanban-column-id')
  }
  return null
}

function setOverColumn(columnId: string | null) {
  if (columnId === lastOverColumnId) return
  emit('column-dragover', columnId)
  lastOverColumnId = columnId
}

function cleanupPointerDrag(options?: { emitEnd?: boolean }) {
  const emitEnd = options?.emitEnd !== false

  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerup', onUp)
  window.removeEventListener('pointercancel', onUp)

  placeholderEl?.remove()
  placeholderEl = null

  if (dragEl.value) {
    dragEl.value.classList.remove('kanban-card-floating')
    dragEl.value.style.position = ''
    dragEl.value.style.left = ''
    dragEl.value.style.top = ''
    dragEl.value.style.width = ''
    dragEl.value.style.zIndex = ''
    dragEl.value.style.pointerEvents = ''
    dragEl.value.style.opacity = ''
    dragEl.value.style.transform = ''
    dragEl.value.style.boxShadow = ''
  }

  document.body.style.userSelect = ''
  document.body.style.cursor = ''

  dragging.value = false
  dragEl.value = null
  dragTask.value = null
  setOverColumn(null)

  if (emitEnd) emit('item-dragend')
}

function startPointerDrag(e: PointerEvent, task: KanbanCardItem) {
  if (e.button != null && e.button !== 0) return
  if (isInteractiveTarget(e.target)) return
  if (!task?.id) return

  e.preventDefault()

  const el = e.currentTarget
  if (!(el instanceof HTMLElement)) return
  const r = el.getBoundingClientRect()

  dragging.value = true
  dragTask.value = task
  emit('item-dragstart', task.id, props.column.id)

  dragEl.value = el
  offset.value = { x: e.clientX - r.left, y: e.clientY - r.top }

  placeholderEl = document.createElement('div')
  placeholderEl.className = 'kanban-card-placeholder'
  placeholderEl.style.height = `${Math.round(r.height)}px`
  placeholderEl.style.width = `${Math.round(r.width)}px`

  const placeholderClone = el.cloneNode(true) as HTMLElement
  placeholderClone.style.opacity = '0.75'
  placeholderClone.style.pointerEvents = 'none'
  placeholderClone.style.width = '100%'
  placeholderClone.style.height = '100%'
  placeholderEl.appendChild(placeholderClone)
  el.insertAdjacentElement('afterend', placeholderEl)

  el.classList.add('kanban-card-floating')
  el.style.position = 'fixed'
  el.style.left = `${Math.round(r.left)}px`
  el.style.top = `${Math.round(r.top)}px`
  el.style.width = `${Math.round(r.width)}px`
  el.style.zIndex = '99999'
  el.style.pointerEvents = 'none'
  el.style.opacity = '1'
  el.style.transform = 'rotate(3deg)'
  el.style.boxShadow = '0 18px 45px rgba(15, 23, 42, 0.28)'

  document.body.style.userSelect = 'none'
  document.body.style.cursor = 'grabbing'

  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('pointerup', onUp)
  window.addEventListener('pointercancel', onUp)

  setOverColumn(findOverColumnId(e.clientX, e.clientY))
}

function onMove(e: PointerEvent) {
  if (!dragging.value || !dragEl.value) return
  dragEl.value.style.left = `${Math.round(e.clientX - offset.value.x)}px`
  dragEl.value.style.top = `${Math.round(e.clientY - offset.value.y)}px`
  setOverColumn(findOverColumnId(e.clientX, e.clientY))
}

function onUp(e: PointerEvent) {
  const over = findOverColumnId(e.clientX, e.clientY)
  const taskId = dragTask.value?.id
  const shouldDrop = !!(taskId && over && over !== props.column.id)

  // Restore DOM first, then drop (board still has drag state), then clear
  cleanupPointerDrag({ emitEnd: false })
  if (shouldDrop && over) emit('item-drop', over)
  else emit('item-dragend')
}

onBeforeUnmount(cleanupPointerDrag)
</script>

<template>
  <section
    class="flex max-h-full w-[280px] shrink-0 flex-col self-start rounded-xl"
    :class="tintClass"
    :style="addButtonStyle"
    :data-kanban-column-id="column.id"
  >
    <header class="flex items-center gap-1.5 px-2.5 pt-2.5 pb-2">
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

    <div v-show="!collapsed" class="flex flex-col overflow-y-auto pb-2">
      <div class="flex flex-col gap-2 px-2">
        <div
          v-if="dropActive && draggingItemId"
          class="h-[72px] shrink-0 rounded-lg bg-white"
          aria-hidden="true"
        />

        <div v-if="column.items.length" class="flex flex-col gap-2">
          <div
            v-for="item in column.items"
            :key="item.id"
            class="kanban-card-draggable cursor-grab touch-none active:cursor-grabbing"
            :class="{ 'is-dragging': draggingItemId === item.id }"
            :data-task-id="item.id"
            @pointerdown="startPointerDrag($event, item)"
          >
            <KanbanCard
              :item="item"
              :dragging="draggingItemId === item.id"
            />
          </div>
        </div>

        <button
          type="button"
          class="kanban-add-task flex h-8 w-full cursor-pointer items-center gap-1 rounded-md px-2 text-[12px] font-medium transition-colors"
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
