import '@/assets/styles/reset.css'
import '@/utils/dayjs'

import { createApp } from 'vue'
import pinia from '@/stores'
import Antd from 'ant-design-vue'
import App from './App.vue'
import 'ant-design-vue/dist/reset.css'
import router from './router'
import { vAuth, vNoauth } from '@/directives/auth'
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(Antd)
app.directive('auth', vAuth)
app.directive('noauth', vNoauth)
app.mount('#app')
