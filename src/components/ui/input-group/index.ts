import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as InputGroup } from './InputGroup.vue'
export { default as InputGroupAddon } from './InputGroupAddon.vue'

export const inputGroupVariants = cva(
  [
    'group/input-group relative flex w-full items-center rounded-md border border-primary bg-white shadow-[0_0_0_2px_var(--color-primary-ring)] outline-none transition-[color,box-shadow]',
    '[&_input]:min-w-0 [&_input]:flex-1 [&_input]:border-0 [&_input]:bg-transparent [&_input]:px-2 [&_input]:py-0 [&_input]:text-[13px] [&_input]:text-app-black [&_input]:shadow-none [&_input]:outline-none [&_input]:ring-0',
    '[&_input]:placeholder:text-para [&_input]:focus:border-0 [&_input]:focus:outline-none [&_input]:focus:ring-0 [&_input]:focus:shadow-none',
    '[&_input::-webkit-search-cancel-button]:appearance-none [&_input::-webkit-search-decoration]:appearance-none',
  ].join(' '),
)

export const inputGroupAddonVariants = cva(
  'flex h-auto shrink-0 items-center justify-center gap-1 text-para select-none [&>svg]:size-3.5',
  {
    variants: {
      align: {
        'inline-start': 'order-first pl-2',
        'inline-end': 'order-last pr-2',
        'block-start':
          'order-first w-full justify-start px-3 pt-2 [.border-b]:pb-2',
        'block-end':
          'order-last w-full justify-start px-3 pb-2 [.border-t]:pt-2',
      },
    },
    defaultVariants: {
      align: 'inline-start',
    },
  },
)

export type InputGroupVariants = VariantProps<typeof inputGroupVariants>
export type InputGroupAddonVariants = VariantProps<typeof inputGroupAddonVariants>
