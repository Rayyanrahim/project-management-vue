<script setup lang="ts">
import { Teleport, watch, type HTMLAttributes } from 'vue'
import SheetContent from './SheetContent.vue'
import SheetOverlay from './SheetOverlay.vue'

const model = defineModel<boolean>({ default: false })

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    overlayClass?: HTMLAttributes['class']
    side?: 'left' | 'right'
  }>(),
  {
    side: 'left',
  },
)

watch(model, (open) => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = open ? 'hidden' : ''
})
</script>

<template>
  <Teleport to="body">
    <div v-if="model" class="fixed inset-0 z-50">
      <SheetOverlay :class="props.overlayClass" @click="model = false" />

      <SheetContent :side="side" :class="props.class">
        <slot />
      </SheetContent>
    </div>
  </Teleport>
</template>
