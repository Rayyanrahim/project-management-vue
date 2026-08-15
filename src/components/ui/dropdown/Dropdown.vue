<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { createDropdownIds, provideDropdownContext } from '.'

const model = defineModel<boolean>()

const props = defineProps<{
  defaultOpen?: boolean
  class?: HTMLAttributes['class']
}>()

const uncontrolledOpen = ref(Boolean(props.defaultOpen))
const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const ids = createDropdownIds()

const open = computed<boolean>({
  get() {
    if (model.value !== undefined) {
      return model.value
    }

    return uncontrolledOpen.value
  },
  set(value) {
    if (model.value !== undefined) {
      model.value = value
      return
    }

    uncontrolledOpen.value = value
  },
})

function setOpen(value: boolean) {
  open.value = value
}

function toggle() {
  open.value = !open.value
}

function close() {
  open.value = false
}

function onDocumentPointerDown(event: MouseEvent) {
  const target = event.target

  if (!(target instanceof Node)) return
  if (rootRef.value?.contains(target)) return

  close()
}

function onDocumentKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape') return

  close()
  triggerRef.value?.focus()
}

onMounted(() => {
  document.addEventListener('mousedown', onDocumentPointerDown)
  document.addEventListener('keydown', onDocumentKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocumentPointerDown)
  document.removeEventListener('keydown', onDocumentKeydown)
})

provideDropdownContext({
  open,
  contentId: ids.contentId,
  triggerId: ids.triggerId,
  rootRef,
  triggerRef,
  contentRef,
  setOpen,
  toggle,
  close,
})
</script>

<template>
  <div ref="rootRef" :class="cn('relative inline-flex', props.class)">
    <slot :open="open" />
  </div>
</template>
