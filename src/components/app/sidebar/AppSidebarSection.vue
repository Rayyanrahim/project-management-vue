<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from '@lucide/vue'
import sidebarTriangleIcon from '@/assets/sidebar-triangle.svg'
import type { SidebarSection } from '@/config/navlink'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { IconButton } from '@/components/ui/icon-button'
import { useModalStore } from '@/stores/modal'
import AppSidebarNavItem from './AppSidebarNavItem.vue'

const props = defineProps<{
  section: SidebarSection
}>()

const modalStore = useModalStore()
const isAddHovered = ref(false)

function onAddClick(event: Event) {
  event.preventDefault()
  event.stopPropagation()

  if (!props.section.showAdd || !props.section.addAction) return

  modalStore.handleAction(props.section.addAction, {
    sectionId: props.section.id,
  })
}

function onAddEnter() {
  isAddHovered.value = true
}

function onAddLeave() {
  isAddHovered.value = false
}
</script>

<template>
  <div v-if="!section.collapsible" class="space-y-1">
    <div
      v-if="section.heading"
      class="app-control-height flex items-center justify-between gap-1 px-2 text-left text-xs font-medium text-[var(--color-app-muted)]"
    >
      <span>{{ section.heading }}</span>
      <IconButton
        v-if="section.showAdd"
        variant="ghost"
        size="sm"
        class="h-5 w-5 shrink-0"
        ariaLabel="Add"
        @click="onAddClick"
      >
        <Plus class="h-3.5 w-3.5 text-[var(--color-app-muted)]" />
      </IconButton>
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
        class="app-control-height group mb-1 flex w-full items-center gap-1 rounded-lg px-2 text-left text-xs font-medium text-[var(--color-app-muted)] transition-colors cursor-pointer"
        :class="
          isAddHovered
            ? 'bg-transparent hover:bg-transparent'
            : 'hover:bg-surface-muted hover:text-app-black'
        "
      >
        <template #default="{ open }">
          <span class="flex min-w-0 items-center gap-1">
            <span>{{ section.heading }}</span>
            <span
              class="flex h-4 w-4 shrink-0 items-center justify-center transition-opacity"
              :class="
                isAddHovered
                  ? 'opacity-0'
                  : open
                    ? 'opacity-0 group-hover:opacity-100'
                    : 'opacity-100'
              "
            >
              <img
                :src="sidebarTriangleIcon"
                alt=""
                aria-hidden="true"
                class="h-[10px] w-[10px] transition-transform"
                :class="open ? 'rotate-90' : ''"
              />
            </span>
          </span>

          <IconButton
            v-if="section.showAdd"
            as="span"
            variant="ghost"
            size="sm"
            class="ml-auto h-5 w-5 shrink-0"
            ariaLabel="Add"
            @click="onAddClick"
            @keydown.enter.prevent="onAddClick"
            @mouseenter="onAddEnter"
            @mouseleave="onAddLeave"
          >
            <Plus class="h-3.5 w-3.5 text-[var(--color-app-muted)]" />
          </IconButton>
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
