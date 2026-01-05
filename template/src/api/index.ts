import request from '@/utils/request'
const viteCloud = import.meta.env.VITE_CLOUD

/**
 * 获取权限子菜单 @author 陆志峰
 */
export const findMyChildMenus = (data: {
  schoolCode: string // 学校编码
  menuId: string // 菜单ID
  extraFields?: string // 额外字段
}) => {
  return request.get(`${viteCloud}/base/menu/check/findMyChildMenus`, data, 'query', {
    headers: {
      appId: 'YXUER_HOME',
    },
  })
}
