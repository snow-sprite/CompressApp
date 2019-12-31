import tinify from 'tinify'
import {
  validityApi
} from '../../lib/validate'

const state = {
  count: 0
}

const mutations = {
  CALCULATE_COUNT (state, count) {
    state.count = count
  }
}

const actions = {
  getCompressedCount ({ commit }, apiKey) {
    // 设置0显示小仓鼠
    commit('CALCULATE_COUNT', 0)
    tinify.key = apiKey
    validityApi()
      .then(() => {
        commit('CALCULATE_COUNT', tinify.compressionCount)
      })
      .catch(() => {})
  }
}

export default {
  state,
  mutations,
  actions
}
