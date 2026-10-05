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
        path: 'space/:view(l|b)/:spaceId',
        name: 'Space',
        component: Space,
      },
      {
        path: 'spaces/:spaceId',
        redirect: (to) => ({
          name: 'Space',
          params: { view: 'l', spaceId: to.params.spaceId as string },
        }),
      },
      {
        path: 'spaces/:spaceId/projects/:projectId/:view(l|b)',
        name: 'Project',
        component: Project,
      },
      {
        path: 'spaces/:spaceId/projects/:projectId',
        redirect: (to) => ({
          name: 'Project',
          params: {
            spaceId: to.params.spaceId as string,
            projectId: to.params.projectId as string,
            view: 'l',
          },
        }),
      },
    ],
  },
]
