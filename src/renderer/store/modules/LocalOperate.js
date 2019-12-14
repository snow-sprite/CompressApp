const {
  shell
} = require('electron').remote
const state = {}

const mutations = {
  OPEN_DIR_DIALOG (state, path) {
    shell.showItemInFolder(path)
  }
}

const actions = {
  openPath ({ commit }, path) {
    commit('OPEN_DIR_DIALOG', path)
  }
}

export default {
  state,
  mutations,
  actions
}
