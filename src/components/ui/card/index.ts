import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Card } from './Card.vue'
export { default as CardHeader } from './CardHeader.vue'
export { default as CardTitle } from './CardTitle.vue'
export { default as CardContent } from './CardContent.vue'
export { default as CardActions } from './CardActions.vue'
export { default as CardFooter } from './CardFooter.vue'

export const cardVariants = cva(
  'overflow-hidden rounded-xl border border-border-default bg-white',
  {
    variants: {
      variant: {
        default: '',
        subtle: 'bg-page-bg',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export const cardHeaderVariants = cva(
  'flex items-center justify-between gap-2 px-4 py-3',
  {
    variants: {
      bordered: {
        true: 'border-b border-border-default',
        false: '',
      },
    },
    defaultVariants: {
      bordered: true,
    },
  },
)

export const cardFooterVariants = cva(
  'flex items-center justify-between gap-2 px-4 py-3',
  {
    variants: {
      bordered: {
        true: 'border-t border-border-default',
        false: '',
      },
    },
    defaultVariants: {
      bordered: true,
    },
  },
)

export type CardVariants = VariantProps<typeof cardVariants>
export type CardHeaderVariants = VariantProps<typeof cardHeaderVariants>
export type CardFooterVariants = VariantProps<typeof cardFooterVariants>
