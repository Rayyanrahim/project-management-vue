import type { StatusBadgeStatus } from '@/components/ui/status-badge'

export type KanbanPriority = 'none' | 'low' | 'normal' | 'high' | 'urgent'

/** Generic card — backend / any feature can map into this shape */
export type KanbanCardItem = {
  id: string
  title: string
  assignee?: string | null
  dueDate?: string | null
  priority?: KanbanPriority
  meta?: Record<string, unknown>
}

/** Generic column — id/label driven so statuses can come from API */
export type KanbanColumn = {
  id: string
  label: string
  /** When set, renders StatusBadge; otherwise plain label */
  status?: StatusBadgeStatus
  tintClass?: string
  footerClass?: string
  items: KanbanCardItem[]
}

export type KanbanMovePayload = {
  taskId: string
  fromColumnId: string
  toColumnId: string
  item: KanbanCardItem
}
