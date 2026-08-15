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
        <Input id="email" v-model="formData.email" type="email" name="email" autocomplete="email" placeholder="Work email"
          :class="emailError ? 'outline-red-400 focus:outline-red-400' : undefined" />
        <p v-if="emailError" class="mt-1.5 text-sm text-red-400">Email required</p>
      </div>

      <div class="relative">
        <Input id="password" v-model="formData.password" :type="showPassword ? 'text' : 'password'" name="password"
          autocomplete="current-password" placeholder="Password" class="pr-10" />
        <button type="button" class="absolute inset-y-0 right-0 flex items-center px-3 hover:opacity-80"
          :aria-label="showPassword ? 'Hide password' : 'Show password'" @click="showPassword = !showPassword">
          <img :src="showPassword ? eyeOffIcon : eyeIcon" alt="" class="size-5" />
        </button>
      </div>

      <Button type="submit" size="lg" class="w-full" :disabled="!isFormValid" :loading="submitting">
        <img v-if="submitting" :src="spinnerIcon" alt="" class="size-5 animate-spin" />
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

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import AuthHeader from '@/components/auth/AuthHeader.vue'
import githubIcon from '@/assets/svg/github.svg'
import googleIcon from '@/assets/svg/google.svg'
import eyeIcon from '@/assets/svg/eye.svg'
import eyeOffIcon from '@/assets/svg/eye-off.svg'
import spinnerIcon from '@/assets/svg/spinner.svg'

const formData = reactive({
  email: '',
  password: '',
})
const showPassword = ref(false)
const submitted = ref(false)
const submitting = ref(false)

const emailError = computed(() => submitted.value && !formData.email.trim())
const isFormValid = computed(() => Boolean(formData.email.trim() && formData.password.trim()))

async function onSubmit() {
  submitted.value = true
  if (!isFormValid.value || submitting.value) return
  submitting.value = true
  // Auth submit will be wired up later.
}
</script>
