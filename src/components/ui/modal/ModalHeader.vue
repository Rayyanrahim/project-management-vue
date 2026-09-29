<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Maximize2, Minimize2, X } from '@lucide/vue'
import { cn } from '@/lib/utils'
import { IconButton } from '@/components/ui/icon-button'
import { modalHeaderVariants, useModal } from '.'

const props = withDefaults(
  defineProps<{
    bordered?: boolean
    showClose?: boolean
    showFullscreen?: boolean
    class?: HTMLAttributes['class']
  }>(),
  {
    bordered: true,
    showClose: true,
    showFullscreen: true,
  },
)

const { close, fullscreen, toggleFullscreen } = useModal()
</script>

<template>
  <div :class="cn(modalHeaderVariants({ bordered }), props.class)">
    <div class="flex min-w-0 flex-1 items-center gap-2">
      <slot />
    </div>

    <div class="flex shrink-0 items-center gap-1">
      <slot name="actions" />

      <IconButton
        v-if="showFullscreen"
        variant="ghost"
        size="sm"
        class="h-7 w-7"
        :ariaLabel="fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'"
        @click="toggleFullscreen"
      >
        <Minimize2 v-if="fullscreen" class="h-4 w-4" />
        <Maximize2 v-else class="h-4 w-4" />
      </IconButton>

      <IconButton
        v-if="showClose"
        variant="ghost"
        size="sm"
        class="h-7 w-7"
        ariaLabel="Close"
        @click="close"
      >
        <X class="h-4 w-4" />
      </IconButton>
    </div>
  </div>
</template>
