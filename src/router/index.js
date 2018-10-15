import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/index'
import routes from '@/router/routes'

Vue.use(Router)

let router = new Router({
  linkActiveClass: 'active',
  routes
})

// 路由切换前置钩子
router.beforeEach((to, from, next) => {
  // 跳转页是否需要登录验证
  if (to.meta.requireAuth === 'no') {
    next()
  } else {
    // 默认每个都验证
    if (store.state.loginInfo.id) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
