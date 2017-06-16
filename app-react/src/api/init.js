import axios from 'axios'
import { readAuthToken } from './token'

export const apiLoader = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
	xsrfCookieName: 'crumb', // TODO: update to something less library specific?
	xsrfHeaderName: 'X-CSRF-Token'
})

export function setAPILoaderToken(token) {
	apiLoader.defaults.headers.common['Authorization'] = token
}
