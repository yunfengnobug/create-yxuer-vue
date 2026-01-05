<script lang="ts" setup>
import { envMode } from '@/utils'
import { HomeOutlined } from '@ant-design/icons-vue'
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const collapsed = ref<boolean>(true)
const selectedKeys = ref<string[]>([route.path])

// 监听路由变化，更新选中的菜单项
watch(
  () => route.path,
  (newPath) => {
    selectedKeys.value = [newPath]
  },
  { immediate: true },
)
// 定义菜单项类型
interface MenuItem {
  key: string
  icon?: any
  label: string
  title: string
  children?: MenuItem[]
  extendProps?: any
}

// 递归处理菜单数据
function processMenuItems(routes: any[]): MenuItem[] {
  return routes
    .filter((child) => child.meta?.title) // 只显示有标题的路由
    .map((child) => {
      const menuItem: MenuItem = {
        key: child.path,
        label: child.meta?.title as string,
        title: child.meta?.title as string,
        extendProps: child.meta?.extendProps || {},
      }

      // 只有配置了图标才添加图标
      if (child.meta?.icon) {
        menuItem.icon = child.meta.icon
      }

      // 如果有子路由，递归处理
      if (child.children && child.children.length > 0) {
        menuItem.children = processMenuItems(child.children)
      }

      return menuItem
    })
}

// 根据路由配置生成菜单数据
const menuItems = computed(() => {
  const routes = router.getRoutes()
  const layoutRoute = routes.find((r) => r.name === 'layout')
  if (!layoutRoute?.children) return []
  return processMenuItems(layoutRoute.children)
})

// 处理菜单点击
const handleMenuClick = ({ key }: { key: string }) => {
  router.push(key)
}
const backHome = () => {
  switch (envMode) {
    case 'prodmaster':
    case 'prodtencentCloud':
      window.open('../home/#/', '_self')
      break
    default:
      alert(
        '开发环境暂不支持返回首页：本页面和首页属于不同项目，即使两个项目同时本地启动，端口不同也无法共享localStorage',
      )
      break
  }
}
const showIcon = (item: MenuItem) => {
  if (item.key === selectedKeys.value[0]) {
    return item.extendProps?.icon || ''
  } else {
    return item.extendProps?.['icon-o'] || ''
  }
}
</script>
<template>
  <a-layout style="height: 100vh">
    <a-layout-sider
      class="menu-sider"
      :collapsedWidth="64"
      v-model:collapsed="collapsed"
      collapsible>
      <div class="logo" @click="backHome">
        <HomeOutlined />
        <span :class="{ 'collapsed-text': collapsed }" style="margin-left: 8px; color: white"
          >返回首页</span
        >
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="inline"
        @click="handleMenuClick">
        <template v-for="item in menuItems" :key="item.key">
          <!-- 有子菜单的情况 -->
          <a-sub-menu v-if="item.children && item.children.length > 0" :key="`sub-${item.key}`">
            <template #title>
              <span>{{ item.label }}</span>
            </template>
            <template #icon v-if="showIcon(item)">
              <img class="menu-icon" :src="showIcon(item)" alt="" />
            </template>
            <a-menu-item v-for="child in item.children" :key="child.key">
              <template #icon v-if="showIcon(child)">
                <img class="menu-icon" :src="showIcon(child)" alt="" />
              </template>
              <span>{{ child.label }}</span>
            </a-menu-item>
          </a-sub-menu>
          <!-- 没有子菜单的情况 -->
          <a-menu-item v-else :key="item.key">
            <template #icon v-if="showIcon(item)">
              <img class="menu-icon" :src="showIcon(item)" alt="" />
            </template>
            <span>{{ item.label }}</span>
          </a-menu-item>
        </template>
      </a-menu>
    </a-layout-sider>
    <a-layout-content style="font-size: 16px; height: 100vh; overflow-y: auto">
      <router-view />
    </a-layout-content>
  </a-layout>
</template>

<style lang="scss" scoped>
.logo {
  height: 32px;
  margin: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  user-select: none;

  .collapsed-text {
    margin-left: 0 !important;
  }
}

.menu-sider {
  overflow-y: auto;
  /* 隐藏滚动条 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }

  // 菜单收起时的样式
  &.ant-layout-sider-collapsed {
    // 返回首页收起时的样式
    .logo {
      flex-direction: column;
      height: auto;
      padding: 6px 0;
      margin: 12px 0;
      position: relative;

      .anticon {
        font-size: 20px !important;
        margin-bottom: 2px;
      }

      span {
        font-size: 12px !important;
        line-height: 1.2;
        text-align: center;
        display: block !important;
        margin-left: 0 !important;
      }

      // 返回首页间隔短杠
      &::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 50%;
        transform: translateX(-50%);
        width: 48px;
        height: 1px;
        background-color: #434343;
      }
    }

    // 菜单项样式
    :deep(.ant-menu-item) {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
      height: auto !important;
      padding: 6px 0 !important;
      margin-bottom: 32px !important;
      position: relative;
      overflow: unset !important;
      color: white !important;

      .ant-menu-item-icon {
        margin-inline-end: 0 !important;
        font-size: 24px !important;
        margin-bottom: 4px !important;
      }

      &:hover {
        background-color: #1890ff !important;
      }

      &::after {
        content: '';
        position: absolute;
        bottom: -16px;
        left: 50%;
        transform: translateX(-50%);
        width: 20px;
        height: 2px;
        background-color: #434343;
        z-index: 1;
      }

      &:last-of-type::after {
        display: none;
      }
    }

    // 菜单收起时文字样式
    :deep(.ant-menu-title-content) {
      margin-left: 0 !important;
      font-size: 12px !important;
      text-align: center !important;
      line-height: 1.2 !important;
      opacity: 1 !important;
      width: 100% !important;
      display: block !important;
      color: white !important;
    }

    // 子菜单样式
    :deep(.ant-menu-submenu) {
      margin-bottom: 32px !important;

      > .ant-menu-submenu-title {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        height: auto !important;
        padding: 6px 0 !important;
        position: relative;
        color: white !important;

        .ant-menu-item-icon {
          margin-inline-end: 0 !important;
          font-size: 24px !important;
          margin-bottom: 4px !important;
        }

        .ant-menu-title-content {
          margin-left: 0 !important;
          font-size: 12px !important;
          text-align: center !important;
          line-height: 1.2 !important;
          opacity: 1 !important;
          width: 100% !important;
          display: block !important;
        }

        &:hover {
          background-color: #1890ff !important;
        }

        &::after {
          content: '';
          position: absolute;
          bottom: -16px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 2px;
          background-color: #434343;
          z-index: 1;
        }
      }

      &:last-of-type > .ant-menu-submenu-title::after {
        display: none;
      }
    }
  }
}
.menu-icon {
  width: 24px;
  height: 24px;
}
</style>
