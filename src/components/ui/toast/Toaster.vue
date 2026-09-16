<script setup lang="ts">
import { Check, Info, LoaderCircle, Minus, TriangleAlert, XCircle } from '@lucide/vue'
import { computed } from 'vue'
import type { Component } from 'vue'
import { toast, toastItems, type ToastItem, type ToastPosition, type ToastType } from './toast'

const positions: ToastPosition[] = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
]

const positionClasses: Record<ToastPosition, string> = {
  'top-left': 'inset-x-3 top-3 sm:inset-x-auto sm:left-6 sm:top-4',
  'top-center': 'inset-x-3 top-3 sm:inset-x-auto sm:left-1/2 sm:top-4 sm:-translate-x-1/2',
  'top-right': 'inset-x-3 top-3 sm:inset-x-auto sm:right-6 sm:top-4',
  'bottom-left': 'inset-x-3 bottom-3 sm:inset-x-auto sm:bottom-4 sm:left-6',
  'bottom-center': 'inset-x-3 bottom-3 sm:inset-x-auto sm:bottom-4 sm:left-1/2 sm:-translate-x-1/2',
  'bottom-right': 'inset-x-3 bottom-3 sm:inset-x-auto sm:bottom-4 sm:right-6',
}

const icons: Record<ToastType, Component> = {
  success: Check,
  error: XCircle,
  warning: TriangleAlert,
  info: Info,
}

const iconClasses: Record<ToastType, string> = {
  success: 'text-[#168a51]',
  error: 'text-[#d33c3c]',
  warning: 'text-[#a75524]',
  info: 'text-[#3975dc]',
}

const visibleToasts = computed(() => {
  const latestItems = toastItems.value.slice(-5)

  return Object.fromEntries(
    positions.map((position) => [
      position,
      latestItems.filter((item) => item.position === position),
    ]),
  ) as Record<ToastPosition, ToastItem[]>
})

function runAction(item: ToastItem) {
  item.action?.onClick()
  toast.dismiss(item.id)
}
</script>

<template>
  <Teleport to="body">
    <div
      v-for="position in positions"
      v-show="visibleToasts[position].length"
      :key="position"
      :aria-label="`Notifications ${position}`"
      :data-toast-position="position"
      :class="[
        'pointer-events-none fixed z-[100] flex flex-col items-start gap-2',
        positionClasses[position],
      ]"
    >
      <TransitionGroup name="toast" tag="div" class="flex w-full flex-col gap-2 sm:w-[340px]">
        <article
          v-for="item in visibleToasts[position]"
          :key="item.id"
          role="status"
          :aria-live="item.type === 'error' ? 'assertive' : 'polite'"
          :data-type="item.type"
          class="group/toast pointer-events-auto relative flex w-full rounded-xl border border-border-default bg-white py-2.5 text-left shadow-[0_6px_16px_rgba(0,0,0,0.16)]"
        >
          <div
            :class="[
              'ml-3 mt-[3px] flex h-4 w-4 shrink-0 items-center justify-center',
              iconClasses[item.type],
            ]"
          >
            <LoaderCircle
              v-if="item.loading"
              aria-label="Loading"
              class="h-4 w-4 animate-spin"
              :stroke-width="2"
            />
            <component
              :is="icons[item.type]"
              v-else
              :data-toast-icon="item.type"
              class="h-4 w-4"
              :stroke-width="2"
            />
          </div>

          <div data-toast-content class="min-w-0 flex-1 pl-1.5 pr-3">
            <p class="text-[13px] font-semibold leading-5 text-app-black">{{ item.title }}</p>
            <p v-if="item.description" class="pb-0 pt-0.5 text-xs leading-[14px] text-para">
              {{ item.description }}
            </p>
          </div>

          <button
            v-if="item.action"
            type="button"
            :aria-label="`${item.action.label} ${item.title}`"
            class="my-auto mr-1 shrink-0 cursor-pointer rounded px-1.5 py-1 text-xs font-semibold text-primary leading-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-1"
            @click="runAction(item)"
          >
            {{ item.action.label }}
          </button>

          <button
            type="button"
            :aria-label="`Dismiss ${item.title} notification`"
            class="pointer-events-none absolute -right-2 -top-2 flex h-5 w-5 scale-90 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border-default bg-white text-para opacity-0 shadow-[0_2px_6px_rgba(0,0,0,0.08)] transition-[opacity,transform,background-color,color] duration-150 hover:bg-[#f6f6f6] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#a952ff] group-focus-within/toast:pointer-events-auto group-focus-within/toast:scale-100 group-focus-within/toast:opacity-100 group-hover/toast:pointer-events-auto group-hover/toast:scale-100 group-hover/toast:opacity-100 [@media(hover:none)]:pointer-events-auto [@media(hover:none)]:scale-100 [@media(hover:none)]:opacity-100"
            @click="toast.dismiss(item.id)"
          >
            <Minus class="h-3 w-3" :stroke-width="1.8" />
          </button>
        </article>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
