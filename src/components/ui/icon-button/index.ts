import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as IconButton } from './IconButton.vue'

export const iconButtonVariants = cva(
  'inline-flex items-center justify-center rounded-lg text-gray-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400',
  {
    variants: {
      variant: {
        ghost: 'hover:bg-gray-100 hover:text-gray-900',
        outline: 'border border-[var(--color-border-default)] bg-white hover:bg-gray-50 hover:text-gray-900',
        subtle: 'bg-gray-100 hover:bg-gray-200 hover:text-gray-900',
      },
      size: {
        sm: 'h-7 w-7',
        md: 'h-8 w-8',
      },
    },
    defaultVariants: {
      variant: 'ghost',
      size: 'sm',
    },
  },
)

export type IconButtonVariants = VariantProps<typeof iconButtonVariants>
