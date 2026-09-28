import type {
  DashboardPersonalItem,
  DashboardRecentItem,
  DashboardWorkItem,
} from './types'

export const dashboardUser = {
  name: 'Rayyan',
  workspace: 'Klab Workspace',
}

export const dashboardRecents: DashboardRecentItem[] = [
  {
    id: 'r1',
    title: 'Bug: Desert Camp - Form Submission',
    subtitle: 'Southern Governorate - Revamp',
    kind: 'doc',
    color: '#a952ff',
  },
  {
    id: 'r2',
    title: 'Southern Governorate - Revamp',
    subtitle: '',
    kind: 'list',
    color: '#4f8cff',
  },
  {
    id: 'r3',
    title: 'Prevent Reassignment of an Order to Another Vendor',
    subtitle: 'Faz3a Revamp',
    kind: 'doc',
    color: '#f5a524',
  },
  {
    id: 'r4',
    title: 'Faz3a Revamp',
    subtitle: '',
    kind: 'list',
    color: '#30a46c',
  },
  {
    id: 'r5',
    title: 'Admin Dashboard: Improve Casework Flow',
    subtitle: 'Southern Governorate - Revamp',
    kind: 'doc',
    color: '#ec5f8a',
  },
  {
    id: 'r6',
    title: 'Bug: Custom Form Submission Validation',
    subtitle: 'Southern Governorate - Revamp',
    kind: 'doc',
    color: '#a952ff',
  },
  {
    id: 'r7',
    title: 'QA: Performance Enhancements',
    subtitle: 'Southern Governorate - Revamp',
    kind: 'doc',
    color: '#4f8cff',
  },
]

export const dashboardMyWork: DashboardWorkItem[] = [
  {
    id: 'w1',
    title: 'Admin Dashboard: Improve People & Access resources',
    project: 'Platform',
    status: 'done',
    due: '8/7/26',
    priority: 'none',
    hasDescription: true,
    hasAttachment: true,
    tags: [{ label: 'customer', tone: 'magenta' }],
  },
  {
    id: 'w2',
    title: 'Admin Dashboard: Improve Publishing resources',
    project: 'Platform',
    status: 'done',
    due: '8/7/26',
    priority: 'normal',
    hasDescription: true,
    tags: [{ label: 'employee', tone: 'green' }],
  },
  {
    id: 'w3',
    title: 'Admin Dashboard: Improve Automations resources',
    project: 'Platform',
    status: 'done',
    due: '8/7/26',
    priority: 'none',
    hasDescription: true,
    tags: [{ label: 'vendor', tone: 'lavender' }],
  },
  {
    id: 'w4',
    title: 'Admin Dashboard: Reorganise Nova sidebar into functional sections',
    project: 'Platform',
    status: 'done',
    due: '8/7/26',
    priority: 'none',
    hasDescription: true,
  },
  {
    id: 'w5',
    title: "Bug: 'My Orders' Showing for Guests",
    project: 'Website',
    status: 'done',
    due: '8/6/26',
    priority: 'high',
    hasDescription: true,
    hasAttachment: true,
    tags: [{ label: 'bug', tone: 'lavender' }],
  },
  {
    id: 'w6',
    title: 'Wire empty states for Inbox tabs',
    project: 'Platform',
    status: 'in_progress',
    due: 'Today',
    priority: 'high',
    hasDescription: true,
    tags: [{ label: 'admin dashboard', tone: 'lavender' }],
  },
  {
    id: 'w7',
    title: 'Fix date picker overflow on mobile',
    project: 'Website Redesign',
    status: 'todo',
    due: 'Today',
    priority: 'urgent',
    tags: [
      { label: 'ui / ux', tone: 'grey' },
      { label: 'web', tone: 'blue' },
    ],
  },
]

export const dashboardPersonalList: DashboardPersonalItem[] = [
  { id: 'p1', title: 'Finalize campaign brief', done: false },
  { id: 'p2', title: 'Review sprint notes', done: false },
  { id: 'p3', title: 'Send weekly update', done: true },
]
