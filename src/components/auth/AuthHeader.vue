<template>
  <div class="sm:mx-auto sm:w-full sm:max-w-sm">
    <div class="flex items-center justify-center">
      <img :src="logoIcon" alt="" class="h-9 w-9" />
    </div>
    <h2 class="mt-4 text-center text-2xl/9 font-bold tracking-tight text-gray-900">{{ title }}</h2>
    <p class="mt-1 text-center text-sm/6 text-gray-500">
      {{ prompt }}
      {{ ' ' }}
      <RouterLink :to="to" class="font-semibold text-auth-link hover:text-auth-link-hover">{{ linkText }}</RouterLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import logoIcon from '@/assets/svg/logo.svg'
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  title: string
  prompt: string
  to: RouteLocationRaw
  linkText: string
}>()
</script>
