import { storeAuthToken } from './token'
import { refreshAPILoader } from './init'

export function setAuthToken(token) {
	storeAuthToken(token)
	refreshAPILoader(token)
}