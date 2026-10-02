import type { TagTone } from '@/components/ui/tag'
import {
  STATUS_BADGE_META,
  statusBadgeVariants,
  type StatusBadgeStatus,
} from '@/components/ui/status-badge'
import { findSpace } from '@/data/spaces'

export type SpaceTaskPriority = 'none' | 'low' | 'normal' | 'high' | 'urgent'

export type SpaceTaskStatus = StatusBadgeStatus

export type SpaceTaskTag = {
  label: string
  tone: TagTone
}

export type SpaceTask = {
  id: string
  title: string
  projectId: string
  priority: SpaceTaskPriority
  assignee?: string | null
  dueDate?: string | null
  hasDescription?: boolean
  hasAttachment?: boolean
  tags?: SpaceTaskTag[]
}

export type SpaceStatusGroup = {
  id: SpaceTaskStatus
  label: string
  badgeClass: string
  tasks: SpaceTask[]
}

type RawGroup = {
  id: SpaceTaskStatus
  label: string
  badgeClass?: string
  tasks: Omit<SpaceTask, 'projectId'>[]
}

function badgeClassFor(status: SpaceTaskStatus) {
  return statusBadgeVariants({ status })
}

/** Static tasks keyed by `${spaceId}:${projectId}` — replace with API later */
const tasksByProject: Record<string, RawGroup[]> = {
  'team-space:marketing': [
    {
      id: 'open',
      label: 'OPEN',
      tasks: [
        {
          id: 't-open-1',
          title: 'Inbox triage',
          priority: 'low',
          hasDescription: true,
          tags: [{ label: 'web', tone: 'blue' }],
        },
        {
          id: 't-open-2',
          title: 'Sync with design',
          priority: 'normal',
          assignee: 'RR',
          dueDate: 'Oct 30',
          hasAttachment: true,
        },
        {
          id: 't-open-3',
          title: 'Collect feedback notes',
          priority: 'none',
          tags: [{ label: 'customer', tone: 'magenta' }],
        },
      ],
    },
    {
      id: 'todo',
      label: 'TO DO',
      tasks: [
        {
          id: 't1',
          title: 'Task 1',
          priority: 'low',
          tags: [{ label: 'todo', tone: 'lavender' }],
        },
        {
          id: 't2',
          title: 'Task 2',
          priority: 'none',
          hasDescription: true,
        },
        {
          id: 't3',
          title: 'Task 3',
          priority: 'none',
          hasAttachment: true,
        },
      ],
    },
    {
      id: 'in-progress',
      label: 'IN PROGRESS',
      tasks: [
        {
          id: 't1b',
          title: 'Campaign draft',
          priority: 'normal',
          assignee: 'RR',
          dueDate: 'Oct 25',
          hasDescription: true,
          tags: [{ label: 'customer', tone: 'magenta' }],
        },
      ],
    },
    {
      id: 'paused',
      label: 'PAUSED',
      tasks: [
        {
          id: 't-paused-1',
          title: 'Social calendar hold',
          priority: 'low',
          assignee: 'RR',
          dueDate: 'Nov 5',
          hasDescription: true,
          tags: [{ label: 'web', tone: 'blue' }],
        },
      ],
    },
  ],
  'team-space:product-launch': [
    {
      id: 'open',
      label: 'OPEN',
      tasks: [
        {
          id: 't-open-4',
          title: 'Vendor shortlist',
          priority: 'high',
          assignee: 'AK',
          dueDate: 'Nov 2',
          hasDescription: true,
          hasAttachment: true,
          tags: [{ label: 'bug', tone: 'lavender' }],
        },
        {
          id: 't-open-5',
          title: 'Budget draft',
          priority: 'normal',
          tags: [{ label: 'employee', tone: 'green' }],
        },
      ],
    },
    {
      id: 'blocked',
      label: 'BLOCKED',
      tasks: [
        {
          id: 't4',
          title: 'Legal review',
          priority: 'urgent',
          assignee: 'AK',
          dueDate: 'Oct 20',
          hasAttachment: true,
          tags: [{ label: 'bug', tone: 'lavender' }],
        },
      ],
    },
    {
      id: 'todo',
      label: 'TO DO',
      tasks: [
        {
          id: 't5',
          title: 'Press kit draft',
          priority: 'normal',
          hasDescription: true,
          tags: [{ label: 'web', tone: 'blue' }],
        },
        {
          id: 't5c',
          title: 'Launch checklist',
          priority: 'high',
        },
      ],
    },
    {
      id: 'in-progress',
      label: 'IN PROGRESS',
      tasks: [
        {
          id: 't5b',
          title: 'Landing page review',
          priority: 'high',
          assignee: 'RR',
          dueDate: '2/8/26',
          hasDescription: true,
          hasAttachment: true,
          tags: [{ label: 'ui / ux', tone: 'grey' }],
        },
      ],
    },
    {
      id: 'paused',
      label: 'PAUSED',
      tasks: [
        {
          id: 't-paused-2',
          title: 'Partner outreach',
          priority: 'normal',
          assignee: 'AK',
          dueDate: 'Nov 8',
          tags: [{ label: 'customer', tone: 'magenta' }],
        },
      ],
    },
    {
      id: 'qa',
      label: 'QA',
      tasks: [
        {
          id: 't-qa-1',
          title: 'App: Featured Images',
          priority: 'low',
          assignee: 'RR',
          dueDate: 'Aug 6',
          hasDescription: true,
        },
      ],
    },
    {
      id: 'pending-review',
      label: 'QA PENDING REVIEW',
      tasks: [
        {
          id: 't5e',
          title: 'Stakeholder sign-off',
          priority: 'normal',
          assignee: 'AK',
          dueDate: 'Oct 28',
          hasDescription: true,
          tags: [{ label: 'admin dashboard', tone: 'lavender' }],
        },
      ],
    },
    {
      id: 'completed',
      label: 'COMPLETED',
      tasks: [
        {
          id: 't5d',
          title: 'Kickoff notes',
          priority: 'low',
          assignee: 'RR',
          dueDate: 'Oct 10',
          hasDescription: true,
          tags: [{ label: 'employee', tone: 'green' }],
        },
      ],
    },
    {
      id: 'qa-rejected',
      label: 'QA REJECTED',
      tasks: [
        {
          id: 't-qa-rej-1',
          title: 'Sort Completed Orders by Ends At',
          priority: 'high',
          assignee: 'AK',
          dueDate: 'Oct 22',
          hasDescription: true,
          hasAttachment: true,
          tags: [{ label: 'bug', tone: 'lavender' }],
        },
      ],
    },
    {
      id: 'cancelled',
      label: 'CANCELLED',
      tasks: [
        {
          id: 't-cancel-1',
          title: 'Old vendor outreach draft',
          priority: 'low',
          hasDescription: true,
          tags: [{ label: 'web', tone: 'blue' }],
        },
      ],
    },
    {
      id: 'closed',
      label: 'CLOSED',
      tasks: [
        {
          id: 't-closed-1',
          title: 'Add Vehicle Information for Emergency Services',
          priority: 'normal',
          assignee: 'RR',
          dueDate: 'Oct 12',
          hasDescription: true,
          tags: [{ label: 'employee', tone: 'green' }],
        },
      ],
    },
  ],
  'test:qa-checklist': [
    {
      id: 'todo',
      label: 'TO DO',
      tasks: [
        { id: 't6', title: 'Regression pass', priority: 'high', hasDescription: true },
        { id: 't7', title: 'Smoke tests', priority: 'normal' },
      ],
    },
  ],
  'testing:sprint-board': [
    {
      id: 'todo',
      label: 'TO DO',
      tasks: [
        { id: 't8', title: 'Sprint planning', priority: 'normal', hasDescription: true },
        { id: 't9', title: 'Demo prep', priority: 'low' },
      ],
    },
    {
      id: 'in-progress',
      label: 'IN PROGRESS',
      tasks: [
        {
          id: 't9b',
          title: 'Board polish',
          priority: 'high',
          assignee: 'RR',
          dueDate: '2/8/26',
          hasAttachment: true,
          tags: [{ label: 'customer', tone: 'magenta' }],
        },
      ],
    },
    {
      id: 'pending-review',
      label: 'QA PENDING REVIEW',
      tasks: [
        {
          id: 't9c',
          title: 'QA checklist review',
          priority: 'high',
          assignee: 'AK',
          dueDate: 'Oct 29',
          hasDescription: true,
        },
      ],
    },
  ],
  'testing:bugs': [
    {
      id: 'todo',
      label: 'TO DO',
      tasks: [
        {
          id: 't10',
          title: 'Fix sidebar active state',
          priority: 'urgent',
          hasDescription: true,
        },
        { id: 't11', title: 'Dropdown overflow', priority: 'high' },
      ],
    },
  ],
}

