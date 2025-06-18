<template>
    <nav class="navbar sticky-top navbar-expand-lg">
        <div class="container-fluid">
            <!-- <a href="#" class="navbar-brand">Archaiving🌿</a> -->
            <router-link to="/" class="navbar-brand" @click="closeMenu">No Filter Life🌿</router-link>

            <!--모바일버전일때 메뉴 버튼-->
            <!-- <button class="navbar-toggler" type="button" 
            data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation" @click="toggleMenu">
                <span class="navbar-toggler-icon"></span>
            </button> -->

            <button class="navbar-toggler" type="button" @click="toggleMenu">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" :class="{ show: showMenu}" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item" v-for="(link, index) in filteredLinks" :key="index">
                        <router-link :to=link.to class="nav-link" @click="closeMenu">
                            <button v-if="link.to !== '#'" 
                                type="button" 
                                class="btn btn-outline-dark">
                                {{ link.title}}
                            </button>
                            <button v-else type="button" class="btn btn-outline-dark" @click="signOut"> Logout </button>
                        </router-link>
                    </li>
                </ul>
                
            </div>

        </div>


    </nav>
    <!-- <hr style="border: 1px solid black;"> -->
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { observeAuthState, logout } from '../firebase/auth.js'

const router = useRouter()
const showMenu = ref(false)
const links = ref(
    [
        {
            to: '/',
            title: 'Home',
            visible: true
        },
        {
            to: '/about',
            title: 'About',
            visible: true
        },
        {
            to: '/posts',
            title: 'Posts',
            visible: true
        },
        {
            to: '/profile',
            title: 'Career',
            visible: true
        },
        {
            to: '/posting',
            title: 'Posting',
            visible: false
        },
        {
            to: '#',
            title: 'Logout',
            visible: false,
        }
    ]
)

const userAuthenticated = ref(false)
const filteredLinks = computed(() => {
    return links.value.filter(link => {
        return link.visible == true || userAuthenticated.value
    })
})

const toggleMenu = () => {
    showMenu.value = !showMenu.value // 버튼 클릭할 때 상태 변경
}

const closeMenu = () => {
    showMenu.value = false // 메뉴 클릭하면 닫힘
}

onMounted(async () => {
    observeAuthState((user) => {
        if (user) {
            userAuthenticated.value = true
        }
    })
})

const signOut = () => {
    logout().then(() => {
        userAuthenticated.value = false
        router.push('/')
        closeMenu()

    }).catch(error => {
        console.error(`Logout failed : ${error}`)
    })
}
</script>
<style scoped>
    .navbar {
        background-color:white;
    }
</style>