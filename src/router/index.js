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
      name: 'Recommend',
      component: Recommend,
      children: [{
        path: ':id',
        name: 'Disc',
        component: resolve => require(['@/views/recommend/disc'], resolve)
      }]
    },
    {
      path: '/singer',
      name: 'Singer',
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
      name: 'Rank',
      component: resolve => require(['@/views/rank/rank'], resolve),
      children: [{
        path: ':id',
        name: 'Toplist',
        component: resolve => require(['@/views/rank/toplist'], resolve)
      }]
    },
    {
      path: '/search',
      name: 'Search',
      component: resolve => require(['@/views/search/search'], resolve),
      children: [{
        path: ':id',
        component: resolve => require(['@/views/singer-detail/singer-detail'], resolve)
      }]
    },
    {
      path: '/user',
      name: 'User',
      component: resolve => require(['@/views/user/user'], resolve)
    }
  ]
})

export default router