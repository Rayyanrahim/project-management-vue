<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  AlignLeft,
  CalendarPlus,
  Ellipsis,
  Flag,
  MessageSquare,
  Paperclip,
  Play,
  Plus,
  UserRound,
} from '@lucide/vue'
import type { Space, SpaceProject } from '@/data/spaces'
import {
  getProjectStatusGroups,
  type SpaceTask,
  type SpaceTaskPriority,
  type SpaceTaskStatus,
} from '@/data/space-tasks'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { IconButton } from '@/components/ui/icon-button'
import {
  STATUS_BADGE_META,
  StatusBadge,
  StatusBadgeIcon,
  type StatusBadgeStatus,
} from '@/components/ui/status-badge'
import { Tag } from '@/components/ui/tag'
import {
  Table,
  TableAddRow,
  TableBody,
  TableCell,
  TableDrag,
  TableDragGroup,
  TableHead,
  TableRow,
  applyTableDragMove,
  type TableDragMovePayload,
  type TableSortDirection,
} from '@/components/ui/table'
import { KANBAN_COLUMN_FOOTER_TINT, KANBAN_DEFAULT_FOOTER } from '@/components/ui/kanban/theme'

const props = defineProps<{
  space: Space
  project: SpaceProject
}>()

type SortKey = 'name' | 'assignee' | 'due' | 'priority'

const sortKey = ref<SortKey>('name')
const sortDir = ref<TableSortDirection>('asc')

/** Project list order — active work first, then backlog / done */
const STATUS_ORDER: StatusBadgeStatus[] = [
  'in-progress',
  'todo',
  'open',
  'paused',
  'qa',
  'pending-review',
  'blocked',
  'qa-rejected',
  'cancelled',
  'closed',
  'completed',
]

const priorityOrder: Record<SpaceTaskPriority, number> = {
  urgent: 4,
  high: 3,
  normal: 2,
  low: 1,
  none: 0,
}

const priorityFlagClass: Record<SpaceTaskPriority, string> = {
  urgent: 'text-priority-urgent',
  high: 'text-priority-high',
  normal: 'text-priority-normal',
  low: 'text-priority-low',
  none: 'text-priority-none',
}

const priorityLabel: Record<SpaceTaskPriority, string> = {
  urgent: 'Urgent',
  high: 'High',
  normal: 'Normal',
  low: 'Low',
  none: '',
}

function parseDue(value: string | null | undefined) {
  if (!value) return 0
  const normalized = value.toLowerCase()

  if (normalized === 'today') return Date.now()
  if (normalized === 'tomorrow') return Date.now() + 86_400_000

  const slashParts = value.split('/')
  if (slashParts.length === 3) {
    const [month, day, year] = slashParts.map(Number)
    if (month && day && year != null) {
      return new Date(2000 + year, month - 1, day).getTime()
    }
  }

  const parsed = Date.parse(value)
  return Number.isNaN(parsed) ? 0 : parsed
}

function sortTasks(tasks: SpaceTask[]) {
  const dir = sortDir.value === 'asc' ? 1 : -1

  return [...tasks].sort((a, b) => {
    let compare = 0

    if (sortKey.value === 'name') {
      compare = a.title.localeCompare(b.title)
    } else if (sortKey.value === 'assignee') {
      compare = (a.assignee ?? '').localeCompare(b.assignee ?? '')
    } else if (sortKey.value === 'priority') {
      compare = priorityOrder[a.priority] - priorityOrder[b.priority]
    } else {
      compare = parseDue(a.dueDate) - parseDue(b.dueDate)
    }

    return compare * dir
  })
}

function countClass(status: SpaceTaskStatus) {
  return KANBAN_COLUMN_FOOTER_TINT[status] ?? KANBAN_DEFAULT_FOOTER
}

type ProjectStatusGroup = {
  id: StatusBadgeStatus
  label: string
  tasks: SpaceTask[]
}

function loadGroups(spaceId: string, projectId: string): ProjectStatusGroup[] {
  const existing = getProjectStatusGroups(spaceId, projectId)
  const byId = new Map(existing.map((group) => [group.id, group]))

  return STATUS_ORDER.map((id) => {
    const group = byId.get(id)
    return {
      id,
      label: STATUS_BADGE_META[id].label,
      tasks: sortTasks(group?.tasks ?? []),
    }
  })
}

