<template>
  <div class="flex min-h-0 flex-1 self-stretch flex-col">
    <div class="flex flex-1 flex-col justify-center">
      <AuthHeader
        title="Check your inbox"
        prompt="Remember password?"
        :to="{ name: 'Login' }"
        link-text="Sign in"
      />

      <div class="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
        <p class="text-center text-sm/6 text-gray-500">
          If an account exists for the email you entered, you'll receive a
          notification with password reset instructions.
        </p>
      </div>
    </div>

    <p class="pb-4 text-center text-sm/6">
      <a href="#" class="auth-muted-link">Need help?</a>
    </p>
  </div>
</template>

<script setup lang="ts">
import AuthHeader from '@/components/auth/AuthHeader.vue'
</script>
