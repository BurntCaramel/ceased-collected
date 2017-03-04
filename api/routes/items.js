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
	updateItemWithChanges
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
	ensureOwnerExists({
		pre: { owner, user }
	}, reply) {
		reply(
			readItem({ owner: user, type: owner.type, id: owner.id })
			.then(ownerItem => {
				if (!ownerItem) {
					throw Boom.unauthorized(`Not authorized for item: ${owner.type} ${owner.id}`)
				}
			})
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
					itemType: Joi.string().required()
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
		method: 'PATCH',
		path: ownerPathPrefix('/items/type:{itemType}/{id}'),
		config: {
			payload: {
				output: 'data'
			},
			validate: {
				payload: Joi.object({
					version: Joi.number().integer().positive().only(1),
					contentJSON: Joi.object().optional(),
					name: Joi.string().optional(),
					rawTags: Joi.string().optional(),
					tags: Joi.array().items(Joi.string()).optional(),
					previewDestination: Joi.object({
						device: Joi.string(),
						framework: Joi.string()
					}).optional()
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
			payload
		}, reply) {
			reply(
				updateItemWithChanges({ owner, type, id, changes: payload })
			)
		}
	}
]