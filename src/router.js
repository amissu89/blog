// src/router.js
import { createRouter, createWebHistory } from 'vue-router'
import AboutPage from './components/about/AboutPage.vue'
import TilPage from './components/til/TilPage.vue'
import PostingPage from './components/post/PostingPage.vue'
import DiaryPage from './components/diary/DiaryPage.vue'
import ProfilePage from './components/profile/ProfilePage.vue'
import MainPage from './components/MainPage.vue'
import SignInPage from './components/auth/SignInPage.vue'
import SignUpPage from './components/auth/SignUpPage.vue'

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
        path: '/posting',
        component: PostingPage,
    },
    {
        path: '/sign-in',
        component: SignInPage,
    },
    {
        path: '/sign-up',
        component: SignUpPage,
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
