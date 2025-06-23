import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'

// Bootstrap CSS and JS
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import './assets/css/main-style.css'
import './assets/css/color.css'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const app = createApp(App)

app.use(router)
app.use(Toast, {
  // 필요 시 옵션 지정
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
})

app.mount('#app')
//createApp(App).use(router).mount('#app')
