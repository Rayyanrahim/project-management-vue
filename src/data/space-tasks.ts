export type SpaceTaskPriority = 'none' | 'low' | 'normal' | 'high' | 'urgent'

export type SpaceTask = {
  id: string
  title: string
  priority: SpaceTaskPriority
}

export type SpaceStatusGroup = {
  id: string
  label: string
  tasks: SpaceTask[]
}

/** Static tasks keyed by `${spaceId}:${projectId}` — replace with API later */
const tasksByProject: Record<string, SpaceStatusGroup[]> = {
  'team-space:marketing': [
    {
      id: 'todo',
      label: 'TO DO',
      tasks: [
        { id: 't1', title: 'Task 2', priority: 'none' },
        { id: 't2', title: 'Task 3', priority: 'none' },
        { id: 't3', title: 'Task 1', priority: 'none' },
      ],
    },
  ],
  'team-space:product-launch': [
    {
      id: 'todo',
      label: 'TO DO',
      tasks: [
        { id: 't4', title: 'Launch checklist', priority: 'high' },
        { id: 't5', title: 'Press kit draft', priority: 'normal' },
      ],
    },
  ],
  'test:qa-checklist': [
    {
      id: 'todo',
      label: 'TO DO',
      tasks: [
        { id: 't6', title: 'Regression pass', priority: 'high' },
        { id: 't7', title: 'Smoke tests', priority: 'normal' },
      ],
    },
  ],
  'testing:sprint-board': [
    {
      id: 'todo',
      label: 'TO DO',
      tasks: [
        { id: 't8', title: 'Sprint planning', priority: 'normal' },
        { id: 't9', title: 'Demo prep', priority: 'low' },
      ],
    },
  ],
  'testing:bugs': [
    {
      id: 'todo',
      label: 'TO DO',
      tasks: [
        { id: 't10', title: 'Fix sidebar active state', priority: 'urgent' },
        { id: 't11', title: 'Dropdown overflow', priority: 'high' },
      ],
    },
  ],
}

export function getProjectStatusGroups(spaceId: string, projectId: string): SpaceStatusGroup[] {
  return (
    tasksByProject[`${spaceId}:${projectId}`] ?? [
      {
        id: 'todo',
        label: 'TO DO',
        tasks: [],
      },
    ]
  )
}
