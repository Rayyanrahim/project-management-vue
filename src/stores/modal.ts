import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export type ModalId = string

export type ModalPayload = {
  sectionId?: string
  [key: string]: unknown
}

export const useModalStore = defineStore('modal', () => {
  const activeModal = ref<ModalId | null>(null)
  const payload = ref<ModalPayload | null>(null)

  const isOpen = computed(() => activeModal.value != null)

  function openModal(id: ModalId, nextPayload?: ModalPayload) {
    activeModal.value = id
    payload.value = nextPayload ?? null
  }

  function closeModal() {
    activeModal.value = null
    payload.value = null
  }

  function isModalOpen(id: ModalId) {
    return activeModal.value === id
  }

  /** Sidebar / nav actions map 1:1 to a modal id (e.g. `create-space`) */
  function handleAction(action: ModalId, nextPayload?: ModalPayload) {
    openModal(action, nextPayload)
  }

  return {
    activeModal,
    payload,
    isOpen,
    openModal,
    closeModal,
    isModalOpen,
    handleAction,
  }
})
