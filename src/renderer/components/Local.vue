<template>
  <!-- Local -->
  <div class="local-content">
    <label for="file">
      <div class="upload-area">
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
            <img class="thumb" src="../../../static/img/image.svg" alt="">
          <span class="thumb-name">巴拉巴拉巴拉</span>
          </div>
          <div class="thumb-right ellp">
            <img class="dir" src="../../../static/img/wenjianjia.svg" alt="">
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
  export default {
    name: 'Local',
    components: {},
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');
</style>
