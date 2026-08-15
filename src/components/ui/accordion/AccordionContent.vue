<script setup lang="ts">
import { computed } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { useAccordionItem } from '.'

const props = defineProps<{
  class?: HTMLAttributes['class']
  forceMount?: boolean
}>()

const item = useAccordionItem()
const shouldRender = computed(() => props.forceMount || item.isOpen.value)
</script>

<template>
  <div
    v-if="shouldRender"
    :id="item.contentId"
    :aria-labelledby="item.triggerId"
    :data-state="item.isOpen.value ? 'open' : 'closed'"
    :hidden="!item.isOpen.value && !props.forceMount"
    :class="cn(props.class)"
  >
    <slot :open="item.isOpen.value" />
  </div>
</template>
