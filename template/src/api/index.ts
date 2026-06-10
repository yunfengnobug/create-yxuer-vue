import request from '@/utils/request'
const viteCloud = import.meta.env.VITE_CLOUD
const viteSchool = import.meta.env.VITE_SCHOOL

/**
 * 通过userKey获取个人信息
 */
export const findUserInfo = (data: { userKey: string }) =>
  request.get(`${viteSchool}/newUser/findUserInfo`, data)

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
