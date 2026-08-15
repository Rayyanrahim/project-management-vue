import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Card } from './Card.vue'

export const cardVariants = cva('rounded-lg border border-[var(--color-border-default)] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]', {
  variants: {
    variant: {
      default: '',
      subtle: 'bg-gray-50/70',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export type CardVariants = VariantProps<typeof cardVariants>
