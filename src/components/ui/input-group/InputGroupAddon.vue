<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { inputGroupAddonVariants, type InputGroupAddonVariants } from '.'

const props = withDefaults(
  defineProps<{
    align?: InputGroupAddonVariants['align']
    class?: HTMLAttributes['class']
  }>(),
  {
    align: 'inline-start',
  },
)
</script>

<template>
  <div
    data-slot="input-group-addon"
    role="group"
    :data-align="align"
    :class="cn(inputGroupAddonVariants({ align }), props.class)"
  >
    <slot />
  </div>
</template>
