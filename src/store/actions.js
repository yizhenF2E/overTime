import * as types from './mutationTypes'
import {
  saveLoginInfo,
  clearLoginInfo
} from '@/common/storage'

// 存储loginInfo（登陆）
export const saveLoginInfoAction = ({commit}, obj) => {
  commit(types.SET_LOGIN_INFO, saveLoginInfo(obj))
}

// 清空loginInfo（退出）
export const clearLoginInfoAction = ({commit}) => {
  commit(types.SET_LOGIN_INFO, clearLoginInfo())
}
