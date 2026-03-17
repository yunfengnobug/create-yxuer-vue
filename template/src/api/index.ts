import request from '@/utils/request'
const viteCloud = import.meta.env.VITE_CLOUD

/** 获取权限子菜单的请求参数 */
interface FindMyChildMenusParams {
  /** 学校编码 */
  schoolCode: string
  /** 菜单ID */
  menuId: string
  /** 额外返回字段，多个用逗号分隔（如 icon,path,component,name,extendProps） */
  extraFields?: string
}

/**
 * 获取权限子菜单 @author 陆志峰
 */
export const findMyChildMenus = (data: FindMyChildMenusParams) =>
  request.get(`${viteCloud}/base/menu/check/findMyChildMenus`, data, 'query', {
    headers: {
      appId: 'YXUER_HOME',
    },
  })
