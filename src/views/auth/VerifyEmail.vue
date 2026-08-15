<template>
  <div class="auth-container">
    <div class="auth-content">
      <AuthHeader title="Verify your email" />

      <div class="auth-panel">
        <form class="space-y-4" @submit.prevent="onSubmit">
          <PinInput v-model="code" :length="4" input-class="h-13 w-13 text-2xl" />

          <div class="space-y-1 text-center">
            <p class="text-sm/6 text-gray-500">Enter the code we sent to</p>
            <p class="text-base font-medium text-gray-900">test675@gmail.com</p>
          </div>

          <Button type="submit" size="lg" class="w-full" :disabled="!isFormValid" :loading="submitting">
            <img v-if="submitting" :src="spinnerIcon" alt="" class="size-5 animate-spin" />
            <template v-else>Verify</template>
          </Button>

          <p class="text-center text-sm/6 text-gray-500">
            Don't see a code?
            <RouterLink :to="{ name: 'VerifyEmail' }" class="auth-link">Resend code</RouterLink>
            {{ ' ' }}
            or
            {{ ' ' }}
            <a href="#" class="auth-link">Logout.</a>
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

<script setup lang="ts">
import { computed, ref } from 'vue'
import spinnerIcon from '@/assets/svg/spinner.svg'
import AuthHeader from '@/components/auth/AuthHeader.vue'
import { Button } from '@/components/ui/button'
import { PinInput } from '@/components/ui/pin-input'

const code = ref('')
const submitting = ref(false)

const isFormValid = computed(() => code.value.trim().length === 4)

async function onSubmit() {
  if (!isFormValid.value || submitting.value) return
  submitting.value = true
  // Verification flow will be wired up later.
}
</script>
