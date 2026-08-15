<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { useDropdownContext } from '.'

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    closeOnSelect?: boolean
  }>(),
  {
    type: 'button',
    disabled: false,
    closeOnSelect: true,
  },
)

const emit = defineEmits<{
  (event: 'select'): void
}>()

const dropdown = useDropdownContext()

function onClick() {
  if (props.disabled) return

  emit('select')

  if (props.closeOnSelect) {
    dropdown.close()
  }
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="
      cn(
        'mt-0 mx-2 flex min-h-[28px] cursor-pointer w-[calc(100%-1rem)] items-center rounded-lg px-2 py-0 text-left text-sm leading-none text-app-black transition-colors hover:bg-surface-muted',
        props.class,
      )
    "
    @click="onClick"
  >
    <slot />
  </button>
</template>
