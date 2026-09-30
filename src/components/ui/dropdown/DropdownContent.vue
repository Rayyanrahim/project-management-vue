<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  watch,
  type HTMLAttributes,
} from 'vue'
import { cn } from '@/lib/utils'
import { useDropdownContext } from '.'

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    align?: 'start' | 'end'
    side?: 'bottom' | 'right'
    sideOffset?: number
    forceMount?: boolean
    /** Render panel outside overflow parents (e.g. modal) */
    teleport?: boolean
  }>(),
  {
    align: 'start',
    side: 'bottom',
    sideOffset: 4,
    forceMount: false,
    teleport: true,
  },
)

const dropdown = useDropdownContext()
const panelStyle = ref<Record<string, string>>({
  top: '0px',
  left: '0px',
})

const isVisible = computed(() => dropdown.open.value || props.forceMount)

function updatePosition() {
  const trigger = dropdown.triggerRef.value
  const content = dropdown.contentRef.value
  if (!trigger || typeof window === 'undefined') return

  const rect = trigger.getBoundingClientRect()
  const offset = props.sideOffset
  const margin = 8
  const viewportH = window.innerHeight
  const viewportW = window.innerWidth
  const contentHeight = content?.offsetHeight ?? 260
  const contentWidth = content?.offsetWidth ?? 322

  if (props.side === 'right') {
    let top = rect.top
    if (top + contentHeight > viewportH - margin) {
      top = Math.max(margin, viewportH - contentHeight - margin)
    }

    panelStyle.value = {
      top: `${top}px`,
      left: `${Math.min(rect.right + offset, viewportW - contentWidth - margin)}px`,
      right: 'auto',
      maxHeight: `${viewportH - margin * 2}px`,
    }
    return
  }

  const preferredMax = 260
  const spaceBelow = viewportH - rect.bottom - offset - margin
  const spaceAbove = rect.top - offset - margin
  const placeAbove = spaceBelow < preferredMax && spaceAbove > spaceBelow
  const maxHeight = Math.min(preferredMax, placeAbove ? spaceAbove : spaceBelow)

  let top = placeAbove
    ? rect.top - offset - Math.min(contentHeight, maxHeight)
    : rect.bottom + offset

  top = Math.min(Math.max(margin, top), viewportH - margin - 40)

  let left = props.align === 'end' ? rect.right - contentWidth : rect.left
  left = Math.min(Math.max(margin, left), viewportW - contentWidth - margin)

  panelStyle.value = {
    top: `${top}px`,
    left: `${left}px`,
    right: 'auto',
    maxHeight: `${Math.max(200, maxHeight)}px`,
  }
}

function bindPositionListeners() {
  if (typeof window === 'undefined') return
  window.addEventListener('resize', updatePosition)
  window.addEventListener('scroll', updatePosition, true)
}

function unbindPositionListeners() {
  if (typeof window === 'undefined') return
  window.removeEventListener('resize', updatePosition)
  window.removeEventListener('scroll', updatePosition, true)
}

async function syncPosition() {
  if (!props.teleport || !dropdown.open.value) return
  await nextTick()
  updatePosition()
  requestAnimationFrame(() => {
    updatePosition()
  })
}

watch(
  () => [dropdown.open.value, props.teleport] as const,
  async ([open, teleport]) => {
    unbindPositionListeners()

    if (!open || !teleport) return

    await syncPosition()
    bindPositionListeners()
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  unbindPositionListeners()
  dropdown.contentRef.value = null
})

function setContentRef(element: unknown) {
  dropdown.contentRef.value = element instanceof HTMLElement ? element : null
  if (element instanceof HTMLElement && dropdown.open.value && props.teleport) {
    requestAnimationFrame(updatePosition)
  }
}
</script>

<template>
  <Teleport to="body" :disabled="!teleport">
    <Transition name="dropdown">
      <div
        v-if="isVisible"
        :id="dropdown.contentId"
        :ref="setContentRef"
        :aria-labelledby="dropdown.triggerId"
        :data-state="dropdown.open.value ? 'open' : 'closed'"
        :hidden="!dropdown.open.value && !forceMount"
        :style="
          teleport
            ? panelStyle
            : side === 'right'
              ? { top: '0', left: `calc(100% + ${sideOffset}px)` }
              : { top: `calc(100% + ${sideOffset}px)` }
        "
        :class="
          cn(
            'z-[80] flex min-w-[8rem] flex-col overflow-hidden rounded-xl border border-[var(--color-border-default)] bg-white py-2 shadow-[0_10px_30px_rgba(15,23,42,0.14)]',
            teleport
              ? 'fixed'
              : cn(
                  'absolute',
                  side === 'right' ? 'left-0' : align === 'end' ? 'right-0' : 'left-0',
                ),
            props.class,
          )
        "
      >
        <slot :open="dropdown.open.value" :close="dropdown.close" />
      </div>
    </Transition>
  </Teleport>
</template>
