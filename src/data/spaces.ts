import type { LucideIcon } from '@lucide/vue'
import { FolderKanban, Layers, ListTodo, Users } from '@lucide/vue'

/** Backend-shaped types — swap static data for API later */
export type SpaceProject = {
  id: string
  name: string
  icon?: LucideIcon
}

export type Space = {
  id: string
  name: string
  icon: LucideIcon
  projects: SpaceProject[]
}

/** Static for now — replace with API fetch later */
export const spaces: Space[] = [
  {
    id: 'team-space',
    name: 'Team Space',
    icon: Users,
    projects: [
      { id: 'marketing', name: 'Marketing', icon: ListTodo },
      { id: 'product-launch', name: 'Product Launch', icon: ListTodo },
    ],
  },
  {
    id: 'test',
    name: 'Test',
    icon: FolderKanban,
    projects: [
      { id: 'qa-checklist', name: 'QA Checklist', icon: ListTodo },
    ],
  },
  {
    id: 'testing',
    name: 'Testing',
    icon: Layers,
    projects: [
      { id: 'sprint-board', name: 'Sprint Board', icon: ListTodo },
      { id: 'bugs', name: 'Bugs', icon: ListTodo },
    ],
  },
]

export function findSpace(spaceId: string) {
  return spaces.find((space) => space.id === spaceId) ?? null
}

export function findProject(spaceId: string, projectId: string) {
  const space = findSpace(spaceId)
  if (!space) return null
  return space.projects.find((project) => project.id === projectId) ?? null
}
