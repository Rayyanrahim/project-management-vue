<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <button
    type="button"
    aria-label="Close modal"
    :class="cn('absolute inset-0 bg-black/40', props.class)"
  />
</template>
