<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { useDropdownContext } from '.'

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
  }>(),
  {
    type: 'button',
    disabled: false,
  },
)

const dropdown = useDropdownContext()

function onClick() {
  if (props.disabled) return
  dropdown.toggle()
}
</script>

<template>
  <button
    :id="dropdown.triggerId"
    ref="dropdown.triggerRef"
    :type="type"
    :disabled="disabled"
    :aria-expanded="dropdown.open.value"
    :aria-controls="dropdown.contentId"
    :data-state="dropdown.open.value ? 'open' : 'closed'"
    :class="cn(props.class)"
    @click="onClick"
  >
    <slot :open="dropdown.open.value" />
  </button>
</template>
