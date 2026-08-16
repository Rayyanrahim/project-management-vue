<script setup lang="ts">
import sidebarTriangleIcon from '@/assets/sidebar-triangle.svg'
import type { SidebarSection } from '@/config/navlink'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import AppSidebarNavItem from './AppSidebarNavItem.vue'

defineProps<{
  section: SidebarSection
}>()
</script>

<template>
  <div v-if="!section.collapsible" class="space-y-1">
    <div
      v-if="section.heading"
      class="app-control-height flex items-center px-2 text-left text-xs font-medium text-[var(--color-app-muted)]"
    >
      {{ section.heading }}
    </div>

    <AppSidebarNavItem
      v-for="item in section.items"
      :key="item.id"
      :item="item"
    />
  </div>

  <Accordion
    v-else
    type="single"
    collapsible
    :default-value="section.defaultOpen ? section.id : undefined"
    class="w-full"
  >
    <AccordionItem :value="section.id">
      <AccordionTrigger
        class="app-control-height group mb-1 relative flex w-full items-center gap-1 rounded-lg px-2 text-left text-xs font-medium text-[var(--color-app-muted)] transition-colors cursor-pointer hover:bg-surface-muted hover:text-app-black"
      >
        <template #default="{ open }">
          <span>{{ section.heading }}</span>
          <span
            class="absolute left-17 top-1.75 flex h-4 w-4 items-center justify-center transition-opacity"
            :class="open ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'"
          >
            <img
              :src="sidebarTriangleIcon"
              alt=""
              aria-hidden="true"
              class="h-[10px] w-[10px] transition-transform"
              :class="open ? 'rotate-90' : ''"
            />
          </span>
        </template>
      </AccordionTrigger>

      <AccordionContent class="space-y-1">
        <AppSidebarNavItem
          v-for="item in section.items"
          :key="item.id"
          :item="item"
        />
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</template>
