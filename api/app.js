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

server.route(require('./routes'))

server.start()
