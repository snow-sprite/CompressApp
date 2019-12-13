import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'

// css样式(由于项目初期使用原生js开发，所以css没有分离)
import '../../static/css/master.css'
import '../../static/css/index.css'

// mixins
import dragEvent from '../utils/dragEvent'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  mixins: [dragEvent],
  template: '<App/>'
}).$mount('#app')
