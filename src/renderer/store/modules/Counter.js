import tinify from 'tinify'
import {
  validityApi
} from '../../../utils/formatter'

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
