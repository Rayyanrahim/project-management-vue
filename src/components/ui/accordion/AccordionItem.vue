<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { createAccordionItemIds, provideAccordionItem, useAccordionRoot } from '.'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  value: string
  class?: HTMLAttributes['class']
}>()

const root = useAccordionRoot()
const ids = createAccordionItemIds()

const isOpen = computed(() => root.isItemOpen(props.value))

function toggle() {
  root.toggleItem(props.value)
}

provideAccordionItem({
  value: props.value,
  isOpen,
  triggerId: ids.triggerId,
  contentId: ids.contentId,
  toggle,
})
</script>

<template>
  <div :data-state="isOpen ? 'open' : 'closed'" :class="cn(props.class)">
    <slot />
  </div>
</template>
