<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { Check } from '@lucide/vue'
import { cn } from '@/lib/utils'
import statusPausedIcon from '@/assets/svg/status-paused.svg?raw'
import statusPendingReviewIcon from '@/assets/svg/status-pending-review.svg?raw'
import statusQaRejectedIcon from '@/assets/svg/status-qa-rejected.svg?raw'
import type { StatusBadgeIconKind } from '.'

const props = withDefaults(
  defineProps<{
    kind: StatusBadgeIconKind
    /** When true, check icons use white disc + colored tick (for colored badges). */
    onBadge?: boolean
    checkOnBadgeClass?: string
    checkRowBgClass?: string
    class?: HTMLAttributes['class']
  }>(),
  {
    onBadge: false,
  },
)

const assetIcons: Partial<Record<StatusBadgeIconKind, string>> = {
  paused: statusPausedIcon,
  'pending-review': statusPendingReviewIcon,
  'qa-rejected': statusQaRejectedIcon,
}

const isCheckKind = computed(
  () => props.kind === 'check' || props.kind === 'cancelled' || props.kind === 'closed',
)
</script>

<template>
  <!-- Asset-backed icons -->
  <span
    v-if="assetIcons[kind]"
    aria-hidden="true"
    :class="
      cn(
        'inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center [&>svg]:h-full [&>svg]:w-full',
        props.class,
      )
    "
    v-html="assetIcons[kind]"
  />

  <!-- ClickUp OPEN: dashed ring -->
  <svg
    v-else-if="kind === 'dashed'"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
    :class="cn('h-3.5 w-3.5 shrink-0', props.class)"
  >
    <circle
      cx="7"
      cy="7"
      r="5"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-dasharray="1.2 1.938"
    />
  </svg>

  <!-- ~45° wedge (IN PROGRESS / TO DO) -->
  <svg
    v-else-if="kind === 'wedge'"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
    :class="cn('h-3.5 w-3.5 shrink-0', props.class)"
  >
    <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5" />
    <path d="M7 7 L7 2 A5 5 0 0 1 10.54 3.46 Z" fill="currentColor" />
  </svg>

  <!-- ~180° half (BLOCKED) -->
  <svg
    v-else-if="kind === 'half'"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
    :class="cn('h-3.5 w-3.5 shrink-0', props.class)"
  >
    <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5" />
    <path d="M7 2 A5 5 0 0 1 7 12 Z" fill="currentColor" />
  </svg>

  <!-- COMPLETED / CLOSED / CANCELLED check -->
  <span
    v-else-if="isCheckKind"
    :class="
      cn(
        'inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full',
        onBadge ? 'bg-white' : (checkRowBgClass ?? 'bg-success'),
        props.class,
      )
    "
  >
    <Check
      class="h-2.5 w-2.5"
      :class="onBadge ? (checkOnBadgeClass ?? 'text-success') : 'text-white'"
      stroke-width="3.5"
    />
  </span>
</template>
