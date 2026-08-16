<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref } from 'vue'
import type { Component, HTMLAttributes } from 'vue'
import { ChevronDown, ChevronRight } from '@lucide/vue'
import { cn } from '@/lib/utils'
import { DropdownItem } from '.'

const props = defineProps<{
  class?: HTMLAttributes['class']
  contentClass?: HTMLAttributes['class']
  icon?: Component
  closedIcon?: Component
  openIcon?: Component
  defaultOpen?: boolean
  side?: 'left' | 'right'
  panelWidth?: number
  sideOffset?: number
  triggerAriaLabel?: string
}>()

const triggerRef = ref<HTMLElement | null>(null)
const open = ref(Boolean(props.defaultOpen))
const panelPosition = ref({ top: 0, left: 0 })
const resolvedPanelWidth = computed(() => props.panelWidth ?? 288)

function updatePanelPosition() {
  if (!triggerRef.value) return

  const rect = triggerRef.value.getBoundingClientRect()
  const offset = props.sideOffset ?? 8
  const width = resolvedPanelWidth.value

  panelPosition.value = {
    top: rect.top,
    left: props.side === 'right' ? rect.right + offset : rect.left - width - offset,
  }
}

async function toggle() {
  open.value = !open.value

  if (!open.value) {
    return
  }

  await nextTick()
  updatePanelPosition()
}

function close() {
  open.value = false
}

function onWindowChange() {
  if (!open.value) return

  updatePanelPosition()
}

if (typeof window !== 'undefined') {
  window.addEventListener('resize', onWindowChange)
  window.addEventListener('scroll', onWindowChange, true)
}

onBeforeUnmount(() => {
  if (typeof window === 'undefined') return

  window.removeEventListener('resize', onWindowChange)
  window.removeEventListener('scroll', onWindowChange, true)
})
</script>

<template>
  <div :class="cn('relative w-full', props.class)">
    <div ref="triggerRef">
      <DropdownItem
        :icon="props.icon"
        :end-icon="open ? (props.openIcon ?? ChevronDown) : (props.closedIcon ?? ChevronRight)"
        :close-on-select="false"
        :aria-label="props.triggerAriaLabel"
        @select="toggle"
      >
        <slot />
      </DropdownItem>
    </div>

    <div
      v-if="open"
      :style="{ top: `${panelPosition.top}px`, left: `${panelPosition.left}px`, width: `${resolvedPanelWidth}px` }"
      :class="
        cn(
          'fixed z-[60] rounded-xl border border-[var(--color-border-default)] bg-white py-2 shadow-[0_10px_30px_rgba(15,23,42,0.14)]',
          props.contentClass,
        )
      "
    >
      <slot name="content" :close="close" />
    </div>
  </div>
</template>
