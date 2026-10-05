<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { Flag } from '@lucide/vue'
import type { KanbanPriority } from '@/components/ui/kanban/types'
import MetaBadge from './MetaBadge.vue'
import { PRIORITY_FLAG_CLASS, PRIORITY_LABEL } from './priority'

const props = defineProps<{
  priority: KanbanPriority
  class?: HTMLAttributes['class']
}>()

const label = computed(() => PRIORITY_LABEL[props.priority])
const flagClass = computed(() => PRIORITY_FLAG_CLASS[props.priority])
</script>

<template>
  <MetaBadge v-if="priority !== 'none' && label" tone="muted" :class="props.class">
    <template #icon>
      <Flag class="h-3 w-3" :class="flagClass" fill="currentColor" />
    </template>
    {{ label }}
  </MetaBadge>
</template>
