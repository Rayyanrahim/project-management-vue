<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Plus } from '@lucide/vue'
import { RouterLink, useRoute } from 'vue-router'
import sidebarTriangleIcon from '@/assets/sidebar-triangle.svg'
import type { SidebarNavItem } from '@/config/navlink'
import { IconButton } from '@/components/ui/icon-button'
import { useModalStore } from '@/stores/modal'
import { isSidebarItemActive } from './sidebar-routing'

const props = defineProps<{
  item: SidebarNavItem
  depth?: number
}>()

const route = useRoute()
const modalStore = useModalStore()

const depth = computed(() => props.depth ?? 0)
const hasChildren = computed(() => (props.item.children?.length ?? 0) > 0)

const active = computed(() => isSidebarItemActive(route, props.item))
const childActive = computed(
  () => props.item.children?.some((child) => isSidebarItemActive(route, child)) ?? false,
)
/** Parent space only looks active on its own page — not when a child project is selected */
const isSelfActive = computed(() => active.value && !childActive.value)

const expanded = ref(Boolean(props.item.defaultOpen) || childActive.value)
const isAddHovered = ref(false)

watch(childActive, (isChildActive) => {
  if (isChildActive) expanded.value = true
})

function toggleExpand(event: Event) {
  event.preventDefault()
  event.stopPropagation()
  expanded.value = !expanded.value
}

function onAddClick(event: Event) {
  event.preventDefault()
  event.stopPropagation()

  if (!props.item.showAdd || !props.item.addAction) return

  modalStore.handleAction(props.item.addAction, {
    spaceId: props.item.id,
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
  <div class="space-y-0.5">
    <div
      class="app-control-height group relative flex w-full items-center rounded-lg transition-colors"
      :class="
        isAddHovered
          ? 'bg-transparent'
          : isSelfActive
            ? 'bg-surface-muted'
            : 'hover:bg-surface-muted'
      "
    >
      <RouterLink
        :to="item.to"
        class="flex h-full min-w-0 flex-1 cursor-pointer items-center gap-2.5 text-left text-[14px]"
        :class="[
          depth > 0 ? 'pl-7 pr-2' : item.showAdd ? 'pl-2 pr-1' : 'px-2',
          isSelfActive
            ? 'font-medium text-app-black'
            : 'text-para group-hover:text-app-black',
        ]"
        :data-active="isSelfActive ? 'true' : 'false'"
      >
        <span class="relative flex h-4 w-4 shrink-0 items-center justify-center">
          <component
            :is="item.icon"
            class="h-4 w-4 transition-opacity"
            :class="[
              isSelfActive ? 'text-app-black' : 'text-para',
              hasChildren ? 'group-hover:opacity-0' : '',
            ]"
          />
          <button
            v-if="hasChildren"
            type="button"
            class="absolute inset-0 z-10 flex cursor-pointer items-center justify-center rounded-sm opacity-0 transition-opacity hover:bg-surface-hover group-hover:opacity-100"
            :aria-label="expanded ? 'Collapse' : 'Expand'"
            @click="toggleExpand"
          >
            <img
              :src="sidebarTriangleIcon"
              alt=""
              aria-hidden="true"
              class="h-[10px] w-[10px] transition-transform"
              :class="expanded ? 'rotate-90' : ''"
            />
          </button>
        </span>
        <span class="truncate">{{ item.label }}</span>
      </RouterLink>

      <IconButton
        v-if="item.showAdd"
        variant="ghost"
        size="sm"
        class="h-5 w-5 mr-2 shrink-0"
        ariaLabel="Add project"
        @click="onAddClick"
        @mouseenter="onAddEnter"
        @mouseleave="onAddLeave"
      >
        <Plus class="h-3.5 w-3.5 text-[var(--color-app-muted)]" />
      </IconButton>
    </div>

    <div v-if="hasChildren && expanded" class="space-y-0.5">
      <AppSidebarNavItem
        v-for="child in item.children"
        :key="child.id"
        :item="child"
        :depth="depth + 1"
      />
    </div>
  </div>
</template>
