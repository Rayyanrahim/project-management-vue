import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Tag } from './Tag.vue'

export const tagVariants = cva(
  'inline-flex max-w-full items-center truncate rounded-full px-1.5 text-[12px] font-normal leading-4',
  {
    variants: {
      tone: {
        magenta: 'bg-tag-magenta text-white',
        green: 'bg-tag-green-bg text-tag-green',
        lavender: 'bg-tag-lavender-bg text-tag-lavender',
        blue: 'bg-tag-blue text-white',
        grey: 'bg-tag-grey-bg text-tag-grey',
      },
    },
    defaultVariants: {
      tone: 'grey',
    },
  },
)

export type TagVariants = VariantProps<typeof tagVariants>
export type TagTone = NonNullable<TagVariants['tone']>
