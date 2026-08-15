<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { iconButtonVariants, type IconButtonVariants } from '.'

const props = withDefaults(
  defineProps<{
    variant?: IconButtonVariants['variant']
    size?: IconButtonVariants['size']
    class?: HTMLAttributes['class']
    type?: 'button' | 'submit' | 'reset'
    ariaLabel?: string
  }>(),
  {
    type: 'button',
  },
)
</script>

<template>
  <button :type="type" :aria-label="ariaLabel" :class="cn(iconButtonVariants({ variant, size }), props.class)">
    <slot />
  </button>
</template>
