<script setup lang="ts">
import { computed, nextTick, ref, watch, type ComponentPublicInstance, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { inputVariants, type InputVariants } from '@/components/ui/input'

const model = defineModel<string>({ default: '' })

const props = withDefaults(
  defineProps<{
    length?: number
    variant?: InputVariants['variant']
    class?: HTMLAttributes['class']
    inputClass?: HTMLAttributes['class']
  }>(),
  {
    length: 4,
  },
)

const inputRefs = ref<HTMLInputElement[]>([])

const normalizedLength = computed(() => Math.max(1, props.length))

const characters = computed(() => {
  const values = model.value.slice(0, normalizedLength.value).split('')
  return Array.from({ length: normalizedLength.value }, (_, index) => values[index] ?? '')
})

watch(
  normalizedLength,
  () => {
    if (model.value.length > normalizedLength.value) {
      model.value = model.value.slice(0, normalizedLength.value)
    }
  },
  { immediate: true },
)

const setInputRef = (
  element: Element | ComponentPublicInstance | null,
  index: number,
) => {
  if (!(element instanceof HTMLInputElement)) {
    inputRefs.value[index] = undefined as never
    return
  }

  inputRefs.value[index] = element
}

const updateCharacters = (nextCharacters: string[]) => {
  model.value = nextCharacters.join('')
}

const focusIndex = (index: number) => {
  const target = inputRefs.value[index]
  if (!target) return

  nextTick(() => {
    target.focus()
    target.select()
  })
}

const handleInput = (event: Event, index: number) => {
  const target = event.target as HTMLInputElement
  const rawValue = target.value
  const nextCharacters = [...characters.value]
  const sanitized = rawValue.replace(/\s+/g, '')

  if (!sanitized) {
    nextCharacters[index] = ''
    updateCharacters(nextCharacters)
    return
  }

  if (sanitized.length > 1) {
    applyPastedValue(sanitized, index)
    return
  }

  nextCharacters[index] = sanitized
  updateCharacters(nextCharacters)

  if (index < normalizedLength.value - 1) {
    focusIndex(index + 1)
  }
}

const handleKeydown = (event: KeyboardEvent, index: number) => {
  if (event.key === 'Backspace') {
    const nextCharacters = [...characters.value]

    if (nextCharacters[index]) {
      nextCharacters[index] = ''
      updateCharacters(nextCharacters)
      return
    }

    if (index > 0) {
      nextCharacters[index - 1] = ''
      updateCharacters(nextCharacters)
      focusIndex(index - 1)
      event.preventDefault()
    }

    return
  }

  if (event.key === 'ArrowLeft' && index > 0) {
    event.preventDefault()
    focusIndex(index - 1)
  }

  if (event.key === 'ArrowRight' && index < normalizedLength.value - 1) {
    event.preventDefault()
    focusIndex(index + 1)
  }
}

const applyPastedValue = (value: string, startIndex = 0) => {
  const nextCharacters = [...characters.value]
  const values = value.replace(/\s+/g, '').slice(0, normalizedLength.value - startIndex).split('')

  values.forEach((character, offset) => {
    nextCharacters[startIndex + offset] = character
  })

  updateCharacters(nextCharacters)

  const focusTarget = Math.min(startIndex + values.length, normalizedLength.value - 1)
  focusIndex(focusTarget)
}

const handlePaste = (event: ClipboardEvent, index: number) => {
  event.preventDefault()
  const pasted = event.clipboardData?.getData('text') ?? ''
  if (!pasted) return

  applyPastedValue(pasted, index)
}
</script>

<template>
  <div :class="cn('flex items-center justify-center gap-2', props.class)">
    <input
      v-for="(_, index) in normalizedLength"
      :key="index"
      :ref="(element) => setInputRef(element, index)"
      :value="characters[index]"
      type="text"
      inputmode="numeric"
      autocomplete="one-time-code"
      maxlength="1"
      :class="
        cn(
          inputVariants({ variant }),
          'h-14 w-14 rounded-xl px-0 text-center text-lg font-semibold leading-none sm:text-xl focus:rounded-xl',
          props.inputClass,
        )
      "
      @input="handleInput($event, index)"
      @keydown="handleKeydown($event, index)"
      @focus="($event.target as HTMLInputElement).select()"
      @paste="handlePaste($event, index)"
    />
  </div>
</template>
