const state = {
  isShowGlobalLoading: false,
  globalLoadingText: ''
}

const mutations = {
  OPEN_GLOBAL_LOAING_STATE (state) {
    state.isShowGlobalLoading = true
  },
  CLOSE_GLOBAL_LOAING_STATE (state) {
    state.isShowGlobalLoading = false
  },
  SET_GLOBAL_LOAING_TEXT (state, text) {
    state.globalLoadingText = text
  }
}

export default {
  state,
  mutations
}
