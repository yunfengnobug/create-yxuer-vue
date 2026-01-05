// 取缓存中的用户信息
export const user = JSON.parse(
  localStorage.getItem('newUserInfo') || localStorage.getItem('user') || '{}',
)
// 当前环境
export const envMode = import.meta.env.MODE
