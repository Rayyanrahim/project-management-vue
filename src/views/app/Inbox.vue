<template>
  <div class="app-dashboard">
    <Tabs v-model="activeTab">
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

      <div class="px-4 py-5">
        <TabsContent value="primary">
          <section
            class="rounded-xl border border-border-default bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          >
            <div class="text-sm font-semibold text-app-black">Primary feed</div>
            <p class="mt-2 text-sm text-para">
              This panel is for the main inbox stream. Switch the top tabs and this content changes.
            </p>
          </section>
        </TabsContent>

        <TabsContent value="other">
          <section
            class="rounded-xl border border-border-default bg-[#fcfcfc] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          >
            <div class="text-sm font-semibold text-app-black">Other feed</div>
            <p class="mt-2 text-sm text-para">
              This panel shows the secondary queue so you can clearly see the selected tab is
              working.
            </p>
          </section>
        </TabsContent>

        <TabsContent value="later">
          <section
            class="rounded-xl border border-border-default bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          >
            <div class="text-sm font-semibold text-app-black">Later feed</div>
            <p class="mt-2 text-sm text-para">
              This panel is for items you want to come back to later.
            </p>
          </section>
        </TabsContent>

        <TabsContent value="cleared">
          <section
            class="rounded-xl border border-border-default bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          >
            <div class="text-sm font-semibold text-app-black">Cleared feed</div>
            <p class="mt-2 text-sm text-para">
              This panel holds completed or cleared items, separate from the active inbox.
            </p>
          </section>
        </TabsContent>
      </div>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Activity, CheckCheck, Clock3, Inbox as InboxIcon } from '@lucide/vue'
import { useRoute, useRouter } from 'vue-router'
import AppPageHeader from '@/components/app/AppPageHeader.vue'
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
