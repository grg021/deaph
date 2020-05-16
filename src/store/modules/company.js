import Company from '../../apis/company'

const state = {
  data: {}
}

const mutations = {
  SET_DATA: (state, data) => {
    state.data = data
  }
}

const actions = {
  getData ({ commit }, slug) {
    return new Promise((resolve, reject) => {
      Company.getCompanyWithTransactions(slug)
        .then(res => {
          commit('SET_DATA', res.data.data)
          resolve(res.data.data)
        }).catch(error => {
          reject(error)
        })
    })
  }
}

const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
