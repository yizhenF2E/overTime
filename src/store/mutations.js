// 存储数据的逻辑
import * as types from './mutationTypes'

const mutations = {
  [types.SET_LOGIN_INFO] (state, obj) {
    state.loginInfo = obj
  }
}

export default mutations
