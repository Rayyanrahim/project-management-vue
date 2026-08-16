<script setup lang="ts">
import type { CSSProperties, HTMLAttributes } from 'vue'
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { cn } from '@/lib/utils'
import { useDropdownSubContext } from '.'

const props = defineProps<{
  class?: HTMLAttributes['class']
  positionStyle?: CSSProperties
}>()

const submenu = useDropdownSubContext()

const positionStyle = computed(() => ({
  top: `${submenu.panelPosition.value.top}px`,
  left: `${submenu.panelPosition.value.left}px`,
  ...(props.positionStyle ?? {}),
}))

onMounted(() => {
  submenu.updatePosition()
})

onBeforeUnmount(() => {
  submenu.contentRef.value = null
})
</script>

<template>
  <div
    v-if="submenu.open.value"
    :ref="
      (element) => {
        submenu.contentRef.value = element as HTMLElement | null
      }
    "
    :style="positionStyle"
    :class="
      cn(
        'fixed z-[60] min-w-[8rem] overflow-visible rounded-xl border border-[var(--color-border-default)] bg-white py-2 shadow-[0_10px_30px_rgba(15,23,42,0.14)]',
        props.class,
      )
    "
  >
    <slot :close="submenu.close" />
  </div>
</template>
