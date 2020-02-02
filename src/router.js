import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Base from './views/Base.vue'
import WebScene from './views/WebScene.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/v3', // arcgis js api 3.x
      name: 'home',
      component: Home
    }, {
      path: '/', // arcgis js api 4.x
      name: 'Base',
      component: Base
    }, {
      path: '/WebScene',
      name: 'WebScene',
      component: WebScene
    }
  ]
})
