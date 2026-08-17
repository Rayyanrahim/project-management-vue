<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { tabsSeparatorVariants, type TabsSeparatorVariants } from '.'

const props = defineProps<{
  class?: HTMLAttributes['class']
  inline?: boolean
  size?: TabsSeparatorVariants['size']
}>()
</script>

<template>
  <span
    data-testid="tabs-separator"
    aria-hidden="true"
    :class="
      cn(
        tabsSeparatorVariants({
          inline: props.inline ?? false,
          size: props.size,
        }),
        props.class,
      )
    "
  />
</template>
