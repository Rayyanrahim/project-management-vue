<template>
  <div class="app-section">
    <div class="app-section-heading">
      <h2 class="app-section-title">Quicklinks</h2>
      <button type="button" class="flex items-center gap-2 text-[13px] font-medium text-sky-700 hover:text-sky-800">
        <AppIcon name="plus" class="h-4 w-4" />
        Add quick Link
      </button>
    </div>

    <div class="app-card-grid">
      <Card v-for="item in items" :key="item.title" class="flex items-center gap-4 px-6 py-4">
        <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-gray-500">
          <AppIcon :name="item.icon" class="h-4.5 w-4.5" />
        </div>
        <div>
          <p class="text-[14px] font-semibold text-gray-900">{{ item.title }}</p>
          <p class="mt-1 text-[12px] text-gray-500">{{ item.time }}</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppIcon from '@/components/app/AppIcon.vue'
import { Card } from '@/components/ui/card'

const items = [
  { title: 'Plane Changelog', time: '4 months ago', icon: 'bolt' },
  { title: 'Plane Docs', time: '4 months ago', icon: 'docs' },
  { title: 'Plane Blogs', time: '4 months ago', icon: 'box' },
] as const
</script>
