<template>
  <div class="app-shell">
    <AppTopbar @open-sidebar="sidebarOpen = true" />

    <div class="app-shell-body">
      <div class="app-frame">
        <div class="app-content">
          <div class="hidden lg:block">
            <AppSidebar />
          </div>

          <RouterView />
        </div>
      </div>
    </div>

    <Sheet v-model="sidebarOpen" class="w-[200px] lg:hidden">
      <AppSidebar />
    </Sheet>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppSidebar from '@/components/app/AppSidebar.vue'
import AppTopbar from '@/components/app/AppTopbar.vue'
import { Sheet } from '@/components/ui/sheet'

const sidebarOpen = ref(false)
</script>
