<script setup lang="ts">
import { useTemplateRef, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { inputVariants, type InputVariants } from '.'

const model = defineModel<string>({ default: '' })

const props = withDefaults(
  defineProps<{
    variant?: InputVariants['variant']
    class?: HTMLAttributes['class']
    type?: HTMLInputElement['type']
    placeholder?: string
  }>(),
  {
    type: 'text',
  },
)

const inputRef = useTemplateRef<HTMLInputElement>('inputEl')

defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
})
</script>

<template>
  <input
    ref="inputEl"
    v-model="model"
    :type="type"
    :placeholder="placeholder"
    :class="cn(inputVariants({ variant }), props.class)"
  />
</template>
