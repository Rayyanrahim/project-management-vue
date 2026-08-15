<template>
  <div class="auth-container">
    <div class="auth-content">
      <AuthHeader
        title="Check your inbox"
        prompt="Remember password?"
        :to="{ name: 'Login' }"
        link-text="Sign in"
      />

      <div class="auth-panel">
        <p class="text-center text-sm/6 text-gray-500">
          If an account exists for the email you entered, you'll receive a
          notification with password reset instructions.
        </p>
      </div>
    </div>

    <p class="auth-help">
      <a href="#" class="auth-muted-link">Need help?</a>
    </p>
  </div>
</template>

<script setup lang="ts">
import AuthHeader from '@/components/auth/AuthHeader.vue'
</script>
