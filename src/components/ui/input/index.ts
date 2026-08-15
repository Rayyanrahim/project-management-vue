import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Input } from './Input.vue'

export const inputVariants = cva(
  'block w-full rounded-md px-3 py-1.5 text-base sm:text-sm/6',
  {
    variants: {
      variant: {
        light:
          'bg-white text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:rounded-md focus:outline-1 focus:-outline-offset-1 focus:outline-gray-900 focus:ring-2 focus:ring-gray-300',
      },
    },
    defaultVariants: {
      variant: 'light',
    },
  },
)

export type InputVariants = VariantProps<typeof inputVariants>
