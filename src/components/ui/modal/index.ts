import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import { inject, provide, type InjectionKey, type Ref } from 'vue'

export { default as Modal } from './Modal.vue'
export { default as ModalOverlay } from './ModalOverlay.vue'
export { default as ModalHeader } from './ModalHeader.vue'
export { default as ModalContent } from './ModalContent.vue'
export { default as ModalFooter } from './ModalFooter.vue'

export type ModalPosition = 'center' | 'top' | 'bottom' | 'top-center'

export type ModalContext = {
  close: () => void
  fullscreen: Ref<boolean>
  toggleFullscreen: () => void
  setFullscreen: (value: boolean) => void
}

const modalKey = Symbol('modal') as InjectionKey<ModalContext>

export function provideModal(context: ModalContext) {
  provide(modalKey, context)
}

export function useModal() {
  const context = inject(modalKey)

  if (!context) {
    throw new Error('Modal components must be used inside Modal.')
  }

  return context
}

export const modalPositionVariants = cva('fixed inset-0 z-50 flex', {
  variants: {
    position: {
      center: 'items-center justify-center',
      top: 'items-start justify-center',
      'top-center': 'items-start justify-center pt-[min(8vh,72px)]',
      bottom: 'items-end justify-center',
    },
    fullscreen: {
      true: 'p-0',
      false: 'p-3 sm:p-4 md:p-6',
    },
  },
  defaultVariants: {
    position: 'center',
    fullscreen: false,
  },
})

export const modalPanelVariants = cva(
  'relative z-10 flex w-full flex-col overflow-hidden border border-border-default bg-white shadow-[0_16px_48px_rgba(0,0,0,0.18)] transition-[width,height,max-width,max-height,border-radius,margin] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
  {
    variants: {
      size: {
        sm: 'max-w-md',
        md: 'max-w-xl',
        lg: 'max-w-2xl',
        xl: 'max-w-3xl',
        max: 'max-w-[min(100%,1120px)]',
        full: 'max-w-none',
      },
      fullscreen: {
        true: 'h-full max-h-none w-full max-w-none rounded-none border-0',
        false:
          'h-auto max-h-[min(92vh,900px)] min-h-[240px] rounded-xl sm:min-h-[280px]',
      },
    },
    compoundVariants: [
      {
        size: 'full',
        fullscreen: false,
        class: 'max-w-[calc(100%-1.5rem)] sm:max-w-[calc(100%-2rem)]',
      },
      {
        size: 'max',
        fullscreen: false,
        class: 'w-full',
      },
    ],
    defaultVariants: {
      size: 'md',
      fullscreen: false,
    },
  },
)

export const modalHeaderVariants = cva(
  'flex shrink-0 items-center justify-between gap-2 px-4 py-2.5',
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

export const modalFooterVariants = cva(
  'flex shrink-0 items-center justify-between gap-2 px-4 py-3',
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

export type ModalPanelVariants = VariantProps<typeof modalPanelVariants>
export type ModalHeaderVariants = VariantProps<typeof modalHeaderVariants>
export type ModalFooterVariants = VariantProps<typeof modalFooterVariants>
export type ModalPositionVariants = VariantProps<typeof modalPositionVariants>
