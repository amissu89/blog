<template>
    <div class="container">
        <div class="form-floating mb-3">
            <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com"
            v-model = "email">
            <label for="floatingInput">Email address</label>
        </div>
        <div class="form-floating">
            <input type="password" class="form-control" id="floatingPassword" placeholder="Password"
            v-model="password">
            <label for="floatingPassword">Password</label>
        </div>
        <div class="buttons">
            <button type="button" class="btn btn-outline-dark" @click="$router.go(-1)">Cancel</button>
            <button type="button" class="btn btn-outline-dark" @click="login">Login</button>
            <!-- <button type="button" class="btn btn-outline-dark" @click="$router.push('/sign-up')">Register</button> -->
        </div>

    </div>
</template>
<script setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import { loginWithEmail } from '../../firebase/auth.js'

const email = ref('')
const password = ref('')
const router = useRouter()

const login = () => {
    loginWithEmail(email.value, password.value)
    .then( (userCredential) =>{
        const user = userCredential.user
        console.debug(`Login user : ${user}`)
        router.push('/')
    })
    .catch( (error) =>{
        console.error(`User creation failed : ${error}`)
        alert(`User creation failed : ${error}`)
        throw error
    })
}


</script>
<style></style>