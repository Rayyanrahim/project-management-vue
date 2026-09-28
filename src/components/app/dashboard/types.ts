export type DashboardStatus = 'todo' | 'in_progress' | 'review' | 'done' | 'overdue'

export type DashboardRecentItem = {
  id: string
  title: string
  subtitle: string
  kind: 'space' | 'list' | 'doc' | 'board'
  color: string
}

export type DashboardWorkTag = {
  label: string
  /** Tailwind-like class pair, or preset tone */
  tone: 'magenta' | 'green' | 'lavender' | 'blue' | 'grey'
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
