// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index'

import iView from 'iview'
import store from '@/store/index' // 引入vuex状态管理

import {APP_ID, APP_KEY} from '../key'

import 'iview/dist/styles/iview.css'

import '@/assets/reset.css'// 引入初始化样式

// 初始化 leancloud-storage
import AV from 'leancloud-storage/live-query'

AV.init({
  appId: APP_ID,
  appKey: APP_KEY
})

Vue.prototype.$AV = AV

Vue.use(iView)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store
})
