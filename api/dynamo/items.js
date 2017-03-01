const Dyno = require('dyno')
const R = require('ramda')
const { fromNode, runNode } = require('creed')
const {
	convertItemsToPutRequests,
	readAllFrom
} = require('./utils')
const {
	incrementIDForType
} = require('./ids')

const types = {
	record: 'record',
	picture: 'picture',
	story: 'story',
	screen: 'story-screen',
	message: 'story-message',
	promotion: 'story-promotion',
	component: 'component'
}

const itemsTable = process.env.AWS_DYNAMODB_ITEMS_TABLE

const uniqueIDForTypeAndID = (type, id) => `${type}-${id}`
const uniqueIDForOwner = (owner) => uniqueIDForTypeAndID(owner.type, owner.id)

const itemsDyno = Dyno({
	table: itemsTable,
	accessKeyId: process.env.AWS_STORIES_USER_ACCESS_KEY,
	secretAccessKey: process.env.AWS_STORIES_USER_SECRET,
	region: process.env.AWS_STORIES_REGION
})
const query = fromNode(itemsDyno.query.bind(itemsDyno))
const getItem = fromNode(itemsDyno.getItem.bind(itemsDyno))
const putItem = fromNode(itemsDyno.putItem.bind(itemsDyno))
const updateItem = fromNode(itemsDyno.updateItem.bind(itemsDyno))

//const writeStream = itemsDyno.putStream()

function readAllItemsForOwner({ owner }) {
	return query({
		TableName: itemsTable,
		KeyConditionExpression: 'ownerID = :ownerID',
		ExpressionAttributeValues: {
			':ownerID': uniqueIDForOwner(owner)
		},
		Pages: 1
	})
	.map(R.prop('Items'))
}

function readAllItemsForType({ owner, type }) {
	return query({
		TableName: itemsTable,
		IndexName: 'Type',
		KeyConditionExpression: 'ownerID = :ownerID and #type = :type',
		ExpressionAttributeNames: {
			'#type': 'type'
		},
		ExpressionAttributeValues: {
			':ownerID': uniqueIDForOwner(owner),
			':type': type
		},
		Pages: 1
	})
	.map(R.prop('Items'))
}

function readItem({ owner, type, id }) {
	return getItem({
		TableName: itemsTable,
		Key: {
			ownerID: uniqueIDForOwner(owner),
			id: uniqueIDForTypeAndID(type, id)
		}
	})
	.map(R.prop('Item'))
}

function createItem({ owner, type, tags = [], contentJSON }) {
	return incrementIDForType(type)
	.then(({ counter: id }) => {
		return putItem({
			TableName: itemsTable,
			Item: {
				ownerID: uniqueIDForOwner(owner),
				id: uniqueIDForTypeAndID(type, id),
				type,
				tags,
				contentJSON: JSON.stringify(contentJSON)
			}
		})
		.map(() => ({ type, id }))
	})
}

function updateNameForItem({ owner, type, id, newName }) {
	return updateItem({
		TableName: itemsTable,
		Key: {
			ownerID: uniqueIDForOwner(owner),
			id: uniqueIDForTypeAndID(type, id)
		},
		UpdateExpression: 'set #name = :newName',
		ExpressionAttributeNames: {
			'#name': 'name'
		},
		ExpressionAttributeValues: {
			':newName': newName
		},
		ReturnValues: 'ALL_NEW'
	})
	.map(R.prop('Attributes'))
}

function updateTagsForItem({ owner, type, id, newTags }) {
	return updateItem({
		TableName: itemsTable,
		Key: {
			ownerID: uniqueIDForOwner(owner),
			id: uniqueIDForTypeAndID(type, id)
		},
		UpdateExpression: 'set #tags = :newTags',
		ExpressionAttributeNames: {
			'#tags': 'tags'
		},
		ExpressionAttributeValues: {
			':newTags': newTags
		},
		ReturnValues: 'ALL_NEW'
	})
	.map(R.prop('Attributes'))
}

// function writeItems(documents) {
// 	return new Promise((resolve, reject) => {
// 		itemsDyno.batchWriteAll({
// 			RequestItems: {
// 				[itemsTable]: convertItemsToPutRequests(documents)
// 			}
// 		}, 10 /* retries */)
// 		.sendAll((error, data) => {
// 			if (error) {
// 				reject(error)
// 			}
// 			else {
// 				const { UnprocessedItems } = data
// 				// FIXME: send or enqueue UnprocessedItems
// 				resolve(data)
// 			}
// 		})
// 	})
// }

module.exports = {
	itemTypes: types,
	readAllItemsForOwner,
	readAllItemsForType,
	readItem,
	//writeItems,
	createItem,
	updateTagsForItem
}
