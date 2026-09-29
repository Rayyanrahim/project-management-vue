import type { RouteRecordRaw } from 'vue-router'

const AppLayout = () => import('@/layouts/AppLayout.vue')
const Dashboard = () => import('@/views/app/Dashboard.vue')
const Inbox = () => import('@/views/app/Inbox.vue')

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
        path: 'spaces/team',
        name: 'TeamSpace',
        component: Dashboard,
      },
      {
        path: 'spaces/test',
        name: 'TestSpace',
        component: Dashboard,
      },
      {
        path: 'spaces/testing',
        name: 'TestingSpace',
        component: Dashboard,
      },
    ],
  },
]
