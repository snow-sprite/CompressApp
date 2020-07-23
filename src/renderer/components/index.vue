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
      <div class="charts-loading" v-show="isChartsLoading">
        <img src="static/img/load/loading.gif" alt="">
      </div>
      <div class="charts-box" v-show="!isChartsLoading">
        <!-- <span class="charts-title">Usage of 500 pictures：{{ count }}</span> -->
        <div id="charts" class="charts"></div>
      </div>
      <p class="statement">
        <span>{{ app.build && app.build.productName}} v{{ app.version }}</span>
      </p>
      <!-- <i class="copyright">&copy;zhiozhou@Cid</i> -->
    </ul>
    <div class="content">
      <Local v-show="activeNavInd === 0"/>
      <Online v-show="activeNavInd === 1"/>
      <Settings v-show="activeNavInd === 2"/>
    </div>
    <div class="global-loading-box" v-show="isShowGlobalLoading">
      <div class="global-loading-wrapper">
        <div class="loader" v-show="!isShowGlobalErrorBox">
          <div class="face">
            <div class="circle"></div>
          </div>
          <div class="face">
            <div class="circle"></div>
          </div>
        </div>
        <div class="global-loading-wrong" v-show="isShowGlobalErrorBox"></div>
        <div class="loading-text">{{ globalLoadingText }}</div>
      </div>
    </div>
    <!-- 更新消息框 -->
    <el-dialog
      title="提示╰(*°▽°*)╯"
      width="300px"
      :visible.sync="msgDialogVisible"
      center
      top="30vh"
      :showClose="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      >
      <div>
        <p style="font-weight: 700;"><span>检测到新版本</span><span style="font-size: 18px;font-weight: 600;color: yellowgreen;">v{{ this.targetObj.version || '1.20.3' }}</span><span>，是否更新？</span></p>
        <ul class="update-info-box">
          <li class="update-info" v-for="(item, ind) in updateInfo" :key="ind">{{ item }}</li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="msgDialogVisible = false">No</el-button>
        <el-button size="small" type="primary" @click="updateByRoot()">Yes</el-button>
      </span>
    </el-dialog>
    <!-- 更新失败弹窗 -->
    <el-dialog
      title='提示Σ(⊙▽⊙"a'
      width="300px"
      :visible.sync="errorDialogVisible"
      center
      top="30vh"
      :showClose="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      >
      <p style="text-align:center;"><span>{{ this.badTargetObj.message || '检测到更新出错 : (' }}，是否需要重试？</span></p>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="errorDialogVisible = false">Cancel</el-button>
        <el-button size="small" type="primary" @click="updateByRoot()">Retry</el-button>
      </span>
    </el-dialog>
    <!-- 更新进度条 -->
    <div class="updating-box">
      <el-dialog
        title="更新中..."
        :visible.sync="refreshDialogVisible"
        width="200px"
        top="30vh"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :showClose="false"
        center
      >
        <div style="width:100%;height:20vh;line-height:20vh;text-align:center">
          <el-progress
            type="circle"
            :percentage="percentage"
            :width="strokeWidth"
          ></el-progress>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import pkg from '../../../package.json'
import Local from '@/components/Local'
import Online from '@/components/Online'
import Settings from '@/components/Settings'
import { mapState } from 'vuex'
import updateInfo from '../../../updateInfo.json'

