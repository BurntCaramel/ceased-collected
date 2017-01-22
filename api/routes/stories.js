const Joi = require('joi')
const R = require('ramda')
const { uploadStoryContent } = require('../commands/stories')
const { listStories, readHMACStory } = require('../queries/stories')
const { enqueueEvents } = require('../sqs/events')
const { readEvents } = require('../dynamo/events')

module.exports = [
	{
		method: 'GET',
		path: '/stories',
		handler(req, reply) {
			reply(
				listStories()
			)
		}
	},
	{
		method: 'GET',
		path: '/stories/256:{hmac}',
		handler(req, reply) {
			const { hmac } = req.params
			readHMACStory(hmac)
			.then(({ ContentLength, ETag, Body }) => {
				reply(Body)
				.bytes(ContentLength)
				.type('json')
				.etag(ETag)
			})
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
				.location(`/stories/256:${data.contentHMAC}`)
			})
		}
	},
  {
    method: 'GET',
    path: '/_events',
    handler(req, reply) {
      reply(readEvents())
    }
  }
]