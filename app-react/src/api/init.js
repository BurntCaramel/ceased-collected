import axios from 'axios'
import { readAuthToken, storeAuthToken } from './token'

const api = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
	xsrfCookieName: 'crumb', // TODO: update to something less library specific?
	xsrfHeaderName: 'X-CSRF-Token'
})

export function refreshAPILoader(token) {
	api.defaults.headers.common['Authorization'] = token
}

refreshAPILoader(readAuthToken())

const extractData = (result) => result.data

export const fetchJSON = (...args) => api.get(...args).then(extractData)
export const postJSON = (...args) => api.post(...args).then(extractData)
export const patchJSON = (...args) => api.patch(...args).then(extractData)
export const sendDelete = (...args) => api.delete(...args).then(extractData)
