import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as StatusBadge } from './StatusBadge.vue'
export { default as StatusBadgeIcon } from './StatusBadgeIcon.vue'

export type StatusBadgeStatus =
  | 'open'
  | 'todo'
  | 'in-progress'
  | 'paused'
  | 'qa'
  | 'pending-review'
  | 'blocked'
  | 'qa-rejected'
  | 'cancelled'
  | 'closed'
  | 'completed'

export type StatusBadgeIconKind =
  | 'dashed'
  | 'wedge'
  | 'half'
  | 'check'
  | 'paused'
  | 'pending-review'
  | 'qa'
  | 'qa-rejected'
  | 'cancelled'
  | 'closed'

export type StatusBadgeMeta = {
  label: string
  icon: StatusBadgeIconKind
  rowIconClass: string
  /** Check color when icon sits on the colored badge */
  checkOnBadgeClass?: string
  /** Circle fill when icon sits in a task row */
  checkRowBgClass?: string
}

/** Optional overrides so callers can customize a status without forking the component */
export type StatusBadgeOverrides = Partial<StatusBadgeMeta> & {
  class?: string
}

export const statusBadgeVariants = cva(
  'inline-flex items-center gap-1 rounded-[4px] py-[2px] pr-[6px] pl-1 text-[12px] font-semibold leading-none tracking-[0.02em]',
  {
    variants: {
      status: {
        open: 'bg-[#ededed] text-[#2f343d]',
        todo: 'bg-todo-badge-bg text-todo-badge',
        'in-progress': 'bg-[#0091f7] text-white',
        paused: 'bg-[#ffc125] text-[#1a1a1a]',
        qa: 'bg-[#5f6368] text-white',
        'pending-review': 'bg-[#9c27b0] text-white',
        blocked: 'bg-[#ff6b00] text-white',
        'qa-rejected': 'bg-[#c53030] text-white',
        cancelled: 'bg-[#c53030] text-white',
        closed: 'bg-[#0d8043] text-white',
        completed: 'bg-success text-white',
      },
    },
    defaultVariants: {
      status: 'open',
    },
  },
)

export const STATUS_BADGE_META: Record<StatusBadgeStatus, StatusBadgeMeta> = {
  open: { label: 'OPEN', icon: 'dashed', rowIconClass: 'text-[#87909E]' },
  todo: { label: 'TO DO', icon: 'wedge', rowIconClass: 'text-todo-badge' },
  'in-progress': { label: 'IN PROGRESS', icon: 'wedge', rowIconClass: 'text-[#0091f7]' },
  paused: { label: 'PAUSED', icon: 'paused', rowIconClass: 'text-[#ffc125]' },
  qa: { label: 'QA', icon: 'qa', rowIconClass: 'text-[#5f6368]' },
  'pending-review': {
    label: 'QA PENDING REVIEW',
    icon: 'pending-review',
    rowIconClass: 'text-[#9c27b0]',
  },
  blocked: { label: 'BLOCKED', icon: 'half', rowIconClass: 'text-[#ff6b00]' },
  'qa-rejected': {
    label: 'QA REJECTED',
    icon: 'qa-rejected',
    rowIconClass: 'text-[#c53030]',
  },
  cancelled: {
    label: 'CANCELLED',
    icon: 'cancelled',
    rowIconClass: 'text-[#c53030]',
    checkOnBadgeClass: 'text-[#c53030]',
    checkRowBgClass: 'bg-[#c53030]',
  },
  closed: {
    label: 'CLOSED',
    icon: 'closed',
    rowIconClass: 'text-[#0d8043]',
    checkOnBadgeClass: 'text-[#0d8043]',
    checkRowBgClass: 'bg-[#0d8043]',
  },
  completed: {
    label: 'COMPLETED',
    icon: 'check',
    rowIconClass: 'text-success',
    checkOnBadgeClass: 'text-success',
    checkRowBgClass: 'bg-success',
  },
}

/** Default display order for status groups (customize per view if needed) */
export const STATUS_BADGE_ORDER: StatusBadgeStatus[] = [
  'completed',
  'open',
  'todo',
  'in-progress',
  'paused',
  'qa',
  'pending-review',
  'blocked',
  'qa-rejected',
  'cancelled',
  'closed',
]

export function getStatusBadgeMeta(
  status: StatusBadgeStatus,
  overrides?: StatusBadgeOverrides,
): StatusBadgeMeta {
  const base = STATUS_BADGE_META[status]
  if (!overrides) return base
  return {
    ...base,
    ...overrides,
    label: overrides.label ?? base.label,
    icon: overrides.icon ?? base.icon,
    rowIconClass: overrides.rowIconClass ?? base.rowIconClass,
    checkOnBadgeClass: overrides.checkOnBadgeClass ?? base.checkOnBadgeClass,
    checkRowBgClass: overrides.checkRowBgClass ?? base.checkRowBgClass,
  }
}

export type StatusBadgeVariants = VariantProps<typeof statusBadgeVariants>
