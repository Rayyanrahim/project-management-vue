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
    /** Use `span` when nested inside another button (e.g. accordion trigger) */
    as?: 'button' | 'span'
  }>(),
  {
    type: 'button',
    as: 'button',
  },
)
</script>

<template>
  <component
    :is="as"
    :type="as === 'button' ? type : undefined"
    :role="as === 'span' ? 'button' : undefined"
    :tabindex="as === 'span' ? 0 : undefined"
    :aria-label="ariaLabel"
    :class="cn(iconButtonVariants({ variant, size }), props.class)"
  >
    <slot />
  </component>
</template>
