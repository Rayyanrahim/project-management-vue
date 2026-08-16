import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useSidebarStore = defineStore('sidebar', () => {
  const desktopSidebarOpen = ref(true)
  const mobileSidebarOpen = ref(false)

  const desktopSidebarHidden = computed(() => !desktopSidebarOpen.value)
  const mobileSidebarHidden = computed(() => !mobileSidebarOpen.value)

  function closeDesktopSidebar() {
    desktopSidebarOpen.value = false
  }

  function openDesktopSidebar() {
    desktopSidebarOpen.value = true
  }

  function toggleDesktopSidebar() {
    desktopSidebarOpen.value = !desktopSidebarOpen.value
  }

  function openMobileSidebar() {
    mobileSidebarOpen.value = true
  }

  function closeMobileSidebar() {
    mobileSidebarOpen.value = false
  }

  function setMobileSidebarOpen(nextValue: boolean) {
    mobileSidebarOpen.value = nextValue
  }

  function openSidebar(mode: 'desktop' | 'mobile') {
    if (mode === 'mobile') {
      mobileSidebarOpen.value = true
      return
    }

    desktopSidebarOpen.value = true
  }

  function closeSidebar(mode: 'desktop' | 'mobile') {
    if (mode === 'mobile') {
      mobileSidebarOpen.value = false
      return
    }

    desktopSidebarOpen.value = false
  }

  return {
    desktopSidebarOpen,
    desktopSidebarHidden,
    mobileSidebarOpen,
    mobileSidebarHidden,
    closeDesktopSidebar,
    openDesktopSidebar,
    toggleDesktopSidebar,
    openMobileSidebar,
    closeMobileSidebar,
    setMobileSidebarOpen,
    openSidebar,
    closeSidebar,
  }
})
