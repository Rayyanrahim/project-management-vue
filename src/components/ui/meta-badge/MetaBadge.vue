<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { metaBadgeVariants, type MetaBadgeVariants } from '.'

const props = withDefaults(
  defineProps<{
    tone?: MetaBadgeVariants['tone']
    class?: HTMLAttributes['class']
  }>(),
  {
    tone: 'default',
  },
)
</script>

<template>
  <span :class="cn(metaBadgeVariants({ tone: props.tone }), props.class)">
    <slot name="icon" />
    <span>
      <slot />
    </span>
  </span>
</template>
