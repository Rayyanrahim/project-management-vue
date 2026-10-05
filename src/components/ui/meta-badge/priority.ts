import type { KanbanPriority } from '@/components/ui/kanban/types'

export const PRIORITY_FLAG_CLASS: Record<KanbanPriority, string> = {
  urgent: 'text-priority-urgent',
  high: 'text-priority-high',
  normal: 'text-priority-normal',
  low: 'text-priority-low',
  none: 'text-priority-none',
}

export const PRIORITY_LABEL: Record<KanbanPriority, string> = {
  urgent: 'Urgent',
  high: 'High',
  normal: 'Normal',
  low: 'Low',
  none: '',
}
