import { inject, provide, type InjectionKey, type Ref } from 'vue'

export { default as Dropdown } from './Dropdown.vue'
export { default as DropdownTrigger } from './DropdownTrigger.vue'
export { default as DropdownContent } from './DropdownContent.vue'
export { default as DropdownItem } from './DropdownItem.vue'
export { default as DropdownSub } from './DropdownSub.vue'
export { default as DropdownSubContent } from './DropdownSubContent.vue'
export { default as DropdownSubTrigger } from './DropdownSubTrigger.vue'
export { default as DropdownSubmenu } from './DropdownSubmenu.vue'

type DropdownContext = {
  open: Ref<boolean>
  contentId: string
  triggerId: string
  rootRef: Ref<HTMLElement | null>
  triggerRef: Ref<HTMLElement | null>
  contentRef: Ref<HTMLElement | null>
  setOpen: (value: boolean) => void
  toggle: () => void
  close: () => void
}

type DropdownSubContext = {
  open: Ref<boolean>
  triggerRef: Ref<HTMLElement | null>
  contentRef: Ref<HTMLElement | null>
  panelPosition: Ref<{ top: number; left: number }>
  resolvedSide: Ref<'left' | 'right'>
  preferredSide: Ref<'left' | 'right' | 'auto'>
  sideOffset: Ref<number>
  setOpen: (value: boolean) => Promise<void> | void
  toggle: () => Promise<void> | void
  close: () => void
  updatePosition: () => void
}

const dropdownContextKey = Symbol('dropdown-context') as InjectionKey<DropdownContext>
const dropdownSubContextKey = Symbol('dropdown-sub-context') as InjectionKey<DropdownSubContext>

export function provideDropdownContext(context: DropdownContext) {
  provide(dropdownContextKey, context)
}

export function useDropdownContext() {
  const context = inject(dropdownContextKey)

  if (!context) {
    throw new Error('Dropdown components must be used inside Dropdown.')
  }

  return context
}

export function provideDropdownSubContext(context: DropdownSubContext) {
  provide(dropdownSubContextKey, context)
}

export function useDropdownSubContext() {
  const context = inject(dropdownSubContextKey)

  if (!context) {
    throw new Error('Dropdown submenu components must be used inside DropdownSub.')
  }

  return context
}

let dropdownId = 0

export function createDropdownIds() {
  dropdownId += 1

  return {
    triggerId: `dropdown-trigger-${dropdownId}`,
    contentId: `dropdown-content-${dropdownId}`,
  }
}
