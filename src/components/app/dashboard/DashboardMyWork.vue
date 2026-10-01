<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import {
  AlignLeft,
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { IconButton } from '@/components/ui/icon-button'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon } from '@/components/ui/input-group'
import { Tag } from '@/components/ui/tag'
import {
  STATUS_BADGE_META,
  STATUS_BADGE_ORDER,
  StatusBadge,
  StatusBadgeIcon,
  type StatusBadgeOverrides,
  type StatusBadgeStatus,
} from '@/components/ui/status-badge'
import type { DashboardStatus, DashboardWorkItem } from './types'

const props = withDefaults(
  defineProps<{
    items: DashboardWorkItem[]
    /** Optional per-status customization (label, icon, colors, class) */
    statusOverrides?: Partial<Record<StatusBadgeStatus, StatusBadgeOverrides>>
    /** Custom group order; defaults to STATUS_BADGE_ORDER */
    statusOrder?: StatusBadgeStatus[]
  }>(),
  {
    statusOverrides: () => ({}),
    statusOrder: () => [...STATUS_BADGE_ORDER],
  },
)

/** Map dashboard task statuses → shared StatusBadge statuses (customize here if needed) */
const DASHBOARD_STATUS_MAP: Record<DashboardStatus, StatusBadgeStatus> = {
  todo: 'in-progress',
  in_progress: 'in-progress',
  review: 'pending-review',
  done: 'completed',
  overdue: 'blocked',
}

function toBadgeStatus(status: DashboardStatus): StatusBadgeStatus {
  return DASHBOARD_STATUS_MAP[status]
}

function metaFor(status: StatusBadgeStatus) {
  const base = STATUS_BADGE_META[status]
  const overrides = props.statusOverrides?.[status]
  if (!overrides) return base
  return { ...base, ...overrides }
}

type SortKey = 'name' | 'priority' | 'due'

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
  const byStatus = new Map<StatusBadgeStatus, DashboardWorkItem[]>()

  for (const item of props.items) {
    if (!matchesSearch(item)) continue
    const status = toBadgeStatus(item.status)
    const list = byStatus.get(status) ?? []
    list.push(item)
    byStatus.set(status, list)
  }

  return props.statusOrder
    .filter((status) => (byStatus.get(status)?.length ?? 0) > 0)
    .map((status) => ({
      id: status,
      status,
      items: sortItems(byStatus.get(status) ?? []),
      overrides: props.statusOverrides?.[status],
    }))
})

const defaultOpenGroups = computed(() => groups.value.map((group) => group.id))

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
            class="my-work-search w-[180px] shrink-0"
          >
            <InputGroup class="h-6 w-full">
              <Input
                ref="searchInput"
                v-model="searchQuery"
                type="search"
                placeholder="Search..."
                @keydown="onSearchKeydown"
              />
              <InputGroupAddon class="text-primary">
                <Search />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <button
                  type="button"
                  class="inline-flex h-4 w-4 cursor-pointer items-center justify-center text-para transition-colors hover:text-app-black"
                  aria-label="Close search"
                  @click="closeSearch"
                >
                  <X class="h-3 w-3" />
                </button>
              </InputGroupAddon>
            </InputGroup>
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
      <Accordion type="multiple" :default-value="defaultOpenGroups">
        <AccordionItem
          v-for="group in groups"
          :key="group.id"
          :value="group.id"
          class="relative"
        >
          <AccordionTrigger
            class="sticky top-0 z-20 flex w-full cursor-pointer items-center gap-2 bg-white px-4 pt-5 pb-2 text-left hover:bg-table-hover"
          >
            <template #default="{ open }">
              <span
                class="inline-block h-0 w-0 shrink-0 border-x-[3.5px] border-x-transparent border-t-[5px] border-t-table-head transition-transform"
                :class="open ? '' : '-rotate-90'"
                aria-hidden="true"
              />

              <StatusBadge
                :status="group.status"
                :overrides="group.overrides"
              />

              <span class="text-[12px] font-semibold text-table-muted">{{ group.items.length }}</span>
            </template>
          </AccordionTrigger>

          <AccordionContent>
            <Table columns="minmax(0, 1fr) 120px 110px">
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
              </TableHeader>

              <TableBody>
                <TableRow v-for="item in group.items" :key="item.id">
                  <TableCell class="group/name flex items-center gap-2 overflow-hidden px-0 py-2.5 pr-1">
                    <button
                      type="button"
                      class="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-none bg-transparent text-table-muted opacity-0 transition-colors hover:bg-table-head-hover group-hover/name:opacity-100"
                      title="Create subtask"
                      aria-label="Create subtask"
                      @click.stop
                    >
                      <Play class="h-2 w-2 fill-current" />
                    </button>

                    <StatusBadgeIcon
                      :kind="metaFor(group.status).icon"
                      :check-on-badge-class="metaFor(group.status).checkOnBadgeClass"
                      :check-row-bg-class="metaFor(group.status).checkRowBgClass"
                      :class="`h-4 w-4 ${metaFor(group.status).rowIconClass}`"
                    />

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
                      <Tag v-for="tag in item.tags" :key="tag.label" :tone="tag.tone">
                        {{ tag.label }}
                      </Tag>
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
                </TableRow>
              </TableBody>

              <TableAddRow />
            </Table>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
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
