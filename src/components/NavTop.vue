<template>
    <nav class="navbar sticky-top navbar-expand-lg">
        <div class="container-fluid">
            <a href="#" class="navbar-brand">Archaiving</a>

            <!--모바일버전일때 메뉴 버튼-->
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item"   v-for="(link, index) in links" :key="index">
                        <router-link :to=link.to class="nav-link">
                            <button type="button" class="btn btn-outline-dark">{{ link.title }}</button> 
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>
<script setup>
import { ref } from 'vue'
const links = ref(
    [
        {
            to: '/',
            title: 'Home'
        },
        {
            to: '/about',
            title: 'About'
        },
        {
            to: '/til',
            title: 'TIL;'
        },
        {
            to: '/diary',
            title: 'Diary'
        },
        {
            to: '/profile',
            title: 'Profile'
        },
        {
            to: '/posting',
            title: 'Posting'
        }
    ]
)
</script>
<style scoped>


</style>