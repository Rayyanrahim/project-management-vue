<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { switchVariants } from '.'

const model = defineModel<boolean>({ default: false })

const props = defineProps<{
  class?: HTMLAttributes['class']
  disabled?: boolean
  ariaLabel?: string
}>()

function toggle() {
  if (props.disabled) return
  model.value = !model.value
}
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="model"
    :aria-label="ariaLabel"
    :disabled="disabled"
    :class="cn(switchVariants({ checked: model }), props.class)"
    @click="toggle"
  >
    <span
      class="pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transition-transform"
      :class="model ? 'translate-x-[18px]' : 'translate-x-0.5'"
    />
  </button>
</template>
