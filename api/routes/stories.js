const Joi = require('joi')
const R = require('ramda')
const { list, create, read } = require('../s3/stories')

module.exports = [
	{
		method: 'GET',
		path: '/stories',
		handler(req, reply) {
			reply(
				list()
			)
		}
	},
	{
		method: 'GET',
		path: '/stories/{id}',
		handler(req, reply) {
			const { id } = req.params
			read(id)
			.then(({ ContentLength, ETag, Body }) => {
				reply(Body)
				.bytes(ContentLength)
				.type('json')
				.etag(ETag)
			}, reply)
			.catch(reply)
		}
	},
	{
		method: 'POST',
		path: '/stories',
		config: {
			payload: {
				output: 'data'
			},
			validate: {
				payload: Joi.object({
					title: Joi.string().optional(),
					body: Joi.string().required(),
					ingredients: Joi.array().items(Joi.string()).optional()
				})
			}
		},
		handler(req, reply) {
			const {
				title = 'Untitled',
				body,
				ingredients = []
			} = req.payload

			reply(
				create({
					title, body, ingredients
				})
				.then(R.prop('Key'))
			)
		}
	}
]