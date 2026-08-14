import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Input } from './Input.vue'

export const inputVariants = cva(
  'block w-full rounded-md px-3 py-1.5 text-base sm:text-sm/6',
  {
    variants: {
      variant: {
        light:
          'bg-white text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary',
      },
    },
    defaultVariants: {
      variant: 'light',
    },
  },
)

export type InputVariants = VariantProps<typeof inputVariants>
