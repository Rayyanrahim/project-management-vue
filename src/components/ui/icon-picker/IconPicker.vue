<script setup lang="ts">
import { computed, ref } from 'vue'
import { Plus, Search } from '@lucide/vue'
import { Dropdown, DropdownContent, DropdownTrigger } from '@/components/ui/dropdown'
import { Input } from '@/components/ui/input'
import { findSpaceIcon, spaceIconOptions } from './icons'

const iconName = defineModel<string | null>({ default: null })
const color = defineModel<string>('color', { default: '#646464' })

const props = withDefaults(
  defineProps<{
    fallbackLetter?: string
    ariaLabel?: string
  }>(),
  {
    fallbackLetter: 'S',
    ariaLabel: 'Choose icon',
  },
)

const open = ref(false)
const query = ref('')

const selected = computed(() => findSpaceIcon(iconName.value))

const filteredIcons = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return spaceIconOptions
  return spaceIconOptions.filter((item) => item.name.toLowerCase().includes(q))
})

function selectIcon(name: string, close: () => void) {
  iconName.value = name
  close()
  query.value = ''
}

function onColorInput(event: Event) {
  const target = event.target as HTMLInputElement
  color.value = target.value
}
</script>

<template>
  <Dropdown v-model="open" class="inline-flex shrink-0">
    <DropdownTrigger
      :aria-label="ariaLabel"
      class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-border-default bg-white text-[14px] font-medium transition-colors hover:bg-surface-hover"
      :style="{ color }"
    >
      <component :is="selected.icon" v-if="selected" class="h-4 w-4" />
      <span v-else class="text-para">{{ fallbackLetter }}</span>
    </DropdownTrigger>

    <DropdownContent
      align="start"
      class="min-w-[322px] w-[322px] max-w-[calc(100vw-1.5rem)] overflow-hidden p-0 py-0"
    >
      <template #default="{ close }">
        <div class="flex w-full flex-col">
          <div class="shrink-0 border-b border-border-default px-3 pt-2">
            <div
              class="inline-flex border-b-2 border-app-black pb-1.5 text-[12px] font-semibold text-app-black"
            >
              Icon
            </div>
          </div>

          <div class="flex shrink-0 items-center gap-1.5 px-3 py-2">
            <div class="relative min-w-0 flex-1">
              <Search
                class="pointer-events-none absolute top-1/2 left-2 h-3.5 w-3.5 -translate-y-1/2 text-para"
              />
              <Input
                v-model="query"
                type="search"
                placeholder="Search..."
                class="h-6 pl-7 text-[11px]"
              />
            </div>

            <label
              class="relative flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-md border border-border-default hover:bg-surface-hover"
              title="Icon color"
            >
              <span
                class="h-3 w-3 rounded-full"
                :style="{ backgroundColor: color }"
              />
              <input
                type="color"
                :value="color"
                class="absolute inset-0 cursor-pointer opacity-0"
                @input="onColorInput"
              />
            </label>

            <button
              type="button"
              class="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-md border border-border-default hover:bg-surface-hover"
              aria-label="Add custom icon"
            >
              <span
                class="flex h-3 w-3 items-center justify-center rounded-full bg-primary text-white"
              >
                <Plus class="h-2.5 w-2.5" />
              </span>
            </button>
          </div>

          <div class="h-[188px] overflow-y-auto overscroll-contain px-1.5 pb-2">
            <div
              v-if="filteredIcons.length"
              class="grid grid-cols-8 gap-0.5"
            >
              <button
                v-for="item in filteredIcons"
                :key="item.name"
                type="button"
                class="flex h-6.5 w-full cursor-pointer items-center justify-center rounded-md text-para transition-colors hover:bg-surface-muted hover:text-app-black"
                :class="
                  iconName === item.name
                    ? 'bg-surface-muted text-app-black ring-1 ring-border-default'
                    : ''
                "
                :aria-label="item.name"
                :title="item.name"
                @click="selectIcon(item.name, close)"
              >
                <component :is="item.icon" class="h-3.5 w-3.5" />
              </button>
            </div>

            <p
              v-else
              class="px-2 py-4 text-center text-[12px] text-para"
            >
              No icons found
            </p>
          </div>
        </div>
      </template>
    </DropdownContent>
  </Dropdown>
</template>
