<template>
  <AuthHeader
    title="Seconds to sign up!"
    prompt="Already have an account?"
    :to="{ name: 'Login' }"
    link-text="Sign in"
  />

  <div class="auth-panel">
    <Button type="button" variant="outline" size="lg" class="h-10 w-full">
      <span class="absolute left-3 inline-flex size-5 items-center justify-center">
        <img :src="googleIcon" alt="" class="size-5" />
      </span>
      Continue with Google
    </Button>

    <Separator class="mt-4" label="or" />

    <form class="mt-4 space-y-3" @submit.prevent="onSubmit">
      <div>
        <Input
          id="name"
          v-model="formData.name"
          type="text"
          name="name"
          autocomplete="name"
          placeholder="Name"
          :aria-invalid="Boolean(errors.name)"
          @blur="touch('name')"
          @input="revalidate('name')"
        />
        <FormError :message="errors.name" />
      </div>

      <div>
        <Input
          id="email"
          v-model="formData.email"
          type="email"
          name="email"
          autocomplete="email"
          placeholder="Work Email"
          :aria-invalid="Boolean(errors.email)"
          @blur="touch('email')"
          @input="revalidate('email')"
        />
        <FormError :message="errors.email" />
      </div>

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
        :disabled="!isFormValid || loading"
        :loading="loading"
      >
        <img v-if="loading" :src="spinnerIcon" alt="" class="size-5 animate-spin" />
        <template v-else>Sign up with Email</template>
      </Button>
    </form>

    <p class="mt-5 text-center text-xs/5 text-gray-500">
      By continuing, you agree to our
      <a href="#" class="font-medium text-gray-700 hover:text-gray-900 hover:underline">
        Terms of Service
      </a>
      and
      <a href="#" class="font-medium text-gray-700 hover:text-gray-900 hover:underline">
        Privacy Policy </a
      >.
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
import { registerSchema } from '@/schemas/auth'
import { toast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { FormError } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import AuthHeader from '@/components/auth/AuthHeader.vue'
import googleIcon from '@/assets/svg/google.svg'
import eyeIcon from '@/assets/svg/eye.svg'
import eyeOffIcon from '@/assets/svg/eye-off.svg'
import spinnerIcon from '@/assets/svg/spinner.svg'

const router = useRouter()
const authStore = useAuthStore()
const { loading } = storeToRefs(authStore)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
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
} = useZodForm(registerSchema, {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

async function onSubmit() {
  if (!isFormValid.value || loading.value || !validate()) return
  submitError.value = ''

  try {
    const { name, email, password } = validatedData.value
    await authStore.register({ name, email, password })
    await router.push({ name: 'VerifyEmail' })
  } catch (error) {
    if (error instanceof ApiError && error.errors && setErrors(error.errors)) {
      toast.error('Validation error', {
        description: error.message,
        position: 'top-right',
      })
      return
    }

    submitError.value = error instanceof ApiError ? error.message : 'Unable to create your account.'
  }
}
</script>
