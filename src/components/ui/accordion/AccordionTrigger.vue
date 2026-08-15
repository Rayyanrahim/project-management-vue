<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { useAccordionItem } from '.'

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

const item = useAccordionItem()

function onClick() {
  if (props.disabled) return
  item.toggle()
}
</script>

<template>
  <button
    :id="item.triggerId"
    :type="type"
    :disabled="disabled"
    :aria-expanded="item.isOpen.value"
    :aria-controls="item.contentId"
    :data-state="item.isOpen.value ? 'open' : 'closed'"
    :class="cn(props.class)"
    @click="onClick"
  >
    <slot :open="item.isOpen.value" />
  </button>
</template>
