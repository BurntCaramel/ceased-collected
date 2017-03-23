const Joi = require('joi')
const Boom = require('boom')
const R = require('ramda')
const { uploadStoryContent } = require('../commands/stories')
const { listStories, readHMACStory } = require('../queries/stories')
const { enqueueEvents } = require('../sqs/events')
const { readAllEvents } = require('../dynamo/events')

const storyValidator = Joi.object({
	//title: Joi.string().optional(),
	body: Joi.string().trim().required(),
	ingredients: Joi.array().items(Joi.object({
		id: Joi.string(),
		type: Joi.string()
	})).optional()
})

module.exports = [
	{
		method: 'GET',
		path: '/1/stories',
		handler(req, reply) {
			reply(
				listStories()
			)
		}
	},
	{
		method: 'GET',
		path: '/1/stories/256/{hmac}',
		config: {
			cors: true,
			validate: {
				params: {
					hmac: Joi.string().hex().required()
				}
			}
		},
		handler(req, reply) {
			const { hmac } = req.params
			readHMACStory(hmac)
			.then(({ ContentLength, ETag, Body }) => {
				reply(Body)
				.bytes(ContentLength)
				.type('json')
				.etag(ETag)
			})
			.catch(error => {
				reply(Boom.wrap(error, error.statusCode))
			})
		}
	},
	{
		method: 'POST',
		path: '/1/stories',
		config: {
			payload: {
				output: 'data'
			},
			validate: {
				payload: storyValidator
			}
		},
		handler(req, reply) {
			// TODO: signed in
			const userID = null
			const organizationID = null
			
			const {
				body,
				ingredients = []
			} = req.payload

			uploadStoryContent({
				version: 1,
				body,
				ingredients
			}, userID, organizationID)
			.then(({ data, events }) => {
				// TODO: send events
				enqueueEvents(events)
				.then(() => {

				})
				.catch(error => {
					// TODO: process error
				})

				// Reply with data
				reply({ data })
				.code(201) // Created
				.location(`/stories/256/${data.contentHMAC}`)
			})
      .catch(error => {
        reply(error)
      })
		}
	},
	{
		method: 'GET',
		path: '/_events',
		handler(req, reply) {
			reply(readAllEvents())
		}
	}
]