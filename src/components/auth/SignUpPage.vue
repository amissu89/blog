<template>
    <div class="container">
        <div class="form-floating mb-3">
            <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com" v-model="email">
            <label for="floatingInput">Email address</label>
        </div>
        <div class="form-floating">
            <input type="password" class="form-control" id="floatingPassword" placeholder="Password"
            v-model="password1">
            <label for="floatingPassword">Password</label>
        </div>
        <div class="form-floating">
            <input type="password" class="form-control" id="floatingPassword" placeholder="Password"
            v-model="password2">
            <label for="floatingPassword">Password Confirm</label>
        </div>
        <div class="buttons">
            <button type="button" class="btn btn-outline-dark" @click="$router.go(-1)">Cancel</button>
            <button type="button" class="btn btn-outline-dark" @click="register">Register</button>
        </div>

    </div>
</template>
<script setup>
import {ref} from 'vue'
import {signUp} from "../../firebase/auth.js"
import {useRouter} from 'vue-router'
import {useToast} from 'vue-toastification'

const email = ref('')
const password1 = ref('')
const password2 = ref('')

const router = useRouter()
const toast = useToast()

const register = () =>{

    if(password1.value !== password2.value){
        toast.error('The password does not match.')
        password1.value = ''
        password2.value = ''
        return
    }

    signUp(email.value, password1.value)
    .then( (userCredential) => {
        const user = userCredential.user
        console.debug(`User created : ${user}`)
        return user
    })
    .catch((error) =>{
        console.error(`User creation failed : ${error}`)
        throw error
    }) 

    toast.success('Registration is complete.')
    router.push('/sign-in')
}
</script>
<style></style>