<template>
  <!-- Local -->
  <div class="local-content">
    <label for="file">
      <div 
        class="upload-area"
        @dragover.prevent
        @drop="dropFile"
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
        <input id="file" type="file" style="display: none;" />
      </div>
    </label>
    <!-- result -->
    <ul id="result-list" class="show-result">
      <li class="thumb-box">
        <div class="detail">
          <div class="thumb-left ellp">
            <img class="thumb" src="static/img/image.svg" alt="">
          <span class="thumb-name">巴拉巴拉巴拉</span>
          </div>
          <div class="thumb-right ellp">
            <img class="dir" src="static/img/wenjianjia.svg" alt="">
            <span class="ellp">/Users/ningzhou/workgroup/test/Electorn</span>
          </div>
        </div>
        <div class="status">
          compressing...
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import { ipcRenderer } from 'electron'
  export default {
    name: 'Local',
    components: {},
    methods: {
      dropFile (e) { // 拖拽文件到指定区域
        e.preventDefault()
        e.stopPropagation()
        console.log('1000')
        for (let f of e.dataTransfer.files) {
          let filePath = f.path
          console.log('fff', filePath)
          ipcRenderer.send('dragEventMessage', filePath)
        }
      },
      wow () {
        // 上传区域点击或拖拽
        // uploadArea.addEventListener('dragover', function(e) {
        //   e.preventDefault()
        //   e.stopPropagation()
        // })
        // uploadArea.addEventListener('drop', function(e) {
        //   e.preventDefault()
        //   e.stopPropagation()
        //   console.log('e', e)
        //   for (f of e.dataTransfer.files) {
        //     // console.log('fpath', f.path)
        //     let filesPath = f.path
        //     ipcRenderer.send('dragEventMessage', filesPath)
        //   }
        // })
        // document.addEventListener('dragover', function(e) {
        //   e.preventDefault()
        //   e.stopPropagation()
        // })

        // ipcRenderer.on('dragEventReply', function(event, data) {
        //   if (data) {
        //     console.log('DONE')
        //   }
        // })

        // // 渲染待压缩图片列表
        // // var appPicsList
        // ipcRenderer.on('filesList', function(e, data) {
        //   console.log('wow', data)
        //   console.log("test");
        //   console.log("test");
        //   // appPicsList = data
        // })
      }
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');
</style>
