<script setup lang="ts">
import { CircleDot } from '@lucide/vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { DashboardRecentItem } from './types'

defineProps<{
  items: DashboardRecentItem[]
}>()
</script>

<template>
  <Card class="flex min-h-[280px] flex-col">
    <CardHeader :bordered="false">
      <CardTitle>Recents</CardTitle>
    </CardHeader>

    <CardContent class="min-h-0 flex-1 overflow-y-auto px-1 pb-2">
      <ul>
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
    </CardContent>
  </Card>
</template>
