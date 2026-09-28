import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as SegmentedControl } from './SegmentedControl.vue'

export type SegmentedControlOption<T extends string = string> = {
  value: T
  label: string
  disabled?: boolean
}

export const segmentedControlVariants = cva(
  'inline-flex items-center gap-1 rounded-lg bg-surface-hover p-0.5',
  {
    variants: {
      size: {
        sm: '',
        md: '',
      },
    },
    defaultVariants: {
      size: 'sm',
    },
  },
)

export const segmentedControlItemVariants = cva(
  'cursor-pointer rounded-md font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'px-2.5 py-1 text-[12px]',
        md: 'px-3 py-1.5 text-[13px]',
      },
      active: {
        true: 'bg-white text-app-black shadow-sm',
        false: 'text-para hover:text-app-black',
      },
    },
    defaultVariants: {
      size: 'sm',
      active: false,
    },
  },
)

export type SegmentedControlVariants = VariantProps<typeof segmentedControlVariants>
