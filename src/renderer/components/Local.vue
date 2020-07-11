<template>
  <!-- Local -->
  <div class="local-content">
    <label for="file">
      <div 
        class="upload-area"
        @dragstart="dragEnterArea"
        @drop="fileUpload"
      >
        <div class="top-line">
          <hr class="row-line row-line-top" />
        </div>
        <div class="collmn-line right-line"></div>
        <div class="bottom-line">
          <hr class="row-line row-line-bottom" />
        </div>
        <div class="collmn-line left-line"></div>
        <p class="upload-area-img"></p>
        <span class="upload-area-text">Please drag or click to upload</span>
        <input 
          id="file" 
          type="file" 
          style="display: none;" 
          ref="inputBtn" 
          @change="fileUpload"/>
      </div>
    </label>
    <!-- result -->
    <ul id="result-list" class="show-result" v-if="appPicsList.length > 0">
      <li class="thumb-box" v-for="(item, ind) in appPicsList" :key="ind">
        <div class="detail">
          <div class="thumb-left ellp">
            <!-- <img class="thumb" src="static/img/image.svg" alt=""> -->
            <span class="thumb-name" :title="item.name">{{ item.name }}</span>
          </div>
          <div class="prev-size size">
            <span>
              <!-- 123.5 KB -->
              {{ item.size | sizeFormat }}
            </span>
          </div>
        </div>
        <div class="thumb-right ellp">
          <!-- <img class="dir" src="static/img/wenjianjia.svg" alt="">
          <span class="ellp" :title="item.path">{{ item.path }}</span> -->
          <div 
            class="progress"
            :class="{
              'compressing':item.isSupport && !item.compressedSize,
              'success': item.isSupport && item.compressedSize,
              'error': !item.isSupport
            }"
          >
            <div class="bar" style="width: 100%;" v-if="item.isSupport"></div>
            <div class="bar" style="width: 100%;" v-else>This file type is not supported</div>
            <!-- <span class="compressing">Compressing</span>
            <span class="finished">Finished</span> -->
          </div>
        </div>
        <div class="status">
          <span class="next-size size">
            <!-- 678.9 kb -->
            {{ item.compressedSize | sizeFormat }}
          </span>
          <div class="find-percent">
            <span class="find" v-if="item.compressedSize" @click="openPath(item.compressedPath)">查看</span>
            <span class="percent" v-if="item.compressedSize">-{{ Math.ceil((item.size - item.compressedSize) / item.size * 100) }}%</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import fs from 'fs'
