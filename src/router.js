// src/router.js
import { createRouter, createWebHistory } from 'vue-router'
import { getCurrentUser } from './firebase/auth-helpers.js'

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('./components/MainPage.vue'),
        meta: {
            title: 'Home',
            requiresAuth: false
        }
    },
    {
        path: '/about',
        name: 'about',
        component: () => import('./components/about/AboutPage.vue'),
        meta: {
            title: 'About',
            requiresAuth: false
        }
    },
    {
        path: '/posts',
        name: 'posts',
        component: () => import('./components/post/PostList.vue'),
        meta: {
            title: 'Posts',
            requiresAuth: false
        }
    },
    {
        path: '/work',
        name: 'work',
        component: () => import('./components/work/WorkPage.vue'),
        meta: {
            title: 'Work',
            requiresAuth: false
        }
    },
    {
        path: '/posting',
        name: 'posting',
        component: () => import('./components/post/PostingPage.vue'),
        meta: {
            title: 'New Post',
            requiresAuth: true
        }
    },
    {
        path: '/edit/:id',
        name: 'edit-post',
        component: () => import('./components/post/PostingPage.vue'),
        props: true,
        meta: {
            title: 'Edit Post',
            requiresAuth: true
        }
    },
    {
        path: '/sign-in',
        name: 'sign-in',
        component: () => import('./components/auth/SignInPage.vue'),
        meta: {
            title: 'Sign In',
            requiresAuth: false
        }
    },
    {
        path: '/sign-up',
        name: 'sign-up',
        component: () => import('./components/auth/SignUpPage.vue'),
        meta: {
            title: 'Sign Up',
            requiresAuth: false
        }
    },
    {
        path: '/view/:id',
        name: 'viewer',
        component: () => import('./components/post/ViewPage.vue'),
        props: true,
        meta: {
            title: 'View Post',
            requiresAuth: false
        }
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to, from, next) => {
    const isAuthenticated = !!await getCurrentUser();

    // Update document title based on route metadata
    if (to.meta.title) {
        document.title = `${to.meta.title} | Rocky's Blog`;
    } else {
        document.title = "Rocky's Blog";
    }

    // Auth guard: check if route requires authentication
    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/sign-in'); // Redirect to sign-in page if not authenticated
    } else {
        next(); // Proceed to the route
    }
});

export default router;
