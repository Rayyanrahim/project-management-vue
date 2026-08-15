<template>
  <div class="app-section">
    <div class="app-section-heading">
      <h2 class="app-section-title">Recents</h2>

      <Button type="button" variant="outline" size="lg" class="h-9 rounded-xl px-4 text-[12px] text-gray-700">
        All
        <AppIcon name="chevron-down" class="ml-2 h-4 w-4" />
      </Button>
    </div>

    <div class="app-recents-list">
      <div
        v-for="item in items"
        :key="item.title"
        class="flex items-center gap-4 rounded-xl px-6 py-2.5 hover:bg-gray-50"
      >
        <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-gray-500">
          <span class="text-lg">{{ item.emoji }}</span>
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex min-w-0 items-center gap-4">
            <span class="text-[12px] text-gray-500">{{ item.code }}</span>
            <span class="truncate text-[14px] font-medium text-gray-900">{{ item.title }}</span>
            <span class="shrink-0 text-[12px] text-gray-500">{{ item.age }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppIcon from '@/components/app/AppIcon.vue'
import { Button } from '@/components/ui/button'

const items = [
  { emoji: '🗂️', code: 'TESTING-1', title: 'Testing the tasks', age: '3 months ago' },
  { emoji: '🫡', code: 'TESTING', title: 'Testing', age: '3 months ago' },
  { emoji: '📄', code: 'TESTI', title: 'Project Design Spec', age: '3 months ago' },
] as const
</script>
