import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入封装的token方法
import { getToken } from '../utils/token'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "Login" */ '../views/Login/index.vue')
  },
  {
    path: '/home',
    redirect: '/home/welcome',
    component: () => import(/* webpackChunkName: "Home" */ '../views/Home/index.vue'),
    children: [
      {
        path: 'welcome',
        component: () => import(/* webpackChunkName: "Welcome" */ '../views/Welcome/index.vue')
      },
      {
        path: 'users',
        component: () => import(/* webpackChunkName: "User" */ '../views/User/index.vue')
      },
      {
        path: 'rights',
        component: () => import(/* webpackChunkName: "Right" */ '../views/Order/rights.vue')
      },
      {
        path: 'roles',
        component: () => import(/* webpackChunkName: "Role" */ '../views/Order/roles.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 路由前置全局守卫（在路由发生真正跳转之前，会执行该函数）
router.beforeEach((to, from, next) => {
  // 如果用户访问登录页面直接放行
  if (to.path === '/login') return next()
  // 如果没有token，强制跳转到登录页面
  if (!getToken()) {
    return next('/login')
  } else {
    // 有token放行
    next()
  }
})

export default router
