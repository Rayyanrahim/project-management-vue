import type { StatusBadgeStatus } from '@/components/ui/status-badge'

/** Soft column background tints (ClickUp-style) — override per column via tintClass */
export const KANBAN_COLUMN_TINT: Record<StatusBadgeStatus, string> = {
  open: 'bg-[#f4f4f5]',
  todo: 'bg-[#f3f2fc]',
  'in-progress': 'bg-[#e8f4fc]',
  paused: 'bg-[#fff8e8]',
  qa: 'bg-[#f0f1f2]',
  'pending-review': 'bg-[#f6eaf9]',
  blocked: 'bg-[#fff1e8]',
  'qa-rejected': 'bg-[#fdecec]',
  cancelled: 'bg-[#fdecec]',
  closed: 'bg-[#e8f6ee]',
  completed: 'bg-[#e8f6ee]',
}

export const KANBAN_COLUMN_FOOTER_TINT: Record<StatusBadgeStatus, string> = {
  open: 'text-table-muted',
  todo: 'text-todo-badge',
  'in-progress': 'text-[#0091f7]',
  paused: 'text-[#c99700]',
  qa: 'text-[#5f6368]',
  'pending-review': 'text-[#9c27b0]',
  blocked: 'text-[#ff6b00]',
  'qa-rejected': 'text-[#c53030]',
  cancelled: 'text-[#c53030]',
  closed: 'text-[#0d8043]',
  completed: 'text-success',
}

/** Hex used for Add Task hover/active via --add-button-color */
export const KANBAN_ADD_BUTTON_COLOR: Record<StatusBadgeStatus, string> = {
  open: '#8c8c8c',
  todo: '#5f55c5',
  'in-progress': '#0091f7',
  paused: '#c99700',
  qa: '#5f6368',
  'pending-review': '#9c27b0',
  blocked: '#ff6b00',
  'qa-rejected': '#c53030',
  cancelled: '#c53030',
  closed: '#0d8043',
  completed: '#008844',
}

export const KANBAN_DEFAULT_TINT = 'bg-[#f4f4f5]'
export const KANBAN_DEFAULT_FOOTER = 'text-table-muted'
export const KANBAN_DEFAULT_ADD_BUTTON_COLOR = '#8c8c8c'
