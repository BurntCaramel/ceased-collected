import Cookie from 'cookie'
import decodeJWT from 'jwt-decode'

const tokenCookieAge = 31536000

let decodedAuthToken = null

export function getDecodedAuthToken() {
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
		decodedAuthToken = null
		return null
	}
}

export function storeAuthToken(token) {
	document.cookie = Cookie.serialize('auth-token', token, { path: '/', maxAge: tokenCookieAge })
	try {
		decodedAuthToken = decodeJWT(token)
	}
	catch (error) {
		decodedAuthToken = null
	}
}
