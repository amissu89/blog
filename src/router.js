// src/router.js
import { createRouter, createWebHistory } from 'vue-router'
import AboutPage from './components/about/AboutPage.vue'
import TilPage from './components/til/TilPage.vue'
import DiaryPage from './components/diary/DiaryPage.vue'
import ProfilePage from './components/profile/ProfilePage.vue'
import MainPage from './components/MainPage.vue'

const routes = [
    { 
        path: '/about', 
        component: AboutPage 
    },
    { 
        path: '/til', 
        component: TilPage 
    },
    { 
        path: '/diary', 
        component: DiaryPage 
    },
    { 
        path: '/profile', 
        component: ProfilePage 
    },
    { 
        path: '/', 
        component: MainPage 
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;
