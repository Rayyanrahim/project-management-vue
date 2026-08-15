import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Sheet } from './Sheet.vue'
export { default as SheetContent } from './SheetContent.vue'
export { default as SheetOverlay } from './SheetOverlay.vue'

export const sheetContentVariants = cva(
  'absolute top-0 h-full bg-white shadow-xl transition-transform',
  {
    variants: {
      side: {
        left: 'left-0',
        right: 'right-0',
      },
    },
    defaultVariants: {
      side: 'left',
    },
  },
)

export type SheetContentVariants = VariantProps<typeof sheetContentVariants>
