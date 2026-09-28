<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  AlignLeft,
  Check,
  CheckCircle2,
  ChevronDown,
  Flag,
  ListFilter,
  Paperclip,
  Plus,
  Search,
  Settings2,
} from '@lucide/vue'
import type { DashboardStatus, DashboardWorkItem, DashboardWorkTag } from './types'

const props = defineProps<{
  items: DashboardWorkItem[]
}>()

const openGroups = ref<Record<string, boolean>>({
  done: true,
  active: true,
})

const groups = computed(() => {
  const completed = props.items.filter((item) => item.status === 'done')
  const active = props.items.filter((item) => item.status !== 'done')

  return [
    {
      id: 'done',
      label: 'COMPLETED',
      badgeClass: 'bg-[#008844] text-white',
      items: completed,
    },
    {
      id: 'active',
      label: 'TO DO',
      badgeClass: 'bg-[#e4e2f9] text-[#5f55c5]',
      items: active,
    },
  ].filter((group) => group.items.length > 0)
})

function toggleGroup(id: string) {
  openGroups.value[id] = !openGroups.value[id]
}

const priorityFlagClass: Record<DashboardWorkItem['priority'], string> = {
  urgent: 'text-[#e5484d]',
  high: 'text-[#f5a524]',
  normal: 'text-[#4f8cff]',
  low: 'text-[#9ca3af]',
  none: 'text-[#cfcfcf]',
}

const priorityLabel: Record<DashboardWorkItem['priority'], string> = {
  urgent: 'Urgent',
  high: 'High',
  normal: 'Normal',
  low: 'Low',
  none: '',
}

const tagToneClass: Record<DashboardWorkTag['tone'], string> = {
  magenta: 'bg-[#c2185b] text-white',
  green: 'bg-[#e6f4ea] text-[#1e7a46]',
  lavender: 'bg-[#ebe8ff] text-[#5b4fc7]',
  blue: 'bg-[#4f8cff] text-white',
  grey: 'bg-[#f0f0f0] text-[#5a5a5a]',
}

function isComplete(status: DashboardStatus) {
  return status === 'done'
}
</script>

