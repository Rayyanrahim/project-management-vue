<template>
  <div class="auth-container">
    <div class="auth-content">
      <AuthHeader
        title="Forgot your password?"
        prompt="Remember password?"
        :to="{ name: 'Login' }"
        link-text="Sign in"
      />

      <div class="auth-panel">
        <form class="space-y-4" @submit.prevent="onSubmit">
          <div>
            <Input
              id="email"
              v-model="formData.email"
              type="email"
              name="email"
              autocomplete="email"
              placeholder="Work email"
              :aria-invalid="Boolean(errors.email)"
              @blur="touch('email')"
              @input="revalidate('email')"
            />
            <FormError :message="errors.email" />
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
            <template v-else>Send me the link</template>
          </Button>
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
import { forgotPasswordSchema } from '@/schemas/auth'
import spinnerIcon from '@/assets/svg/spinner.svg'
import AuthHeader from '@/components/auth/AuthHeader.vue'
import { Button } from '@/components/ui/button'
import { FormError } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

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
  touch,
  revalidate,
  setErrors,
} = useZodForm(forgotPasswordSchema, { email: '' })

async function onSubmit() {
  if (!isFormValid.value || loading.value || !validate()) return
  submitError.value = ''

  try {
    await authStore.forgotPassword(validatedData.value)
    await router.push({ name: 'LoginRecover' })
  } catch (error) {
    if (error instanceof ApiError && error.errors && setErrors(error.errors)) return
    submitError.value = error instanceof ApiError ? error.message : 'Unable to send the reset link.'
  }
}
</script>
