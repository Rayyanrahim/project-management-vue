<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import {
  AlignLeft,
  Check,
  CheckCircle2,
  Flag,
  Paperclip,
  Play,
  Plus,
  Search,
  X,
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
import { Card, CardActions, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IconButton } from '@/components/ui/icon-button'
import { Input } from '@/components/ui/input'
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
const searchOpen = ref(false)
const searchQuery = ref('')
const searchInputRef = useTemplateRef<{ focus: () => void }>('searchInput')
const searchWrapRef = useTemplateRef<HTMLElement>('searchWrap')

const priorityOrder: Record<DashboardWorkItem['priority'], number> = {
  urgent: 4,
  high: 3,
  normal: 2,
  low: 1,
  none: 0,
}

function parseDue(value: string) {
  const normalized = value.toLowerCase()

  if (normalized === 'today') {
    return Date.now()
  }

  if (normalized === 'tomorrow') {
    return Date.now() + 86_400_000
  }

  const parts = value.split('/')
  if (parts.length === 3) {
    const [month, day, year] = parts.map(Number)
    return new Date(2000 + year, month - 1, day).getTime()
  }

  return 0
}

function matchesSearch(item: DashboardWorkItem) {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return true
  return item.title.toLowerCase().includes(query)
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
  const completed = props.items.filter((item) => item.status === 'done' && matchesSearch(item))
  const active = props.items.filter((item) => item.status !== 'done' && matchesSearch(item))

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

async function openSearch() {
  searchOpen.value = true
  await nextTick()
  searchInputRef.value?.focus()
}

function closeSearch() {
  searchOpen.value = false
  searchQuery.value = ''
}

function onSearchKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeSearch()
  }
}

function onDocumentPointerDown(event: PointerEvent) {
  if (!searchOpen.value) return
  const target = event.target as Node | null
  if (target && searchWrapRef.value?.contains(target)) return
  closeSearch()
}

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointerDown)
})

onUnmounted(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown)
})

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
  <Card>
    <CardHeader>
      <CardTitle>Assigned to me</CardTitle>
      <CardActions>
        <IconButton variant="ghost" aria-label="Filter">
          <Plus class="h-4 w-4" />
        </IconButton>
        <IconButton variant="ghost" aria-label="Closed tasks">
          <CheckCircle2 class="h-4 w-4" />
        </IconButton>

        <Transition name="my-work-search">
          <div
            v-if="searchOpen"
            ref="searchWrap"
            class="my-work-search flex h-6 w-[180px] shrink-0 items-center gap-1.5 overflow-hidden rounded-md border border-primary bg-white px-2.5 shadow-[0_0_0_2px_color-mix(in_srgb,var(--color-primary)_18%,transparent)]"
          >
            <Search class="h-3.5 w-3.5 shrink-0 text-primary" />
            <Input
              ref="searchInput"
              v-model="searchQuery"
              type="search"
              placeholder="Search..."
              class="h-auto min-w-0 flex-1 rounded-none border-0 bg-transparent p-0 text-[13px] text-app-black shadow-none outline-none ring-0 placeholder:text-para focus:rounded-none focus:outline-none focus:ring-0"
              @keydown="onSearchKeydown"
            />
            <button
              type="button"
              class="inline-flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center text-para hover:text-app-black"
              aria-label="Close search"
              @click="closeSearch"
            >
              <X class="h-3 w-3" />
            </button>
          </div>
        </Transition>
        <IconButton
          v-show="!searchOpen"
          variant="ghost"
          aria-label="Search"
          @click="openSearch"
        >
          <Search class="h-4 w-4" />
        </IconButton>
      </CardActions>
    </CardHeader>

    <CardContent class="max-h-[28rem] overflow-y-auto">
      <div v-for="group in groups" :key="group.id" class="relative">
        <button
          type="button"
          class="sticky top-0 z-20 flex w-full cursor-pointer items-center gap-2 bg-white px-4 py-2 text-left hover:bg-table-hover"
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
          <TableHeader class="sticky top-9 z-10 bg-white">
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
                    class="inline-flex max-w-full items-center truncate rounded-full px-1.5  text-[12px] font-normal leading-4"
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
    </CardContent>
  </Card>
</template>

<style scoped>
.my-work-search-enter-active,
.my-work-search-leave-active {
  transition:
    width 180ms cubic-bezier(0.2, 0, 0, 1),
    opacity 150ms ease,
    transform 180ms cubic-bezier(0.2, 0, 0, 1);
  transform-origin: right center;
}

.my-work-search-enter-from,
.my-work-search-leave-to {
  width: 0 !important;
  opacity: 0;
  transform: scaleX(0.85);
  padding-left: 0;
  padding-right: 0;
  border-width: 0;
  box-shadow: none;
}

.my-work-search-enter-to,
.my-work-search-leave-from {
  width: 180px;
  opacity: 1;
  transform: scaleX(1);
}
</style>