const STATUS_ORDER: SpaceTaskStatus[] = [
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
  'completed',
]

const STATUS_META: Record<SpaceTaskStatus, { label: string; badgeClass: string }> = {
  open: { label: STATUS_BADGE_META.open.label, badgeClass: badgeClassFor('open') },
  todo: { label: STATUS_BADGE_META.todo.label, badgeClass: badgeClassFor('todo') },
  'in-progress': {
    label: STATUS_BADGE_META['in-progress'].label,
    badgeClass: badgeClassFor('in-progress'),
  },
  paused: { label: STATUS_BADGE_META.paused.label, badgeClass: badgeClassFor('paused') },
  qa: { label: STATUS_BADGE_META.qa.label, badgeClass: badgeClassFor('qa') },
  'pending-review': {
    label: STATUS_BADGE_META['pending-review'].label,
    badgeClass: badgeClassFor('pending-review'),
  },
  blocked: { label: STATUS_BADGE_META.blocked.label, badgeClass: badgeClassFor('blocked') },
  'qa-rejected': {
    label: STATUS_BADGE_META['qa-rejected'].label,
    badgeClass: badgeClassFor('qa-rejected'),
  },
  cancelled: {
    label: STATUS_BADGE_META.cancelled.label,
    badgeClass: badgeClassFor('cancelled'),
  },
  closed: { label: STATUS_BADGE_META.closed.label, badgeClass: badgeClassFor('closed') },
  completed: {
    label: STATUS_BADGE_META.completed.label,
    badgeClass: badgeClassFor('completed'),
  },
}

