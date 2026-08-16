<script setup lang="ts">
import type { Component, HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { useDropdownContext } from '.'

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    icon?: Component
    endIcon?: Component
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
        'app-control-height group mt-0 mx-2 flex w-[calc(100%-1rem)] cursor-pointer items-center gap-2 rounded-lg px-2 py-0 text-left text-sm leading-none text-app-black transition-colors hover:bg-surface-muted [&_svg]:shrink-0 [&_svg]:text-para [&_svg]:transition-colors hover:[&_svg]:text-app-black',
        props.class,
      )
    "
    @click="onClick"
  >
    <slot name="icon">
      <component
        :is="props.icon"
        v-if="props.icon"
        class="h-4 w-4"
        aria-hidden="true"
      />
    </slot>

    <div class="min-w-0 flex-1">
      <slot />
    </div>

    <div
      v-if="$slots.end || props.endIcon"
      class="ml-auto flex items-center"
    >
      <slot name="end">
        <component
          :is="props.endIcon"
          v-if="props.endIcon"
          class="h-4 w-4"
          aria-hidden="true"
        />
      </slot>
    </div>
  </button>
</template>
