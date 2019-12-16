<template>
  <!-- Settings -->
  <div class="settings-content">
    <div class="set-title">Set your Api keys here</div>
    <div class="api-keys-list">
      <div class="api-key" v-for="(apiKey, ind) in keysList" :key="ind">
        <input 
          type="text" 
          class="settings-key" 
          placeholder="Tinypng Api key..." 
          :value="apiKey"
          @input="updateCurrentApiKey"
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
export default {
  name: 'Settings',
  data () {
    return {
      keysList: [
        'fvDPnGNpDZRJsrtR5KdM4Qcbp8RvcYhN',
        '',
        '',
        '',
        '8qv069yMQM9KGBj2yk6HnSpskZTYB7KK'
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
  },
  methods: {
    setActiveKey (ind) {
      // 设置当前激活的key
      this.activeKeyInd = ind
      this.activeKey = this.keysList[ind]
      localStorage.setItem('keyInd', ind)
      this.$store.dispatch('getCompressedCount', this.keysList[ind])
      localStorage.setItem('activeKey', this.keysList[ind])
    },
    updateCurrentApiKey (e) {
      // 监听当前对input apikey的操作
      // this.keysList[ind] =
      console.log(1, e)
    }
  }
}
</script>

<style scoped>

</style>