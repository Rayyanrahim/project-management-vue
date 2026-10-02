<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  AlignLeft,
  Ellipsis,
  Flag,
  Paperclip,
  Play,
  UserRound,
} from '@lucide/vue'
import type { Space } from '@/data/spaces'
import {
  getProjectStatusGroups,
  type SpaceTask,
  type SpaceTaskPriority,
} from '@/data/space-tasks'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card } from '@/components/ui/card'
import { IconButton } from '@/components/ui/icon-button'
import {
  STATUS_BADGE_META,
  StatusBadge,
  StatusBadgeIcon,
} from '@/components/ui/status-badge'
import { Tag } from '@/components/ui/tag'
import {
  Table,
  TableAddRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  type TableSortDirection,
} from '@/components/ui/table'

const props = defineProps<{
  space: Space
}>()

type SortKey = 'name' | 'assignee' | 'due' | 'priority'

const sortKey = ref<SortKey>('name')
const sortDir = ref<TableSortDirection>('asc')

const projectIds = computed(() => props.space.projects.map((project) => project.id))

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

function groupsFor(projectId: string) {
  return getProjectStatusGroups(props.space.id, projectId)
    .filter((group) => group.id !== 'todo')
    .map((group) => ({
      ...group,
      tasks: sortTasks(group.tasks),
    }))
}

function groupIdsFor(projectId: string) {
  return groupsFor(projectId).map((group) => `${projectId}:${group.id}`)
}

function toggleSort(key: SortKey) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'desc' ? 'asc' : 'desc'
    return
  }

  sortKey.value = key
  sortDir.value = 'desc'
}

function directionFor(key: SortKey): TableSortDirection | false {
  return sortKey.value === key ? sortDir.value : false
}
</script>

<template>
  <div class="min-h-0 flex-1 overflow-auto px-3 py-3 sm:px-4">
    <Accordion type="multiple" :default-value="projectIds" class="space-y-3">
      <Card
        v-for="project in space.projects"
        :key="project.id"
        class="border-l-[3px] border-l-amber-300 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
      >
        <AccordionItem :value="project.id">
          <div class="px-4 pt-3 pb-0.5">
            <p class="text-[12px] font-medium text-para">{{ space.name }}</p>
          </div>

          <AccordionTrigger
            class="group flex w-full cursor-pointer items-center gap-2 px-4 pt-2 mb-8 text-left hover:bg-table-hover"
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
              <span class="min-w-0 flex-1 truncate text-[14px] font-semibold text-app-black">
                {{ project.name }}
              </span>
              <IconButton
                as="span"
                variant="ghost"
                size="sm"
                class="h-6 w-6 opacity-0 group-hover:opacity-100"
                ariaLabel="Project options"
                @click.stop
              >
                <Ellipsis class="h-4 w-4 text-para" />
              </IconButton>
            </template>
          </AccordionTrigger>

          <AccordionContent>
            <Accordion
              type="multiple"
              :default-value="groupIdsFor(project.id)"
              class="pb-2"
            >
              <AccordionItem
                v-for="group in groupsFor(project.id)"
                :key="`${project.id}:${group.id}`"
                :value="`${project.id}:${group.id}`"
              >
                <AccordionTrigger
                  class="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left hover:bg-table-hover"
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

                    <span class="text-[12px] font-semibold text-table-muted">
                      {{ group.tasks.length }}
                    </span>
                  </template>
                </AccordionTrigger>

                <AccordionContent>
                  <Table columns="minmax(0, 1fr) 120px 110px 110px">
                    <TableHeader class="bg-white">
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
                    </TableHeader>

                    <TableBody>
                      <TableRow v-for="task in group.tasks" :key="task.id">
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

                        <TableCell
                          class="truncate text-sm"
                          :class="task.dueDate ? 'font-medium text-success' : 'text-table-icon'"
                        >
                          {{ task.dueDate || '—' }}
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
                      </TableRow>
                    </TableBody>

                    <TableAddRow />
                  </Table>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </AccordionContent>
        </AccordionItem>
      </Card>
    </Accordion>
  </div>
</template>
