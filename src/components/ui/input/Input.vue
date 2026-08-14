<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { inputVariants, type InputVariants } from '.'

const model = defineModel<string>({ default: '' })

const props = withDefaults(
  defineProps<{
    variant?: InputVariants['variant']
    class?: HTMLAttributes['class']
    type?: HTMLInputElement['type']
  }>(),
  {
    type: 'text',
  },
)
</script>

<template>
  <input v-model="model" :type="type" :class="cn(inputVariants({ variant }), props.class)" />
</template>
