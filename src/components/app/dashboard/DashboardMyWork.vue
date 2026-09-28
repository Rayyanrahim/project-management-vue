<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  AlignLeft,
  Check,
  CheckCircle2,
  Flag,
  Paperclip,
  Play,
  Plus,
  Search,
} from '@lucide/vue'
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
import { IconButton } from '@/components/ui/icon-button'
import type { DashboardStatus, DashboardWorkItem, DashboardWorkTag } from './types'

const props = defineProps<{
  items: DashboardWorkItem[]
}>()

type SortKey = 'name' | 'priority' | 'due'

const openGroups = ref<Record<string, boolean>>({
  done: true,
  active: true,
})

const sortKey = ref<SortKey>('due')
const sortDir = ref<TableSortDirection>('desc')

const priorityOrder: Record<DashboardWorkItem['priority'], number> = {
  urgent: 4,
  high: 3,
  normal: 2,
  low: 1,
  none: 0,
}

function parseDue(value: string) {
  if (value.toLowerCase() === 'today') {
    return Date.now()
  }

  const parts = value.split('/')
  if (parts.length === 3) {
    const [month, day, year] = parts.map(Number)
    return new Date(2000 + year, month - 1, day).getTime()
  }

  return 0
}

function sortItems(items: DashboardWorkItem[]) {
  const dir = sortDir.value === 'asc' ? 1 : -1

  return [...items].sort((a, b) => {
    let compare = 0

    if (sortKey.value === 'name') {
      compare = a.title.localeCompare(b.title)
    } else if (sortKey.value === 'priority') {
      compare = priorityOrder[a.priority] - priorityOrder[b.priority]
    } else {
      compare = parseDue(a.due) - parseDue(b.due)
    }

    return compare * dir
  })
}

const groups = computed(() => {
  const completed = props.items.filter((item) => item.status === 'done')
  const active = props.items.filter((item) => item.status !== 'done')

  return [
    {
      id: 'done',
      label: 'COMPLETED',
      badgeClass: 'bg-success text-white',
      items: sortItems(completed),
    },
    {
      id: 'active',
      label: 'TO DO',
      badgeClass: 'bg-todo-badge-bg text-todo-badge',
      items: sortItems(active),
    },
  ].filter((group) => group.items.length > 0)
})

