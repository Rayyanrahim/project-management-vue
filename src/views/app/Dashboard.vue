<template>
  <div class="app-dashboard">
    <AppPageHeader>
      <div class="flex items-center gap-2 py-3">
        <span class="text-[14px] font-semibold text-app-black">Home</span>
      </div>
    </AppPageHeader>

    <div class="min-h-0 flex-1 overflow-y-auto bg-[#f7f7f8]">
      <div class="mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-4 py-5 sm:px-6">
        <h1 class="text-[22px] font-semibold tracking-tight text-app-black sm:text-[24px]">
          {{ greeting }}, {{ dashboardUser.name }}
        </h1>

        <div class="grid items-stretch gap-4 lg:grid-cols-2">
          <DashboardPersonalList :items="dashboardPersonalList" />
          <DashboardRecents :items="dashboardRecents" />
        </div>

        <DashboardMyWork :items="dashboardMyWork" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppPageHeader from '@/components/app/AppPageHeader.vue'
import {
  DashboardMyWork,
  DashboardPersonalList,
  DashboardRecents,
  dashboardMyWork,
  dashboardPersonalList,
  dashboardRecents,
  dashboardUser,
} from '@/components/app/dashboard'

const greeting = computed(() => {
  const hour = new Date().getHours()

  if (hour < 12) {
    return 'Good morning'
  }

  if (hour < 17) {
    return 'Good afternoon'
  }

  return 'Good evening'
})
</script>
