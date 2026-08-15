<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { cardVariants, type CardVariants } from '.'

const props = defineProps<{
  variant?: CardVariants['variant']
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <section :class="cn(cardVariants({ variant }), props.class)">
    <slot />
  </section>
</template>
