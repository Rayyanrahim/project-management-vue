<script setup lang="ts">
import { CircleDot } from '@lucide/vue'
import type { DashboardRecentItem } from './types'

defineProps<{
  items: DashboardRecentItem[]
}>()
</script>

<template>
  <section
    class="flex min-h-[280px] flex-col overflow-hidden rounded-xl border border-border-default bg-white"
  >
    <div class="px-4 py-3">
      <h2 class="text-[15px] font-semibold text-app-black">Recents</h2>
    </div>

    <ul class="min-h-0 flex-1 overflow-y-auto px-1 pb-2">
      <li v-for="item in items" :key="item.id">
        <button
          type="button"
          class="flex w-full min-w-0 cursor-pointer items-center gap-2 overflow-hidden rounded-md px-3 py-1.5 text-left transition-colors hover:bg-surface-hover"
        >
          <CircleDot class="h-3.5 w-3.5 shrink-0 text-icon-subtle" />

          <span class="min-w-0 flex-1 truncate text-[13px] leading-5">
            <span class="font-medium text-app-black">{{ item.title }}</span>
            <span v-if="item.subtitle" class="text-para">
              &nbsp;• in {{ item.subtitle }}
            </span>
          </span>
        </button>
      </li>
    </ul>
  </section>
</template>
