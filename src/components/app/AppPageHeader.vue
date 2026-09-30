<template>
  <div
    :class="
      cn(
        'flex min-h-[48px] items-center justify-between gap-2 border-b border-border-default px-4',
        props.class,
      )
    "
  >
    <div class="flex min-w-0 flex-1 items-stretch gap-2">
      <IconButton
        v-if="mobileSidebarHidden"
        variant="ghost"
        class="my-auto inline-flex cursor-pointer lg:hidden"
        aria-label="Open mobile sidebar"
        @click="sidebarStore.openSidebar('mobile')"
      >
        <PanelLeft class="h-4 w-4" />
      </IconButton>

      <IconButton
        v-if="desktopSidebarHidden"
        variant="ghost"
        class="my-auto hidden cursor-pointer lg:inline-flex"
        aria-label="Open desktop sidebar"
        @click="sidebarStore.openSidebar('desktop')"
      >
        <PanelLeft class="h-4 w-4" />
      </IconButton>

      <slot />
    </div>

    <div v-if="$slots.actions" class="flex shrink-0 items-center gap-0.5">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { storeToRefs } from 'pinia'
import { PanelLeft } from '@lucide/vue'
import { IconButton } from '@/components/ui/icon-button'
import { cn } from '@/lib/utils'
import { useSidebarStore } from '@/stores/sidebar'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const sidebarStore = useSidebarStore()
const { desktopSidebarHidden, mobileSidebarHidden } = storeToRefs(sidebarStore)
</script>
