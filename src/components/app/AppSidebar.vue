<template>
  <aside class="flex h-full w-[200px] min-w-[200px] flex-col border-r border-[var(--color-border-default)] bg-sidebar-bg">
    <div class="flex items-center justify-between bg-sidebar-bg pr-2 pb-1 pl-3 pt-2">
      <h2 class="text-[16px] font-semibold text-[var(--color-app-black)]">Projects</h2>
      <div class="flex items-center gap-2">
        <IconButton variant="ghost" class="cursor-pointer" aria-label="Panel">
          <PanelLeft class="h-4 w-4" />
        </IconButton>
      </div>
    </div>

    <div class="min-h-0 flex-1 overflow-auto px-2 pb-3">
      <div class="h-2.5 mx-3" />

      <nav class="space-y-1">
        <button
          v-for="item in primaryNav"
          :key="item.label"
          type="button"
          class="flex h-7 w-full items-center gap-2.5 rounded-lg px-2 text-left text-[14px] transition-colors cursor-pointer"
          :class="item.active ? 'bg-surface-muted font-medium text-app-black' : 'text-para hover:bg-surface-muted hover:text-app-black'"
        >
          <component
            :is="item.icon"
            class="h-4 w-4"
            :class="item.active ? 'text-app-black' : 'text-para'"
          />
          <span>{{ item.label }}</span>
        </button>
      </nav>

      <div class="h-2.5 mx-3" />

      <Accordion type="single" collapsible default-value="workspace" class="w-full">
        <AccordionItem value="workspace">
          <AccordionTrigger
            class="group mb-1 flex h-7 w-full items-center gap-1 rounded-lg px-2 text-left text-xs font-medium text-[var(--color-app-muted)] transition-colors cursor-pointer hover:bg-surface-muted hover:text-app-black"
          >
            <template #default="{ open }">
              <span>Workspace</span>
              <span
                class="flex h-4 w-4 items-center justify-center transition-opacity"
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
            <button
              v-for="item in workspaceNav"
              :key="item.label"
              type="button"
              class="flex h-7 w-full items-center gap-2.5 rounded-lg px-2 text-left text-[14px] transition-colors cursor-pointer"
              :class="item.active ? 'bg-surface-muted font-medium text-app-black' : 'text-para hover:bg-surface-muted hover:text-app-black'"
            >
              <component
                :is="item.icon"
                class="h-4 w-4"
                :class="item.active ? 'text-app-black' : 'text-para'"
              />
              <span>{{ item.label }}</span>
            </button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>


      
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { LucideIcon } from '@lucide/vue'
import {
  Briefcase,
  Ellipsis,
  FileText,
  House,
  PanelLeft,
  StickyNote,
  UserRound,
} from '@lucide/vue'
import sidebarTriangleIcon from '@/assets/sidebar-triangle.svg'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { IconButton } from '@/components/ui/icon-button'

type PrimaryNavItem = {
  label: string
  icon: LucideIcon
  active?: boolean
}

type SecondaryNavItem = {
  label: string
  icon: LucideIcon
  active?: boolean
}

const primaryNav: PrimaryNavItem[] = [
  { label: 'Home', icon: House, active: true },
  { label: 'Drafts', icon: FileText },
  { label: 'Your work', icon: UserRound },
  { label: 'Stickies', icon: StickyNote },
]

const workspaceNav: SecondaryNavItem[] = [
  { label: 'Projects', icon: Briefcase, active: true },
  { label: 'More', icon: Ellipsis },
]
</script>
