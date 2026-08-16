<template>
  <div class="flex items-center justify-between border-b border-border-default px-2">
    <div class="flex items-center gap-2">
      <IconButton
        v-if="mobileSidebarHidden"
        variant="ghost"
        class="inline-flex lg:hidden cursor-pointer"
        aria-label="Open mobile sidebar"
        @click="sidebarStore.openSidebar('mobile')"
      >
        <PanelLeft class="h-4 w-4" />
      </IconButton>

      <IconButton
        v-if="desktopSidebarHidden"
        variant="ghost"
        class="hidden lg:inline-flex cursor-pointer"
        aria-label="Open desktop sidebar"
        @click="sidebarStore.openSidebar('desktop')"
      >
        <PanelLeft class="h-4 w-4" />
      </IconButton>

      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { PanelLeft } from '@lucide/vue'
import { IconButton } from '@/components/ui/icon-button'
import { useSidebarStore } from '@/stores/sidebar'

const sidebarStore = useSidebarStore()
const { desktopSidebarHidden, mobileSidebarHidden } = storeToRefs(sidebarStore)
</script>
