<template>
  <AuthHeader
    title="Create a new password!"
    prompt="For security reasons, you will be logged out of all devices after password is changed."
  />

  <div class="auth-panel">
    <form class="space-y-4" @submit.prevent="onSubmit">
      <FormError v-if="invalidToken" message="This password reset link is invalid or incomplete." />

      <div>
        <div class="relative">
          <Input
            id="password"
            v-model="formData.password"
            :type="showPassword ? 'text' : 'password'"
            name="password"
            autocomplete="new-password"
            placeholder="Password"
            class="pr-10"
            :aria-invalid="Boolean(errors.password)"
            @blur="touch('password')"
            @input="revalidate('password')"
          />
          <button
            type="button"
            class="absolute inset-y-0 right-0 flex items-center px-3 hover:opacity-80"
            :aria-label="showPassword ? 'Hide password' : 'Show password'"
            @click="showPassword = !showPassword"
          >
            <img :src="showPassword ? eyeOffIcon : eyeIcon" alt="" class="size-5" />
          </button>
        </div>
        <FormError :message="errors.password" />
      </div>

      <div>
        <div class="relative">
          <Input
            id="confirmPassword"
            v-model="formData.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            name="confirmPassword"
            autocomplete="new-password"
            placeholder="Confirm Password"
            class="pr-10"
            :aria-invalid="Boolean(errors.confirmPassword)"
            @blur="touch('confirmPassword')"
            @input="revalidate('confirmPassword')"
          />
          <button
            type="button"
            class="absolute inset-y-0 right-0 flex items-center px-3 hover:opacity-80"
            :aria-label="showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'"
            @click="showConfirmPassword = !showConfirmPassword"
          >
            <img :src="showConfirmPassword ? eyeOffIcon : eyeIcon" alt="" class="size-5" />
          </button>
        </div>
        <FormError :message="errors.confirmPassword" />
      </div>

      <FormError :message="submitError" />

      <Button
        type="submit"
        size="lg"
        class="w-full"
        :disabled="!isFormValid || loading || invalidToken"
        :loading="loading"
      >
        <img v-if="loading" :src="spinnerIcon" alt="" class="size-5 animate-spin" />
        <template v-else>Confirm Password</template>
      </Button>

      <p v-if="invalidToken" class="text-center text-sm/6">
        <RouterLink :to="{ name: 'ForgotPassword' }" class="auth-link">
          Request another reset link
        </RouterLink>
      </p>
    </form>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { ApiError } from '@/api/http'
import { useAuthStore } from '@/stores/auth'
import { useZodForm } from '@/composables/useZodForm'
import { resetPasswordSchema } from '@/schemas/auth'
import { toast } from '@/components/ui/toast'
import AuthHeader from '@/components/auth/AuthHeader.vue'
import { Button } from '@/components/ui/button'
import { FormError } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import spinnerIcon from '@/assets/svg/spinner.svg'
import eyeIcon from '@/assets/svg/eye.svg'
import eyeOffIcon from '@/assets/svg/eye-off.svg'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { loading } = storeToRefs(authStore)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const submitError = ref('')
const token = typeof route.query.token === 'string' ? route.query.token : ''
const invalidToken = computed(() => !/^[a-f0-9]{64}$/i.test(token))

const {
  values: formData,
  errors,
  validatedData,
  isValid: isFormValid,
  validate,
  touch,
  revalidate,
  setErrors,
} = useZodForm(resetPasswordSchema, {
  token,
  password: '',
  confirmPassword: '',
})

async function onSubmit() {
  if (invalidToken.value || !isFormValid.value || loading.value || !validate()) return
  submitError.value = ''

  try {
    const result = await authStore.resetPassword(validatedData.value)
    toast.success(result.message || 'Password reset successfully.')
    await router.push({ name: 'Login' })
  } catch (error) {
    if (error instanceof ApiError && error.errors && setErrors(error.errors)) return
    submitError.value = error instanceof ApiError ? error.message : 'Unable to reset your password.'
  }
}
</script>
