import type { RouteRecordRaw } from 'vue-router'

const AppLayout = () => import('@/layouts/AppLayout.vue')
const Dashboard = () => import('@/views/app/Dashboard.vue')
const Inbox = () => import('@/views/app/Inbox.vue')
export const appRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: Dashboard,
      },
      {
        path: '/inbox',
        name: 'Inbox',
        component: Inbox,
      }
    ],
  },
]
