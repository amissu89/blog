import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'

// Bootstrap CSS and JS
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import './assets/css/main-style.css'
import './assets/css/color.css'

createApp(App).use(router).mount('#app')
