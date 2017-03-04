import axios from 'axios'

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
})

export default api

const extractData = (result) => result.data

export const fetchJSON = (...args) => api.get(...args).then(extractData)
export const postJSON = (...args) => api.post(...args).then(extractData)
export const patchJSON = (...args) => api.patch(...args).then(extractData)
