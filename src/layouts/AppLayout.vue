<template>
  <div class="app-shell">
    <AppTopbar />

    <div class="app-shell-body">
      <div class="app-frame">
        <div class="app-content">
          <div
            data-testid="mobile-sidebar"
            class="app-sidebar-mobile block lg:hidden"
            :class="mobileSidebarOpen ? 'app-sidebar-mobile-open' : 'app-sidebar-mobile-closed'"
          >
          <AppSidebar mode="mobile" />
          </div>

          <div
            data-testid="desktop-sidebar"
            class="app-sidebar-desktop hidden lg:block"
            :class="desktopSidebarOpen ? 'app-sidebar-desktop-open' : 'app-sidebar-desktop-closed'"
          >
            <AppSidebar mode="desktop" />
          </div>

          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import AppSidebar from '@/components/app/AppSidebar.vue'
import AppTopbar from '@/components/app/AppTopbar.vue'
import { useSidebarStore } from '@/stores/sidebar'

const sidebarStore = useSidebarStore()
const { desktopSidebarOpen, mobileSidebarOpen } = storeToRefs(sidebarStore)
</script>
