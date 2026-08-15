<template>
  <div class="flex h-14 items-center justify-between border-b border-[var(--color-border-default)] px-10">
    <div class="flex items-center gap-3 text-gray-700">
      <AppIcon name="home" class="h-4.5 w-4.5" />
      <span class="text-[13px] font-medium text-gray-900">Home</span>
    </div>

    <Button type="button" variant="app-outline" size="lg" class="h-9 rounded-xl px-4 text-[12px] text-gray-700">
      <AppIcon name="grid" class="mr-2 h-4 w-4" />
      Manage widgets
    </Button>
  </div>
</template>

<script setup lang="ts">
import AppIcon from '@/components/app/AppIcon.vue'
import { Button } from '@/components/ui/button'
</script>
