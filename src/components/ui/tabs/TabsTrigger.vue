<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import {
  TabsSeparator,
  tabsTriggerInnerVariants,
  tabsTriggerVariants,
  type TabsTriggerVariants,
  useTabsList,
  useTabsRoot,
} from '.'

const props = withDefaults(
  defineProps<{
    value: string
    size?: TabsTriggerVariants['size']
    class?: HTMLAttributes['class']
    innerClass?: HTMLAttributes['class']
    disabled?: boolean
  }>(),
  {
    size: 'sm',
    disabled: false,
  },
)

const root = useTabsRoot()
const list = useTabsList()
const triggerRef = ref<HTMLButtonElement | null>(null)
const ids = root.getIds(props.value)

const selected = computed(() => root.isSelected(props.value))
const showSeparator = computed(() => list.separated.value && !root.isFirstTrigger(props.value))

function activate() {
  if (props.disabled) {
    return
  }

  root.setValue(props.value)
}

function onKeydown(event: KeyboardEvent) {
  if (props.disabled) {
    return
  }

  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    event.preventDefault()
    root.focusAdjacentTrigger(props.value, 1)
    return
  }

  if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    event.preventDefault()
    root.focusAdjacentTrigger(props.value, -1)
    return
  }

  if (event.key === 'Home') {
    event.preventDefault()
    root.focusBoundaryTrigger('first')
    return
  }

  if (event.key === 'End') {
    event.preventDefault()
    root.focusBoundaryTrigger('last')
  }
}

onMounted(() => {
  if (triggerRef.value) {
    root.registerTrigger(props.value, triggerRef.value)
  }
})

onBeforeUnmount(() => {
  if (triggerRef.value) {
    root.unregisterTrigger(props.value, triggerRef.value)
  }
})
</script>

<template>
  <button :id="ids.triggerId" ref="triggerRef" type="button" role="tab" :disabled="disabled"
    :tabindex="selected ? 0 : -1" :aria-selected="selected" :aria-controls="ids.contentId"
    :data-state="selected ? 'active' : 'inactive'" :data-value="value"
    :data-separated="list.separated.value ? 'true' : undefined" :class="cn(tabsTriggerVariants({ size }), props.class)"
    @keydown="onKeydown">
    <TabsSeparator v-if="showSeparator" :size="size" />

    <div @click="activate" :class="cn(
      tabsTriggerInnerVariants({ size }),
      selected
        ? 'bg-transparent font-semibold text-app-black'
        : 'hover:bg-[#f3f3f3] font-medium text-para',
      props.innerClass,
    )
      ">
      <slot :selected="selected" />
    </div>

    <span v-if="selected" aria-hidden="true" class="absolute inset-x-1 bottom-0 h-0.5 rounded-full bg-app-black" />
  </button>
</template>
