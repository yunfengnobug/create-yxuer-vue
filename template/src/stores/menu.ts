import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu', () => {
  const childMenus = ref<any[]>([])

  const setChildMenus = (menus: any[]) => {
    childMenus.value = menus
  }

  return {
    childMenus,
    setChildMenus,
  }
})
