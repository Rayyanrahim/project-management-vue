<template>
  <div class="app-dashboard">
    <template v-if="space">
      <Tabs v-model="activeView" class="flex min-h-0 flex-1 flex-col">
        <AppPageHeader class="items-start pb-0">
          <div class="mt-1.5 flex w-full min-w-0 flex-1 flex-col">
            <div class="flex h-9 w-full items-center justify-between gap-2">
              <div class="flex min-w-0 items-center gap-1.5">
                <component :is="space.icon" class="h-4 w-4 shrink-0 text-para" />
                <span class="truncate text-[15px] font-semibold text-app-black">
                  {{ space.name }}
                </span>
                <Star class="h-3.5 w-3.5 shrink-0 text-para" />
              </div>

              <Button variant="ghost" size="md" class="h-7 shrink-0 gap-1.5 px-2.5 text-sm">
                <Share2 class="h-3.5 w-3.5" />
                Share
              </Button>
            </div>

            <div class="flex h-8 w-full items-stretch">
              <TabsList class="flex h-full min-w-0 items-stretch gap-1 overflow-x-auto">
                <TabsTrigger v-for="tab in viewTabs" :key="tab.id" :value="tab.id" size="sm" class="h-full min-h-0 py-0"
                  inner-class="gap-1 px-1.5 py-1 text-[12px] font-medium leading-none">
                  <img :src="tab.icon" alt="" aria-hidden="true" class="h-3.5 w-3.5 shrink-0" />
                  {{ tab.label }}
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
        </AppPageHeader>


        <div class="flex h-9 items-center justify-end gap-2 mt-2 px-3">

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
          <SpaceListView :space="space" />
        </TabsContent>

        <TabsContent v-for="tab in placeholderTabs" :key="tab.id" :value="tab.id" class="flex min-h-0 flex-1 flex-col">
          <div class="flex flex-1 items-center justify-center bg-page-bg px-4">
            <p class="text-[14px] text-para">{{ tab.label }} view coming soon.</p>
          </div>
        </TabsContent>
      </Tabs>
    </template>

    <template v-else>
      <AppPageHeader>
        <span class="my-auto text-[15px] font-semibold text-app-black">Space</span>
      </AppPageHeader>
      <div class="flex flex-1 items-center justify-center bg-page-bg">
        <p class="text-[14px] text-para">Space not found.</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Plus, Rows3, Search, Share2, Star } from '@lucide/vue'
import { useRoute } from 'vue-router'
import AppPageHeader from '@/components/app/AppPageHeader.vue'
import SpaceListView from '@/components/app/spaces/SpaceListView.vue'
import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import viewBoardIcon from '@/assets/svg/view-board.svg'
import viewListIcon from '@/assets/svg/view-list.svg'
import { findSpace } from '@/data/spaces'

const route = useRoute()
const activeView = ref('list')

const space = computed(() => {
  const spaceId = String(route.params.spaceId ?? '')
  return findSpace(spaceId)
})

const viewTabs = [
  { id: 'list', label: 'List', icon: viewListIcon },
  { id: 'board', label: 'Board', icon: viewBoardIcon },
]

const placeholderTabs = viewTabs.filter((tab) => tab.id !== 'list')
</script>
