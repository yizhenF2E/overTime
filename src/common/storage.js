import storage from 'good-storage'

/**
 * 登陆信息
 * @type {string}
 */
const LOGIN_INFO = '__loginInfo__'

// 存储loginInfo
export const saveLoginInfo = (obj) => {
  return storage.set(LOGIN_INFO, obj)
}

// 清空loginInfo
export const clearLoginInfo = () => {
  storage.remove(LOGIN_INFO)
  return {}
}

// 获取loginInfo
export const loadLoginInfo = () => {
  return storage.get(LOGIN_INFO, {})
}
