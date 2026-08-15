<script setup lang="ts">
import { computed, ref } from 'vue'
import { cn } from '@/lib/utils'
import { provideAccordionRoot, type AccordionType, type AccordionValue } from '.'
import type { HTMLAttributes } from 'vue'

const model = defineModel<AccordionValue>()

const props = withDefaults(
  defineProps<{
    type?: AccordionType
    collapsible?: boolean
    defaultValue?: AccordionValue
    class?: HTMLAttributes['class']
  }>(),
  {
    type: 'single',
    collapsible: false,
    defaultValue: undefined,
  },
)

const uncontrolledValue = ref<AccordionValue>(props.defaultValue)

const currentValue = computed<AccordionValue>({
  get() {
    if (model.value !== undefined) {
      return model.value
    }

    return uncontrolledValue.value
  },
  set(nextValue) {
    if (model.value !== undefined) {
      model.value = nextValue
      return
    }

    uncontrolledValue.value = nextValue
  },
})

function isItemOpen(itemValue: string) {
  if (props.type === 'multiple') {
    return Array.isArray(currentValue.value) && currentValue.value.includes(itemValue)
  }

  return currentValue.value === itemValue
}

function toggleItem(itemValue: string) {
  if (props.type === 'multiple') {
    const values = Array.isArray(currentValue.value) ? [...currentValue.value] : []
    const hasValue = values.includes(itemValue)

    currentValue.value = hasValue
      ? values.filter((value) => value !== itemValue)
      : [...values, itemValue]

    return
  }

  if (currentValue.value === itemValue) {
    currentValue.value = props.collapsible ? undefined : itemValue
    return
  }

  currentValue.value = itemValue
}

provideAccordionRoot({
  type: props.type,
  collapsible: props.collapsible,
  value: currentValue,
  isItemOpen,
  toggleItem,
})
</script>

<template>
  <div :class="cn(props.class)">
    <slot />
  </div>
</template>
