import R from 'ramda'
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://1.stories.icing.space'
})

export default api

export const fetchJSON = (...args) => api.get(...args).then(R.prop('data'))
export const postJSON = (...args) => api.post(...args).then(R.prop('data'))
