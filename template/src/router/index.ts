import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { findMyChildMenus, findUserInfo } from '@/api'
import { ref, type Component } from 'vue'
import { updateAuthButKeys } from '@/directives/auth'
import { message } from 'ant-design-vue'
import { useMenuStore } from '@/stores/menu'
import { useUserStore } from '@/stores/user'
import pinia from '@/stores'

const menuStore = useMenuStore(pinia)
const userStore = useUserStore(pinia)

const MENU_ID_KEY = `${import.meta.env.VITE_APPID}_menuId`

const routes = ref<any[]>([])
// 使用 import.meta.glob 预加载所有 vue 组件
const modules = import.meta.glob<{ default: Component }>('@/views/**/*.vue')
// 生成动态导入函数
function dynamicImport(path: string) {
  const fullPath = `/src/views/${path}.vue`
  const moduleLoader = modules[fullPath]
  if (moduleLoader) {
    return async () => {
      const module = await moduleLoader()
      return module.default
    }
  }
  return () => Promise.reject(new Error(`模块 ${fullPath} 未找到`))
}
// 递归过滤出menuType!==3的路由，排除按钮等非路由项
const filterMenuRoutes = (menus: any[]): any[] =>
  menus
    .filter((item: any) => item.meta?.menuType !== 3)
    .map((item: any) => {
      if (item.children?.length > 0) {
        return { ...item, children: filterMenuRoutes(item.children) }
      }
      return item
    })
// 递归处理component为动态导入函数
const generateRoutes = (data: any, callback: any) => {
  data.forEach((item: any) => {
    item.component = callback(item.component)
    if (item.children?.length > 0) {
      // 如果有子路由，设置重定向到第一个子路由
      if (item.path === '/') {
        item.redirect = item.children[0].path
      }
      generateRoutes(item.children, callback)
    }
  })
  return data
}
const initRoutes = async () => {
  try {
    if (location.hash.includes('?')) {
      const queryString = location.hash.split('?')[1]
      const urlParams = new URLSearchParams(queryString)
      // 从url中获取menuId和userKey
      const userKey = urlParams.get('userKey') || ''
      const menuId = urlParams.get('menuId') || ''

      // 首次进入时url带有userKey和menuId：userKey 存入 store 的 user 对象（持久化），menuId 直接放缓存
      if (userKey) {
        userStore.user.userKey = userKey
      }
      if (menuId) {
        localStorage.setItem(MENU_ID_KEY, menuId)
      }
    }
    // 刷新后url可能不带参数，分别从 store 持久化和缓存中获取
    const menuId = localStorage.getItem(MENU_ID_KEY) || ''
    if (!userStore.user.userKey || !menuId) {
      message.error('本地开发环境：缺少 userKey 或 menuId 参数')
    }
    // 参数缺失时也照常调接口，用户可通过接口报错进一步定位原因
    const res = await findUserInfo({ userKey: userStore.user.userKey })
    // 用户信息整体覆盖（含 userKey 等字段）
    userStore.setUser(res.result)
    const res2 = await findMyChildMenus({
      schoolCode: userStore.user.schoolCode,
      menuId,
      extraFields: 'icon,path,component,name,extendProps,butKey,showLink',
    })
    menuStore.setChildMenus(res2.result.myMenus || [])
    routes.value = generateRoutes(
      [
        {
          path: '/',
          name: 'layout',
          component: 'layout/index',
          children: filterMenuRoutes(menuStore.childMenus || []),
          // children: [
          //   {
          //     path: '/ReportManagement',
          //     name: 'ReportManagement',
          //     component: 'ReportManagement',
          //     meta: {
          //       title: '报告管理',
          //       extendProps: {
          //         icon: 'https://origin.yxuer.com/9ceb7bf7b57e43ef92e1f29a80a4d721.png',
          //         'icon-o': 'https://origin.yxuer.com/e17552362fe341dd9018041e9479ae19.png',
          //       },
          //     },
          //   },
          // ],
        },
        // 兜底路由
        {
          path: '/:pathMatch(.*)*',
          name: 'notFound',
          redirect: '/',
        },
      ],
      dynamicImport,
    )
    console.log(routes.value)
  } catch (error) {
    console.log(error)
  }
}

await initRoutes()

const router = createRouter({
  history:
    import.meta.env.VITE_PATH_MODE === 'hash'
      ? createWebHashHistory(import.meta.env.VITE_BASE_PATH)
      : createWebHistory(import.meta.env.VITE_BASE_PATH),
  routes: routes.value as any,
})
router.beforeEach((to, from, next) => {
  document.title = (to.meta.title as string)
    ? `${to.meta.title} | ${import.meta.env.VITE_PROJECT_NAME}`
    : import.meta.env.VITE_PROJECT_NAME
  updateAuthButKeys(to.path, menuStore.childMenus)
  next()
})

export default router
