// src/router.js
import { createRouter, createWebHistory } from 'vue-router'
import { getCurrentUser } from './firebase/auth-helpers.js'

const routes = [

    { 
        path: '/', 
        component: () => import('./components/MainPage.vue') 
    },
    { 
        path: '/about', 
        component: () => import('./components/about/AboutPage.vue') 
    },
    { 
        path: '/posts', 
        component: () => import('./components/post/PostList.vue') 
    },
    { 
        path: '/work', 
        component: () => import('./components/work/WorkPage.vue'),
    },
    {
        path: '/posting',
        component: () => import('./components/post/PostingPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/edit/:id',
        name: 'edit-post',
        component: () => import('./components/post/PostingPage.vue'),
        props: true,
        meta: { requiresAuth: true }
    },
    {
        path: '/sign-in',
        component: () => import('./components/auth/SignInPage.vue')
    },
    {
        path: '/sign-up',
        component: () => import('./components/auth/SignUpPage.vue')
    },
    {
        path: '/view/:id',
        name: 'viewer',
        component: () => import('./components/post/ViewPage.vue'),
        props: true
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to, from, next) => {
    const isAuthenticated = !!await getCurrentUser();
    
    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/sign-in'); // Redirect to sign-in page if not authenticated
    } else {
        next(); // Proceed to the route
    }
});

export default router;
