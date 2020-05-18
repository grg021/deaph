import Booking from '../../apis/booking'
const state = {
  data: {}
}

const mutations = {
  SET_BOOKING: (state, data) => {
    state.data = data
  }
}
const actions = {
  getBooking ({ commit }, uuid) {
    return new Promise((resolve, reject) => {
      Booking.get(uuid).then(res => {
        commit('SET_BOOKING', res.data.data)
        resolve(res)
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
