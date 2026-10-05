<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  KanbanBoard,
  type KanbanCardItem,
  type KanbanColumnData,
  type KanbanMovePayload,
} from '@/components/ui/kanban'
import type { Space, SpaceProject } from '@/data/spaces'
import {
  getProjectStatusGroups,
  type SpaceTaskStatus,
} from '@/data/space-tasks'
import { STATUS_BADGE_META } from '@/components/ui/status-badge'

const props = defineProps<{
  space: Space
  project: SpaceProject
}>()

const emit = defineEmits<{
  move: [payload: KanbanMovePayload]
  'add-task': [columnId: string]
  'add-group': []
}>()

/** Project board — all statuses including TO DO */
const ORDER: SpaceTaskStatus[] = [
  'open',
  'todo',
  'in-progress',
  'paused',
  'qa',
  'pending-review',
  'blocked',
  'qa-rejected',
  'cancelled',
  'closed',
  'completed',
]

function toColumns(spaceId: string, projectId: string): KanbanColumnData[] {
  const existing = getProjectStatusGroups(spaceId, projectId)
  const byId = new Map(existing.map((group) => [group.id, group]))

  return ORDER.map((id) => {
    const group = byId.get(id)
    const items: KanbanCardItem[] = (group?.tasks ?? []).map((task) => ({
      id: task.id,
      title: task.title,
      assignee: task.assignee,
      dueDate: task.dueDate,
      priority: task.priority,
      meta: {
        projectId: task.projectId,
        tags: task.tags,
        hasDescription: task.hasDescription,
      },
    }))

    return {
      id,
      label: STATUS_BADGE_META[id].label,
      status: id,
      items,
    }
  })
}

const columns = ref<KanbanColumnData[]>(
  toColumns(props.space.id, props.project.id),
)

watch(
  () => [props.space.id, props.project.id] as const,
  ([spaceId, projectId]) => {
    columns.value = toColumns(spaceId, projectId)
  },
)

function onMove(payload: KanbanMovePayload) {
  emit('move', payload)
}

function onAddItem(columnId: string) {
  emit('add-task', columnId)

  const target = columns.value.find((column) => column.id === columnId)
  if (!target) return

  target.items.push({
    id: `local-${columnId}-${Date.now()}`,
    title: 'New task',
    priority: 'none',
    meta: { projectId: props.project.id },
  })
}

function onAddGroup() {
  emit('add-group')
}
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
    <KanbanBoard
      v-model:columns="columns"
      @move="onMove"
      @add-item="onAddItem"
      @add-group="onAddGroup"
    />
  </div>
</template>
