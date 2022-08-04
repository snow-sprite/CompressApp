<template>
  <!-- Settings -->
  <div class="settings-content">
      <div class="set-title">
        <span>Choose your Api keys here</span>
        <!-- <div class="set-apikey-text" @click="openExternal">Get more Apikey..</div> -->
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
        'Rqq4ZS1TPbQqyPPpdSbSDd9dyBzGK2Sv',
        'RLqWky7WpTVHqhNSDBL1h4hSWvtbHvLQ',
        'lnsMXTZLC7kcgxfcj5FF0yJ1VStyBm7X',
        'NzjzpXlKB0fPwcZSw79lMFQqD06npB7v'
      ],
      activeKeyInd: '', // 激活的key
      activeKey: '' // 激活的key
    }
  },
  methods: {
    setActiveKey (ind) {
      // 设置当前激活的key
      this.activeKeyInd = ind
      this.activeKey = this.keysList[ind]
      localStorage.setItem('keyInd', ind)
      this.$store.dispatch('getCompressedCount', this.activeKey)
      localStorage.setItem('activeKey', JSON.stringify(this.activeKey))
      this.$store.commit('setGlobalKey', this.activeKey)
    },
    updateCurrentApiKey (ind) {
      // 监听当前对input apikey的操作
      if (ind === this.activeKeyInd) {
        this.activeKey = this.$refs.inputs[ind].value
        localStorage.setItem('activeKey', JSON.stringify(this.activeKey))
        this.$store.commit('setGlobalKey', this.activeKey)
      }
      this.keysList[ind] = this.$refs.inputs[ind].value
      localStorage.setItem('tinyKeys', JSON.stringify(this.keysList))
    },
    openExternal () {
      // 打开外部链接
      shell.openExternal(this.tinypngApiLink)
    }
  },
  created () {
    // 保存keysList到本地
    this.activeKeyInd = Number(localStorage.getItem('keyInd')) || 0
    // 解决由于tinify key多了""导致api验证不通过报401错误的问题
    let localActiveKey = localStorage.getItem('activeKey')
    this.activeKey = localActiveKey ? JSON.parse(localActiveKey) : this.keysList[0]

    // 更新下已有缓存 销毁的生命周期中暂无法清除
    localStorage.setItem('tinyKeys', JSON.stringify([]))
    let localTinyKeys = localStorage.getItem('tinyKeys')
    let localTinyKeysParsed = JSON.parse(localTinyKeys)
    for (let k of this.keysList) {
      localTinyKeysParsed.push(k)
    }
    localStorage.setItem('tinyKeys', JSON.stringify(localTinyKeysParsed))
    this.$store.commit('setGlobalKey', this.activeKey)
  }
  // destroyed () {
  //   localStorage.clear()
  // }
}
</script>

<style scoped>

</style>
