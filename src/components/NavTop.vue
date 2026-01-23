<template>
    <nav class="navbar sticky-top navbar-expand-lg">
        <div class="container-fluid">
            <!-- <a href="#" class="navbar-brand">Archaiving🌿</a> -->
            <router-link to="/" class="navbar-brand" @click="closeMenu">Rocky🌿</router-link>

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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { storeToRefs } from 'pinia'
import logger from '../utils/logger.js'

const router = useRouter()
const showMenu = ref(false)

const authStore = useAuthStore()
const { isAuthenticated, isAdmin } = storeToRefs(authStore)
const { logout } = authStore

const links = computed(() => [
    { to: '/', title: 'Home' },
    { to: '/posts', title: 'Posts' },
    { to: '/tools', title: 'Tools' },
    { to: '/posting', title: 'Posting', requiresAuth: true, requiresAdmin: true },
    { to: '/sign-in', title: 'Login', requiresAuth: false },
    { to: '#', title: 'Logout', requiresAuth: true },
])

const filteredLinks = computed(() => {
    return links.value.filter(link => {
        // Show link if no auth requirements specified
        if (link.requiresAuth === undefined) return true;

        // Check auth requirement
        if (link.requiresAuth && !isAuthenticated.value) return false;
        if (link.requiresAuth === false && isAuthenticated.value) return false;

        // Check admin requirement
        if (link.requiresAdmin && !isAdmin.value) return false;

        return true;
    })
})

const toggleMenu = () => {
    showMenu.value = !showMenu.value // 버튼 클릭할 때 상태 변경
}

const closeMenu = () => {
    showMenu.value = false // 메뉴 클릭하면 닫힘
}

const signOut = async () => {
    try {
        await logout()
        router.push('/')
    } catch (error) {
        logger.error('Logout failed:', error)
    } finally {
        closeMenu()
    }
}
</script>

<style scoped>
/* Navbar - Clean & Minimal */
.navbar {
  background-color: var(--color-bg);
  padding: var(--spacing-lg) var(--spacing-md);
  z-index: 1000;
  box-shadow: var(--shadow-xs);
}

/* Brand Styling */
.navbar-brand {
  font-weight: 700;
  font-size: var(--font-size-2xl);
  color: var(--color-primary);
  transition: color var(--transition-base);
  text-decoration: none;
}

.navbar-brand:hover {
  color: var(--color-accent);
}

/* Toggler Button */
.navbar-toggler {
  border: none;
  padding: var(--spacing-sm);
}

.navbar-toggler:focus {
  outline: none;
  box-shadow: none;
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='%233A3635' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
}

@media (prefers-color-scheme: dark) {
  .navbar-toggler-icon {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='%23F5F1ED' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
  }
}

/* Collapse Menu */
.collapse.navbar-collapse {
  transition: max-height var(--transition-slow);
  overflow: hidden;
  max-height: 0;
}

.collapse.navbar-collapse.show {
  max-height: 500px;
}

/* Navigation List */
ul.navbar-nav {
  padding-left: 0;
  margin-top: var(--spacing-sm);
  gap: var(--spacing-xs);
}

ul.navbar-nav li {
  margin-bottom: var(--spacing-sm);
}

/* Navigation Buttons - Simple Style */
ul.navbar-nav li .btn {
  width: 100%;
  text-align: left;
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-base);
  font-weight: 500;
  border: none;
  color: var(--color-text);
  background-color: transparent;
  transition: color var(--transition-base);
}

ul.navbar-nav li .btn:hover {
  color: var(--color-accent);
}

/* Active Link Styling */
.nav-link {
  text-decoration: none;
}

.router-link-active .btn {
  color: var(--color-accent);
  font-weight: 600;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .navbar {
    padding: var(--spacing-md) var(--spacing-sm);
  }

  .navbar-brand {
    font-size: var(--font-size-xl);
  }

  .navbar-nav {
    width: 100%;
  }

  .navbar-nav .nav-link {
    display: block;
    width: 100%;
  }

  ul.navbar-nav li .btn {
    text-align: center;
  }
}

/* Desktop Styles */
@media (min-width: 992px) {
  .collapse.navbar-collapse {
    display: flex !important;
    max-height: none !important;
    overflow: visible !important;
  }

  ul.navbar-nav {
    flex-direction: row;
    margin-top: 0;
  }

  ul.navbar-nav li {
    margin-bottom: 0;
    margin-right: var(--spacing-md);
  }

  ul.navbar-nav li .btn {
    width: auto;
    padding: var(--spacing-sm) var(--spacing-md);
    text-align: center;
  }
}
</style>