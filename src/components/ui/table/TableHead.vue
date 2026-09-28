<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { ChevronDown, ChevronsUpDown } from '@lucide/vue'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    sortable?: boolean
    /** Active sort indicator (purple chevron) */
    sorted?: boolean
    class?: HTMLAttributes['class']
  }>(),
  {
    sortable: false,
    sorted: false,
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
        'group/col inline-flex h-full w-full cursor-pointer items-center rounded px-3 py-0 text-left hover:bg-table-head-hover',
        props.class,
      )
    "
    @click.stop="emit('click', $event)"
  >
    <slot />
    <template v-if="sortable">
      <span
        :class="
          cn(
            'relative ml-1 mr-[-6px] inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded bg-transparent transition-colors hover:bg-surface-muted',
            sorted ? '' : 'opacity-0 group-hover/col:opacity-100',
          )
        "
      >
        <span
          v-if="sorted"
          class="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-table-sort-bg group-hover/col:hidden"
        >
          <ChevronDown class="h-2.5 w-2.5 text-table-sort" stroke-width="3" />
        </span>
        <ChevronsUpDown
          :class="
            cn(
              'h-3 w-3 shrink-0',
              sorted ? 'absolute hidden group-hover/col:inline-block' : '',
            )
          "
        />
      </span>
    </template>
  </button>
</template>
