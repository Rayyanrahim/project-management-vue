<template>
  <div class="auth-container">
    <div class="auth-content">
      <AuthHeader title="Verify your email" />

      <div class="auth-panel">
        <form class="space-y-4" @submit.prevent="onSubmit">
          <PinInput v-model="formData.otp" :length="6" input-class="h-13 w-13 text-2xl" />
          <FormError :message="errors.otp" />

          <div class="space-y-1 text-center">
            <p class="text-sm/6 text-gray-500">Enter the code we sent to</p>
            <p class="text-base font-medium text-gray-900">{{ authStore.user?.email }}</p>
          </div>

          <FormError :message="submitError" />

          <Button
            type="submit"
            size="lg"
            class="w-full"
            :disabled="!isFormValid || loading"
            :loading="loading"
          >
            <img v-if="loading" :src="spinnerIcon" alt="" class="size-5 animate-spin" />
            <template v-else>Verify</template>
          </Button>

          <p class="text-center text-sm/6 text-gray-500">
            Need a new code? Log in again and we will send one.
            <button type="button" class="auth-link" @click="startOver">Return to login</button>
          </p>

          <p class="text-center text-sm/6 text-gray-500">
            Still nothing? Check your spam or promotional folder.
          </p>
        </form>
      </div>
    </div>

    <p class="auth-help">
      <a href="#" class="auth-muted-link">Need help?</a>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { ApiError } from '@/api/http'
import { useAuthStore } from '@/stores/auth'
import { useZodForm } from '@/composables/useZodForm'
import { verifyOtpSchema } from '@/schemas/auth'
import spinnerIcon from '@/assets/svg/spinner.svg'
import AuthHeader from '@/components/auth/AuthHeader.vue'
import { Button } from '@/components/ui/button'
import { FormError } from '@/components/ui/form'
import { PinInput } from '@/components/ui/pin-input'

const router = useRouter()
const authStore = useAuthStore()
const { loading } = storeToRefs(authStore)
const submitError = ref('')

const {
  values: formData,
  errors,
  validatedData,
  isValid: isFormValid,
  validate,
  setErrors,
} = useZodForm(verifyOtpSchema, { otp: '' })

async function onSubmit() {
  if (!isFormValid.value || loading.value || !validate()) return
  submitError.value = ''

  try {
    await authStore.verifyOtp(validatedData.value)
    await router.push({ name: 'Dashboard' })
  } catch (error) {
    if (error instanceof ApiError && error.errors && setErrors(error.errors)) return
    submitError.value = error instanceof ApiError ? error.message : 'Unable to verify this code.'
  }
}

async function startOver() {
  try {
    await authStore.logout()
  } catch {
    // The store clears the local session even when the remote session is already unavailable.
  }

  await router.replace({ name: 'Login' })
}
</script>
