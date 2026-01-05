import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { findMyChildMenus } from '@/api'
import { ref, type Component } from 'vue'
import { user } from '@/utils'

const currentMenuId = ref<string>('')

const routes = ref<any[]>([])
const childMenus = ref<any[]>(
  JSON.parse(localStorage.getItem(`${import.meta.env.VITE_APPID}_childMenus`) || '[]'),
)
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
    // 如果 有菜单ID，则重新获取子菜单并更新缓存
    if (currentMenuId.value) {
      const res = await findMyChildMenus({
        schoolCode: user.schoolCode,
        menuId: currentMenuId.value,
        extraFields: 'icon,path,component,name,extendProps',
      })
      childMenus.value = res.result.myMenus || []
      // 缓存子菜单
      localStorage.setItem(
        `${import.meta.env.VITE_APPID}_childMenus`,
        JSON.stringify(childMenus.value),
      )
    }
    routes.value = generateRoutes(
      [
        {
          path: '/',
          name: 'layout',
          component: 'layout/index',
          children: childMenus.value || [],
          // children: [
          //   {
          //     path: '/partybuild/outstandingPartyMember',
          //     name: 'outstandingPartyMember',
          //     component: 'partybuild/outstandingPartyMember',
          //     meta: {
          //       title: '优秀党员',
          //       icon: 'material-symbols:group',
          //     },
          //   },
          //   {
          //     path: '/partybuild/memberManage',
          //     name: 'memberManage',
          //     component: 'partybuild/memberManage',
          //     meta: {
          //       title: '党员管理',
          //       icon: 'material-symbols:groups',
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
    console.log(routes.value, '===============')
  } catch (error) {
    console.log(error)
  }
}

await initRoutes()

const router = createRouter({
  history:
    import.meta.env.VITE_PATH_MODE === 'hash' ?
      createWebHashHistory(import.meta.env.VITE_BASE_PATH)
    : createWebHistory(import.meta.env.VITE_BASE_PATH),
  routes: routes.value as any,
})
router.beforeEach((to, from, next) => {
  document.title =
    (to.meta.title as string) ?
      `${to.meta.title} | ${import.meta.env.VITE_PROJECT_NAME}`
    : import.meta.env.VITE_PROJECT_NAME
  next()
})

export default router
