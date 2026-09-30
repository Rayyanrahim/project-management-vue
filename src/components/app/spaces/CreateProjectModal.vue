<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ChevronDown, Search } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from '@/components/ui/dropdown'
import { Input } from '@/components/ui/input'
import { Modal, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/modal'
import { Switch } from '@/components/ui/switch'
import { findSpace, spaces } from '@/data/spaces'
import { useModalStore } from '@/stores/modal'

const modalStore = useModalStore()

const open = computed({
  get: () => modalStore.isModalOpen('create-project'),
  set: (value) => {
    if (!value) modalStore.closeModal()
  },
})

const name = ref('')
const isPrivate = ref(false)
const selectedSpaceId = ref('')
const spaceQuery = ref('')

const selectedSpace = computed(() => findSpace(selectedSpaceId.value))

const spaceLetter = computed(() => {
  const label = selectedSpace.value?.name?.trim() ?? ''
  return label ? label.charAt(0).toUpperCase() : 'S'
})

const filteredSpaces = computed(() => {
  const q = spaceQuery.value.trim().toLowerCase()
  if (!q) return spaces
  return spaces.filter((space) => space.name.toLowerCase().includes(q))
})

watch(open, (isOpen) => {
  if (!isOpen) {
    name.value = ''
    isPrivate.value = false
    selectedSpaceId.value = ''
    spaceQuery.value = ''
    return
  }

  const payloadSpaceId = String(modalStore.payload?.spaceId ?? '')
  selectedSpaceId.value =
    findSpace(payloadSpaceId)?.id ?? spaces[0]?.id ?? ''
})

function selectSpace(spaceId: string) {
  selectedSpaceId.value = spaceId
  spaceQuery.value = ''
}

function onCreate() {
  modalStore.closeModal()
}
</script>

<template>
  <Modal v-model="open" size="md" position="center">
    <ModalHeader :show-fullscreen="false" class="items-start px-5 pt-5 pb-3" bordered>
      <div class="pr-2">
        <h2 class="text-[18px] font-semibold leading-6 text-app-black">
          Create Project
        </h2>
        <p class="mt-1.5 text-[13px] leading-5 text-para">
          All Projects are located within a Space. Projects can house any type of
          task.
        </p>
      </div>
    </ModalHeader>

    <ModalContent class="space-y-5 px-5 py-4">
      <div class="space-y-2">
        <label class="block text-[13px] font-semibold text-app-black">
          Name
        </label>
        <Input
          v-model="name"
          placeholder="Your project name"
          class="h-9"
        />
      </div>

      <div class="space-y-2">
        <label class="block text-[13px] font-medium text-para">
          Space (location)
        </label>

        <Dropdown class="w-full">
          <DropdownTrigger
            class="flex h-9 w-full cursor-pointer items-center gap-2 rounded-lg border border-border-default bg-white px-2.5 text-left text-[14px] text-app-black transition-colors hover:bg-surface-hover"
          >
            <span
              class="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-transparent text-[11px] font-semibold text-app-black"
            >
              <component
                :is="selectedSpace?.icon"
                v-if="selectedSpace?.icon"
                class="h-3.5 w-3.5"
              />
              <template v-else>{{ spaceLetter }}</template>
            </span>
            <span class="min-w-0 flex-1 truncate">
              {{ selectedSpace?.name ?? 'Select a space' }}
            </span>
            <ChevronDown class="h-3.5 w-3.5 shrink-0 text-para" />
          </DropdownTrigger>

          <DropdownContent class="min-w-[320px] p-0 py-0" align="start">
            <div class="border-b border-border-default px-2 py-2" @click.stop>
              <div class="relative">
                <Search
                  class="pointer-events-none absolute top-1/2 left-2 h-3.5 w-3.5 -translate-y-1/2 text-para"
                />
                <Input
                  v-model="spaceQuery"
                  type="search"
                  placeholder="Search spaces..."
                  class="h-8 pl-7 text-[13px]"
                  @keydown.stop
                />
              </div>
            </div>

            <div class="max-h-48 overflow-y-auto py-1 pt-1 pb-2">
              <DropdownItem
                v-for="space in filteredSpaces"
                :key="space.id"
                :icon="space.icon"
                @select="selectSpace(space.id)"
              >
                <span>{{ space.name }}</span>
              </DropdownItem>

              <p
                v-if="filteredSpaces.length === 0"
                class="px-3 py-2 text-[13px] text-para"
              >
                No spaces found
              </p>
            </div>
          </DropdownContent>
        </Dropdown>
      </div>

      <div class="flex items-center justify-between gap-4">
        <div class="min-w-0">
          <div class="text-[13px] font-medium text-app-black">Make private</div>
          <p class="mt-0.5 text-[12px] leading-4 text-para">
            Only you and invited members have access
          </p>
        </div>
        <Switch v-model="isPrivate" ariaLabel="Make private" />
      </div>
    </ModalContent>

    <ModalFooter class="justify-end px-5 py-4">
      <Button class="min-w-[96px] px-4" @click="onCreate">
        Create
      </Button>
    </ModalFooter>
  </Modal>
</template>
