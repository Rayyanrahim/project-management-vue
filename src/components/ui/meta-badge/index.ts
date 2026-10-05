import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as MetaBadge } from './MetaBadge.vue'
export { default as DueDateBadge } from './DueDateBadge.vue'
export { default as PriorityBadge } from './PriorityBadge.vue'
export { PRIORITY_FLAG_CLASS, PRIORITY_LABEL } from './priority'

export const metaBadgeVariants = cva(
  'inline-flex items-center gap-1 rounded-md border border-table-border bg-white px-1.5 py-0.5 text-[11px] font-medium',
  {
    variants: {
      tone: {
        muted: 'text-table-muted',
        danger: 'text-danger',
        default: 'text-table-muted',
      },
    },
    defaultVariants: {
      tone: 'default',
    },
  },
)

export type MetaBadgeVariants = VariantProps<typeof metaBadgeVariants>