export default {
  name: 'CompressYourImages',
  data () {
    return {
      activeNavInd: 0, // 激活的nav
      navList: [{
        name: 'Local'
      }, {
        name: 'Online'
      }, {
        name: 'Settings'
      }],
      app: {}, // 项目名 & 版本
      updateInfo: [], // 更新信息
      msgDialogVisible: false, // 消息框显隐
      errorDialogVisible: false, // 更新错误弹窗显隐
      refreshDialogVisible: false, // 更新进度条弹窗显隐
      percentage: 0,
      strokeWidth: 100,
      timer: null,
      // 更新文件信息
      targetObj: {},
      // 更新失败信息
      badTargetObj: {},
      timing: 2000, // 检测更新的延时时间
      isChartsLoading: true
    }
  },
  computed: {
    ...mapState({
      count: state => state.Counter.count,
      globalKey: state => state.Settings.globalKey,
      isShowGlobalLoading: state => state.GlobalSettings.isShowGlobalLoading,
      globalLoadingText: state => state.GlobalSettings.globalLoadingText,
      isShowGlobalErrorBox: state => state.GlobalSettings.isShowGlobalErrorBox
    })
  },
  components: {
    Local,
    Online,
    Settings
  },
  watch: {
    count (newV, oldV) {
      this.isChartsLoading = true
      // 设置图表
      if (newV) {
        this.timer && clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.isChartsLoading = false
          this.setPieCharts()
        }, this.timing)
      }
    },
    globalKey (newK, oldK) {
      this.isChartsLoading = true
      if (newK) {
        this.timer && clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.isChartsLoading = false
          this.setPieCharts()
        }, this.timing)
      }
    }
  },
  methods: {
    jumpMap (ind) {
      this.activeNavInd = ind
    },
    getCompressedCount () {
      this.$store.dispatch('getCompressedCount', this.globalKey)
    },
    setPieCharts () {
      let pieCharts = this.$echarts.init(document.getElementById('charts'))
      let options = {
        title: {
          show: false,
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
          color: 'rgb(255, 255, 255)'
        }, {
          offset: 1,
          color: 'rgb(251, 118, 123)'
        }]),
        new this.$echarts.graphic.RadialGradient(0.5, 0.5, 1, [{
          offset: 0,
          color: 'rgb(155, 155, 255)'
        }, {
          offset: 1,
          color: 'rgb(129, 227, 238)'
        }])]
      }
      pieCharts.setOption(options)
    },
    listenCount () {
      // 计算当前账号所已使用的压缩数量
      this.$electron.ipcRenderer.on('rebuildCount', (event, data) => {
        if (data) {
          this.$store.dispatch('getCompressedCount', this.globalKey)
        }
      })
    },
    setUpdateInfo () {
      if (Object.keys(updateInfo).length > 0) this.updateInfo.pop()
      Object.keys(updateInfo).forEach((key, ind) => {
        this.updateInfo.push(`${ind + 1}：${updateInfo[key]}`)
      })
    },
    checkForUpdate () {
      this.timer && clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$electron.ipcRenderer.send('checkForUpdateByDefault')
      }, this.timing)
    },
    listenUpdateEvent () {
      this.$electron.ipcRenderer.on('message', (event, arg) => {
        switch (arg.cmd) {
          case 'update-available':
            this.msgDialogVisible = true
            this.targetObj = { ...arg.message }
            break
          case 'download-progress':
            let percent = Math.floor(arg.message.percent)
            this.percentage = percent
            this.refreshDialogVisible = true
            break
          case 'error':
            this.msgDialogVisible = false
            this.errorDialogVisible = true
            this.badTargetObj = { ...arg }
            break
          default:
            this.msgDialogVisible = false
            this.errorDialogVisible = false
            this.refreshDialogVisible = false
        }
      })
    },
    updateByRoot () {
      this.msgDialogVisible = false
      this.errorDialogVisible = false
      // 主动触发更新机制
      this.$electron.ipcRenderer.send('checkForUpdateByRoot')
    }
  },
  mounted () {
    this.app = { ...pkg }
    this.setUpdateInfo()
    // 主动去连接更新 默认2秒后开始检测新版本
    this.checkForUpdate()
    // 接收主进程版本更新消息
    this.listenUpdateEvent()
    // 获取当前apikey下载量
    this.getCompressedCount()
    // 设置apicount值
    this.listenCount()

    this.timer && clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      if (this.count || this.count === 0) {
        this.isChartsLoading = false
        this.setPieCharts()
      }
    }, this.timing)
  },
  destroyed () {
    clearTimeout(this.timer)
  }
}
</script>

<style>
.loader {
    width: 100px;
    height: 100px;
    font-size: 10px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    margin-bottom: 5px;
}

.loader .face {
    position: absolute;
    border-radius: 50%;
    border-style: solid;
    animation: animate 1.5s linear infinite;
}

.loader .face:nth-child(1) {
    width: 100%;
    height: 100%;
    color: gold;
    border-color: currentColor transparent transparent currentColor;
    border-width: 0.2em 0.2em 0em 0em;
    --deg: -45deg;
    animation-direction: normal;
}

.loader .face:nth-child(2) {
    width: 70%;
    height: 70%;
    color: lime;
    border-color: currentColor currentColor transparent transparent;
    border-width: 0.2em 0em 0em 0.2em;
    --deg: -135deg;
    animation-direction: reverse;
}

.loader .face .circle {
    position: absolute;
    width: 50%;
    height: 0.1em;
    top: 50%;
    left: 50%;
    background-color: transparent;
    transform: rotate(var(--deg));
    transform-origin: left;
}

.loader .face .circle::before {
    position: absolute;
    top: -0.5em;
    right: -0.5em;
    content: '';
    width: 1em;
    height: 1em;
    background-color: currentColor;
    border-radius: 50%;
    box-shadow: 0 0 2em,
                0 0 4em,
                0 0 6em,
                0 0 8em,
                0 0 10em,
                0 0 0 0.5em rgba(255, 255, 0, 0.1);
}

@keyframes animate {
    to {
        transform: rotate(1turn);
    }
}
.el-dialog { background: lightcyan; }

/* 更新中弹窗 */
.updating-box .el-dialog {
  background: none;
  box-shadow: none;
  border: 0;
}
.updating-box .el-dialog__title { color: #fff; }
.updating-box .el-progress__text { color: yellowgreen; }
</style>
