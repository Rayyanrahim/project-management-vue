import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import App from '../App.vue'
import router from '../router'

describe('App', () => {
  it('renders the app shell dashboard at the root route', async () => {
    router.push('/')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [createPinia(), router],
      },
    })

    expect(wrapper.text()).toContain('Projects')
    expect(wrapper.text()).toContain('Search')
  })

  it('renders settings content when navigating to the settings route', async () => {
    await router.push({ name: 'Settings' })
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [createPinia(), router],
      },
    })

    expect(wrapper.text()).toContain('Settings')
  })

  it('hides the desktop sidebar from its panel button and reopens it from the header', async () => {
    await router.push('/')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [createPinia(), router],
      },
    })

    expect(wrapper.find('[data-testid="desktop-sidebar"]').exists()).toBe(true)

    await wrapper.get('[aria-label="Collapse sidebar"]').trigger('click')

    expect(wrapper.find('[data-testid="desktop-sidebar"]').exists()).toBe(false)
    expect(wrapper.find('[aria-label="Open desktop sidebar"]').exists()).toBe(true)

    await wrapper.get('[aria-label="Open desktop sidebar"]').trigger('click')

    expect(wrapper.find('[data-testid="desktop-sidebar"]').exists()).toBe(true)
  })
})
