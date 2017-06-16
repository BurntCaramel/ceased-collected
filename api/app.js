const Hapi = require('hapi')

if (process.env.NODE_ENV === 'development') {
	require('dotenv').config()

	process.on('uncaughtException', (error) => {
		console.error(`Caught exception`, error)
	})
}

const server = new Hapi.Server()
server.connection({
	address: process.env.HOST,
	port: (process.env.PORT || 80),
  routes: {
    cors: true
  }
})

server.register([
	require('inert'),
	require('hapi-auth-jwt2'),
	{
		register: require('crumb'),
		options: {
			restful: true,
			cookieOptions: {
				path: '/',
				isHttpOnly: false, // Allow reading from front-end
				isSecure: !isDev
			}
		}
	}
])
.then(() => {
	server.auth.strategy('auth0-jwt', 'jwt', {
		key: process.env.AUTH0_CLIENT_SECRET,
		validateFunc(decoded, request, callback) {
			callback(null, true)
		},
		verifyOptions: {
			algorithms: [ 'HS256' ],
			audience: process.env.AUTH0_CLIENT_ID
		},
		urlKey: false,
		cookieKey: false
	})

	server.auth.default('auth0-jwt')

	server.route(require('./routes'))
})

server.start()
