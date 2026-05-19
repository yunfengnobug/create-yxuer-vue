import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu', () => {
  const childMenus = ref<any[]>([])
  const siderVisible = ref(true)

  const setChildMenus = (menus: any[]) => {
    childMenus.value = menus
  }

  const setSiderVisible = (visible: boolean) => {
    siderVisible.value = visible
  }

  return {
    childMenus,
    siderVisible,
    setChildMenus,
    setSiderVisible,
  }
})
