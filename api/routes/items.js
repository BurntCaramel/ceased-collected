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
	updateContentForItem
} = require('../dynamo/items')

const itemValidator = Joi.object({
	tags: Joi.array().items(Joi.string()).optional(),
	contentJSON: Joi.object().required()
})

const handlers = {
	owner({
		params: {
			ownerType,
			ownerID
		}
	}, reply) {
		reply({
			type: ownerType,
			id: ownerID
		})
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
	itemType({
		params: { itemType }
	}, reply) {
		reply(itemType)
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
				throw Boom.notFound(`No item with type '${type}' and id '${id}' found`)
			}
		})
		.catch(reply)
	}
}

const ownerPathPrefix = (rest) => `/@{ownerType}/{ownerID}${rest}`

const ownerValidator= Joi.object({
	ownerType: Joi.string().required(),
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
		path: ownerPathPrefix('/items/type:{itemType}'),
		config: {
			pre: [
				[
					{
						assign: 'owner',
						method: handlers.owner
					},
					{
						assign: 'type',
						method: handlers.itemType
					}
				]
			],
			handler: handlers.itemsForType
		}
	},
	{
		method: 'GET',
		path: ownerPathPrefix('/items/type:{itemType}/{id}'),
		config: {
			pre: [
				[
					{
						assign: 'owner',
						method: handlers.owner
					},
					{
						assign: 'type',
						method: handlers.itemType
					}
				]
			],
			handler: handlers.item
		}
	},
	{
		method: 'POST',
		path: ownerPathPrefix('/items/type:{itemType}'),
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
						method: handlers.itemType
					}
				]
			]
		},
		handler({
			params: { ownerType, ownerID },
			pre: { owner, type },
			payload: { tags, contentJSON }
		}, reply) {
			createItem({ owner, type, tags, contentJSON })
			.then(({ id, type }) => {
				reply({ id, type })
				.code(201) // 201 Created
				.location(`/@${ownerType}/${ownerID}/items/${type}/${id}`)
			})
			.catch(reply)
		}
	},
	{
		method: 'PUT',
		path: ownerPathPrefix('/items/type:{itemType}/{id}/tags'),
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
						method: handlers.itemType
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
	},
	{
		method: 'PATCH',
		path: ownerPathPrefix('/items/type:{itemType}/{id}'),
		config: {
			payload: {
				output: 'data'
			},
			validate: {
				payload: Joi.object({
					contentJSON: Joi.object().optional()
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
						method: handlers.itemType
					}
				]
			]
		},
		handler({
			pre: { owner, type },
			params: { id },
			payload: { contentJSON }
		}, reply) {
			reply(
				updateContentForItem({ owner, type, id, contentJSON })
			)
		}
	}
]