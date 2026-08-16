<script setup lang="ts">
import type { Component, HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { useDropdownSubContext } from '.'

const props = defineProps<{
  class?: HTMLAttributes['class']
  icon?: Component
  endIcon?: Component
}>()

const submenu = useDropdownSubContext()
</script>

<template>
  <button
    :ref="
      (element) => {
        submenu.triggerRef.value = element as HTMLElement | null
      }
    "
    type="button"
    v-bind="$attrs"
    :class="
      cn(
        'app-control-height group mt-0 mx-2 flex w-[calc(100%-1rem)] cursor-pointer items-center gap-2 rounded-lg px-2 py-0 text-left text-sm leading-none text-app-black transition-colors hover:bg-surface-muted [&_svg]:shrink-0 [&_svg]:text-para [&_svg]:transition-colors hover:[&_svg]:text-app-black',
        props.class,
      )
    "
    @click="submenu.toggle"
  >
    <component
      :is="props.icon"
      v-if="props.icon"
      class="h-4 w-4"
      aria-hidden="true"
    />

    <div class="min-w-0 flex-1">
      <slot />
    </div>

    <component
      :is="props.endIcon"
      v-if="props.endIcon"
      class="ml-auto h-4 w-4"
      aria-hidden="true"
    />
  </button>
</template>
