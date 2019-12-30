<template>
  <!-- Settings -->
  <div class="settings-content">
      <div class="set-title">
        <span>Set your Api keys here</span>
        <div class="set-apikey-text" @click="openExternal">去获取Apikey..</div>
      </div>
    <div class="api-keys-list">
      <div class="api-key" v-for="(apiKey, ind) in keysList" :key="ind">
        <input 
          type="text" 
          class="settings-key" 
          placeholder="Tinypng Api key..." 
          :value="apiKey"
          @input="updateCurrentApiKey(ind)"
          ref="inputs"
          >
        <div class="switch-box is-success">
          <input
            :id="'apiKey' + ind"
            name="apiKey"
            class="switch-box-input"
            type="radio"
            :checked="activeKeyInd === ind"
            @click="setActiveKey(ind)">
          <label :for="'apiKey' + ind" class="switch-box-slider"></label>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { shell } from 'electron'

export default {
  name: 'Settings',
  data () {
    return {
      tinypngApiLink: 'https://tinypng.com/developers',
      keysList: [
        'fvDPnGNpDZRJsrtR5KdM4Qcbp8RvcYhN',
        '8qv069yMQM9KGBj2yk6HnSpskZTYB7KK',
        '',
        '',
        ''
      ],
      activeKeyInd: Number(localStorage.getItem('keyInd')) || 0, // 激活的key
      activeKey: localStorage.getItem('activeKey') || '' // 激活的key
    }
  },
  mounted () {
    // 保存keysList到本地
    localStorage.setItem('tinyKeys', JSON.stringify([]))
    let localTinyKeys = localStorage.getItem('tinyKeys')
    let localTinyKeysParsed = JSON.parse(localTinyKeys)
    for (let k of this.keysList) {
      localTinyKeysParsed.push(k)
    }
    localStorage.setItem('tinyKeys', JSON.stringify(localTinyKeysParsed))
    this.$store.commit('setGlobalKey', this.keysList[this.activeKeyInd])
    if (!this.activeKeyInd) {
      localStorage.setItem('activeKey', JSON.stringify(this.keysList[0]))
    }
  },
  methods: {
    setActiveKey (ind) {
      // 设置当前激活的key
      this.activeKeyInd = ind
      this.activeKey = this.keysList[ind]
      localStorage.setItem('keyInd', ind)
      this.$store.dispatch('getCompressedCount', this.keysList[ind])
      localStorage.setItem('activeKey', JSON.stringify(this.keysList[ind]))
    },
    updateCurrentApiKey (ind) {
      // 监听当前对input apikey的操作
      if (ind === this.activeKeyInd) {
        this.activeKey = this.$refs.inputs[ind].value
        localStorage.setItem('activeKey', this.activeKey)
        this.$store.commit('setGlobalKey', this.activeKey)
      }
      this.keysList[ind] = this.$refs.inputs[ind].value
      localStorage.setItem('tinyKeys', JSON.stringify(this.keysList))
    },
    openExternal () {
      // 打开外部链接
      shell.openExternal(this.tinypngApiLink)
    }
  }
}
</script>

<style scoped>

</style>