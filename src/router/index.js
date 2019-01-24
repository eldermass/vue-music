import Vue from 'vue'
import Router from 'vue-router'
import Recommend from '@/views/recommend/recommend'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      name: 'recommend',
      component: Recommend,
      children: [{
        path: ':id',
        name: 'disc',
        component: () => import('@/views/recommend/disc')
      }]
    },
    {
      path: '/singer',
      name: 'singer',
      component: resolve => require(['@/views/singer/singer'], resolve),
      children: [
        {
          path: ':id',
          name: 'SingerDetail',
          component: resolve => require(['@/views/singer-detail/singer-detail'], resolve)
        }
      ]
    },
    {
      path: '/rank',
      name: 'rank',
      component: resolve => require(['@/views/rank/rank'], resolve),
      children: [{
        path: ':id',
        name: 'toplist',
        component: resolve => require(['@/views/rank/toplist'], resolve)
      }]
    },
    {
      path: '/search',
      name: 'search',
      component: resolve => require(['@/views/search/search'], resolve),
      children: [{
        path: ':id',
        component: resolve => require(['@/views/singer-detail/singer-detail'], resolve)
      }]
    },
    {
      path: '/user',
      name: 'user',
      component: resolve => require(['@/views/user/user'], resolve)
    }
  ]
})

export default router