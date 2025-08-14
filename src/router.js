// src/router.js
import { createRouter, createWebHistory } from 'vue-router'

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
    },
    {
        path: '/edit/:id',
        name: 'edit-post',
        component: () => import('./components/post/PostingPage.vue'),
        props: true,
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

router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('authToken'); // Example: Check if user is logged in
    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/sign-in'); // Redirect to sign-in page if not authenticated
    } else {
        next(); // Proceed to the route
    }
});

export default router;
