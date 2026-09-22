<template>
  <div class="auth-container">
    <div class="auth-content">
      <AuthHeader
        title="Check your inbox"
        prompt="Remember password?"
        :to="{ name: 'Login' }"
        link-text="Sign in"
      />

      <div class="auth-panel">
        <p class="text-center text-sm/6 text-gray-500">
          If an account exists for the email you entered, you'll receive a notification with
          password reset instructions.
        </p>

        <div class="mt-4 text-center">
          <button
            type="button"
            class="auth-link cursor-pointer border-0 bg-transparent p-0 text-sm/6"
            :disabled="loading"
            :data-loading="loading || undefined"
            :aria-busy="loading"
            @click="onResend"
          >
            Resend link
          </button>

          <p
            v-if="feedbackMessage"
            class="mt-2 text-sm/6"
            :class="feedbackType === 'error' ? 'text-red-400' : 'text-green-600'"
            :role="feedbackType === 'error' ? 'alert' : 'status'"
          >
            {{ feedbackMessage }}
          </p>
        </div>
      </div>
    </div>

    <p class="auth-help">
      <a href="#" class="auth-muted-link">Need help?</a>
    </p>
  </div>
</template>

<script setup>
import { onBeforeUnmount, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import AuthHeader from '@/components/auth/AuthHeader.vue'

const authStore = useAuthStore()
const { loading, passwordResetEmail } = storeToRefs(authStore)
const feedbackMessage = ref('')
const feedbackType = ref('')
let successMessageTimer

const clearSuccessMessageTimer = () => {
  if (successMessageTimer) {
    clearTimeout(successMessageTimer)
    successMessageTimer = undefined
  }
}

const onResend = async () => {
  if (loading.value) return

  clearSuccessMessageTimer()
  feedbackMessage.value = ''
  feedbackType.value = ''

  if (!passwordResetEmail.value) {
    feedbackType.value = 'error'
    feedbackMessage.value = 'Something went wrong. Please try again.'
    return
  }

  try {
    await authStore.forgotPassword({ email: passwordResetEmail.value })
    feedbackType.value = 'success'
    feedbackMessage.value = 'A reset link has been sent.'
    successMessageTimer = setTimeout(() => {
      feedbackMessage.value = ''
      feedbackType.value = ''
      successMessageTimer = undefined
    }, 2_000)
  } catch {
    feedbackType.value = 'error'
    feedbackMessage.value = 'Something went wrong. Please try again.'
  }
}

onBeforeUnmount(clearSuccessMessageTimer)
</script>
