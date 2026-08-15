<template>
  <aside class="flex h-full w-[200px] min-w-[200px] flex-col border-r border-[var(--color-border-default)] bg-[#F9F9F9]">
    <div class="min-h-0 flex-1 overflow-auto px-4 py-4">
      <div class="mb-3 flex items-center justify-between">
        <h2 class="text-[14px] font-semibold text-gray-900">Projects</h2>
        <div class="flex items-center gap-2">
          <IconButton variant="ghost" aria-label="Filters">
            <AppIcon name="sliders" class="h-4 w-4" />
          </IconButton>
          <IconButton variant="ghost" aria-label="Panel">
            <AppIcon name="panel" class="h-4 w-4" />
          </IconButton>
        </div>
      </div>

      <Button type="button" variant="app-outline" size="lg" class="mb-5 h-10 w-full justify-start rounded-xl px-4 text-[13px] font-medium text-gray-700">
        <AppIcon name="plus" class="mr-3 h-3.5 w-3.5" />
        New work item
      </Button>

      <nav class="space-y-1">
        <button
          v-for="item in primaryNav"
          :key="item.label"
          type="button"
          class="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-[12px] font-medium transition-colors"
          :class="item.active ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'"
        >
          <AppIcon :name="item.icon" class="h-4 w-4 text-gray-600" />
          <span>{{ item.label }}</span>
        </button>
      </nav>

      <div class="mt-8 space-y-6">
        <section>
          <button type="button" class="mb-2.5 flex w-full items-center justify-between text-left">
            <span class="text-[12px] font-semibold text-gray-700">Workspace</span>
            <AppIcon name="chevron-down" class="h-3.5 w-3.5 text-gray-500" />
          </button>

          <div class="space-y-1">
            <button
              v-for="item in workspaceNav"
              :key="item.label"
              type="button"
              class="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-[12px] text-gray-700 hover:bg-gray-50"
            >
              <AppIcon :name="item.icon" class="h-4 w-4 text-gray-600" />
              <span>{{ item.label }}</span>
            </button>
          </div>
        </section>

        <section>
          <button type="button" class="mb-2.5 flex w-full items-center justify-between text-left">
            <span class="text-[12px] font-semibold text-gray-700">Projects</span>
            <AppIcon name="chevron-down" class="h-3.5 w-3.5 text-gray-500" />
          </button>

          <div class="space-y-1">
            <button
              v-for="item in projectNav"
              :key="item.label"
              type="button"
              class="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-[12px] text-gray-700 hover:bg-gray-50"
            >
              <span class="text-sm">{{ item.emoji }}</span>
              <span>{{ item.label }}</span>
            </button>
          </div>
        </section>
      </div>
    </div>

    <div class="border-t border-[var(--color-border-default)] px-4 py-3">
      <Button type="button" variant="app-outline" size="lg" class="h-8 rounded-xl px-4 text-[11px] text-gray-700">
        Upgrade plan
      </Button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import AppIcon from '@/components/app/AppIcon.vue'
import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'

type PrimaryNavItem = {
  label: string
  icon: 'home' | 'file' | 'user' | 'sticky'
  active?: boolean
}

const primaryNav: PrimaryNavItem[] = [
  { label: 'Home', icon: 'home', active: true },
  { label: 'Drafts', icon: 'file' },
  { label: 'Your work', icon: 'user' },
  { label: 'Stickies', icon: 'sticky' },
] 

const workspaceNav = [
  { label: 'Projects', icon: 'briefcase' },
  { label: 'More', icon: 'dots' },
] as const

const projectNav = [
  { label: 'Testing', emoji: '🫡' },
  { label: 'testing-15', emoji: '👇' },
] as const
</script>
