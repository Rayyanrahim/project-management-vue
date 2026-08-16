<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import type { SidebarNavItem } from '@/config/navlink'
import { isSidebarItemActive } from './sidebar-routing'

const props = defineProps<{
  item: SidebarNavItem
}>()

const route = useRoute()

const active = computed(() => isSidebarItemActive(route, props.item))
</script>

<template>
  <RouterLink
    :to="item.to"
    class="app-control-height flex w-full items-center gap-2.5 rounded-lg px-2 text-left text-[14px] transition-colors cursor-pointer"
    :class="active ? 'bg-surface-muted font-medium text-app-black' : 'text-para hover:bg-surface-muted hover:text-app-black'"
    :data-active="active ? 'true' : 'false'"
  >
    <component
      :is="item.icon"
      class="h-4 w-4"
      :class="active ? 'text-app-black' : 'text-para'"
    />
    <span>{{ item.label }}</span>
  </RouterLink>
</template>
