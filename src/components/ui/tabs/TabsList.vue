<script setup lang="ts">
import { computed } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { provideTabsList, tabsListVariants, type TabsListVariants } from '.'

const props = withDefaults(
  defineProps<{
    variant?: TabsListVariants['variant']
    separated?: boolean
    class?: HTMLAttributes['class']
  }>(),
  {
    variant: 'default',
    separated: false,
  },
)

const separated = computed(() => props.separated)

provideTabsList({
  separated,
})
</script>

<template>
  <div
    role="tablist"
    :data-separated="separated ? 'true' : undefined"
    :class="cn(tabsListVariants({ variant }), props.class)"
  >
    <slot />
  </div>
</template>
