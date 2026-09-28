<script setup lang="ts">
import inboxZeroIcon from '@/assets/svg/inbox/inbox-zero.svg'

withDefaults(
  defineProps<{
    title?: string
  }>(),
  {
    title: "You've achieved Inbox Zero!",
  },
)
</script>

<template>
  <div class="flex min-h-[min(28rem,70vh)] flex-col items-center justify-center px-4 py-16 text-center">
    <img
      :src="inboxZeroIcon"
      alt=""
      aria-hidden="true"
      class="mb-6 h-auto w-[min(100%,24rem)] select-none"
    />
    <h2 class="text-[18px] font-semibold text-app-black">{{ title }}</h2>
  </div>
</template>
