import Company from '../../apis/company'

const state = {
  data: {
    branches: [],
    slug: ''
  },
  timeslots: []
}

const mutations = {
  SET_DATA: (state, data) => {
    state.data = data
  },
  SET_TIMESLOTS: (state, data) => {
    state.timeslots = data
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
  },
  getTimeSlots ({ commit, state }, params) {
    return new Promise((resolve, reject) => {
      Company.getTimeSlots(params)
        .then(res => {
          commit('SET_TIMESLOTS', res.data.time_slots)
          resolve(res.data.data)
        }).catch(error => {
          commit('SET_TIMESLOTS', [])
          reject(error)
        })
    })
  }
}

const getters = {
  getBranches: state => {
    return state.data.branches.data
  },
  getTimeSlots: state => {
    return state.timeslots
  },
  getSlug: state => {
    return state.data.slug
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
