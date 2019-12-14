import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'

// css样式(由于项目初期使用原生js开发，所以css没有分离)
import '../../static/css/master.css'
import '../../static/css/index.css'

// mixins
import defaultDragEvent from '../lib/defaultDragEvent'
import defaultRefreshEvent from '../lib/defaultRefreshEvent'
// filters
import filters from '../lib/filters'
Object.keys(filters).forEach(fil => {
  Vue.filter(fil, filters[fil])
})

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  mixins: [defaultDragEvent, defaultRefreshEvent],
  template: '<App/>'
}).$mount('#app')
