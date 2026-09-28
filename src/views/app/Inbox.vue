<template>
  <div class="app-dashboard">
    <Tabs v-model="activeTab" class="flex min-h-0 flex-1 flex-col">
      <AppPageHeader>
        <TabsList class="flex min-w-0 overflow-x-auto px-1">
          <template v-for="(tab, index) in inboxTabs" :key="tab.id">
            <TabsTrigger
              :value="tab.id"
              :size="inboxTabSize"
              class="min-w-[250px]"
              inner-class="mx-1 bg-transparent font-medium text-app-black hover:bg-[#f3f3f3]"
            >
              <template #default="{ selected }">
                <component
                  :is="tab.icon"
                  class="h-4 w-4 shrink-0"
                  :class="selected ? 'text-app-black' : 'text-para'"
                />

                <div class="min-w-0 flex min-h-[32px] flex-col justify-center">
                  <div class="text-[14px] font-medium text-app-black">
                    {{ tab.label }}
                  </div>
                  <div
                    class="text-[12px] leading-4 text-para"
                    :class="tab.meta ? '' : 'invisible h-0 leading-none'"
                  >
                    {{ tab.meta || 'placeholder' }}
                  </div>
                </div>
              </template>
            </TabsTrigger>

            <TabsSeparator
              v-if="index < inboxTabs.length - 1"
              inline
              :size="inboxTabSize"
              class="my-auto self-auto bg-[#e6e9ee]"
            />
          </template>
        </TabsList>
      </AppPageHeader>

      <TabsContent value="primary" class="flex min-h-0 flex-1 flex-col">
        <InboxFeed tab="primary" />
      </TabsContent>

      <TabsContent value="other" class="flex min-h-0 flex-1 flex-col">
        <InboxFeed tab="other" />
      </TabsContent>

      <TabsContent value="later" class="flex min-h-0 flex-1 flex-col">
        <InboxFeed tab="later" />
      </TabsContent>

      <TabsContent value="cleared" class="flex min-h-0 flex-1 flex-col">
        <div class="min-h-0 flex-1 overflow-y-auto bg-white">
          <InboxEmptyState />
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Activity, CheckCheck, Clock3, Inbox as InboxIcon } from '@lucide/vue'
import { useRoute, useRouter } from 'vue-router'
import AppPageHeader from '@/components/app/AppPageHeader.vue'
import { InboxEmptyState, InboxFeed } from '@/components/app/inbox'
import { Tabs, TabsContent, TabsList, TabsSeparator, TabsTrigger } from '@/components/ui/tabs'

const inboxTabs = [
  {
    id: 'primary',
    label: 'Primary',
    meta: '79 unread',
    icon: InboxIcon,
  },
  {
    id: 'other',
    label: 'Other',
    meta: '18 unread',
    icon: Activity,
  },
  {
    id: 'later',
    label: 'Later',
    meta: '',
    icon: Clock3,
  },
  {
    id: 'cleared',
    label: 'Cleared',
    meta: '',
    icon: CheckCheck,
  },
] as const

const route = useRoute()
const router = useRouter()
const inboxTabSize = 'md' as const
const inboxTabIds = inboxTabs.map((tab) => tab.id)

function isInboxTab(tab: unknown): tab is (typeof inboxTabs)[number]['id'] {
  return typeof tab === 'string' && inboxTabIds.includes(tab as (typeof inboxTabs)[number]['id'])
}

function getQueryTab() {
  const tab = Array.isArray(route.query.tab) ? route.query.tab[0] : route.query.tab
  return isInboxTab(tab) ? tab : undefined
}

const activeTab = ref<(typeof inboxTabs)[number]['id']>(getQueryTab() ?? 'primary')

watch(
  () => route.query.tab,
  () => {
    const queryTab = getQueryTab()

    if (queryTab && queryTab !== activeTab.value) {
      activeTab.value = queryTab
    }
  },
)

watch(
  activeTab,
  async (tab) => {
    if (route.query.tab === tab) {
      return
    }

    await router.replace({
      query: {
        ...route.query,
        tab,
      },
    })
  },
  { immediate: true },
)
</script>
