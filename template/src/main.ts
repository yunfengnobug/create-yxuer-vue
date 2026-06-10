import '@/assets/styles/reset.css'
import '@/utils/dayjs'

import { createApp } from 'vue'
import pinia from '@/stores'
import Antd from 'ant-design-vue'
import App from './App.vue'
import 'ant-design-vue/dist/reset.css'
import { vAuth, vNoauth } from '@/directives/auth'
const app = createApp(App)

app.use(pinia)
// router 模块加载时会立即使用 pinia store（初始化动态路由），
// 必须在 app.use(pinia) 之后再动态导入，否则持久化插件不会生效
const { default: router } = await import('./router')
app.use(router)
app.use(Antd)
app.directive('auth', vAuth)
app.directive('noauth', vNoauth)
app.mount('#app')
