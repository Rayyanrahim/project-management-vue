import type { LucideIcon } from '@lucide/vue'
import { House, Inbox, ListTodo } from '@lucide/vue'
import { spaces } from '@/data/spaces'

export type AppRouteName = string

export type SidebarMatch =
  | { type: 'route-name'; value: AppRouteName }
  | { type: 'route-names'; value: AppRouteName[] }
  | { type: 'route-prefix'; value: string }
  | { type: 'route-prefixes'; value: string[] }

export type SidebarNavItem = {
  id: string
  label: string
  icon: LucideIcon
  to: { name: AppRouteName; params?: Record<string, string> }
  match?: SidebarMatch
  sidebarKey?: string
  /** Nested submenu (e.g. projects under a space) */
  children?: SidebarNavItem[]
  defaultOpen?: boolean
  /** Show plus on the right (e.g. create project inside space) */
  showAdd?: boolean
  addAction?: string
}

export type SidebarSection = {
  id: string
  heading?: string
  collapsible?: boolean
  defaultOpen?: boolean
  showAdd?: boolean
  addAction?: string
  items: SidebarNavItem[]
}

export type SidebarConfig = {
  title: string
  primaryNav?: SidebarNavItem[]
  sections?: SidebarSection[]
}

export type SidebarConfigs = Record<string, SidebarConfig>

/** Maps static/API spaces → sidebar items (projects as children) */
export function mapSpacesToNavItems(): SidebarNavItem[] {
  return spaces.map((space) => ({
    id: space.id,
    label: space.name,
    icon: space.icon,
    to: { name: 'Space', params: { view: 'l', spaceId: space.id } },
    match: {
      type: 'route-prefixes',
      value: [`/space/l/${space.id}`, `/space/b/${space.id}`, `/spaces/${space.id}`],
    },
    defaultOpen: true,
    showAdd: true,
    addAction: 'create-project',
    children: space.projects.map((project) => ({
      id: `${space.id}-${project.id}`,
      label: project.name,
      icon: project.icon ?? ListTodo,
      to: {
        name: 'Project',
        params: { spaceId: space.id, projectId: project.id, view: 'l' },
      },
      match: {
        type: 'route-prefixes',
        value: [
          `/spaces/${space.id}/projects/${project.id}/l`,
          `/spaces/${space.id}/projects/${project.id}/b`,
          `/spaces/${space.id}/projects/${project.id}`,
        ],
      },
    })),
  }))
}

export const sidebarConfigs: SidebarConfigs = {
  workspace: {
    title: 'Home',
    primaryNav: [
      { id: 'home', label: 'Home', icon: House, to: { name: 'Dashboard' } },
      { id: 'inbox', label: 'Inbox', icon: Inbox, to: { name: 'Inbox' } },
    ],
    sections: [
      {
        id: 'spaces',
        heading: 'Spaces',
        collapsible: true,
        defaultOpen: true,
        showAdd: true,
        addAction: 'create-space',
        items: mapSpacesToNavItems(),
      },
    ],
  },
}
