<script setup lang="ts">
import { computed } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { useTabsRoot } from '.'

const props = withDefaults(
  defineProps<{
    value: string
    forceMount?: boolean
    class?: HTMLAttributes['class']
  }>(),
  {
    forceMount: false,
  },
)

const root = useTabsRoot()
const ids = root.getIds(props.value)
const selected = computed(() => root.isSelected(props.value))
</script>

<template>
  <div
    v-if="forceMount || selected"
    v-show="forceMount ? selected : true"
    :id="ids.contentId"
    role="tabpanel"
    :aria-labelledby="ids.triggerId"
    :tabindex="0"
    :data-state="selected ? 'active' : 'inactive'"
    :class="cn('outline-none', props.class)"
  >
    <slot />
  </div>
</template>
