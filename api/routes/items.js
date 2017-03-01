const Joi = require('joi')
const Boom = require('boom')
const R = require('ramda')
const { resolve, reject } = require('creed')
const {
	itemTypes,
	readAllItemsForOwner,
	readAllItemsForType,
	readItem,
	createItem,
	updateTagsForItem,
} = require('../dynamo/items')

const itemValidator = Joi.object({
	tags: Joi.array().items(Joi.string()).optional(),
	contentJSON: Joi.object().required()
})

const resourcesMap = new Map([
	['organizations', {
		type: 'organization'
	}],
	['stories', {
		type: itemTypes.story
	}],
	['screens', {
		type: itemTypes.screen
	}],
	['messages', {
		type: itemTypes.message
	}]
])

const promiseInfoForResources = (resources) => {
	const resourcesInfo = resourcesMap.get(resources)
	if (!resourcesInfo) {
		return reject(Boom.notFound(`Invalid resources: ${resources}`))
	}
	return resolve(resourcesInfo)
}

const handlers = {
	owner({
		params: {
			ownerResources,
			ownerID
		}
	}, reply) {
		reply(
			promiseInfoForResources(ownerResources)
			.then(({ type }) => ({
				type,
				id: ownerID
			}))
		)
	},
	authorizedForOwner({
		pre: { owner }
	}, reply) {
		if (owner.type === 'organization') {
			reply(owner.id === '1' || Boom.unauthorized(`Not allowed to access organization ${owner.id}`))
		}
	},
	itemsForOwner({
		pre: { owner }
	}, reply) {
		reply(
			readAllItemsForOwner({ owner })
		)
	},
	typeForResources({
		params: { resources }
	}, reply) {
		reply(
			promiseInfoForResources(resources).map(R.prop('type'))
		)
	},
	itemsForType({
		pre: { owner, type }
	}, reply) {
		console.log('itemsForType', owner, type)
		reply(
			readAllItemsForType({ owner, type })
		)
	},
	item({
		pre: { owner, type },
		params: { id },
	}, reply) {
		readItem({ owner, type, id })
		.then(item => {
			if (item) {
				reply(item)
			}
			else {
				reply().code(404)
			}
		})
		.catch(reply)
	}
}

const ownerPathPrefix = (rest) => `/@{ownerResources}/{ownerID}${rest}`

const ownerValidator= Joi.object({
	ownerResources: Joi.string().required(),
	ownerID: Joi.string().required()
})

module.exports = [
	{
		method: 'GET',
		path: ownerPathPrefix('/items'),
		config: {
			pre: [
				{
					assign: 'owner',
					method: handlers.owner
				}
			],
			handler: handlers.itemsForOwner
		}
	},
	{
		method: 'GET',
		path: ownerPathPrefix('/items/{resources}'),
		config: {
			pre: [
				[
					{
						assign: 'owner',
						method: handlers.owner
					},
					{
						assign: 'type',
						method: handlers.typeForResources
					}
				]
			],
			handler: handlers.itemsForType
		}
	},
	{
		method: 'GET',
		path: ownerPathPrefix('/items/{resources}/{id}'),
		config: {
			pre: [
				[
					{
						assign: 'owner',
						method: handlers.owner
					},
					{
						assign: 'type',
						method: handlers.typeForResources
					}
				]
			],
			handler: handlers.item
		}
	},
	{
		method: 'POST',
		path: ownerPathPrefix('/items/{resources}'),
		config: {
			payload: {
				output: 'data'
			},
			validate: {
				params: ownerValidator.keys({
					resources: Joi.string().required()
				}),
				payload: itemValidator
			},
			pre: [
				[
					{
						assign: 'owner',
						method: handlers.owner
					},
					{
						assign: 'type',
						method: handlers.typeForResources
					}
				]
			]
		},
		handler({
			params: { ownerResources, ownerID },
			pre: { owner, type },
			payload: { tags, contentJSON }
		}, reply) {
			createItem({ owner, type, tags, contentJSON })
			.then(({ id, type }) => {
				reply({ id, type })
				.code(201) // 201 Created
				.location(`/@${ownerResources}/${ownerID}/items/${type}/${id}`)
			})
			.catch(reply)
		}
	},
	{
		method: 'PUT',
		path: ownerPathPrefix('/items/{resources}/{id}/tags'),
		config: {
			payload: {
				output: 'data'
			},
			validate: {
				payload: Joi.object({
					tags: Joi.array().items(Joi.string()),
				})
			},
			pre: [
				[
					{
						assign: 'owner',
						method: handlers.owner
					},
					{
						assign: 'type',
						method: handlers.typeForResources
					}
				]
			]
		},
		handler({
			pre: { owner, type },
			params: { id },
			payload: { tags }
		}, reply) {
			reply(
				updateTagsForItem({ owner, type, id, newTags: tags })
			)
		}
	}
]