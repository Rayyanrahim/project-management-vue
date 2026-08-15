import { createRouter, createWebHistory } from 'vue-router'

const Index = () => import('@/views/Index.vue')
const AuthLayout = () => import('@/layouts/AuthLayout.vue')
const Login = () => import('@/views/auth/Login.vue')
const Signup = () => import('@/views/auth/Signup.vue')
const ForgotPassword = () => import('@/views/auth/ForgotPassword.vue')
const VerifyEmail = () => import('@/views/auth/VerifyEmail.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
    },
    {
      path: '/login',
      component: AuthLayout,
      children: [
        {
          path: '',
          name: 'Login',
          component: Login,
        },
      ],
    },
    {
      path: '/signup',
      component: AuthLayout,
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
      children: [
        {
          path: '',
          name: 'VerifyEmail',
          component: VerifyEmail,
        },
      ],
    },
  ],
})

export default router
