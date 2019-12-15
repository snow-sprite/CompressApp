<template>
  <!-- Online -->
  <div class="online-search-box">
    <p><span class="online-search-title">Please enter online image URL:</span></p><br/>
    <!-- first -->
    <div class="online-box">
      <div class="online-search-box2" v-for="(item, ind) in onlineInputs" :key="ind">
        <input class="online-search-text" type="text" placeholder="url.." v-model="onlineImgs[ind]" @keyup.enter="compressDownload(ind)">
        <button 
          type="button"
          class="online-file-button online-download-btn">
          <div class="download-text-box" @click="compressDownload(ind)">Download</div>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Online',
  data () {
    return {
      onlineImgs: [
        'https://tinypng.com/images/panda-happy.png',
        'https://tinypng.com/images/example-orig.png',
        'http://dmimg.5054399.com/allimg/pkm/pk/22.jpg',
        'http://file02.16sucai.com/d/file/2014/0829/372edfeb74c3119b666237bd4af92be5.jpg',
        'http://file02.16sucai.com/d/file/2015/0408/779334da99e40adb587d0ba715eca102.jpg'
      ],
      onlineInputs: [1, 2, 3, 4, 5],
      onlineInputActive: -1
    }
  },
  mounted () {
    this.listenOnlineEvent()
  },
  methods: {
    compressDownload (ind) {
      if (!this.onlineImgs[ind]) return false
      this.onlineInputActive = ind
      this.$electron.ipcRenderer.send('onlineImgCompress', this.onlineImgs[ind])
    },
    listenOnlineEvent () {
      this.$electron.ipcRenderer.on('compressedOnlineImg', (event, downloadPath) => {
        if (downloadPath) {
          this.$store.dispatch('openPath', downloadPath)
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