const groups = ref<ProjectStatusGroup[]>(loadGroups(props.space.id, props.project.id))

const defaultOpenIds = computed(() =>
  groups.value.filter((group) => group.tasks.length > 0).map((group) => group.id),
)

const openGroups = ref<string[]>([...defaultOpenIds.value])

watch(
  () => `${props.space.id}:${props.project.id}`,
  () => {
    groups.value = loadGroups(props.space.id, props.project.id)
    openGroups.value = [...defaultOpenIds.value]
  },
)

const TABLE_COLUMNS = 'minmax(220px, 1.4fr) 110px 110px 110px 150px 72px'

function isGroupOpen(groupId: string) {
  return openGroups.value.includes(groupId)
}

function toggleSort(key: SortKey) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'desc' ? 'asc' : 'desc'
  } else {
    sortKey.value = key
    sortDir.value = 'desc'
  }

  groups.value = groups.value.map((group) => ({
    ...group,
    tasks: sortTasks(group.tasks),
  }))
}

function directionFor(key: SortKey): TableSortDirection | false {
  return sortKey.value === key ? sortDir.value : false
}

function onMove(payload: TableDragMovePayload) {
  applyTableDragMove(
    groups.value.map((group) => ({ id: group.id, items: group.tasks })),
    payload,
  )

  if (!openGroups.value.includes(payload.toGroupId)) {
    openGroups.value = [...openGroups.value, payload.toGroupId]
  }
}

let expandTimer: ReturnType<typeof setTimeout> | null = null

function onGroupHover(groupId: string) {
  if (openGroups.value.includes(groupId)) {
    if (expandTimer != null) {
      clearTimeout(expandTimer)
      expandTimer = null
    }
    return
  }

  if (expandTimer != null) clearTimeout(expandTimer)
  expandTimer = setTimeout(() => {
    expandTimer = null
    if (!openGroups.value.includes(groupId)) {
      openGroups.value = [...openGroups.value, groupId]
    }
  }, 350)
}
</script>

