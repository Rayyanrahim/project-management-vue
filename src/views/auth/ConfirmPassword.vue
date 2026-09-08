<template>
    <AuthHeader title="Create a new password!" prompt="For security reasons, you will be logged out of all devices after password is changed." />

    <div class="auth-panel">

        <form class="space-y-4" @submit.prevent="onSubmit">
            <div class="relative">
                <Input id="password" v-model="formData.password" :type="showPassword ? 'text' : 'password'"
                    name="password" autocomplete="current-password" placeholder="Password" class="pr-10" />
                <button type="button" class="absolute inset-y-0 right-0 flex items-center px-3 hover:opacity-80"
                    :aria-label="showPassword ? 'Hide password' : 'Show password'"
                    @click="showPassword = !showPassword">
                    <img :src="showPassword ? eyeOffIcon : eyeIcon" alt="" class="size-5" />
                </button>
            </div>

            <div class="relative">
                <Input id="confirmPassword" v-model="formData.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'" name="confirmPassword" autocomplete="current-password"
                    placeholder="Confirm Password" class="pr-10" />
                <button type="button" class="absolute inset-y-0 right-0 flex items-center px-3 hover:opacity-80"
                    :aria-label="showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'"
                    @click="showConfirmPassword = !showConfirmPassword">
                    <img :src="showConfirmPassword ? eyeOffIcon : eyeIcon" alt="" class="size-5" />
                </button>
            </div>

            <Button type="submit" size="lg" class="w-full" :disabled="!isFormValid" :loading="submitting">
                <img v-if="submitting" :src="spinnerIcon" alt="" class="size-5 animate-spin" />
                <template v-else>Confirm Password</template>
            </Button>
        </form>
    </div>

</template>
<script setup lang="ts">
import AuthHeader from '@/components/auth/AuthHeader.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import spinnerIcon from '@/assets/svg/spinner.svg'
import { reactive, ref, computed } from 'vue'
import eyeIcon from '@/assets/svg/eye.svg'
import eyeOffIcon from '@/assets/svg/eye-off.svg'

const formData = reactive({
    password: '',
    confirmPassword: '',
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const submitted = ref(false)
const submitting = ref(false)

const isFormValid = computed(() => Boolean(formData.password.trim() && formData.confirmPassword.trim()))

async function onSubmit() {
    submitted.value = true
    if (submitting.value) return
    submitting.value = true
    // Auth submit will be wired up later.
}
</script>
