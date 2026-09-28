<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { tagVariants, type TagVariants } from '.'

const props = withDefaults(
  defineProps<{
    tone?: TagVariants['tone']
    class?: HTMLAttributes['class']
  }>(),
  {
    tone: 'grey',
  },
)
</script>

<template>
  <span :class="cn(tagVariants({ tone: props.tone }), props.class)">
    <slot />
  </span>
</template>
