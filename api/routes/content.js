const Joi = require('joi')
const Boom = require('boom')
const R = require('ramda')
const {
	readAllContentItemsForType,
	readContentItem,
	createContentItem,
} = require('../dynamo/organizationReferencedContent')

const contentItemValidator = Joi.object({
	tags: Joi.array().items(Joi.string()).optional(),
	contentJSON: Joi.object().required()
})

module.exports = [
	{
		method: 'GET',
		path: '/@{organizationID}/content/{type}',
		handler(req, reply) {
			const { organizationID, type } = req.params
			reply(
				readAllContentItemsForType({ organizationID, type })
				.catch(error => {
					console.error(error)
					throw error
				})
			)
		}
	},
	{
		method: 'GET',
		path: '/@{organizationID}/content/{type}/{id}',
		handler(req, reply) {
			const {
				organizationID,
				type,
				id
			} = req.params

			readContentItem({ organizationID, type, id })
			.then(reply)
			.catch(error => {
				console.error(error)
				reply(error)
			})
		}
	},
	{
		method: 'POST',
		path: '/@{organizationID}/content/{type}',
		config: {
			payload: {
				output: 'data'
			},
			validate: {
				payload: contentItemValidator
			}
		},
		handler(req, reply) {
			const {
				organizationID,
				type
			} = req.params
			const {
				tags,
				contentJSON
			} = req.payload

			createContentItem({ organizationID, type, tags, contentJSON })
			.then(({ id, type }) => {
				// Successfully created
				reply({ id, type })
				.code(201) // 201 Created
				.location(`/@${organizationID}/content/${type}/${id}`)
			})
			.catch(error => {
				console.error(error)
				reply(error)
			})
		}
	},
	{
		method: 'PATCH',
		path: '/@{organizationID}/content/{type}/{id}',
		handler(req, reply) {
			// TODO
		}
	}
]