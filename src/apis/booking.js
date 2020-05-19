import Request from './request'

export default {
  get (uuid) {
    return Request.get(`/api/apply/${uuid}`)
  },
  retrieve (form) {
    return Request.post('/api/retrieve', form)
  },
  verify (form) {
    return Request.post('/api/apply', form)
  },
  submit (form) {
    return Request.post('/api/verify', form)
  },
  resend (form) {
    return Request.post('/api/resend', form)
  },
  cancel (form) {
    return Request.post('/api/booking/cancel', form)
  }
}
