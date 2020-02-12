import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import BaseMap from './views/BaseMap.vue'
import BIM from './views/BIM.vue'
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
      name: 'baseMap',
      component: BaseMap
    }, {
      path: '/bim', // arcgis js api 4.x
      name: 'bim',
      component: BIM
    }, {
      path: '/WebScene',
      name: 'webScene',
      component: WebScene
    }
  ]
})
