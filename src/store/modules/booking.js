import Booking from '../../apis/booking'
import moment from 'moment'

const getDefaultAppointment = () => {
  return {
    id: 0,
    cslug: '',
    date: moment().add(1, 'day').format('YYYY/MM/DD'),
    name: '',
    sms: '',
    branch: '',
    timeslot: '',
    verify: 'sms',
    code: '',
    pin: '',
    g_token: '',
    contact: '',
    is_trusted: 0
  }
}

const state = {
  data: {},
  appointment: getDefaultAppointment()
}

const mutations = {
  RESET_APPOINTMENT: (state) => {
    Object.assign(state.appointment, getDefaultAppointment())
  },
  SET_BOOKING: (state, data) => {
    state.data = data
  },
  SET_APPOINTMENT: (state, data) => {
    state.appointment = data
  },
  SET_BRANCH: (state, data) => {
    state.appointment.branch = data
  },
  SET_CSLUG: (state, data) => {
    state.appointment.cslug = data
  },
  SET_TIMESLOT: (state, data) => {
    state.appointment.timeslot = data
  },
  SET_GTOKEN: (state, data) => {
    state.appointment.g_token = data
  },
  SET_FORM_TWO: (state, data) => {
    state.appointment.contact = data.contact
    state.appointment.id = data.id
    state.appointment.is_trusted = data.is_trusted
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
  },
  rescheduleBooking ({ commit, dispatch }, param) {
    return new Promise((resolve, reject) => {
      Booking.reschedule(param).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
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