<template>
  <TableDrag
    class="mt-2 min-h-0 flex-1 overflow-auto bg-white px-1 sm:px-2"
    @move="onMove"
    @group-hover="onGroupHover"
  >
    <Accordion
      :key="`${space.id}:${project.id}`"
      v-model="openGroups"
      type="multiple"
      class="pb-4"
    >
      <TableDragGroup
        v-for="group in groups"
        :key="group.id"
        :group-id="group.id"
        :item-count="group.tasks.length"
      >
        <AccordionItem
          :value="group.id"
          class="relative"
        >
        <!-- Status + column headers stick together so rows never bleed above -->
        <div class="sticky top-0 z-20 bg-white">
          <AccordionTrigger
            class="group/header flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left hover:bg-table-hover"
          >
            <template #default="{ open }">
              <span
                class="inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-md text-table-muted transition-colors hover:bg-table-head-hover"
                aria-hidden="true"
              >
                <Play
                  class="h-2.5 w-2.5 fill-current transition-transform"
                  :class="open ? 'rotate-90' : ''"
                />
              </span>

              <StatusBadge
                :status="group.id"
                :label="group.label"
                class="cursor-pointer"
              />

              <span
                class="text-[12px] font-semibold"
                :class="countClass(group.id)"
              >
                {{ group.tasks.length }}
              </span>

              <div class="ml-auto flex items-center gap-0.5 opacity-0 transition-opacity group-hover/header:opacity-100">
                <IconButton
                  as="span"
                  variant="ghost"
                  size="sm"
                  class="h-6 w-6"
                  ariaLabel="Status options"
                  @click.stop
                >
                  <Ellipsis class="h-4 w-4 text-para" />
                </IconButton>
                <IconButton
                  as="span"
                  variant="ghost"
                  size="sm"
                  class="h-6 w-6"
                  ariaLabel="Add task"
                  @click.stop
                >
                  <Plus class="h-4 w-4 text-para" stroke-width="2.5" />
                </IconButton>
              </div>
            </template>
          </AccordionTrigger>

          <div
            v-show="isGroupOpen(group.id)"
            class="grid h-8 items-center border-b-[1.5px] border-table-border px-4 text-[12px] font-medium text-table-head"
            :style="{ gridTemplateColumns: TABLE_COLUMNS }"
          >
            <TableHead
              sortable
              :sort-direction="directionFor('name')"
              @click="toggleSort('name')"
            >
              Name
            </TableHead>
            <TableHead
              sortable
              :sort-direction="directionFor('assignee')"
              @click="toggleSort('assignee')"
            >
              Assignee
            </TableHead>
            <TableHead
              sortable
              :sort-direction="directionFor('due')"
              @click="toggleSort('due')"
            >
              Due date
            </TableHead>
            <TableHead
              sortable
              :sort-direction="directionFor('priority')"
              @click="toggleSort('priority')"
            >
              Priority
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Comments</TableHead>
          </div>
        </div>

        <AccordionContent class="relative z-0">
          <Table :columns="TABLE_COLUMNS">
            <TableBody>
              <TableRow
                v-for="(task, index) in group.tasks"
                :key="task.id"
                :drag-id="task.id"
                :drag-index="index"
              >
                <TableCell class="group/name flex items-center gap-2 overflow-hidden px-0 py-2.5 pr-1">
                  <button
                    type="button"
                    class="inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-md border-none bg-transparent text-table-muted opacity-0 transition-colors hover:bg-table-head-hover group-hover/name:opacity-100"
                    title="Create subtask"
                    aria-label="Create subtask"
                    @click.stop
                  >
                    <Play class="h-2.5 w-2.5 fill-current" />
                  </button>

                  <StatusBadgeIcon
                    :kind="STATUS_BADGE_META[group.id].icon"
                    :check-on-badge-class="STATUS_BADGE_META[group.id].checkOnBadgeClass"
                    :check-row-bg-class="STATUS_BADGE_META[group.id].checkRowBgClass"
                    :class="`h-4 w-4 ${STATUS_BADGE_META[group.id].rowIconClass}`"
                  />

                  <span class="min-w-0 truncate text-[13px] font-semibold leading-5 text-table-title">
                    {{ task.title }}
                  </span>

                  <span class="flex shrink-0 items-center gap-1 text-table-icon">
                    <AlignLeft v-if="task.hasDescription" class="h-3.5 w-3.5" />
                    <Paperclip v-if="task.hasAttachment" class="h-3.5 w-3.5" />
                  </span>

                  <span
                    v-if="task.tags?.length"
                    class="flex min-w-0 shrink items-center gap-1 overflow-hidden"
                  >
                    <Tag v-for="tag in task.tags" :key="tag.label" :tone="tag.tone">
                      {{ tag.label }}
                    </Tag>
                  </span>
                </TableCell>

                <TableCell class="flex items-center gap-1.5">
                  <span
                    v-if="task.assignee"
                    class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-app-black text-[10px] font-semibold text-white"
                  >
                    {{ task.assignee }}
                  </span>
                  <UserRound v-else class="h-4 w-4 shrink-0 text-table-icon" />
                </TableCell>

                <TableCell class="flex items-center">
                  <span
                    v-if="task.dueDate"
                    class="truncate text-sm font-medium text-para"
                  >
                    {{ task.dueDate }}
                  </span>
                  <CalendarPlus v-else class="h-4 w-4 text-table-icon" />
                </TableCell>

                <TableCell class="flex items-center gap-1.5">
                  <Flag
                    class="h-4 w-4 shrink-0"
                    :class="priorityFlagClass[task.priority]"
                    :fill="task.priority === 'none' ? 'none' : 'currentColor'"
                  />
                  <span
                    v-if="priorityLabel[task.priority]"
                    class="truncate text-sm text-table-head"
                  >
                    {{ priorityLabel[task.priority] }}
                  </span>
                </TableCell>

                <TableCell class="flex items-center">
                  <StatusBadge :status="group.id" :label="group.label" />
                </TableCell>

                <TableCell class="flex items-center">
                  <MessageSquare class="h-4 w-4 text-table-icon" />
                </TableCell>
              </TableRow>
            </TableBody>

            <TableAddRow />
          </Table>
        </AccordionContent>
        </AccordionItem>
      </TableDragGroup>
    </Accordion>
  </TableDrag>
</template>
