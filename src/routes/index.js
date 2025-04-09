import { createRouter, createWebHashHistory } from 'vue-router'
import { constantRouter } from './constantRouter'
import { ElMessage } from 'element-plus'

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRouter,
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('TokenInfo')
  const userInfo = localStorage.getItem('userInfo')
  let UserInfo = { username: '' }
  if (userInfo !== 'undefined') {
    UserInfo = JSON.parse(userInfo)
  }
  if (to.path === '/login' && isLoggedIn) {
    ElMessage({
      message: '您已登录！若想退出请点击退出登录按钮！',
      type: 'error',
    })
    next('/home/analyse')
  } else if (to.path !== '/login' && to.path !== '/home/analyse' && !isLoggedIn) {
    localStorage.setItem('tab', '/home/analyse')
    ElMessage({
      message: '您未登录！',
      type: 'error',
    })
    next('/login')
  } else if (to.path === '/home/admin' && UserInfo.username !== 'administrator') {
    ElMessage({
      message: '您不是管理员，没有权限！',
      type: 'error',
    })
    localStorage.setItem('tab', '/home/analyse')
    next('/home/analyse')
  } else {
    next()
  }
})

export default router
