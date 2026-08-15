<template>
  <div class="flex min-h-0 flex-1 self-stretch flex-col">
    <div class="flex flex-1 flex-col justify-center">
      <AuthHeader title="Forgot your password?" prompt="Remember password?" :to="{ name: 'Login' }" link-text="Sign in" />
      <div class="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
        <form class="space-y-4" @submit.prevent="onSubmit">
          <Input id="email" v-model="email" type="email" name="email" autocomplete="email" placeholder="Work email" />

          <Button type="submit" size="lg" class="w-full" :disabled="!isFormValid" :loading="submitting">
            <img v-if="submitting" :src="spinnerIcon" alt="" class="size-5 animate-spin" />
            <template v-else>Send me the link</template>
          </Button>
        </form>
      </div>
    </div>
    <p class="pb-4 text-center text-sm/6">
      <a href="#" class="auth-muted-link">Need help?</a>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import spinnerIcon from '@/assets/svg/spinner.svg'
import AuthHeader from '@/components/auth/AuthHeader.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const email = ref('')
const submitting = ref(false)

const isFormValid = computed(() => Boolean(email.value.trim()))

async function onSubmit() {
  if (!isFormValid.value || submitting.value) return
  submitting.value = true
  // Reset link flow will be wired up later.
}
</script>
