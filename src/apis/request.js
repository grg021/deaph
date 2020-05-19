import axios from 'axios'
import { Notify } from 'quasar'

const request = axios.create({
  baseURL: process.env.API,
  timeout: 5000
})

request.interceptors.response.use(

  response => {
    return response
  },
  error => {
    const show = [400, 404, 405, 422]

    if (show.includes(error.response.status)) {
      Notify.create({
        type: 'negative',
        position: 'top',
        progress: true,
        message: error.response.data.message
      })
    } else {
      Notify.create({
        type: 'negative',
        position: 'top',
        progress: true,
        message: 'Something went wrong. Please contact support.'
      })
    }

    return Promise.reject(error)
  }
)

export default request
