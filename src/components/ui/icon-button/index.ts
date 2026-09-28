import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as IconButton } from './IconButton.vue'

export const iconButtonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center rounded-md text-para transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        ghost: 'hover:bg-surface-hover hover:text-app-black',
        outline: 'border border-surface-muted bg-white hover:bg-surface-hover hover:text-app-black',
        subtle: 'bg-surface-hover hover:bg-gray-200 hover:text-app-black',
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
