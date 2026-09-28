export type DashboardStatus = 'todo' | 'in_progress' | 'review' | 'done' | 'overdue'

export type DashboardRecentItem = {
  id: string
  title: string
  subtitle: string
  kind: 'space' | 'list' | 'doc' | 'board'
  color: string
}

import type { TagTone } from '@/components/ui/tag'

export type DashboardWorkTag = {
  label: string
  tone: TagTone
}

export type DashboardWorkItem = {
  id: string
  title: string
  project: string
  status: DashboardStatus
  due: string
  priority: 'urgent' | 'high' | 'normal' | 'low' | 'none'
  hasDescription?: boolean
  hasAttachment?: boolean
  tags?: DashboardWorkTag[]
}

export type DashboardPersonalItem = {
  id: string
  title: string
  done?: boolean
}
