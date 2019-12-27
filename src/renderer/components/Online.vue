<template>
  <!-- Online -->
  <div class="online-search-box">
    <p class="online-search-title-box">
      <span class="online-search-title">Please enter online image URL:</span>
      <button class="online-search-title add" @click="addNewInput">Add+</button>
    </p><br/>
    <!-- first -->
    <div class="online-box-wrapper">
      <div class="online-box">
        <div class="online-search-box2" v-for="(item, ind) in onlineInputs" :key="ind">
          <input class="online-search-text" type="text" placeholder="url.." v-model="onlineImgs[ind]" @keyup.enter="compressDownload(ind)">
          <button 
            type="button"
            class="online-file-button online-download-btn">
            <div class="download-text-box" @click="compressDownload(ind)">Save</div>
          </button>
        </div>
      </div>
    </div>
    
  </div>
</template>
<script>
import os from 'os'
import { validityApi } from '../lib/validate'
import { mapState } from 'vuex'
export default {
  name: 'Online',
  data () {
    return {
      onlineImgs: [
        'https://tinypng.com/images/panda-happy.png'
      ],
      input: 0,
      onlineInputs: [0],
      onlineInputActive: -1
    }
  },
  computed: {
    ...mapState({
      globalKey: state => state.Settings.globalKey
    })
  },
  mounted () {
    this.listenOnlineEvent()
  },
  methods: {
    addNewInput () {
      // 增加一个新的输入框来下载
      this.onlineImgs.push('')
      this.input += 1
      this.onlineInputs.push(this.input)
    },
    compressDownload (ind) {
      if (!this.onlineImgs[ind]) return false
      this.onlineInputActive = ind
      // 设置全局loading状态
      this.$store.commit('SET_GLOBAL_LOAING_TEXT', 'Verify TinyAPI..')
      this.$store.commit('OPEN_GLOBAL_LOAING_STATE')
      validityApi()
        .then(() => {
          this.$store.commit('SET_GLOBAL_LOAING_TEXT', 'Verified :）')
          setTimeout(_ => {
            this.$store.commit('CLOSE_GLOBAL_LOAING_STATE')
          }, 1000)
          // 验证tinyapi通过则开始压缩
          this.$electron.ipcRenderer.send('onlineImgCompress', this.onlineImgs[ind], this.globalKey)
        })
        .catch(err => {
          this.$store.commit('SET_GLOBAL_LOAING_TEXT',
            `verification failed with code:${err.status} :（`
          )
          this.$store.commit('TOGGLE_GLOBAL_LOADING_ERROR_BOX', true)
          setTimeout(_ => {
            this.$store.commit('TOGGLE_GLOBAL_LOADING_ERROR_BOX', false)
            this.$store.commit('CLOSE_GLOBAL_LOAING_STATE')
          }, 2000)
          // 验证不通过，弹出警告框
          // this.$electron.ipcRenderer.send('validateApiOnlineError', err)
        })
    },
    listenOnlineEvent () {
      // 压缩完成 发出通知
      this.$electron.ipcRenderer.on('compressedOnlineImg', (event, downloadPath) => {
        if (downloadPath) {
          // windows用户需要授权 这里不发通知 直接弹出下载目录
          if (os.type() === 'Windows_NT') {
            this.$store.dispatch('openPath', downloadPath)
            return
          }
          if (!('Notification' in window)) {
            console.log('This browser does not support desktop notification')
            return false
          }
          let onLineNotification = new Notification('Compression succeeded', {
            body: '🎉🎉🎉congratulations! Click on me to show the results.',
            icon: '../../../build/icons/logo.png'
          })

          onLineNotification.onclick = () => {
            this.$store.dispatch('openPath', downloadPath)
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.load8 .loader,
.load8 .loader:after {
  border-radius: 50%;
  width: 20px;
  height: 20px;
}
.load8 .loader {
  margin: 0 auto;
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  border-top: 2px solid rgba(255, 255, 255, 0.2);
  border-right: 2px solid rgba(255, 255, 255, 0.2);
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  border-left: 2px solid #ffffff;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: load8 1.1s infinite linear;
  animation: load8 1.1s infinite linear;
}
@-webkit-keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>