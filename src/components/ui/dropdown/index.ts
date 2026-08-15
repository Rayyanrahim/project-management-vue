import { inject, provide, type InjectionKey, type Ref } from 'vue'

export { default as Dropdown } from './Dropdown.vue'
export { default as DropdownTrigger } from './DropdownTrigger.vue'
export { default as DropdownContent } from './DropdownContent.vue'
export { default as DropdownItem } from './DropdownItem.vue'

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

const dropdownContextKey = Symbol('dropdown-context') as InjectionKey<DropdownContext>

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

let dropdownId = 0

export function createDropdownIds() {
  dropdownId += 1

  return {
    triggerId: `dropdown-trigger-${dropdownId}`,
    contentId: `dropdown-content-${dropdownId}`,
  }
}
