import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Button } from './Button.vue'

export const buttonVariants = cva(
  'relative flex items-center justify-center cursor-pointer rounded-md font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary-hover focus-visible:outline-primary',
        outline:
          'bg-white text-gray-900 outline-1 -outline-offset-1 outline-gray-300 hover:bg-gray-50 focus-visible:outline-primary',
      },
      size: {
        md: 'px-3 py-1.5 text-sm/6',
        lg: 'py-[10px] px-3 h-8 text-sm/6',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
