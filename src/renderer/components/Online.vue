<template>
  <!-- Online -->
  <div class="online-search-box">
    <p><span class="online-search-title">Please enter online image URL:</span></p><br/>
    <div class="online-search-box2">
      <input class="online-search-text" type="text" placeholder="url.." v-model="onlineImg" @keyup.enter="compressDownload">
      <button class="online-file-button" @click="compressDownload">Download</button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Online',
  data () {
    return {
      onlineImg: 'https://tinypng.com/images/panda-happy.png'
    }
  },
  mounted () {
    this.listenOnlineEvent()
  },
  methods: {
    compressDownload () {
      if (!this.onlineImg) return false
      this.$electron.ipcRenderer.send('onlineImgCompress', this.onlineImg)
    },
    listenOnlineEvent () {
      this.$electron.ipcRenderer.on('compressedOnlineImg', (event, data) => {
        console.log('cool, ', data)
      })
    }
  }
}
</script>

<style scoped>

</style>