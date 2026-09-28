<script setup lang="ts">
import { computed } from 'vue'
import { Check, Clock3, FileText, CircleAlert, CircleDot, Mail } from '@lucide/vue'
import type { InboxItem, InboxStatusTone } from './types'

const props = defineProps<{
  item: InboxItem
}>()

const emit = defineEmits<{
  clear: [id: string]
  snooze: [id: string]
  markUnread: [id: string]
}>()

const statusClass: Record<InboxStatusTone, string> = {
  success: 'bg-[#008844] text-white',
  warning: 'bg-[#f5a524] text-white',
  danger: 'bg-[#e5484d] text-white',
  neutral: 'bg-[#c3c6cb] text-[#5f6368]',
  doc: 'bg-[#f5a524] text-white',
}

const StatusIcon = computed(() => {
  switch (props.item.status) {
    case 'doc':
      return FileText
    case 'warning':
      return CircleAlert
    case 'danger':
      return CircleDot
    case 'neutral':
      return CircleDot
    default:
      return Check
  }
})

function renderAction(action: string) {
  return action.split(/(@[\w.@-]+)/g).map((part) => {
    if (part.startsWith('@')) {
      return { type: 'mention' as const, value: part }
    }

    return { type: 'text' as const, value: part }
  })
}
</script>

<template>
  <div
    class="group grid min-h-11 cursor-pointer grid-cols-[16px_minmax(140px,200px)_minmax(0,1fr)_auto] items-center gap-x-2.5 border-b border-[#ebebeb] px-3 py-2 last:border-b-0 hover:bg-[#f3f3f3]"
  >
    <span
      class="inline-flex h-4 w-4 items-center justify-center rounded-full"
      :class="statusClass[item.status]"
    >
      <component :is="StatusIcon" class="h-2.5 w-2.5" stroke-width="3" />
    </span>

    <span class="truncate text-[13px] font-semibold leading-5 text-app-black">
      {{ item.title }}
    </span>

    <div class="flex min-w-0 items-center gap-2">
      <span
        class="inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full text-[8px] font-bold tracking-wide text-white"
        :style="{ backgroundColor: item.actor.color || '#64748b' }"
      >
        {{ item.actor.initials }}
      </span>

      <p class="min-w-0 truncate text-[13px] leading-5 text-[#6b6b6b]">
        <span class="font-medium text-[#292929]">{{ item.actor.name }}</span>
        <span>&nbsp;</span>
        <template v-for="(part, index) in renderAction(item.action)" :key="`${item.id}-${index}`">
          <span v-if="part.type === 'mention'" class="font-medium text-[#0b68cb]">
            {{ part.value }}
          </span>
          <span
            v-else
            :class="item.unread ? 'font-semibold text-app-black' : 'font-normal text-[#6b6b6b]'"
          >
            {{ part.value }}
          </span>
        </template>
      </p>
    </div>

    <div class="relative flex h-7 min-w-[52px] items-center justify-end">
      <div class="flex items-center gap-2 group-hover:invisible">
        <span class="w-11 text-right text-[12px] leading-5 text-[#8a8a8a]">
          {{ item.date }}
        </span>
      </div>

      <div
        class="absolute inset-y-0 right-0 hidden items-center gap-0.5 group-hover:flex"
      >
        <button
          type="button"
          class="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-[#6b6b6b] transition-colors hover:bg-white hover:text-app-black"
          aria-label="Mark as unread"
          @click.stop="emit('markUnread', item.id)"
        >
          <Mail class="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          class="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-[#6b6b6b] transition-colors hover:bg-white hover:text-app-black"
          aria-label="Snooze"
          @click.stop="emit('snooze', item.id)"
        >
          <Clock3 class="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          class="inline-flex h-7 cursor-pointer items-center gap-1 rounded-md bg-[#7b68ee] px-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#6a58e0]"
          @click.stop="emit('clear', item.id)"
        >
          <Check class="h-3.5 w-3.5" stroke-width="3" />
          Clear
        </button>
      </div>
    </div>
  </div>
</template>
