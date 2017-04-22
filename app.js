const Hapi = require('hapi')
const Boom = require('boom')

const isDev = (process.env.NODE_ENV === 'development')

if (isDev) {
	require('dotenv').config()

	process.on('uncaughtException', (error) => {
		console.error(`Caught exception`, error)
	})
}

const server = new Hapi.Server()
server.connection({
	address: process.env.HOST,
	port: (process.env.PORT || 80)
})

if (isDev) {
	server.on('request-error', (request, error) => {
		console.error(error)
		//console.log('Error response (500) sent for request: ' + request.id + ' because: ' + (err.trace || err.stack || err));
	});
}

server.register([
	require('inert'),
	//require('bell'),
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
	// From Auth0 authentication flow
	// server.auth.strategy('bell-auth0', 'bell', {
	// 	provider: 'auth0',
	// 	location: 'http://localhost:7000',
	// 	password: process.env.AUTH_COOKIE_PASSWORD,
	// 	clientId: process.env.AUTH0_CLIENT_ID,
	// 	clientSecret: process.env.AUTH0_CLIENT_SECRET,
	// 	cookie: 'bell-auth0',
  //   isSecure: !isDev,
  //   forceHttps: !isDev,
  //   isHttpOnly: true,
	// 	config: {
	// 		domain: process.env.AUTH0_DOMAIN,
	// 	}
	// })
	// Auth0 callback cookie
  // server.state('bell-auth0', {
  //   ttl: null,
  //   isSecure: !isDev,
  //   isHttpOnly: true,
  //   isSameSite: 'Strict',
  //   path: '/',
  //   encoding: 'iron',
  //   password: process.env.AUTH_COOKIE_PASSWORD
  // })
	// server.route({
	// 	method: ['GET', 'POST'],
	// 	path: '/auth0/callback/cookie',
	// 	config: {
	// 		auth: {
	// 			strategy: 'bell-auth0',
	// 			mode: 'try'
	// 		},
	// 		handler(request, reply) {
	// 			if (request.auth.isAuthenticated) {
	// 				//reply({ success: true, auth: request.auth })
	// 				reply().redirect('/')
	// 			}
	// 			else {
	// 				reply(request.auth.error)
	// 			}
	// 		}
	// 	}
	// })

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

	server.route(require('./api/routes'))

	server.route([
		{
			// Unknown paths to API
			method: 'GET',
			path: '/1/{param*}',
			config: { auth: false },
			handler(request, reply) {
				reply(Boom.notFound())
			}
		},
		{
			method: 'GET',
			path: '/favicon.ico',
			config: { auth: false },
			handler: {
				file: 'app-react/build/favicon.ico'
			}
		},
		{
			method: 'GET',
			path: '/static/{param*}',
			config: { auth: false },
			handler: {
				directory: {
					path: 'app-react/build/static'
				}
			}
		},
		{
			method: 'GET',
			path: '/{param*}',
			config: { auth: false },
			handler: {
				file: 'app-react/build/index.html'
			}
		}
	])
})

server.start()
