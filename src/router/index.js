import Vue from 'vue'
import Router from 'vue-router'
import header from '@/components/header/header'
import ratings from '@/components/ratings/ratings'
import seller from '@/components/seller/seller'
import goods from '@/components/goods/goods'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/header',
      name: 'header',
      component: header
    },
    {
      path: '/ratings',
      name: 'ratings',
      component: ratings
    },
    {
      path: '/seller',
      name: 'seller',
      component: seller
    },
    {
      path: '/goods',
      name: 'goods',
      component: goods
    }
  ]
});
