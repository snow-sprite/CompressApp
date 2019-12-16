<template>
  <div class="work-area">
    <ul class="tabs">
      <li class="tab tab-settings"
        v-for="(item, ind) in navList" :key="ind"
        @click="jumpMap(ind)"
      >
        <span
          :class="{'icon-local': item.name === 'Local', 'icon-online': item.name === 'Online', 'icon-settings': item.name === 'Settings'}"
          class="icon-left"
        ></span>
        <span class="tab-text">{{ item.name }}</span>
        <i :class="{'after-icon': activeNavInd === ind}"></i>
      </li>
      <div class="charts-loading" v-if="!count">
        <img src="static/img/load/loading2.gif" alt="">
      </div>
      <div class="charts-box">
        <!-- <span class="charts-title">Usage of 500 pictures：{{ count }}</span> -->
        <div id="charts" class="charts"></div>
      </div>
      <p class="statement">
        <span>Compress and generate</span>
      </p>
      <i class="copyright">&copy;zhiozhou&lt;Cid&gt;</i>
    </ul>
    <div class="content">
      <Local v-show="activeNavInd === 0"/>
      <Online v-show="activeNavInd === 1"/>
      <Settings v-show="activeNavInd === 2"/>
    </div>
  </div>
</template>

<script>
  import Local from '@/components/Local'
  import Online from '@/components/Online'
  import Settings from '@/components/Settings'
  import { mapState } from 'vuex'
  export default {
    name: 'minify_your_images',
    data () {
      return {
        activeNavInd: 0, // 激活的nav
        navList: [{
          name: 'Local'
        }, {
          name: 'Online'
        }, {
          name: 'Settings'
        }]
      }
    },
    computed: {
      ...mapState({
        count: state => state.Counter.count
      })
    },
    components: {
      Local,
      Online,
      Settings
    },
    mounted () {
      // 获取当前apikey下载量
      this.getCompressedCount()
      // 设置apicount值
      this.listenCount()
    },
    watch: {
      count (newV, oldV) {
        // 设置图表
        if (newV) {
          this.setPieCharts()
        }
      }
    },
    methods: {
      jumpMap (ind) {
        this.activeNavInd = ind
      },
      getCompressedCount () {
        this.$store.dispatch('getCompressedCount', 'fvDPnGNpDZRJsrtR5KdM4Qcbp8RvcYhN')
      },
      setPieCharts () {
        let pieCharts = this.$echarts.init(document.getElementById('charts'))
        let options = {
          title: {
            show: true,
            text: 'Usage of 500 pictures',
            textStyle: {
              color: '#cdd0d5',
              fontSize: 16,
              fontWeight: 400
            },
            x: 'center',
            y: 'bottom'
          },
          series: [{
            type: 'pie',
            radius: '80%',
            center: ['50%', '50%'],
            selectedMode: 'single',
            label: {
              normal: {
                position: 'inner',
                formatter: '{b}({c}): {d}%'
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {value: this.count, name: 'used', selected: true},
              {value: 500 - this.count, name: 'unused'}
            ]
          }],
          color: [new this.$echarts.graphic.RadialGradient(0.5, 0.5, 1, [{
            offset: 0,
            color: 'rgb(251, 118, 63)'
          }, {
            offset: 1,
            color: 'rgb(204, 186, 172)'
          }]),
          new this.$echarts.graphic.RadialGradient(0.5, 0.5, 1, [{
            offset: 0,
            color: 'rgb(0, 250, 150)'
          }, {
            offset: 1,
            color: 'rgb(136,206,250)'
          }])]
        }
        pieCharts.setOption(options)
      },
      listenCount () {
        let that = this
        this.$electron.ipcRenderer.on('rebuildCount', function (event, data) {
          if (data) {
            that.$store.dispatch('getCompressedCount', 'fvDPnGNpDZRJsrtR5KdM4Qcbp8RvcYhN')
          }
        })
      }
    }
  }
</script>

<style>

</style>
