import type { RouteRecordRaw } from 'vue-router'

const AuthLayout = () => import('@/layouts/AuthLayout.vue')
const Login = () => import('@/views/auth/Login.vue')
const LoginRecover = () => import('@/views/auth/LoginRecover.vue')
const Signup = () => import('@/views/auth/Signup.vue')
const ForgotPassword = () => import('@/views/auth/ForgotPassword.vue')
const VerifyEmail = () => import('@/views/auth/VerifyEmail.vue')
const ConfirmPassword = () => import('@/views/auth/ConfirmPassword.vue')

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: AuthLayout,
    meta: { guestOnly: true },
    children: [
      {
        path: '',
        name: 'Login',
        component: Login,
      },
      {
        path: 'recover',
        name: 'LoginRecover',
        component: LoginRecover,
      },
    ],
  },
  {
    path: '/signup',
    component: AuthLayout,
    meta: { guestOnly: true },
    children: [
      {
        path: '',
        name: 'Signup',
        component: Signup,
      },
    ],
  },
  {
    path: '/forgot-password',
    component: AuthLayout,
    meta: { guestOnly: true },
    children: [
      {
        path: '',
        name: 'ForgotPassword',
        component: ForgotPassword,
      },
    ],
  },
  {
    path: '/verify-email',
    component: AuthLayout,
    meta: { requiresAuth: true, allowUnverified: true },
    children: [
      {
        path: '',
        name: 'VerifyEmail',
        component: VerifyEmail,
      },
    ],
  },
  {
    path: '/confirm-password',
    component: AuthLayout,
    meta: { guestOnly: true },
    children: [
      {
        path: '',
        name: 'ConfirmPassword',
        component: ConfirmPassword,
      },
    ],
  },
]
