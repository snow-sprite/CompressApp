<template>
  <!-- Local -->
  <div class="local-content">
    <label for="file">
      <div 
        class="upload-area"
        @dragover.prevent
        @drop="dropFileUpload"
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
        <span class="upload-area-text">请拖拽或点击上传</span>
        <input 
          id="file" 
          type="file" 
          style="display: none;" 
          ref="inputBtn" 
          @change="clickFileUpload"/>
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
              {{ item.size }}
            </span>
          </div>
        </div>
        <div class="thumb-right ellp">
          <!-- <img class="dir" src="static/img/wenjianjia.svg" alt="">
          <span class="ellp" :title="item.path">{{ item.path }}</span> -->
          <div class="progress success">
            <div class="bar" style="width: 100%;"></div>
            <!-- <span class="compressing">Compressing</span>
            <span class="finished">Finished</span> -->
          </div>
        </div>
        <div class="status">
          <span class="next-size size">
            <!-- 678.9 kb -->
            {{ item.compressedSize }}
          </span>
          <div class="find-percent">
            <span class="find">查看</span>
            <span class="percent">-100%</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'Local',
    data () {
      return {
        appPicsList: [] // 渲染待压缩图片列表
      }
    },
    components: {},
    mounted () {
      this.listenFileList()
    },
    methods: {
      dropFileUpload (e) { // 拖拽文件上传
        e.preventDefault()
        e.stopPropagation()
        // e.target.files
        for (let f of e.dataTransfer.files) {
          let filePath = f.path
          this.$electron.ipcRenderer.send('uploadEventMessage', filePath)
        }
      },
      clickFileUpload (e) { // 点击文件上传
        e.preventDefault()
        e.stopPropagation()
        for (let f of e.target.files) {
          let filePath = f.path
          this.$electron.ipcRenderer.send('uploadEventMessage', filePath)
        }
      },
      listenFileList () {
        let that = this
        // 获取要压缩的图片列表
        this.$electron.ipcRenderer.on('filesList', function (e, data) {
          if (data) {
            that.appPicsList = data
          }
        })
        this.$electron.ipcRenderer.on('finishedItem', function (event, data) {
          if (data) {
            that.appPicsList = data
          }
        })
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