import { validityApi } from '../lib/validate'
import { mapState } from 'vuex'
export default {
  name: 'Local',
  data () {
    return {
      isSingle: true, // 是否是单个文件或单个文件夹
      appPicsList: [], // 渲染待压缩图片列表,
      fileTag: '' // 上传类型 判断是纯文件 || 纯文件夹 || （文件夹&&文件）
    }
  },
  computed: {
    ...mapState({
      globalKey: state => state.Settings.globalKey
    })
  },
  components: {},
  mounted () {
    this.listenFileList()
  },
  methods: {
    dragEnterArea (e) {
      e.preventDefault()
    },
    fileUpload (e) { // 拖拽文件上传
      e.preventDefault()
      e.stopPropagation()
      console.log('e', e)
      let fileDataPath = ''
      if (e.type === 'drop') {
        fileDataPath = e.dataTransfer.files
      } else {
        fileDataPath = e.target.files
      }
      console.log('fileDataPath', fileDataPath)
      this.$store.commit('SET_GLOBAL_LOAING_TEXT', '')
      this.$store.commit('OPEN_GLOBAL_LOAING_STATE')
      validityApi()
        .then(() => {
          this.$store.commit('SET_GLOBAL_LOAING_TEXT', 'Start Compressing..')
          this.$store.commit('TOGGLE_GLOBAL_LOADING_ERROR_BOX', false)
          setTimeout(_ => {
            this.$store.commit('SET_GLOBAL_LOAING_TEXT', '')
            this.$store.commit('TOGGLE_GLOBAL_LOADING_ERROR_BOX', false)
            this.$store.commit('CLOSE_GLOBAL_LOAING_STATE')
          }, 2000)

          if (fileDataPath.length === 1) {
            this.isSingle = true
            let fileStat = fs.lstatSync(fileDataPath[0].path)
            if (fileStat.isFile()) {
              // 文件类型 支持的图片格式 单图片类型因为不破坏目标文件夹结构 可以追加 故单独使用
              for (let f of fileDataPath) {
                // if (/^image/gi.test(f.type)) {
                this.$electron.ipcRenderer.send('uploadSingleImgMessage', f.path, this.globalKey, this.isSingle)
                // }
              }
            } else {
              this.fileTag = 'folder'
              for (let f of fileDataPath) {
                this.$electron.ipcRenderer.send('uploadMultipleMessage', f.path, this.globalKey, this.isSingle, this.fileTag)
              }
            }
          } else {
            this.isSingle = false
            let fileObj = {}
            // // 给文件夹设置一个默认type
            let fType
            for (let f of fileDataPath) {
              // 给文件夹设置一个默认type
              fType = f.type || 'folder'
              fileObj[fType] = fileObj[fType] ? fileObj[fType] += 1 : 1
            }

            // 默认多图片类型
            this.fileTag = 'images'

            if (Object.keys(fileObj).length === 1) {
              // 只有文件夹类型
              if (fileObj['folder'] > 1) this.fileTag = 'folders'
            } else if (Object.keys(fileObj).length > 1) {
              // 包含文件夹&图片类型
              if (fileObj['folder'] >= 1) this.fileTag = 'folders-images'
            }
            for (let f of fileDataPath) {
              this.$electron.ipcRenderer.send('uploadMultipleMessage', f.path, this.globalKey, this.isSingle, this.fileTag)
            }
          }
        })
        .catch(err => {
          this.$store.commit('SET_GLOBAL_LOAING_TEXT',
            `verification failed with code:${err.status}`
          )
          this.$store.commit('TOGGLE_GLOBAL_LOADING_ERROR_BOX', true)
          setTimeout(_ => {
            this.$store.commit('SET_GLOBAL_LOAING_TEXT', '')
            this.$store.commit('TOGGLE_GLOBAL_LOADING_ERROR_BOX', false)
            this.$store.commit('CLOSE_GLOBAL_LOAING_STATE')
          }, 2000)
          // this.$electron.ipcRenderer.send('validateApiLocalError', err)
        })
    },
    listenFileList () { // 监听ipcMain事件
      // 获取要压缩的图片列表
      this.$electron.ipcRenderer.on('filesList', (e, data) => {
        if (data) {
          // 这里在本地缓存中存一份 渲染列表
          sessionStorage.setItem('singleImgList', JSON.stringify(data))

          let realRenderList = JSON.parse(sessionStorage.getItem('singleImgList'))
          this.appPicsList = realRenderList
        }
      })
      // 获取已经压缩完成的列表 重新计数，重绘图表
      this.$electron.ipcRenderer.on('finishedItem', (event, data) => {
        if (data) {
          this.$store.dispatch('getCompressedCount', this.globalKey)
          this.appPicsList = data
        }
      })
      // 所有任务已完成，发出通知
      this.$electron.ipcRenderer.on('AllDone', (event) => {
        if (!('Notification' in window)) {
          console.log('This browser does not support desktop notification')
          return false
        }
        let localNotification = new Notification('Compression succeeded', {
          body: '🎉🎉🎉congratulations!',
          icon: '../../../build/icons/logo.png'
        })
        localNotification.onclick = () => {
          console.log('通知被点击')
        }
      })
      // 压缩数量超过限制500张，提醒
      this.$electron.ipcRenderer.on('limitCountErrorEvent', event => {
        this.$store.commit('SET_GLOBAL_LOAING_TEXT', '当前Key已达到上限500！')
        this.$store.commit('TOGGLE_GLOBAL_LOADING_ERROR_BOX', true)
        setTimeout(_ => {
          this.$store.commit('SET_GLOBAL_LOAING_TEXT', '')
          this.$store.commit('TOGGLE_GLOBAL_LOADING_ERROR_BOX', false)
          this.$store.commit('CLOSE_GLOBAL_LOAING_STATE')
        }, 2000)
      })
    },
    openPath (path) { // 根据path打开对话框
      this.$store.dispatch('openPath', path)
    }
  }
}
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  div.progress {
    width: 100%;
    height: 100%;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    float: left;
    white-space: nowrap;
    overflow: hidden;
    -o-text-overflow: ellipsis;
    text-overflow: ellipsis;
    position: relative;
  }
  div.progress div.bar:after {
    content: 'Compressing'
  }
  div.progress.success div.bar:after {
    content: 'Finished'
  }
  div.progress div.bar {
    width: 100%;
    height: 100%;
    border-radius: 12px;
    -webkit-box-shadow: rgba(0,0,0,0.08) 0 -.96rem 1.6rem 0 inset;
    box-shadow: rgba(0,0,0,0.08) 0 -.96rem 1.6rem 0 inset;
    -webkit-animation: progress 1.5s linear 0s infinite;
    -moz-animation: progress 1.5s linear 0s infinite;
    -o-animation: progress 1.5s linear 0s infinite;
    -ms-animation: progress 1.5s linear 0s infinite;
    animation: progress 1.5s linear 0s infinite;
    background: -webkit-linear-gradient(315deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 31%, rgba(0,0,0,0.05) 33%, rgba(0,0,0,0.05) 67%, rgba(0,0,0,0) 69%);
    background: -moz-linear-gradient(315deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 31%, rgba(0,0,0,0.05) 33%, rgba(0,0,0,0.05) 67%, rgba(0,0,0,0) 69%);
    background: -o-linear-gradient(315deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 31%, rgba(0,0,0,0.05) 33%, rgba(0,0,0,0.05) 67%, rgba(0,0,0,0) 69%);
    background: -ms-linear-gradient(315deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 31%, rgba(0,0,0,0.05) 33%, rgba(0,0,0,0.05) 67%, rgba(0,0,0,0) 69%);
    background: linear-gradient(135deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 31%, rgba(0,0,0,0.05) 33%, rgba(0,0,0,0.05) 67%, rgba(0,0,0,0) 69%);
    -webkit-background-size: 4.8rem 2.2rem;
    -moz-background-size: 4.8rem 2.2rem;
    background-size: 4.8rem 2.2rem;
  }

  div.progress div.bar:after {
    position: absolute;
    margin: 0;
    width: 100%;
    height: 100%;
    padding: 3px 0;
    font-size: 16px;
    font-weight: normal;
    text-align: center;
    opacity: .9;
    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=90)";
    filter: alpha(opacity=90);
    line-height: 1em;
    color: #fff;
  }
  div.progress.error div.bar, div.progress.limited div.bar {
    width: 100%;
    background-color: #f94c00;
    -webkit-animation: none;
    -moz-animation: none;
    -o-animation: none;
    -ms-animation: none;
    animation: none;
    background-image: none;
    text-shadow: none;
    text-align: center;
    color: #fff;
    font-weight: bold;
    -webkit-font-smoothing: antialiased;
    line-height: 20px;
    font-size: 14px;
  }
  div.progress.success div.bar {
    background: #94e623;
  }

  div.progress.compressing div.bar {
    width: 100%;
    background-color: #3ee283;
  }

  @-moz-keyframes progress {
      from {
          background-position: 0
      }

      to {
          background-position: 4.8rem
      }
  }

  @-webkit-keyframes progress {
      from {
          background-position: 0
      }

      to {
          background-position: 4.8rem
      }
  }

  @-o-keyframes progress {
      from {
          background-position: 0
      }

      to {
          background-position: 4.8rem
      }
  }

  @keyframes progress {
      from {
          background-position: 0
      }

      to {
          background-position: 4.8rem
      }
  }
</style>
