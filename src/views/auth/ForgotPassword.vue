<template>
  <div class="auth-container">
    <div class="auth-content">
      <AuthHeader title="Forgot your password?" prompt="Remember password?" :to="{ name: 'Login' }" link-text="Sign in" />
      <div class="auth-panel">
        <form class="space-y-4" @submit.prevent="onSubmit">
          <Input id="email" v-model="email" type="email" name="email" autocomplete="email" placeholder="Work email" />

          <Button type="submit" size="lg" class="w-full" :disabled="!isFormValid" :loading="submitting">
            <img v-if="submitting" :src="spinnerIcon" alt="" class="size-5 animate-spin" />
            <template v-else>Send me the link</template>
          </Button>
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
import { useRouter } from 'vue-router'
import spinnerIcon from '@/assets/svg/spinner.svg'
import AuthHeader from '@/components/auth/AuthHeader.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const router = useRouter()
const email = ref('')
const submitting = ref(false)

const isFormValid = computed(() => Boolean(email.value.trim()))

async function onSubmit() {
  if (!isFormValid.value || submitting.value) return
  submitting.value = true
  await router.push({ name: 'LoginRecover' })
}
</script>
