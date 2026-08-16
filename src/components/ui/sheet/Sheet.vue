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
    <Transition name="sheet-root">
      <div v-if="model" class="fixed inset-0 z-50">
        <Transition name="sheet-overlay">
          <SheetOverlay v-if="model" :class="props.overlayClass" @click="model = false" />
        </Transition>

        <Transition name="sheet-content">
          <SheetContent v-if="model" :side="side" :class="props.class">
            <slot />
          </SheetContent>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
