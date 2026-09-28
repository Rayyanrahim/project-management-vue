<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import InboxEmptyState from './InboxEmptyState.vue'
import InboxItem from './InboxItem.vue'
import InboxToolbar from './InboxToolbar.vue'
import { inboxFeedByTab } from './mock-data'
import type { InboxGroup, InboxTabId } from './types'

const props = defineProps<{
  tab: Exclude<InboxTabId, 'cleared'>
}>()

const groups = ref<InboxGroup[]>(structuredClone(inboxFeedByTab[props.tab]))

watch(
  () => props.tab,
  (tab) => {
    groups.value = structuredClone(inboxFeedByTab[tab])
  },
)

const isEmpty = computed(() => groups.value.every((group) => group.items.length === 0))

function removeItem(id: string) {
  groups.value = groups.value
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.id !== id),
    }))
    .filter((group) => group.items.length > 0)
}

function clearAll() {
  groups.value = []
}

function toggleUnread(id: string) {
  groups.value = groups.value.map((group) => ({
    ...group,
    items: group.items.map((item) =>
      item.id === id ? { ...item, unread: !item.unread } : item,
    ),
  }))
}
</script>

<template>
  <div class="min-h-0 flex-1 overflow-y-auto bg-white">
    <InboxToolbar @clear-all="clearAll" />

    <div v-if="isEmpty">
      <InboxEmptyState />
    </div>

    <div v-else class="px-4 pb-4">
      <section v-for="group in groups" :key="group.id" class="mb-4 last:mb-0">
        <h3 class="mb-2 text-[13px] font-semibold text-app-black">
          {{ group.label }}
        </h3>

        <div class="overflow-hidden rounded-xl border border-[#e8e8e8] bg-white">
          <InboxItem
            v-for="item in group.items"
            :key="item.id"
            :item="item"
            @clear="removeItem"
            @snooze="removeItem"
            @mark-unread="toggleUnread"
          />
        </div>
      </section>
    </div>
  </div>
</template>
