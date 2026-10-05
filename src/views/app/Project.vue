<template>
  <div class="app-dashboard">
    <template v-if="space && project">
      <Tabs v-model="activeView" class="flex min-h-0 flex-1 flex-col">
        <AppPageHeader class="items-start pb-0">
          <div class="mt-1 flex w-full min-w-0 flex-1 flex-col gap-0">
            <!-- Row 1: Space / Project ★ …… Share -->
            <div class="flex h-9 w-full items-center justify-between gap-2">
              <div class="flex min-w-0 items-center gap-1">
                <component
                  :is="project.icon ?? space.icon"
                  class="h-4 w-4 shrink-0 text-para"
                />

                <RouterLink
                  :to="{ name: 'Space', params: { view: 'l', spaceId: space.id } }"
                  class="truncate text-[14px] font-medium text-para transition-colors hover:text-app-black"
                >
                  {{ space.name }}
                </RouterLink>
                <span class="shrink-0 text-[14px] text-para">/</span>

                <span class="truncate text-[14px] font-semibold text-app-black">
                  {{ project.name }}
                </span>

                <button
                  type="button"
                  class="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-para transition-colors hover:bg-surface-hover hover:text-app-black"
                  aria-label="Favorite"
                >
                  <Star class="h-3.5 w-3.5" />
                </button>
              </div>

              <Button
                variant="ghost"
                size="md"
                class="h-7 shrink-0 gap-1.5 px-2.5 text-sm text-para"
              >
                <Share2 class="h-3.5 w-3.5" />
                Share
              </Button>
            </div>

            <!-- Row 2: List | Board -->
            <div class="flex h-8 w-full items-stretch">
              <TabsList class="flex h-full min-w-0 items-stretch gap-0.5 overflow-x-auto">
                <TabsTrigger
                  v-for="tab in viewTabs"
                  :key="tab.id"
                  :value="tab.id"
                  size="sm"
                  class="h-full min-h-0 py-0"
                  inner-class="gap-1.5 px-2 py-1 text-[12px] font-medium leading-none"
                >
                  <img :src="tab.icon" alt="" aria-hidden="true" class="h-3.5 w-3.5 shrink-0" />
                  {{ tab.label }}
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
        </AppPageHeader>

        <div class="mt-2 flex h-9 items-center justify-end gap-2 px-3">
          <div class="flex shrink-0 items-center gap-0.5">
            <IconButton variant="ghost" size="sm" class="h-6 w-6" ariaLabel="Search">
              <Search class="h-3.5 w-3.5" />
            </IconButton>
            <Button class="ml-0.5 h-6 gap-0.5 rounded-md px-2 text-[12px] font-medium leading-none">
              <Plus class="h-3 w-3" stroke-width="2.5" />
              Task
            </Button>
          </div>
        </div>

        <TabsContent value="list" class="flex min-h-0 flex-1 flex-col">
          <ProjectListView :space="space" :project="project" />
        </TabsContent>

        <TabsContent value="board" class="flex min-h-0 flex-1 flex-col overflow-hidden">
          <ProjectKanbanBoard :space="space" :project="project" />
        </TabsContent>
      </Tabs>
    </template>

    <template v-else>
      <AppPageHeader>
        <span class="my-auto text-[15px] font-semibold text-app-black">Project</span>
      </AppPageHeader>
      <div class="flex flex-1 items-center justify-center ">
        <p class="text-[14px] text-para">Project not found.</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Plus, Search, Share2, Star } from '@lucide/vue'
import { useRoute, useRouter } from 'vue-router'
import AppPageHeader from '@/components/app/AppPageHeader.vue'
import ProjectKanbanBoard from '@/components/app/projects/ProjectKanbanBoard.vue'
import ProjectListView from '@/components/app/projects/ProjectListView.vue'
import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import viewBoardIcon from '@/assets/svg/view-board.svg'
import viewListIcon from '@/assets/svg/view-list.svg'
import { findProject, findSpace } from '@/data/spaces'

const route = useRoute()
const router = useRouter()

const spaceId = computed(() => String(route.params.spaceId ?? ''))
const projectId = computed(() => String(route.params.projectId ?? ''))

const space = computed(() => findSpace(spaceId.value))
const project = computed(() => findProject(spaceId.value, projectId.value))

/** Route: .../l = list, .../b = board */
const activeView = computed({
  get() {
    return route.params.view === 'b' ? 'board' : 'list'
  },
  set(view: string) {
    if (!spaceId.value || !projectId.value) return
    void router.push({
      name: 'Project',
      params: {
        spaceId: spaceId.value,
        projectId: projectId.value,
        view: view === 'board' ? 'b' : 'l',
      },
    })
  },
})

const viewTabs = [
  { id: 'list', label: 'List', icon: viewListIcon },
  { id: 'board', label: 'Board', icon: viewBoardIcon },
]
</script>
