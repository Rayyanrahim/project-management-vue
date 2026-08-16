import { describe, it, expect } from 'vitest'
import { nextTick } from 'vue'

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

    expect(wrapper.text()).toContain('Home')
    expect(wrapper.text()).toContain('Search')
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
    expect(wrapper.get('[data-testid="desktop-sidebar"]').classes()).toContain('app-sidebar-desktop-open')

    await wrapper.get('[data-testid="desktop-sidebar"] [aria-label="Collapse sidebar"]').trigger('click')
    await nextTick()

    expect(wrapper.get('[data-testid="desktop-sidebar"]').classes()).toContain('app-sidebar-desktop-closed')
    expect(wrapper.find('[aria-label="Open desktop sidebar"]').exists()).toBe(true)

    await wrapper.get('[aria-label="Open desktop sidebar"]').trigger('click')
    await nextTick()

    expect(wrapper.get('[data-testid="desktop-sidebar"]').classes()).toContain('app-sidebar-desktop-open')
  })

  it('opens the mobile sidebar from the page header and closes it from the sidebar panel button', async () => {
    await router.push('/')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [createPinia(), router],
      },
    })

    expect(wrapper.get('[data-testid="mobile-sidebar"]').classes()).toContain('app-sidebar-mobile-closed')

    await wrapper.get('[aria-label="Open mobile sidebar"]').trigger('click')
    await nextTick()

    expect(wrapper.get('[data-testid="mobile-sidebar"]').classes()).toContain('app-sidebar-mobile-open')

    await wrapper.get('[data-testid="mobile-sidebar"] [aria-label="Collapse sidebar"]').trigger('click')
    await nextTick()

    expect(wrapper.get('[data-testid="mobile-sidebar"]').classes()).toContain('app-sidebar-mobile-closed')
  })
})
