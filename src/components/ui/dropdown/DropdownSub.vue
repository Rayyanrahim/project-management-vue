<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, toRef } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { provideDropdownSubContext } from '.'

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    defaultOpen?: boolean
    side?: 'left' | 'right' | 'auto'
    sideOffset?: number
  }>(),
  {
    defaultOpen: false,
    side: 'auto',
    sideOffset: 8,
  },
)

const open = ref(Boolean(props.defaultOpen))
const triggerRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const panelPosition = ref({ top: 0, left: 0 })
const preferredSide = toRef(props, 'side')
const sideOffset = toRef(props, 'sideOffset')
const resolvedSide = ref<'left' | 'right'>('right')

function updatePosition() {
  if (!triggerRef.value || !contentRef.value || typeof window === 'undefined') return

  const rect = triggerRef.value.getBoundingClientRect()
  const contentRect = contentRef.value.getBoundingClientRect()
  const viewportPadding = 8
  const rightSpace = window.innerWidth - rect.right - sideOffset.value - viewportPadding
  const leftSpace = rect.left - sideOffset.value - viewportPadding

  const nextSide = (() => {
    if (preferredSide.value === 'right') {
      return rightSpace >= contentRect.width || rightSpace >= leftSpace ? 'right' : 'left'
    }

    if (preferredSide.value === 'left') {
      return leftSpace >= contentRect.width || leftSpace >= rightSpace ? 'left' : 'right'
    }

    return rightSpace >= contentRect.width || rightSpace >= leftSpace ? 'right' : 'left'
  })()

  resolvedSide.value = nextSide

  const rawLeft = nextSide === 'right'
    ? rect.right + sideOffset.value
    : rect.left - contentRect.width - sideOffset.value

  const maxLeft = window.innerWidth - contentRect.width - viewportPadding
  const clampedLeft = Math.min(Math.max(rawLeft, viewportPadding), Math.max(viewportPadding, maxLeft))

  const maxTop = window.innerHeight - contentRect.height - viewportPadding
  const clampedTop = Math.min(Math.max(rect.top, viewportPadding), Math.max(viewportPadding, maxTop))

  panelPosition.value = {
    top: clampedTop,
    left: clampedLeft,
  }
}

async function setOpen(value: boolean) {
  open.value = value

  if (!open.value) {
    return
  }

  await nextTick()
  updatePosition()
}

async function toggle() {
  await setOpen(!open.value)
}

function close() {
  open.value = false
}

function onWindowChange() {
  if (!open.value) return

  updatePosition()
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

provideDropdownSubContext({
  open,
  triggerRef,
  contentRef,
  panelPosition,
  resolvedSide,
  preferredSide,
  sideOffset,
  setOpen,
  toggle,
  close,
  updatePosition,
})
</script>

<template>
  <div :class="cn('relative w-full', props.class)">
    <slot :open="open" />
  </div>
</template>
