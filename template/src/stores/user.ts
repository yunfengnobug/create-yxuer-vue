import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore(
  'user',
  () => {
    /** 整个 user 对象 */
    const user = ref<Record<string, any>>({})

    const setUser = (val: Record<string, any>) => {
      user.value = val || {}
    }

    return {
      user,
      setUser,
    }
  },
  {
    persist: true, //持久化
  },
)
