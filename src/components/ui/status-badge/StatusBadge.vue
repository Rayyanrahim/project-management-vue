<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import {
  getStatusBadgeMeta,
  statusBadgeVariants,
  type StatusBadgeIconKind,
  type StatusBadgeOverrides,
  type StatusBadgeStatus,
} from '.'
import StatusBadgeIcon from './StatusBadgeIcon.vue'

const props = withDefaults(
  defineProps<{
    status: StatusBadgeStatus
    /** Override label text */
    label?: string
    /** Override icon kind */
    icon?: StatusBadgeIconKind
    /** Extra / full style overrides for customization */
    overrides?: StatusBadgeOverrides
    class?: HTMLAttributes['class']
  }>(),
  {},
)

const meta = computed(() =>
  getStatusBadgeMeta(props.status, {
    ...props.overrides,
    label: props.label ?? props.overrides?.label,
    icon: props.icon ?? props.overrides?.icon,
  }),
)
</script>

<template>
  <span
    :class="
      cn(
        statusBadgeVariants({ status: props.status }),
        props.overrides?.class,
        props.class,
      )
    "
  >
    <StatusBadgeIcon
      :kind="meta.icon"
      on-badge
      :check-on-badge-class="meta.checkOnBadgeClass"
      :check-row-bg-class="meta.checkRowBgClass"
      :class="status === 'open' ? 'text-[#87909E]' : undefined"
    />
    <span>{{ meta.label }}</span>
  </span>
</template>
