import Cookie from 'cookie'
import decodeJWT from 'jwt-decode'

let decodedAuthToken = null

export function decodeAuthToken() {
	return decodedAuthToken
}

export function readAuthToken() {
	const cookies = Cookie.parse(document.cookie)
	try {
		const token = cookies['auth-token']
		decodedAuthToken = decodeJWT(token)
		return token
	}
	catch (error) {
		return null
	}
}

export function storeAuthToken(token) {
	document.cookie = Cookie.serialize('auth-token', token, { path: '/', maxAge: 31536000 })
	decodedAuthToken = decodeJWT(token)
}
