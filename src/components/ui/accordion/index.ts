import { inject, provide, ref, type InjectionKey, type Ref } from 'vue'

export { default as Accordion } from './Accordion.vue'
export { default as AccordionItem } from './AccordionItem.vue'
export { default as AccordionTrigger } from './AccordionTrigger.vue'
export { default as AccordionContent } from './AccordionContent.vue'

export type AccordionType = 'single' | 'multiple'
export type AccordionValue = string | string[] | undefined

type AccordionRootContext = {
  type: AccordionType
  collapsible: boolean
  value: Ref<AccordionValue>
  isItemOpen: (itemValue: string) => boolean
  toggleItem: (itemValue: string) => void
}

type AccordionItemContext = {
  value: string
  isOpen: Ref<boolean>
  triggerId: string
  contentId: string
  toggle: () => void
}

const accordionRootKey = Symbol('accordion-root') as InjectionKey<AccordionRootContext>
const accordionItemKey = Symbol('accordion-item') as InjectionKey<AccordionItemContext>

export function provideAccordionRoot(context: AccordionRootContext) {
  provide(accordionRootKey, context)
}

export function useAccordionRoot() {
  const context = inject(accordionRootKey)

  if (!context) {
    throw new Error('Accordion components must be used inside Accordion.')
  }

  return context
}

export function provideAccordionItem(context: AccordionItemContext) {
  provide(accordionItemKey, context)
}

export function useAccordionItem() {
  const context = inject(accordionItemKey)

  if (!context) {
    throw new Error('AccordionTrigger and AccordionContent must be used inside AccordionItem.')
  }

  return context
}

let accordionId = 0

export function createAccordionItemIds() {
  accordionId += 1

  return {
    triggerId: `accordion-trigger-${accordionId}`,
    contentId: `accordion-content-${accordionId}`,
  }
}
