<script setup lang="ts">
import { CheckCheck} from '@lucide/vue'

defineEmits<{
  clearAll: []
}>()
</script>

<template>
  <div class="flex h-11 shrink-0 items-center justify-end px-4">
    <div class="flex items-center gap-1.5">
      <button
        type="button"
        class="inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-md border border-[#e2e2e2] bg-white px-2.5 text-[12px] font-medium text-[#5f6368] transition-colors hover:bg-[#f7f7f7] hover:text-app-black"
        @click="$emit('clearAll')"
      >
        <CheckCheck class="h-3.5 w-3.5" />
        Clear all
      </button>
    </div>
  </div>
</template>
