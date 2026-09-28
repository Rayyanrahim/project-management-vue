import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import IconButton from './IconButton.vue'

describe('IconButton', () => {
  it('renders the dashboard outline variant with an accessible label', () => {
    const wrapper = mount(IconButton, {
      attrs: {
        'aria-label': 'Settings',
      },
      props: {
        variant: 'outline',
      },
    })

    const button = wrapper.get('button')

    expect(button.attributes('type')).toBe('button')
    expect(button.attributes('aria-label')).toBe('Settings')
    expect(button.classes()).toEqual(
      expect.arrayContaining([
        'h-7',
        'w-7',
        'cursor-pointer',
        'rounded-md',
        'border',
        'border-surface-muted',
        'bg-white',
        'text-para',
        'hover:bg-surface-hover',
      ]),
    )
  })
})
