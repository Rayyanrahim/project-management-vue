import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Input } from './Input.vue'

export const inputVariants = cva(
  'block w-full rounded-md bg-white px-3 py-1.5 text-base outline-1 -outline-offset-1 transition-colors sm:text-sm/6 focus:rounded-md focus:outline-1 focus:-outline-offset-1 focus:ring-2',
  {
    variants: {
      variant: {
        app:
          'text-app-black outline-border-default placeholder:text-para focus:outline-primary focus:ring-primary-ring',
        auth:
          'text-gray-900 outline-gray-300 placeholder:text-gray-400 focus:outline-gray-900 focus:ring-gray-300',
      },
    },
    defaultVariants: {
      variant: 'app',
    },
  },
)

export type InputVariants = VariantProps<typeof inputVariants>
