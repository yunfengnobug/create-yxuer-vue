import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { findMyChildMenus } from '@/api'
import { ref, type Component } from 'vue'
import { user } from '@/utils'
import { updateAuthButKeys } from '@/directives/auth'
import { useMenuStore } from '@/stores/menu'
import pinia from '@/stores'

const menuStore = useMenuStore(pinia)

const MENU_ID_KEY = `${import.meta.env.VITE_APPID}_menuId`

const currentMenuId = ref<string>('')

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
      currentMenuId.value = urlParams.get('menuId') || ''
    }
    if (currentMenuId.value) {
      localStorage.setItem(MENU_ID_KEY, currentMenuId.value)
    } else {
      currentMenuId.value = localStorage.getItem(MENU_ID_KEY) || ''
    }
    if (currentMenuId.value) {
      const res = await findMyChildMenus({
        schoolCode: user.schoolCode,
        menuId: currentMenuId.value,
        extraFields: 'icon,path,component,name,extendProps,butKey,showLink',
      })
      menuStore.setChildMenus(res.result.myMenus || [])
    }
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
