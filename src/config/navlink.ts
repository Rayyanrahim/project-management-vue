import type { LucideIcon } from '@lucide/vue'
import {
  House,
} from '@lucide/vue'

export type AppRouteName = string

export type SidebarMatch =
  | { type: 'route-name'; value: AppRouteName }
  | { type: 'route-names'; value: AppRouteName[] }
  | { type: 'route-prefix'; value: string }

export type SidebarNavItem = {
  id: string
  label: string
  icon: LucideIcon
  to: { name: AppRouteName }
  match?: SidebarMatch
  sidebarKey?: string
}

export type SidebarSection = {
  id: string
  heading?: string
  collapsible?: boolean
  defaultOpen?: boolean
  items: SidebarNavItem[]
}

export type SidebarConfig = {
  title: string
  primaryNav?: SidebarNavItem[]
  sections?: SidebarSection[]
}

export type SidebarConfigs = Record<string, SidebarConfig>

// export const sidebarConfigs: SidebarConfigs = {
//   workspace: {
//     title: 'Home',
//     primaryNav: [
//       { id: 'home', label: 'Home', icon: House, to: { name: 'Dashboard' } },
//       { id: 'drafts', label: 'Drafts', icon: FileText, to: { name: 'Drafts' } },
//       { id: 'your-work', label: 'Your work', icon: UserRound, to: { name: 'YourWork' } },
//       { id: 'stickies', label: 'Stickies', icon: StickyNote, to: { name: 'Stickies' } },
//       {
//         id: 'settings',
//         label: 'Settings',
//         icon: SettingsIcon,
//         to: { name: 'Settings' },
//         match: { type: 'route-names', value: ['Settings', 'SettingsProfile', 'SettingsNotifications'] },
//         sidebarKey: 'settings',
//       },
//     ],
//     sections: [
//       {
//         id: 'workspace',
//         heading: 'Workspace',
//         collapsible: true,
//         defaultOpen: true,
//         items: [
//           { id: 'projects', label: 'Projects', icon: Briefcase, to: { name: 'Dashboard' } },
//         ],
//       },
//     ],
//   },
//   settings: {
//     title: 'Settings',
//     primaryNav: [
//       { id: 'settings-overview', label: 'General', icon: SettingsIcon, to: { name: 'Settings' } },
//       { id: 'profile', label: 'Profile', icon: UserRound, to: { name: 'SettingsProfile' } },
//       {
//         id: 'notifications',
//         label: 'Notifications',
//         icon: Bell,
//         to: { name: 'SettingsNotifications' },
//       },
//     ],
//     sections: [
//       {
//         id: 'settings-links',
//         heading: 'Preferences',
//         items: [
//           { id: 'profile-link', label: 'Profile', icon: UserRound, to: { name: 'SettingsProfile' } },
//           {
//             id: 'notifications-link',
//             label: 'Notifications',
//             icon: Bell,
//             to: { name: 'SettingsNotifications' },
//           },
//         ],
//       },
//     ],
//   },

// }



export const sidebarConfigs: SidebarConfigs = {
  workspace: {
    title: 'Home',
    primaryNav: [
      { id: 'home', label: 'Home', icon: House, to: { name: 'Dashboard' } },
    ],
  },
}
