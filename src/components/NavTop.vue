<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <button type="button" class="btn btn-outline-dark" @click="navigate('About')">About</button>
                <button type="button" class="btn btn-outline-dark" @click="navigate('TilPage')">TIL;</button>
                <button type="button" class="btn btn-outline-dark" @click="navigate('Blog')">Blog</button>
                <button type="button" class="btn btn-outline-dark" @click="navigate('ProfilePage')">Profile</button>
            </div>
            <div class="col-md-auto"></div>
            <div class="col col-lg-2">
                <button type="button" class="btn btn-outline-dark">Home</button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { defineEmits } from 'vue'

const emit = defineEmits(['navigate'])

const navigate = (componentName) => {
    emit('navigate', componentName)
}

</script>
<style scoped>
.btn{
    margin-right: 1%;
}

</style>