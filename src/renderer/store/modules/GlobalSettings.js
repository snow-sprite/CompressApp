const state = {
  // 全局loading
  isShowGlobalLoading: false,
  // 全局loading文案
  globalLoadingText: '',
  // 展示全局错误提示
  isShowGlobalErrorBox: false
}

const mutations = {
  OPEN_GLOBAL_LOAING_STATE (state) {
    state.isShowGlobalLoading = true
  },
  CLOSE_GLOBAL_LOAING_STATE (state) {
    state.isShowGlobalLoading = false
  },
  TOGGLE_GLOBAL_LOADING_ERROR_BOX (state, status) {
    state.isShowGlobalErrorBox = status
  },
  SET_GLOBAL_LOAING_TEXT (state, text) {
    state.globalLoadingText = text
  }
}

export default {
  state,
  mutations
}