export function getProjectStatusGroups(spaceId: string, projectId: string): SpaceStatusGroup[] {
  const raw = tasksByProject[`${spaceId}:${projectId}`]
  if (!raw) {
    return [
      {
        id: 'todo',
        label: STATUS_META.todo.label,
        badgeClass: STATUS_META.todo.badgeClass,
        tasks: [],
      },
    ]
  }

  return raw.map((group) => ({
    id: group.id,
    label: group.label,
    badgeClass: group.badgeClass ?? badgeClassFor(group.id),
    tasks: group.tasks.map((task) => ({ ...task, projectId })),
  }))
}

/** Flatten all projects in a space into status-group cards (list view) */
export function getSpaceStatusGroups(spaceId: string): SpaceStatusGroup[] {
  const space = findSpace(spaceId)
  if (!space) return []

  const byStatus = new Map<SpaceTaskStatus, SpaceTask[]>()

  for (const project of space.projects) {
    for (const group of getProjectStatusGroups(spaceId, project.id)) {
      const existing = byStatus.get(group.id) ?? []
      byStatus.set(group.id, [...existing, ...group.tasks])
    }
  }

  return STATUS_ORDER.filter((id) => byStatus.has(id)).map((id) => ({
    id,
    label: STATUS_META[id].label,
    badgeClass: STATUS_META[id].badgeClass,
    tasks: byStatus.get(id) ?? [],
  }))
}
