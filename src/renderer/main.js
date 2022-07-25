import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core'
// 引入柱状图图表，图表后缀都为 Chart
import { PieChart } from 'echarts/charts'
import Element from 'element-ui'

// css样式(由于项目初期使用原生js开发，所以css没有分离)
import '../../static/css/master.css'
import '../../static/css/index.css'
import 'element-ui/lib/theme-chalk/index.css'

// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent
} from 'echarts/components'

// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features'

// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'

// mixins
import {
  defaultDragEvent,
  defaultRefreshEvent
} from './lib/defaultEvent'

// filters
import filters from './lib/filters'
Object.keys(filters).forEach(fil => {
  Vue.filter(fil, filters[fil])
})

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  PieChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
])

Vue.use(Element)
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

Vue.prototype.$echarts = echarts
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  mixins: [defaultDragEvent, defaultRefreshEvent],
  template: '<App/>'
}).$mount('#app')
