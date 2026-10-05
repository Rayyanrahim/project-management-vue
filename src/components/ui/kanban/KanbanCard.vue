<script setup lang="ts">
import { AlignLeft, Ellipsis, UserRound } from '@lucide/vue'
import { Card } from '@/components/ui/card'
import { DueDateBadge, PriorityBadge } from '@/components/ui/meta-badge'
import type { KanbanCardItem } from './types'

defineProps<{
  item: KanbanCardItem
  dragging?: boolean
}>()
</script>

<template>
  <Card
    class="rounded-lg border-table-border px-3 py-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-shadow"
    :class="
      dragging
        ? 'shadow-none'
        : 'group hover:shadow-[0_2px_8px_rgba(15,23,42,0.08)]'
    "
  >
    <div class="flex items-start justify-between gap-2">
      <p class="min-w-0 flex-1 text-[13px] font-semibold leading-5 text-table-title">
        {{ item.title }}
      </p>
      <button
        type="button"
        data-no-drag
        class="inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-md text-table-icon opacity-0 transition-opacity hover:bg-table-head-hover hover:text-app-black group-hover:opacity-100"
        aria-label="Card options"
        @click.stop
      >
        <Ellipsis class="h-3.5 w-3.5" />
      </button>
    </div>

    <div
      v-if="item.meta?.hasDescription || item.meta?.tags"
      class="mt-1.5 flex items-center gap-1 text-table-icon"
    >
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

      <DueDateBadge v-if="item.dueDate" :date="item.dueDate" />
      <PriorityBadge v-if="item.priority" :priority="item.priority" />
    </div>
  </Card>
</template>
