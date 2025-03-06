import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from "@/router/index"
import '@/utils/permission'
import { createPinia } from 'pinia'

const app = createApp(App)

const pinia = createPinia()

app.use(ElementPlus)
app.use(router)
app.use(pinia)
app.mount('#app')
