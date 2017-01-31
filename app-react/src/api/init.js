import R from 'ramda'
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
})

export default api

export const fetchJSON = (...args) => api.get(...args).then(R.prop('data'))
export const postJSON = (...args) => api.post(...args).then(R.prop('data'))
