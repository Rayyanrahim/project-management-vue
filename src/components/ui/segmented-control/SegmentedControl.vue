<script setup lang="ts" generic="T extends string">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import {
  segmentedControlItemVariants,
  segmentedControlVariants,
  type SegmentedControlOption,
  type SegmentedControlVariants,
} from '.'

const model = defineModel<T>({ required: true })

const props = withDefaults(
  defineProps<{
    options: SegmentedControlOption<T>[]
    size?: SegmentedControlVariants['size']
    class?: HTMLAttributes['class']
    ariaLabel?: string
  }>(),
  {
    size: 'sm',
  },
)

function select(value: T, disabled?: boolean) {
  if (disabled) {
    return
  }

  model.value = value
}
</script>

<template>
  <div
    role="tablist"
    :aria-label="ariaLabel"
    :class="cn(segmentedControlVariants({ size }), props.class)"
  >
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      role="tab"
      :aria-selected="model === option.value"
      :disabled="option.disabled"
      :class="
        cn(
          segmentedControlItemVariants({
            size,
            active: model === option.value,
          }),
        )
      "
      @click="select(option.value, option.disabled)"
    >
      {{ option.label }}
    </button>
  </div>
</template>
