<template>
    <div class="container">
        <div class="form-floating mb-3">
            <input
                type="email"
                class="form-control"
                :class="{ 'is-invalid': emailError }"
                id="floatingInput"
                placeholder="name@example.com"
                v-model="email"
                @blur="validateEmailField">
            <label for="floatingInput">Email address</label>
            <div v-if="emailError" class="invalid-feedback">
                {{ emailError }}
            </div>
        </div>
        <div class="form-floating">
            <input
                type="password"
                class="form-control"
                :class="{ 'is-invalid': passwordError }"
                id="floatingPassword"
                placeholder="Password"
                v-model="password"
                @blur="validatePasswordField">
            <label for="floatingPassword">Password</label>
            <div v-if="passwordError" class="invalid-feedback">
                {{ passwordError }}
            </div>
        </div>
        <div class="buttons">
            <button type="button" class="btn btn-outline-dark" @click="$router.go(-1)">Cancel</button>
            <button type="button" class="btn btn-outline-dark" @click="login" :disabled="loading">
                <span v-if="loading">
                    <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                    <span role="status"> Logging in...</span>
                </span>
                <span v-else>Login</span>
            </button>
            <!-- <button type="button" class="btn btn-outline-dark" @click="$router.push('/sign-up')">Register</button> -->
        </div>
        <div class="forgot-password">
            <a href="#" @click.prevent="handleForgotPassword" class="forgot-link">Forgot Password?</a>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginWithEmail } from '../../firebase/firebase-app.js'
import { useToast } from "vue-toastification"
import { validateEmail, validatePassword, VALIDATION_CONSTANTS } from '../../utils/validation.js'
import logger from '../../utils/logger.js'

const email = ref('')
const password = ref('')
const emailError = ref('')
const passwordError = ref('')
const loading = ref(false)
const router = useRouter()
const toast = useToast()

const validateEmailField = () => {
    const result = validateEmail(email.value)
    emailError.value = result.isValid ? '' : result.message
    return result.isValid
}

const validatePasswordField = () => {
    const result = validatePassword(password.value, VALIDATION_CONSTANTS.MIN_PASSWORD_LENGTH)
    passwordError.value = result.isValid ? '' : result.message
    return result.isValid
}

const validateForm = () => {
    const isEmailValid = validateEmailField()
    const isPasswordValid = validatePasswordField()
    return isEmailValid && isPasswordValid
}

const login = async () => {
    if (!email.value || !password.value) {
        toast.error('Please enter both email and password.')
        return
    }

    if (!validateForm()) {
        toast.error('Please fix the validation errors.')
        return
    }

    try {
        loading.value = true
        const userCredential = await loginWithEmail(email.value, password.value)
        const user = userCredential.user
        logger.info('User logged in successfully:', user.email)
        router.push('/')
    } catch (error) {
        logger.error('Login failed:', error.message)
        toast.error(`Login failed: ${error.message}`)
    } finally {
        loading.value = false
    }
}

const handleForgotPassword = () => {
    if (!email.value) {
        toast.info('Please enter your email address first.')
        return
    }

    if (!validateEmailField()) {
        toast.error('Please enter a valid email address.')
        return
    }

    // TODO: Implement password reset email functionality
    toast.info('Password reset feature will be implemented soon. Please contact support.')
    logger.info('Password reset requested for:', email.value)
}
</script>
<style scoped>
.forgot-password {
    margin-top: 1rem;
    text-align: center;
}

.forgot-link {
    color: var(--color-accent, #ff6b35);
    text-decoration: none;
    font-size: 0.9rem;
    transition: all 0.2s ease;
}

.forgot-link:hover {
    color: var(--color-accent-hover, #ff8555);
    text-decoration: underline;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
</style>