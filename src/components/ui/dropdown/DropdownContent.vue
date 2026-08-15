<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { useDropdownContext } from '.'

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    align?: 'start' | 'end'
    sideOffset?: number
    forceMount?: boolean
  }>(),
  {
    align: 'start',
    sideOffset: 4,
    forceMount: false,
  },
)

const dropdown = useDropdownContext()
</script>

<template>
  <Transition name="dropdown">
    <div
      v-if="dropdown.open.value || props.forceMount"
      :id="dropdown.contentId"
      ref="dropdown.contentRef"
      :aria-labelledby="dropdown.triggerId"
      :data-state="dropdown.open.value ? 'open' : 'closed'"
      :hidden="!dropdown.open.value && !props.forceMount"
      :style="{ top: `calc(100% + ${props.sideOffset}px)` }"
      :class="
        cn(
          'absolute z-50 min-w-[8rem] overflow-hidden rounded-xl border border-[var(--color-border-default)] bg-white py-2 shadow-[0_10px_30px_rgba(15,23,42,0.14)]',
          props.align === 'end' ? 'right-0' : 'left-0',
          props.class,
        )
      "
    >
      <slot :open="dropdown.open.value" :close="dropdown.close" />
    </div>
  </Transition>
</template>
