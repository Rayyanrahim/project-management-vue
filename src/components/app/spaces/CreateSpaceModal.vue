<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { IconPicker } from '@/components/ui/icon-picker'
import { Input } from '@/components/ui/input'
import { Modal, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/modal'
import { Switch } from '@/components/ui/switch'
import { useModalStore } from '@/stores/modal'

const modalStore = useModalStore()

const open = computed({
  get: () => modalStore.isModalOpen('create-space'),
  set: (value) => {
    if (!value) modalStore.closeModal()
  },
})

const name = ref('')
const description = ref('')
const isPrivate = ref(false)
const selectedIcon = ref<string | null>(null)
const iconColor = ref('#646464')

const iconLetter = computed(() => {
  const trimmed = name.value.trim()
  return trimmed ? trimmed.charAt(0).toUpperCase() : 'S'
})

watch(open, (isOpen) => {
  if (!isOpen) {
    name.value = ''
    description.value = ''
    isPrivate.value = false
    selectedIcon.value = null
    iconColor.value = '#646464'
  }
})

function onContinue() {
  modalStore.closeModal()
}
</script>

<template>
  <Modal v-model="open" size="md" position="center">
    <ModalHeader :show-fullscreen="false" class="items-start px-5 pt-5 pb-3" bordered>
      <div class="pr-2">
        <h2 class="text-[18px] font-semibold leading-6 text-app-black">
          Create a Space
        </h2>
        <p class="mt-1.5 text-[13px] leading-5 text-para">
          A Space represents teams, departments, or groups, each with its own Lists,
          workflows, and settings.
        </p>
      </div>
    </ModalHeader>

    <ModalContent class="space-y-5 px-5 py-4">
      <div class="space-y-2">
        <label class="block text-[13px] font-semibold text-app-black">
          Icon &amp; name
        </label>
        <div class="flex items-center gap-2">
          <IconPicker
            v-model="selectedIcon"
            v-model:color="iconColor"
            :fallback-letter="iconLetter"
          />
          <Input
            v-model="name"
            placeholder="e.g. Marketing, Engineering, HR"
            class="h-9 flex-1"
          />
        </div>
      </div>

      <div class="space-y-2">
        <label class="block text-[13px] font-medium text-para">
          Description (optional)
        </label>
        <Input
          v-model="description"
          placeholder=""
          class="h-9"
        />
      </div>

      <div class="flex items-center justify-between gap-4">
        <div class="min-w-0">
          <div class="text-[13px] font-medium text-app-black">Make Private</div>
          <p class="mt-0.5 text-[12px] leading-4 text-para">
            Only you and invited members have access
          </p>
        </div>
        <Switch v-model="isPrivate" ariaLabel="Make Private" />
      </div>
    </ModalContent>

    <ModalFooter class="justify-end px-5 py-4">
      <Button class="min-w-[96px] px-4" @click="onContinue">
        Continue
      </Button>
    </ModalFooter>
  </Modal>
</template>
