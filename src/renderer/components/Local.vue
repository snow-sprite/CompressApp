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
    <!-- TODO 参考tinipngy官网样式 -->
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
            :class="{'compressing': !item.compressedSize, 'success': item.compressedSize}"
          >
            <div class="bar" style="width: 100%;"></div>
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
import { validityApi } from '../lib/validate'
import { mapState } from 'vuex'
export default {
  name: 'Local',
  data () {
    return {
      appPicsList: [] // 渲染待压缩图片列表
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
      // TODO not work.
      // this.$electron.ipcRenderer.send('onDragStart')
    },
    fileUpload (e) { // 拖拽文件上传
      e.preventDefault()
      e.stopPropagation()
      let fileDataPath = ''
      if (e.type === 'drop') {
        fileDataPath = e.dataTransfer.files
      } else {
        fileDataPath = e.target.files
      }
      this.$store.commit('SET_GLOBAL_LOAING_TEXT', '验证TinyAPI有效性中..')
      this.$store.commit('OPEN_GLOBAL_LOAING_STATE')
      validityApi()
        .then(() => {
          this.$store.commit('SET_GLOBAL_LOAING_TEXT', '验证通过:)')
          setTimeout(_ => {
            this.$store.commit('CLOSE_GLOBAL_LOAING_STATE')
            this.$store.commit('TOGGLE_GLOBAL_LOADING_ERROR_BOX', false)
          }, 2000)
          if (fileDataPath.length === 1) {
            // 单张图 || 单个文件夹
            if (/^image/gi.test(fileDataPath[0].type)) {
              // 这里做个区分 单张图执行以下
              this.$electron.ipcRenderer.send('uploadSingleImgMessage', fileDataPath[0].path, this.globalKey)
            } else if (!/^image/gi.test(fileDataPath[0].type) && fileDataPath[0].type === '') {
              // 单个文件夹执行以下
              for (let f of fileDataPath) {
                let filePath = f.path
                let isNeedWalk = true
                this.$electron.ipcRenderer.send('uploadMultipleMessage', filePath, this.globalKey, isNeedWalk)
              }
            }
          } else if (fileDataPath.length > 1) {
            // 多文件 || 多文件夹
            let fileObj = {}
            for (let f of fileDataPath) {
              fileObj[f.type] = 1
            }
            if (Object.keys(fileObj).length > 1) {
              this.$store.commit('SET_GLOBAL_LOAING_TEXT', '您上传的格式暂不支持:(')
              this.$store.commit('TOGGLE_GLOBAL_LOADING_ERROR_BOX', true)
            } else {
              if (Object.keys(fileObj)[0] === '') {
                this.$store.commit('SET_GLOBAL_LOAING_TEXT', '暂时仅支持单文件夹哦:(')
                this.$store.commit('TOGGLE_GLOBAL_LOADING_ERROR_BOX', true)
              } else if (/^image/gi.test(Object.keys(fileObj)[0])) {
                this.$store.commit('SET_GLOBAL_LOAING_TEXT', '暂时仅支持单图片哦:(')
                this.$store.commit('TOGGLE_GLOBAL_LOADING_ERROR_BOX', true)
                // for (let f of fileDataPath) {
                //   let filePath = f.path
                //   let isNeedWalk = false
                //   this.$electron.ipcRenderer.send('uploadMultipleMessage', filePath, this.globalKey, isNeedWalk)
                // }
              }
            }
          }
        })
        .catch(err => {
          this.$store.commit('SET_GLOBAL_LOAING_TEXT',
            `verification failed with code:${err.status} :(`
          )
          this.$store.commit('TOGGLE_GLOBAL_LOADING_ERROR_BOX', true)
          setTimeout(_ => {
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
