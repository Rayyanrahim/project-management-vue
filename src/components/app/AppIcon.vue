<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    name:
      | 'search'
      | 'chevron-down'
      | 'home'
      | 'file'
      | 'user'
      | 'sticky'
      | 'briefcase'
      | 'dots'
      | 'plus'
      | 'sliders'
      | 'panel'
      | 'star'
      | 'box'
      | 'grid'
      | 'docs'
      | 'question'
      | 'bag'
      | 'bolt'
      | 'menu'
    class?: string
  }>(),
  {
    class: 'h-4 w-4',
  },
)

const paths = computed(() => {
  const map = {
    search: ['M21 21l-4.35-4.35', 'M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z'],
    'chevron-down': ['M6 9l6 6 6-6'],
    home: ['M4 10.5L12 4l8 6.5', 'M6.5 9.5V20h11V9.5'],
    file: ['M7 3h7l5 5v11a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z', 'M14 3v6h6'],
    user: ['M12 12a4 4 0 100-8 4 4 0 000 8z', 'M4 20a8 8 0 0116 0'],
    sticky: ['M6 4h12a2 2 0 012 2v12l-4-4H6a2 2 0 01-2-2V6a2 2 0 012-2z'],
    briefcase: ['M3 8h18v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8z', 'M9 8V6a3 3 0 013-3 3 3 0 013 3v2'],
    dots: ['M5 12h.01', 'M12 12h.01', 'M19 12h.01'],
    plus: ['M12 5v14', 'M5 12h14'],
    sliders: ['M4 6h16', 'M7 6v12', 'M17 6v12', 'M4 18h16'],
    panel: ['M4 5h16v14H4z', 'M10 5v14'],
    star: ['M12 3l2.7 5.46L21 9.27l-4.5 4.38L17.54 20 12 17.08 6.46 20l1.04-6.35L3 9.27l6.3-.81L12 3z'],
    box: ['M4 7l8-4 8 4-8 4-8-4z', 'M4 7v10l8 4 8-4V7'],
    grid: ['M4 4h7v7H4z', 'M13 4h7v7h-7z', 'M4 13h7v7H4z', 'M13 13h7v7h-7z'],
    docs: ['M7 3h7l5 5v11a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z', 'M14 3v6h6'],
    question: ['M9.09 9a3 3 0 115.82 1c0 2-3 3-3 3', 'M12 17h.01'],
    bag: ['M6 8h12l-1 11H7L6 8z', 'M9 8V6a3 3 0 016 0v2'],
    bolt: ['M13 2L4 14h6l-1 8 9-12h-6l1-8z'],
    menu: ['M4 7h16', 'M4 12h16', 'M4 17h16'],
  } as const

  return map[props.name]
})
</script>

<template>
  <svg :class="props.class" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path v-for="path in paths" :key="path" :d="path" />
  </svg>
</template>
