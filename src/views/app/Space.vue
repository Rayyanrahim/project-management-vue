<template>
  <div class="app-dashboard">
    <AppPageHeader>
      <span class="text-[15px] font-semibold text-app-black">{{ space?.name ?? 'Space' }}</span>
    </AppPageHeader>

    <div class="min-h-0 flex-1 overflow-y-auto bg-page-bg">
      <div class="mx-auto flex w-full flex-col gap-4 px-4 py-5">
        <h1 class="text-[22px] font-semibold tracking-tight text-app-black sm:text-[24px]">
          {{ space?.name ?? 'Space' }}
        </h1>
        <p class="text-[14px] text-para">
          Projects in this space will show here. Data is static for now.
        </p>

        <ul v-if="space?.projects.length" class="space-y-2">
          <li v-for="project in space.projects" :key="project.id">
            <RouterLink
              :to="{
                name: 'Project',
                params: { spaceId: space.id, projectId: project.id },
              }"
              class="flex items-center gap-2 rounded-lg border border-border-default bg-white px-3 py-2 text-[14px] text-app-black transition-colors hover:bg-surface-hover"
            >
              <component :is="project.icon ?? ListTodo" class="h-4 w-4 text-para" />
              {{ project.name }}
            </RouterLink>
          </li>
        </ul>

        <p v-else class="text-[14px] text-para">No projects in this space yet.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ListTodo } from '@lucide/vue'
import { useRoute } from 'vue-router'
import AppPageHeader from '@/components/app/AppPageHeader.vue'
import { findSpace } from '@/data/spaces'

const route = useRoute()

const space = computed(() => {
  const spaceId = String(route.params.spaceId ?? '')
  return findSpace(spaceId)
})
</script>
