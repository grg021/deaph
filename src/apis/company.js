import Request from './request'

export default {
  getCompanyWithTransactions (company) {
    return Request.get(`/api/company/${company}?include=branches`)
  },
  getTimeSlots (params) {
    return Request.get('/api/get-time-slots', params)
  }
}
