import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Switch } from './Switch.vue'

export const switchVariants = cva(
  'relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      checked: {
        true: 'bg-primary',
        false: 'bg-[#d1d5db]',
      },
    },
    defaultVariants: {
      checked: false,
    },
  },
)

export type SwitchVariants = VariantProps<typeof switchVariants>
