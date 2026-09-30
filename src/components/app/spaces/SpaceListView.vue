<script setup lang="ts">
import type { Space } from '@/data/spaces'

defineProps<{
  space: Space
}>()
</script>

<template>
  <div class="min-h-0 flex-1 overflow-auto bg-page-bg" />
</template>
