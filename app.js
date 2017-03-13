const Hapi = require('hapi')
const Boom = require('boom')

const server = new Hapi.Server()
server.connection({
	address: process.env.HOST,
	port: (process.env.PORT || 80)
})

server.register(require('inert'))
.then(() => {
	server.route(require('./api/routes'))

	server.route([
		{
			method: 'GET',
			path: '/favicon.ico',
			handler: {
				file: 'app-react/build/favicon.ico'
			}
		},
		{
			method: 'GET',
			path: '/static/{param*}',
			handler: {
				directory: {
					path: 'app-react/build/static'
				}
			}
		},
		{
			method: 'GET',
			path: '/1/{param*}',
			handler(request, reply) {
				reply(Boom.notFound())
			}
		},
		{
			method: 'GET',
			path: '/{param*}',
			handler: {
				file: 'app-react/build/index.html'
			}
		}
	])
})

server.start()