function toggleGroup(id: string) {
  openGroups.value[id] = !openGroups.value[id]
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

const priorityFlagClass: Record<DashboardWorkItem['priority'], string> = {
  urgent: 'text-priority-urgent',
  high: 'text-priority-high',
  normal: 'text-priority-normal',
  low: 'text-priority-low',
  none: 'text-priority-none',
}

const priorityLabel: Record<DashboardWorkItem['priority'], string> = {
  urgent: 'Urgent',
  high: 'High',
  normal: 'Normal',
  low: 'Low',
  none: '',
}

const tagToneClass: Record<DashboardWorkTag['tone'], string> = {
  magenta: 'bg-tag-magenta text-white',
  green: 'bg-tag-green-bg text-tag-green',
  lavender: 'bg-tag-lavender-bg text-tag-lavender',
  blue: 'bg-tag-blue text-white',
  grey: 'bg-tag-grey-bg text-tag-grey',
}

function isComplete(status: DashboardStatus) {
  return status === 'done'
}
</script>

<template>
  <section class="overflow-hidden rounded-xl border border-border-default bg-white">
    <div
      class="flex min-h-[52px] items-center justify-between gap-2 border-b border-border-default px-4"
    >
      <h2 class="text-[15px] font-semibold text-app-black">Assigned to me</h2>
      <div class="flex shrink-0 items-center gap-0.5">
        <IconButton variant="ghost" aria-label="Filter">
          <Plus class="h-4 w-4" />
        </IconButton>
        <IconButton variant="ghost" aria-label="Closed tasks">
          <CheckCircle2 class="h-4 w-4" />
        </IconButton>
        <IconButton variant="ghost" aria-label="Search">
          <Search class="h-4 w-4" />
        </IconButton>
      </div>
    </div>

    <div class="max-h-[28rem] overflow-y-auto">
      <div v-for="group in groups" :key="group.id">
        <button
          type="button"
          class="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left hover:bg-table-hover"
          @click="toggleGroup(group.id)"
        >
          <span
            class="inline-block h-0 w-0 shrink-0 border-x-[3.5px] border-x-transparent border-t-[5px] border-t-table-head transition-transform"
            :class="openGroups[group.id] ? '' : '-rotate-90'"
            aria-hidden="true"
          />

          <span
            class="inline-flex items-center gap-1.5 rounded-[4px] px-2 py-[3px] text-[11px] font-bold tracking-[0.02em]"
            :class="group.badgeClass"
          >
            <span
              v-if="group.id === 'done'"
              class="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white"
            >
              <Check class="h-2.5 w-2.5 text-success" stroke-width="3.5" />
            </span>
            {{ group.label }}
          </span>

          <span class="text-[12px] text-table-muted">{{ group.items.length }}</span>
        </button>

        <Table v-if="openGroups[group.id]" columns="minmax(0, 1fr) 120px 110px 36px">
          <TableHeader>
            <TableHead
              sortable
              :sort-direction="directionFor('name')"
              @click="toggleSort('name')"
            >
              Name
            </TableHead>
            <TableHead
              sortable
              :sort-direction="directionFor('priority')"
              @click="toggleSort('priority')"
            >
              Priority
            </TableHead>
            <TableHead
              sortable
              :sort-direction="directionFor('due')"
              @click="toggleSort('due')"
            >
              Due date
            </TableHead>
            <button
              type="button"
              class="inline-flex h-6 w-6 cursor-pointer items-center justify-center justify-self-end rounded border-none text-table-muted hover:bg-table-head-hover"
              aria-label="Add column"
              @click.stop
            >
              <Plus class="h-3.5 w-3.5" />
            </button>
          </TableHeader>

          <TableBody>
            <TableRow v-for="item in group.items" :key="item.id">
              <TableCell class="group/name flex items-center gap-1.5 overflow-hidden px-0 py-2.5 pr-1">
                <button
                  type="button"
                  class="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-none bg-transparent text-table-muted opacity-0 transition-colors hover:bg-table-head-hover group-hover/name:opacity-100"
                  title="Create subtask"
                  aria-label="Create subtask"
                  @click.stop
                >
                  <Play class="h-2 w-2 fill-current" />
                </button>

                <span
                  class="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                  :class="
                    isComplete(item.status)
                      ? 'bg-success text-white'
                      : 'border-[1.5px] border-priority-none bg-white'
                  "
                >
                  <Check v-if="isComplete(item.status)" class="h-2.5 w-2.5" stroke-width="3.5" />
                </span>

                <span class="min-w-0 truncate text-[13px] font-semibold leading-5 text-table-title">
                  {{ item.title }}
                </span>

                <span class="flex shrink-0 items-center gap-1 text-table-icon">
                  <AlignLeft v-if="item.hasDescription" class="h-3.5 w-3.5" />
                  <Paperclip v-if="item.hasAttachment" class="h-3.5 w-3.5" />
                </span>

                <span
                  v-if="item.tags?.length"
                  class="flex min-w-0 shrink items-center gap-1 overflow-hidden"
                >
                  <span
                    v-for="tag in item.tags"
                    :key="tag.label"
                    class="inline-flex max-w-full items-center truncate rounded-full px-2.5 py-0.5 text-[11px] font-semibold leading-4"
                    :class="tagToneClass[tag.tone]"
                  >
                    {{ tag.label }}
                  </span>
                </span>

              </TableCell>

              <TableCell class="flex items-center gap-1.5">
                <Flag
                  class="h-4 w-4 shrink-0"
                  :class="priorityFlagClass[item.priority]"
                  :fill="item.priority === 'none' ? 'none' : 'currentColor'"
                />
                <span
                  v-if="priorityLabel[item.priority]"
                  class="truncate text-sm text-table-head"
                >
                  {{ priorityLabel[item.priority] }}
                </span>
              </TableCell>

              <TableCell
                class="truncate text-sm"
                :class="item.status === 'overdue' ? 'font-medium text-danger' : 'text-success'"
              >
                {{ item.due }}
              </TableCell>

              <TableCell />
            </TableRow>
          </TableBody>

          <TableAddRow />
        </Table>
      </div>
    </div>
  </section>
</template>
