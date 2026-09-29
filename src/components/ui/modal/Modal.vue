<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import {
  modalPanelVariants,
  modalPositionVariants,
  provideModal,
  type ModalPanelVariants,
  type ModalPosition,
} from '.'
import ModalOverlay from './ModalOverlay.vue'

const model = defineModel<boolean>({ default: false })
const fullscreenModel = defineModel<boolean>('fullscreen')

const props = withDefaults(
  defineProps<{
    size?: ModalPanelVariants['size']
    /** Where the modal sits when not fullscreen */
    position?: ModalPosition
    /** Open in fullscreen every time the modal opens */
    defaultFullscreen?: boolean
    class?: HTMLAttributes['class']
    overlayClass?: HTMLAttributes['class']
    closeOnOverlay?: boolean
    closeOnEscape?: boolean
  }>(),
  {
    size: 'md',
    position: 'center',
    defaultFullscreen: false,
    closeOnOverlay: true,
    closeOnEscape: true,
  },
)

const fullscreen = ref(props.defaultFullscreen)

const resolvedPosition = computed(() =>
  fullscreen.value ? 'center' : props.position,
)

watch(
  fullscreenModel,
  (value) => {
    if (typeof value === 'boolean') {
      fullscreen.value = value
    }
  },
  { immediate: true },
)

watch(fullscreen, (value) => {
  fullscreenModel.value = value
})

watch(model, (open) => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = open ? 'hidden' : ''

  if (open) {
    fullscreen.value =
      typeof fullscreenModel.value === 'boolean'
        ? fullscreenModel.value
        : props.defaultFullscreen
  }
})

function close() {
  model.value = false
}

function toggleFullscreen() {
  fullscreen.value = !fullscreen.value
}

function setFullscreen(value: boolean) {
  fullscreen.value = value
}

function onOverlayClick() {
  if (!props.closeOnOverlay || fullscreen.value) return
  close()
}

function onKeydown(event: KeyboardEvent) {
  if (!model.value || !props.closeOnEscape) return
  if (event.key === 'Escape') {
    event.preventDefault()
    close()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})

provideModal({
  close,
  fullscreen,
  toggleFullscreen,
  setFullscreen,
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-root">
      <div
        v-if="model"
        role="presentation"
        :class="
          cn(
            modalPositionVariants({
              position: resolvedPosition,
              fullscreen,
            }),
          )
        "
      >
        <Transition name="modal-overlay" appear>
          <ModalOverlay
            v-if="model"
            :class="cn(fullscreen && 'bg-black/50', overlayClass)"
            @click="onOverlayClick"
          />
        </Transition>

        <Transition
          :name="fullscreen ? 'modal-panel-full' : 'modal-panel'"
          appear
        >
          <div
            v-if="model"
            role="dialog"
            aria-modal="true"
            :class="
              cn(
                modalPanelVariants({ size, fullscreen }),
                props.class,
              )
            "
            @click.stop
          >
            <slot />
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Root fade */
.modal-root-enter-active,
.modal-root-leave-active {
  transition: opacity 200ms cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-root-enter-from,
.modal-root-leave-to {
  opacity: 0;
}

/* Overlay — ClickUp-like soft fade */
.modal-overlay-enter-active {
  transition: opacity 220ms cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-overlay-leave-active {
  transition: opacity 160ms ease-in;
}

.modal-overlay-enter-from,
.modal-overlay-leave-to {
  opacity: 0;
}

/* Windowed panel — scale + lift like ClickUp */
.modal-panel-enter-active {
  transition:
    opacity 240ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 240ms cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-panel-leave-active {
  transition:
    opacity 160ms ease-in,
    transform 160ms ease-in;
}

.modal-panel-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.96);
}

.modal-panel-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}

/* Fullscreen panel — expand feel */
.modal-panel-full-enter-active {
  transition:
    opacity 260ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 260ms cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-panel-full-leave-active {
  transition:
    opacity 160ms ease-in,
    transform 160ms ease-in;
}

.modal-panel-full-enter-from {
  opacity: 0;
  transform: scale(0.985);
}

.modal-panel-full-leave-to {
  opacity: 0;
  transform: scale(0.99);
}
</style>
