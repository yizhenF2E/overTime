import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'

Vue.use(Vuex)

// 定义一个store实例
const store = new Vuex.Store({
  actions,
  getters,
  state,
  mutations
})

export default store
