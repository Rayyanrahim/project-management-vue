<template>
  <AuthHeader title="Welcome back!" prompt="Don't have an account?" :to="{ name: 'Signup' }" link-text="Sign up" />

  <div class="auth-panel">
    <div class="space-y-2">
      <Button type="button" variant="outline" size="lg" class="h-10 w-full">
        <span class="absolute left-3 inline-flex size-5 items-center justify-center">
          <img :src="googleIcon" alt="" class="size-5" />
        </span>
        Continue with Google
      </Button>

      <Button type="button" variant="outline" size="lg" class="h-10 w-full">
        <span class="absolute left-3 inline-flex size-5 items-center justify-center">
          <img :src="githubIcon" alt="" class="size-5" />
        </span>
        Continue with GitHub
      </Button>
    </div>

    <Separator class="mt-4" label="or" />

    <form class="mt-4 space-y-3" @submit.prevent="onSubmit">
      <div>
        <Input id="email" v-model="formData.email" type="email" name="email" autocomplete="email"
          placeholder="Work email" :aria-invalid="Boolean(errors.email)"
          :class="errors.email ? 'outline-red-400 focus:outline-red-400' : undefined" @blur="touch('email')"
          @input="revalidate('email')" />
        <FormError :message="errors.email" />
      </div>

      <div>
        <div class="relative">
          <Input id="password" v-model="formData.password" :type="showPassword ? 'text' : 'password'" name="password"
            autocomplete="current-password" placeholder="Password" :aria-invalid="Boolean(errors.password)"
            :class="['pr-10', errors.password ? 'outline-red-400 focus:outline-red-400' : undefined]"
            @blur="touch('password')" @input="revalidate('password')" />
          <button type="button" class="absolute inset-y-0 right-0 flex items-center px-3 hover:opacity-80"
            :aria-label="showPassword ? 'Hide password' : 'Show password'" @click="showPassword = !showPassword">
            <img :src="showPassword ? eyeOffIcon : eyeIcon" alt="" class="size-5" />
          </button>
        </div>
        <FormError :message="errors.password" />
      </div>

      <FormError :message="loginError" />

      <Button type="submit" size="lg" class="w-full" :disabled="!isFormValid || loading" :loading="loading">
        <img v-if="loading" :src="spinnerIcon" alt="" class="size-5 animate-spin" />
        <template v-else>Log In</template>
      </Button>
    </form>

    <p class="mt-3 text-center text-sm/6">
      <RouterLink :to="{ name: 'ForgotPassword' }" class="auth-link">
        Forgot Password?
      </RouterLink>
    </p>

    <p class="mt-5 text-center text-sm/6">
      <a href="#" class="auth-muted-link">Need help?</a>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormError } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import AuthHeader from '@/components/auth/AuthHeader.vue'
import githubIcon from '@/assets/svg/github.svg'
import googleIcon from '@/assets/svg/google.svg'
import eyeIcon from '@/assets/svg/eye.svg'
import eyeOffIcon from '@/assets/svg/eye-off.svg'
import spinnerIcon from '@/assets/svg/spinner.svg'
import { ApiError } from '@/api/http'
import { useZodForm } from '@/composables/useZodForm'
import { loginSchema } from '@/schemas/auth'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const { loading } = storeToRefs(authStore)
const loginError = ref('')
const showPassword = ref(false)

const {
  values: formData,
  errors,
  validatedData,
  isValid: isFormValid,
  validate,
  touch,
  revalidate,
  setErrors,
} = useZodForm(loginSchema, {
  email: '',
  password: '',
})

const onSubmit = async () => {
  if (!isFormValid.value || loading.value || !validate()) return

  loginError.value = ''

  try {
    await authStore.login(validatedData.value)
    await router.push({ name: 'Dashboard' })
  } catch (error) {
    const isValidationError = error instanceof ApiError
      && error.messageCode === 'VALIDATION_ERROR'
      && error.errors

    if (isValidationError && setErrors(error.errors)) return

    loginError.value = error instanceof ApiError
      ? error.message
      : 'Unable to log in. Please try again.'
  }
}
</script>
