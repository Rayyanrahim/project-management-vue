export type InboxStatusTone = 'success' | 'warning' | 'danger' | 'neutral' | 'doc'

export type InboxActor = {
  name: string
  initials: string
  color?: string
}

export type InboxItem = {
  id: string
  title: string
  status: InboxStatusTone
  actor: InboxActor
  action: string
  unread?: boolean
  count?: number
  date: string
}

export type InboxGroup = {
  id: string
  label: string
  items: InboxItem[]
}

export type InboxTabId = 'primary' | 'other' | 'later' | 'cleared'
