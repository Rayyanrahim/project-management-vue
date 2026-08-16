<template>
  <div class="app-dashboard">
    <AppPageHeader>
      <div class="flex min-w-0 flex-1 overflow-x-auto px-1">
        <button
          v-for="tab in inboxTabs"
          :key="tab.id"
          type="button"
          class="relative min-w-[250px] shrink-0 py-3 text-left before:absolute before:left-0 before:top-1/2 before:h-[calc(100%-24px)] before:w-px before:-translate-y-1/2 before:bg-border-default first:before:hidden"
          @click="activeTab = tab.id"
        >
          <div
            class="mx-1 flex min-h-[56px] items-center gap-3 rounded-md px-3 py-2 transition-colors"
            :class="activeTab === tab.id ? 'bg-[#f3f3f3]' : 'bg-transparent hover:bg-[#f3f3f3]'"
          >
            <component :is="tab.icon" class="h-4 w-4 shrink-0 text-para" />

            <div
              class="min-w-0 flex min-h-[32px] flex-col"
              :class="tab.meta ? 'justify-center' : 'justify-center'"
            >
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
          </div>

          <span
            v-if="activeTab === tab.id"
            class="absolute inset-x-1 bottom-0 h-0.5 bg-app-black"
          />
        </button>
      </div>
    </AppPageHeader>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Activity, CheckCheck, Clock3, Inbox as InboxIcon } from '@lucide/vue'
import AppPageHeader from '@/components/app/AppPageHeader.vue'

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

const activeTab = ref<(typeof inboxTabs)[number]['id']>('primary')
</script>
