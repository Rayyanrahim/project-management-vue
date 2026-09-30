import type { RouteRecordRaw } from 'vue-router'

const AppLayout = () => import('@/layouts/AppLayout.vue')
const Dashboard = () => import('@/views/app/Dashboard.vue')
const Inbox = () => import('@/views/app/Inbox.vue')
const Space = () => import('@/views/app/Space.vue')
const Project = () => import('@/views/app/Project.vue')

export const appRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: Dashboard,
      },
      {
        path: 'inbox',
        name: 'Inbox',
        component: Inbox,
      },
      {
        path: 'spaces/:spaceId',
        name: 'Space',
        component: Space,
      },
      {
        path: 'spaces/:spaceId/projects/:projectId',
        name: 'Project',
        component: Project,
      },
    ],
  },
]
