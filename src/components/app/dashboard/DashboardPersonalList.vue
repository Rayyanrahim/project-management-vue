<script setup lang="ts">
import { Plus } from '@lucide/vue'
import type { DashboardPersonalItem } from './types'

defineProps<{
  items: DashboardPersonalItem[]
}>()
</script>

<template>
  <section class="flex min-h-[280px] flex-col overflow-hidden rounded-xl border border-border-default bg-white">
    <div class="flex items-center justify-between px-4 py-3">
      <h2 class="text-[15px] font-semibold text-app-black">Personal List</h2>
      <button
        type="button"
        class="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-para transition-colors hover:bg-[#f3f3f3] hover:text-app-black"
        aria-label="Add task"
      >
        <Plus class="h-4 w-4" />
      </button>
    </div>

    <div class="border-t border-[#f0f0f0] px-2 py-2">
      <div class="px-2 pb-1.5 text-[12px] font-semibold text-para">Tasks</div>

      <ul>
        <li
          v-for="item in items"
          :key="item.id"
          class="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-[#f7f7f7]"
        >
          <span
            class="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border"
            :class="
              item.done
                ? 'border-[#30a46c] bg-[#30a46c]'
                : 'border-[#cfcfcf] bg-white'
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
            class="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#30a46c] text-[9px] font-bold text-white"
          >
            R
          </span>
        </li>
      </ul>

      <button
        type="button"
        class="mt-1 flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-left text-[13px] text-para transition-colors hover:bg-[#f7f7f7] hover:text-app-black"
      >
        <Plus class="h-3.5 w-3.5" />
        Add Task
      </button>
    </div>
  </section>
</template>
