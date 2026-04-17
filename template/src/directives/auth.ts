import { ref, type Directive } from 'vue'

export const authButKeys = ref<string[]>([])

export function updateAuthButKeys(routePath: string, childMenus: any[]) {
  const menuItem = childMenus.find((item: any) => item.path === routePath)
  if (menuItem?.children?.length > 0) {
    authButKeys.value = menuItem.children
      .filter((child: any) => child.meta?.menuType === 3 && child.meta?.butKey)
      .map((child: any) => child.meta.butKey)
  } else {
    authButKeys.value = []
  }
}

const placeholderMap = new WeakMap<HTMLElement, Comment>()

function removeEl(el: HTMLElement) {
  if (!el.parentNode) {
    return
  }
  const placeholder = document.createComment('')
  placeholderMap.set(el, placeholder)
  el.parentNode.replaceChild(placeholder, el)
}

function restoreEl(el: HTMLElement) {
  const placeholder = placeholderMap.get(el)
  if (placeholder?.parentNode) {
    placeholder.parentNode.replaceChild(el, placeholder)
    placeholderMap.delete(el)
  }
}

function toggleEl(el: HTMLElement, shouldRemove: boolean) {
  if (shouldRemove) {
    removeEl(el)
  } else {
    restoreEl(el)
  }
}

export const vAuth: Directive<HTMLElement, string> = {
  mounted(el, binding) {
    toggleEl(el, !binding.value || !authButKeys.value.includes(binding.value))
  },
  updated(el, binding) {
    toggleEl(el, !binding.value || !authButKeys.value.includes(binding.value))
  },
}

export const vNoauth: Directive<HTMLElement, string> = {
  mounted(el, binding) {
    toggleEl(el, Boolean(binding.value) && authButKeys.value.includes(binding.value))
  },
  updated(el, binding) {
    toggleEl(el, Boolean(binding.value) && authButKeys.value.includes(binding.value))
  },
}
