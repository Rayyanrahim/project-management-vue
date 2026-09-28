<script setup lang="ts">
import { Plus } from '@lucide/vue'
import { Card, CardActions, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IconButton } from '@/components/ui/icon-button'
import type { DashboardPersonalItem } from './types'

defineProps<{
  items: DashboardPersonalItem[]
}>()
</script>

<template>
  <Card class="flex min-h-[280px] flex-col">
    <CardHeader :bordered="false">
      <CardTitle>Personal List</CardTitle>
      <CardActions>
        <IconButton variant="ghost" class="hover:bg-surface-hover" aria-label="Add task">
          <Plus class="h-4 w-4" />
        </IconButton>
      </CardActions>
    </CardHeader>

    <CardContent class="min-h-0 flex-1 border-t border-table-border px-2 py-2">
      <div class="px-2 pb-1.5 text-[12px] font-semibold text-para">Tasks</div>

      <ul>
        <li
          v-for="item in items"
          :key="item.id"
          class="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-row-hover"
        >
          <span
            class="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border"
            :class="
              item.done
                ? 'border-success-bright bg-success-bright'
                : 'border-priority-none bg-white'
            "
          >
            <span v-if="item.done" class="h-1.5 w-1.5 rounded-full bg-white" />
          </span>
          <span
            class="min-w-0 flex-1 truncate text-[13px] leading-5"
            :class="item.done ? 'text-para line-through' : 'text-app-black'"
          >
            {{ item.title }}
          </span>
          <span
            class="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success-bright text-[9px] font-bold text-white"
          >
            R
          </span>
        </li>
      </ul>

      <button
        type="button"
        class="mt-1 flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-left text-[13px] text-para transition-colors hover:bg-row-hover hover:text-app-black"
      >
        <Plus class="h-3.5 w-3.5" />
        Add Task
      </button>
    </CardContent>
  </Card>
</template>
