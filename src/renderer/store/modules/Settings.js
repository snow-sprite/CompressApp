const state = {
  globalKey: '' // 全局变量key
}

const mutations = {
  setGlobalKey (state, currentKey) {
    state.globalKey = currentKey
  }
}

export default {
  state,
  mutations
}
