import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router'
import store from './store'
// import elementUI from 'element-ui';
// Vue.use(elementUI);

async function startApp () {
  let baseURL = process.env.BASE_URL
  const configFile = `config/config.json`
  console.log(`Loading config: ${configFile}`)
  const res = await axios.get(configFile, { baseURL })
  Vue.prototype.ARCGIS_API_BASE_URL = res.data.arcgisApiBaseUrl
  Vue.prototype.TIANDITU_TOKEN = res.data.tiandituToken
  console.log(`ARCGIS_API_BASE_URL: ${Vue.prototype.ARCGIS_API_BASE_URL}`)

  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
}

Vue.config.productionTip = false

startApp()