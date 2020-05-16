import Request from './request'

export default {
  getCompanyWithTransactions (company) {
    return Request.get(`/api/company/${company}?include=branches`)
  }
}
