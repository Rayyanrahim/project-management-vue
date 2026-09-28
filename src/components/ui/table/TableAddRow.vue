<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Plus } from '@lucide/vue'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    label?: string
    class?: HTMLAttributes['class']
  }>(),
  {
    label: 'Add Task',
  },
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button
    type="button"
    :class="
      cn(
        'flex w-full cursor-pointer items-center gap-2 border-b border-table-border px-4 py-2.5 text-left text-[13px] text-table-muted hover:bg-table-hover',
        props.class,
      )
    "
    @click="emit('click', $event)"
  >
    <Plus class="ml-0.5 h-3.5 w-3.5 shrink-0" />
    <span>{{ label }}</span>
  </button>
</template>
