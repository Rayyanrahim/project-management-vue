<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Calendar } from '@lucide/vue'
import MetaBadge from './MetaBadge.vue'

const props = defineProps<{
  date: string
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <MetaBadge tone="danger" :class="props.class">
    <template #icon>
      <Calendar class="h-3 w-3 text-table-icon" />
    </template>
    {{ date }}
  </MetaBadge>
</template>
