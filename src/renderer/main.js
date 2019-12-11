import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
// css样式(由于项目初期使用原生js开发，所以css没有分离)
import '../../static/css/master.css'
import '../../static/css/index.css'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
