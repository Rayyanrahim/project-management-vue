<template>
  <div class="app-dashboard">
    <AppPageHeader>
      <div class="my-auto flex min-w-0 items-center gap-2 text-[15px]">
        <RouterLink
          v-if="space"
          :to="{ name: 'Space', params: { spaceId: space.id } }"
          class="truncate text-para transition-colors hover:text-app-black"
        >
          {{ space.name }}
        </RouterLink>
        <span v-if="space && project" class="text-para">/</span>
        <span class="truncate font-semibold text-app-black">
          {{ project?.name ?? 'Project' }}
        </span>
      </div>
    </AppPageHeader>

    <div class="min-h-0 flex-1 overflow-y-auto bg-page-bg">
      <div class="mx-auto flex w-full flex-col gap-4 px-4 py-5">
        <h1 class="text-[22px] font-semibold tracking-tight text-app-black sm:text-[24px]">
          {{ project?.name ?? 'Project' }}
        </h1>
        <p class="text-[14px] text-para">
          Project board / tasks will show here. Route is ready for backend data later.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppPageHeader from '@/components/app/AppPageHeader.vue'
import { findProject, findSpace } from '@/data/spaces'

const route = useRoute()

const spaceId = computed(() => String(route.params.spaceId ?? ''))
const projectId = computed(() => String(route.params.projectId ?? ''))

const space = computed(() => findSpace(spaceId.value))
const project = computed(() => findProject(spaceId.value, projectId.value))
</script>
