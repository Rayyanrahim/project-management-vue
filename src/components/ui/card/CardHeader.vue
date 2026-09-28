<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { cardHeaderVariants } from '.'

const props = withDefaults(
  defineProps<{
    bordered?: boolean
    class?: HTMLAttributes['class']
  }>(),
  {
    bordered: true,
  },
)
</script>

<template>
  <div :class="cn(cardHeaderVariants({ bordered }), props.class)">
    <slot />
  </div>
</template>
