const Joi = require('joi')
const Boom = require('boom')
const R = require('ramda')
const {
	readAllIDs,
	createIDForType,
	incrementIDForType
} = require('../dynamo/ids')

const idValidator = Joi.object({
	type: Joi.string().alphanum().required()
})

module.exports = [
	{
		method: 'GET',
		path: '/_ids',
		handler(req, reply) {
			reply(
				readAllIDs()
			)
		}
	},
	{
		method: 'POST',
		path: '/_ids',
		config: {
			payload: {
				output: 'data'
			},
			validate: {
				payload: idValidator
			}
		},
		handler(req, reply) {
			const {
				type
			} = req.payload

			createIDForType(type)
			.then((result) => {
				// Reply with data
				reply(result)
				.code(201) // Created
				.location(`/_ids/${type}`)
			})
			.catch(error => {
				console.error(error)
				reply(error)
			})
		}
	},
	{
		method: 'PATCH',
		path: '/_ids/{type}',
		handler(req, reply) {
			const { type } = req.params
			const { change } = req.payload
			incrementIDForType(type)
			.then(result => {
				console.log('PATCH', result)
				reply(result)
			})
			.catch(error => {
				console.error(error)
				reply(error)
			})
		}
	}
]