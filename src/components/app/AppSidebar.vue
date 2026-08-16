<template>
  <aside
    class="app-sidebar-panel flex h-full w-[200px] min-w-[200px] flex-col border-r border-[var(--color-border-default)] bg-sidebar-bg"
    :class="isSidebarHidden ? 'app-sidebar-panel-collapsed' : 'app-sidebar-panel-open'"
  >
    <div class="flex items-center justify-between bg-sidebar-bg pr-2 pb-1 pl-3 pt-2">
      <h2 class="text-[16px] font-semibold text-app-black">{{ sidebarContext.title }}</h2>
      <div class="flex items-center gap-2">
        <IconButton
          variant="ghost"
          class="cursor-pointer"
          aria-label="Collapse sidebar"
          @click="onPanelClick"
        >
          <PanelLeft class="h-4 w-4" />
        </IconButton>
      </div>
    </div>

    <div class="min-h-0 flex-1 overflow-auto px-2 pb-3">
      <div class="h-2.5 mx-3" />

      <nav class="space-y-1">
        <AppSidebarNavItem
          v-for="item in sidebarContext.primaryNav"
          :key="item.id"
          :item="item"
        />
      </nav>

      <div class="h-2.5 mx-3" />

      <div class="space-y-1">
        <AppSidebarSection
          v-for="section in sidebarContext.sections"
          :key="section.id"
          :section="section"
        />
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PanelLeft } from '@lucide/vue'
import { useRoute } from 'vue-router'
import { sidebarConfigs } from '@/config/navlink'
import { IconButton } from '@/components/ui/icon-button'
import AppSidebarNavItem from '@/components/app/sidebar/AppSidebarNavItem.vue'
import AppSidebarSection from '@/components/app/sidebar/AppSidebarSection.vue'
import { resolveSidebarContext } from '@/components/app/sidebar/sidebar-routing'
import { useSidebarStore } from '@/stores/sidebar'

const props = withDefaults(
  defineProps<{
    mode?: 'desktop' | 'mobile'
  }>(),
  {
    mode: 'desktop',
  },
)

const route = useRoute()
const sidebarStore = useSidebarStore()

const sidebarContext = computed(() => resolveSidebarContext(route, sidebarConfigs))
const isSidebarHidden = computed(() =>
  props.mode === 'mobile' ? sidebarStore.mobileSidebarHidden : sidebarStore.desktopSidebarHidden,
)

function onPanelClick() {
  sidebarStore.closeSidebar(props.mode)
}
</script>
