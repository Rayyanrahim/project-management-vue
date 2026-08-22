import { inject, provide, ref, type ComputedRef, type InjectionKey, type Ref } from 'vue'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Tabs } from './Tabs.vue'
export { default as TabsList } from './TabsList.vue'
export { default as TabsTrigger } from './TabsTrigger.vue'
export { default as TabsContent } from './TabsContent.vue'
export { default as TabsSeparator } from './TabsSeparator.vue'

export const tabsListVariants = cva('inline-flex items-stretch', {
  variants: {
    variant: {
      default: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export const tabsTriggerVariants = cva(
  [
    'group relative inline-flex  shrink-0 items-center text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-default)] focus-visible:ring-offset-2',
  ],
  {
    variants: {
      size: {
        sm: 'min-h-8 py-1',
        md: 'min-h-14 py-3',
        lg: 'min-h-16 py-4',
      },
    },
    defaultVariants: {
      size: 'sm',
    },
  },
)

export const tabsTriggerInnerVariants = cva(
  'flex w-full items-center rounded-md cursor-pointer transition-colors',
  {
    variants: {
      size: {
        sm: ' justify-center gap-1.5 p-1 text-[12px]',
        md: 'min-h-13 gap-3 px-3 py-2',
        lg: 'min-h-16 gap-3 px-3 py-2',
      },
    },
    defaultVariants: {
      size: 'sm',
    },
  },
)

export const tabsSeparatorVariants = cva('', {
  variants: {
    inline: {
      true: 'pointer-events-none static my-3 block w-px shrink-0 bg-[var(--color-border-default)]',
      false:
        'pointer-events-none absolute left-0 top-1/2 z-10 w-px -translate-y-1/2 bg-[var(--color-border-default)]',
    },
    size: {
      sm: 'h-10',
      md: 'h-[52px]',
      lg: 'h-16',
    },
  },
  defaultVariants: {
    inline: false,
    size: 'md',
  },
})

export type TabsListVariants = VariantProps<typeof tabsListVariants>
export type TabsTriggerVariants = VariantProps<typeof tabsTriggerVariants>
export type TabsSeparatorVariants = VariantProps<typeof tabsSeparatorVariants>
export type TabsValue = string | undefined

type TabsRootContext = {
  value: ComputedRef<TabsValue>
  isSelected: (tabValue: string) => boolean
  isFirstTrigger: (tabValue: string) => boolean
  setValue: (tabValue: string) => void
  getIds: (tabValue: string) => { triggerId: string; contentId: string }
  registerTrigger: (tabValue: string, element: HTMLButtonElement) => void
  unregisterTrigger: (tabValue: string, element: HTMLButtonElement) => void
  focusAdjacentTrigger: (currentValue: string, direction: 1 | -1) => void
  focusBoundaryTrigger: (position: 'first' | 'last') => void
}

type TabsListContext = {
  separated: Ref<boolean>
}

const tabsRootKey = Symbol('tabs-root') as InjectionKey<TabsRootContext>
const tabsListKey = Symbol('tabs-list') as InjectionKey<TabsListContext>

export function provideTabsRoot(context: TabsRootContext) {
  provide(tabsRootKey, context)
}

export function useTabsRoot() {
  const context = inject(tabsRootKey)

  if (!context) {
    throw new Error('Tabs components must be used inside Tabs.')
  }

  return context
}

export function provideTabsList(context: TabsListContext) {
  provide(tabsListKey, context)
}

export function useTabsList() {
  return inject(tabsListKey, { separated: ref(false) })
}

export function createTabsIds(prefix: string, value: string) {
  const normalizedValue = value.replace(/[^a-zA-Z0-9_-]/g, '-')

  return {
    triggerId: `${prefix}-trigger-${normalizedValue}`,
    contentId: `${prefix}-content-${normalizedValue}`,
  }
}
