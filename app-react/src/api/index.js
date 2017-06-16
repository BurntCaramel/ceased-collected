import { readAuthToken, getDecodedAuthToken, storeAuthToken } from './token'
import { apiLoader, setAPILoaderToken } from './init'

setAPILoaderToken(readAuthToken())

export { getDecodedAuthToken }
export function setAuthToken(token) {
	storeAuthToken(token)
	setAPILoaderToken(token)
}

const extractData = (result) => result.data
export const fetchJSON = (...args) => apiLoader.get(...args).then(extractData)
export const postJSON = (...args) => apiLoader.post(...args).then(extractData)
export const patchJSON = (...args) => apiLoader.patch(...args).then(extractData)
export const sendDelete = (...args) => apiLoader.delete(...args).then(extractData)
