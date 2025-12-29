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
        <div class="form-floating mb-3">
            <input
                type="password"
                class="form-control"
                :class="{ 'is-invalid': password1Error }"
                id="floatingPassword"
                placeholder="Password"
                v-model="password1"
                @input="updatePasswordStrength"
                @blur="validatePassword1Field">
            <label for="floatingPassword">Password</label>
            <div v-if="password1Error" class="invalid-feedback">
                {{ password1Error }}
            </div>
            <div v-if="password1 && !password1Error" class="password-strength">
                <div class="strength-bar">
                    <div
                        class="strength-fill"
                        :style="{ width: passwordStrength.score + '%', backgroundColor: passwordStrength.color }">
                    </div>
                </div>
                <small :style="{ color: passwordStrength.color }">
                    {{ passwordStrength.feedback }}
                </small>
            </div>
        </div>
        <div class="form-floating mb-3">
            <input
                type="password"
                class="form-control"
                :class="{ 'is-invalid': password2Error }"
                id="floatingPasswordConfirm"
                placeholder="Password"
                v-model="password2"
                @blur="validatePassword2Field">
            <label for="floatingPasswordConfirm">Password Confirm</label>
            <div v-if="password2Error" class="invalid-feedback">
                {{ password2Error }}
            </div>
        </div>
        <div class="form-check mb-3">
            <input
                class="form-check-input"
                :class="{ 'is-invalid': termsError }"
                type="checkbox"
                v-model="termsAccepted"
                id="termsCheck">
            <label class="form-check-label" for="termsCheck">
                I agree to the Terms and Conditions
            </label>
            <div v-if="termsError" class="invalid-feedback d-block">
                {{ termsError }}
            </div>
        </div>
        <div class="buttons">
            <button type="button" class="btn btn-outline-dark" @click="$router.go(-1)">Cancel</button>
            <button type="button" class="btn btn-outline-dark" @click="register">Register</button>
        </div>

    </div>
</template>
<script setup>
import {ref} from 'vue'
import {signUp} from "../../firebase/firebase-app.js"
import {useRouter} from 'vue-router'
import {useToast} from 'vue-toastification'
import {
    validateEmail,
    validatePassword,
    getPasswordStrength,
    doPasswordsMatch,
    VALIDATION_CONSTANTS
} from '../../utils/validation.js'
import logger from '../../utils/logger.js'

const email = ref('')
const password1 = ref('')
const password2 = ref('')
const termsAccepted = ref(false)

const emailError = ref('')
const password1Error = ref('')
const password2Error = ref('')
const termsError = ref('')

const passwordStrength = ref({
    score: 0,
    level: 'weak',
    feedback: '',
    color: '#dc3545'
})

const router = useRouter()
const toast = useToast()

const validateEmailField = () => {
    const result = validateEmail(email.value)
    emailError.value = result.isValid ? '' : result.message
    return result.isValid
}

const validatePassword1Field = () => {
    const result = validatePassword(password1.value, VALIDATION_CONSTANTS.MIN_PASSWORD_LENGTH)
    password1Error.value = result.isValid ? '' : result.message
    return result.isValid
}

const validatePassword2Field = () => {
    if (!password2.value) {
        password2Error.value = 'Please confirm your password'
        return false
    }

    if (!doPasswordsMatch(password1.value, password2.value)) {
        password2Error.value = 'Passwords do not match'
        return false
    }

    password2Error.value = ''
    return true
}

const validateTermsField = () => {
    if (!termsAccepted.value) {
        termsError.value = 'You must accept the terms and conditions'
        return false
    }

    termsError.value = ''
    return true
}

const updatePasswordStrength = () => {
    if (password1.value) {
        passwordStrength.value = getPasswordStrength(password1.value)
    } else {
        passwordStrength.value = {
            score: 0,
            level: 'weak',
            feedback: '',
            color: '#dc3545'
        }
    }
}

const validateForm = () => {
    const isEmailValid = validateEmailField()
    const isPassword1Valid = validatePassword1Field()
    const isPassword2Valid = validatePassword2Field()
    const areTermsAccepted = validateTermsField()

    return isEmailValid && isPassword1Valid && isPassword2Valid && areTermsAccepted
}

const register = async () =>{

    if (!validateForm()) {
        toast.error('Please fix the validation errors.')
        return
    }

    if(password1.value !== password2.value){
        toast.error('The password does not match.')
        password1.value = ''
        password2.value = ''
        return
    }

    try {
        const userCredential = await signUp(email.value, password1.value)
        const user = userCredential.user
        logger.info('User created successfully:', user.email)
        toast.success('Registration is complete.')
        router.push('/sign-in')
    } catch (error) {
        const errorMessage = error.message;
        logger.error('User creation failed:', error)
        toast.error(`Registration failed: ${errorMessage}`)
    }
}
</script>
<style scoped>
.password-strength {
    margin-top: 0.5rem;
}

.strength-bar {
    height: 4px;
    background-color: #e9ecef;
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 0.25rem;
}

.strength-fill {
    height: 100%;
    transition: width 0.3s ease, background-color 0.3s ease;
}

.form-check-label {
    cursor: pointer;
}

.invalid-feedback.d-block {
    display: block;
}
</style>