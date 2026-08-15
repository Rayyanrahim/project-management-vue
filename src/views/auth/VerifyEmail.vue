<template>
  <div class="flex min-h-0 flex-1 self-stretch flex-col">
    <div class="flex flex-1 flex-col justify-center">
      <AuthHeader title="Verify your email" />

      <div class="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
        <form class="space-y-4" @submit.prevent="onSubmit">
          <PinInput v-model="code" :length="4" input-class="h-13 w-13 text-2xl" />

          <div class="space-y-1 text-center">
            <p class="text-sm/6 text-gray-500">Enter the code we sent to</p>
            <p class="text-base font-medium text-gray-900">test675@gmail.com</p>
          </div>

          <Button type="submit" size="lg" class="w-full">
            Verify
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

    <p class="pb-4 text-center text-sm/6">
      <a href="#" class="auth-muted-link">Need help?</a>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AuthHeader from '@/components/auth/AuthHeader.vue'
import { Button } from '@/components/ui/button'
import { PinInput } from '@/components/ui/pin-input'

const code = ref('')

function onSubmit() {
  // Verification flow will be wired up later.
}
</script>
