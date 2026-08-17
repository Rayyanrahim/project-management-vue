<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { createTabsIds, provideTabsRoot, type TabsValue } from '.'

const model = defineModel<TabsValue>()

const props = withDefaults(
  defineProps<{
    defaultValue?: string
    class?: HTMLAttributes['class']
  }>(),
  {
    defaultValue: undefined,
  },
)

const baseId = useId()
const uncontrolledValue = ref<TabsValue>(props.defaultValue)
const triggerRegistry = ref<Array<{ value: string; element: HTMLButtonElement }>>([])

const currentValue = computed<TabsValue>({
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

function isSelected(tabValue: string) {
  return currentValue.value === tabValue
}

function isFirstTrigger(tabValue: string) {
  return triggerRegistry.value[0]?.value === tabValue
}

function setValue(tabValue: string) {
  currentValue.value = tabValue
}

function registerTrigger(tabValue: string, element: HTMLButtonElement) {
  const existingIndex = triggerRegistry.value.findIndex(
    (entry) => entry.value === tabValue && entry.element === element,
  )

  if (existingIndex === -1) {
    triggerRegistry.value.push({ value: tabValue, element })
  }

  if (currentValue.value === undefined) {
    currentValue.value = tabValue
  }
}

function unregisterTrigger(tabValue: string, element: HTMLButtonElement) {
  triggerRegistry.value = triggerRegistry.value.filter(
    (entry) => !(entry.value === tabValue && entry.element === element),
  )
}

function focusAdjacentTrigger(currentTabValue: string, direction: 1 | -1) {
  const currentIndex = triggerRegistry.value.findIndex((entry) => entry.value === currentTabValue)

  if (currentIndex === -1) {
    return
  }

  const nextIndex =
    (currentIndex + direction + triggerRegistry.value.length) % triggerRegistry.value.length
  const nextTrigger = triggerRegistry.value[nextIndex]

  nextTrigger?.element.focus()
  if (nextTrigger) {
    setValue(nextTrigger.value)
  }
}

function focusBoundaryTrigger(position: 'first' | 'last') {
  const boundaryTrigger =
    position === 'first'
      ? triggerRegistry.value[0]
      : triggerRegistry.value[triggerRegistry.value.length - 1]

  boundaryTrigger?.element.focus()
  if (boundaryTrigger) {
    setValue(boundaryTrigger.value)
  }
}

provideTabsRoot({
  value: currentValue,
  isSelected,
  isFirstTrigger,
  setValue,
  getIds: (tabValue) => createTabsIds(baseId, tabValue),
  registerTrigger,
  unregisterTrigger,
  focusAdjacentTrigger,
  focusBoundaryTrigger,
})
</script>

<template>
  <div :class="cn('w-full', props.class)">
    <slot />
  </div>
</template>
