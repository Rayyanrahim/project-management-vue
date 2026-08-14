<template>
  <AuthHeader title="Seconds to sign up!" prompt="Already have an account?" :to="{ name: 'Login' }"
    link-text="Sign in" />

  <div class="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
    <Button type="button" variant="outline" size="lg" class="h-10 w-full">
      <span class="absolute left-3 inline-flex size-5 items-center justify-center">
        <img :src="googleIcon" alt="" class="size-5" />
      </span>
      Continue with Google
    </Button>

    <Separator class="mt-4" label="or" />

    <form class="mt-4 space-y-3" @submit.prevent="onSubmit">
      <Input id="name" v-model="formData.name" type="text" name="name" autocomplete="name" placeholder="Name" />

      <Input id="email" v-model="formData.email" type="email" name="email" autocomplete="email" placeholder="Work Email" />

      <div class="relative">
        <Input id="password" v-model="formData.password" :type="showPassword ? 'text' : 'password'" name="password"
          autocomplete="new-password" placeholder="Password" class="pr-10" />
        <button type="button" class="absolute inset-y-0 right-0 flex items-center px-3 hover:opacity-80"
          :aria-label="showPassword ? 'Hide password' : 'Show password'" @click="showPassword = !showPassword">
          <img :src="showPassword ? eyeOffIcon : eyeIcon" alt="" class="size-5" />
        </button>
      </div>

      <Button type="submit" size="lg" class="w-full" :disabled="!isFormValid" :loading="submitting">
        <img v-if="submitting" :src="spinnerIcon" alt="" class="size-5 animate-spin" />
        <template v-else>Sign up with Email</template>
      </Button>
    </form>

    <p class="mt-5 text-center text-xs/5 text-gray-500">
      By continuing, you agree to our
      {{ ' ' }}
      <a href="#" class="font-medium text-gray-700 hover:text-gray-900">Terms of Service</a>
      {{ ' ' }}
      and
      {{ ' ' }}
      <a href="#" class="font-medium text-gray-700 hover:text-gray-900">Privacy Policy</a>.
      {{ ' ' }}
      <a href="#" class="hover:text-gray-700">Need help?</a>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import AuthHeader from '@/components/auth/AuthHeader.vue'
import googleIcon from '@/assets/svg/google.svg'
import eyeIcon from '@/assets/svg/eye.svg'
import eyeOffIcon from '@/assets/svg/eye-off.svg'
import spinnerIcon from '@/assets/svg/spinner.svg'

const formData = reactive({
  name: '',
  email: '',
  password: '',
})
const showPassword = ref(false)
const submitting = ref(false)

const isFormValid = computed(() =>
  Boolean(formData.name.trim() && formData.email.trim() && formData.password.trim()),
)

async function onSubmit() {
  if (!isFormValid.value || submitting.value) return
  submitting.value = true
  // Auth submit will be wired up later.
}
</script>
