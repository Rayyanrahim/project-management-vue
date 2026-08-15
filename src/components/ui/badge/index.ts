import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Badge } from './Badge.vue'

export const badgeVariants = cva('inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[11px] font-semibold', {
  variants: {
    variant: {
      default: 'bg-gray-100 text-gray-700',
      accent: 'bg-rose-500 text-white',
      blue: 'bg-sky-600 text-white',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export type BadgeVariants = VariantProps<typeof badgeVariants>
