import { readonly, ref } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'
export type ToastPosition =
  'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'

export interface ToastAction {
  label: string
  onClick: () => void
}

export interface ToastOptions {
  description?: string
  duration?: number
  action?: ToastAction
  loading?: boolean
  position?: ToastPosition
}

export interface ToastItem extends ToastOptions {
  id: string
  title: string
  type: ToastType
  duration: number
  position: ToastPosition
}

const DEFAULT_DURATION = 5_000
const DEFAULT_POSITION: ToastPosition = 'bottom-left'
const items = ref<ToastItem[]>([])
const timers = new Map<string, ReturnType<typeof setTimeout>>()
let nextId = 0

const dismiss = (id: string) => {
  const timer = timers.get(id)
  if (timer) clearTimeout(timer)
  timers.delete(id)
  items.value = items.value.filter((item) => item.id !== id)
}

const show = (title: string, options: ToastOptions = {}, type: ToastType = 'info') => {
  const id = `toast-${++nextId}`
  const duration = options.duration ?? DEFAULT_DURATION
  const position = options.position ?? DEFAULT_POSITION

  items.value = [...items.value, { ...options, id, title, type, duration, position }]

  if (duration > 0) {
    timers.set(
      id,
      setTimeout(() => dismiss(id), duration),
    )
  }

  return id
}

const clear = () => {
  timers.forEach((timer) => clearTimeout(timer))
  timers.clear()
  items.value = []
}

export const toast = {
  show: (title: string, options?: ToastOptions) => show(title, options),
  success: (title: string, options?: ToastOptions) => show(title, options, 'success'),
  error: (title: string, options?: ToastOptions) => show(title, options, 'error'),
  warning: (title: string, options?: ToastOptions) => show(title, options, 'warning'),
  info: (title: string, options?: ToastOptions) => show(title, options, 'info'),
  dismiss,
  clear,
}

export function useToast() {
  return toast
}

export const toastItems = readonly(items)