<template>
  <section class="overflow-hidden rounded-xl border border-border-default bg-white">
    <div class="flex items-center justify-between px-4 py-3.5">
      <h2 class="text-[15px] font-semibold text-app-black">Assigned to me</h2>
      <div class="flex items-center gap-0.5">
        <button
          type="button"
          class="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-para hover:bg-[#f3f3f3]"
          aria-label="Filter"
        >
          <ListFilter class="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          class="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-para hover:bg-[#f3f3f3]"
          aria-label="Closed tasks"
        >
          <CheckCircle2 class="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          class="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-para hover:bg-[#f3f3f3]"
          aria-label="Search"
        >
          <Search class="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          class="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-[#e8e8e8] text-para hover:bg-[#f3f3f3]"
          aria-label="Settings"
        >
          <Settings2 class="h-3.5 w-3.5" />
        </button>
      </div>
    </div>

    <div class="max-h-[28rem] overflow-y-auto">
      <div v-for="group in groups" :key="group.id">
        <!-- Status group header -->
        <button
          type="button"
          class="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left hover:bg-[#fafafa]"
          @click="toggleGroup(group.id)"
        >
          <span
            class="inline-block h-0 w-0 shrink-0 border-x-[3.5px] border-x-transparent border-t-[5px] border-t-[#7a7a7a] transition-transform"
            :class="openGroups[group.id] ? '' : '-rotate-90'"
            aria-hidden="true"
          />

          <span
            class="inline-flex items-center gap-1.5 rounded-[4px] px-2 py-[3px] text-[11px] font-bold tracking-[0.02em]"
            :class="group.badgeClass"
          >
            <span
              v-if="group.id === 'done'"
              class="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white"
            >
              <Check class="h-2.5 w-2.5 text-[#008844]" stroke-width="3.5" />
            </span>
            {{ group.label }}
          </span>

          <span class="text-[12px] text-[#8c8c8c]">{{ group.items.length }}</span>
        </button>

        <template v-if="openGroups[group.id]">
          <!-- Column headers -->
          <div
            class="grid grid-cols-[minmax(0,1fr)_120px_110px_36px] items-center border-b border-[#ededed] px-4 text-[11px] font-medium text-[#8c8c8c]"
          >
            <span class="py-1.5 pl-7">Name</span>
            <span class="py-1.5">Priority</span>
            <span class="inline-flex items-center gap-1 py-1.5">
              Due date
              <span
                class="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#ece8ff]"
              >
                <ChevronDown class="h-2.5 w-2.5 text-[#7c5cff]" stroke-width="3" />
              </span>
            </span>
            <button
              type="button"
              class="inline-flex h-6 w-6 cursor-pointer items-center justify-center justify-self-end rounded text-[#8c8c8c] hover:bg-[#f3f3f3]"
              aria-label="Add column"
              @click.stop
            >
              <Plus class="h-3.5 w-3.5" />
            </button>
          </div>

          <!-- Task rows -->
          <ul>
            <li
              v-for="item in group.items"
              :key="item.id"
              class="grid cursor-pointer grid-cols-[minmax(0,1fr)_120px_110px_36px] items-center border-b border-[#ededed] px-4 transition-colors hover:bg-[#fafafa]"
            >
              <div class="flex min-w-0 items-center gap-2 py-2.5">
                <span
                  class="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                  :class="
                    isComplete(item.status)
                      ? 'bg-[#008844] text-white'
                      : 'border-[1.5px] border-[#cfcfcf] bg-white'
                  "
                >
                  <Check
                    v-if="isComplete(item.status)"
                    class="h-2.5 w-2.5"
                    stroke-width="3.5"
                  />
                </span>

                <span class="min-w-0 truncate text-[13px] font-semibold leading-5 text-[#2e2e2e]">
                  {{ item.title }}
                </span>

                <span class="flex shrink-0 items-center gap-1 text-[#b5b5b5]">
                  <AlignLeft v-if="item.hasDescription" class="h-3.5 w-3.5" />
                  <Paperclip v-if="item.hasAttachment" class="h-3.5 w-3.5" />
                </span>

                <span
                  v-if="item.tags?.length"
                  class="flex shrink-0 items-center gap-1"
                >
                  <span
                    v-for="tag in item.tags"
                    :key="tag.label"
                    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold leading-4 whitespace-nowrap"
                    :class="tagToneClass[tag.tone]"
                  >
                    {{ tag.label }}
                  </span>
                </span>
              </div>

              <div class="flex min-w-0 items-center gap-1.5 py-2.5">
                <Flag
                  class="h-3.5 w-3.5 shrink-0"
                  :class="priorityFlagClass[item.priority]"
                  :fill="item.priority === 'none' ? 'none' : 'currentColor'"
                />
                <span
                  v-if="priorityLabel[item.priority]"
                  class="truncate text-[12px] text-[#6b6b6b]"
                >
                  {{ priorityLabel[item.priority] }}
                </span>
              </div>

              <span
                class="truncate py-2.5 text-[12px]"
                :class="
                  item.status === 'overdue'
                    ? 'font-medium text-[#c62828]'
                    : 'text-[#008844]'
                "
              >
                {{ item.due }}
              </span>

              <span />
            </li>
          </ul>

          <!-- Add Task -->
          <button
            type="button"
            class="flex w-full cursor-pointer items-center gap-2 border-b border-[#ededed] px-4 py-2.5 text-left text-[13px] text-[#8c8c8c] hover:bg-[#fafafa]"
          >
            <Plus class="ml-0.5 h-3.5 w-3.5 shrink-0" />
            <span>Add Task</span>
          </button>
        </template>
      </div>
    </div>
  </section>
</template>
