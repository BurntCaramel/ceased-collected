const Joi = require('joi')
const Boom = require('boom')
const R = require('ramda')

const processGitHubAppHook = require('../../hooks/github/app')

module.exports = [
	{
		method: 'POST',
		path: '/hooks/github/app',
		handler(req, reply) {
			reply(
				processGitHubAppHook(req)
			)
		}
	}
]