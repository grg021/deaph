import axios from 'axios'

const request = axios.create({
  baseURL: process.env.API,
  timeout: 15000
})

export default request
