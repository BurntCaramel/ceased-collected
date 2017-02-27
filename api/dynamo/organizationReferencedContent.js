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
	storyItem: 'storyItem',
	component: 'component'
}

const contentTable = process.env.AWS_DYNAMODB_ORGANIZATION_REFERENCED_CONTENT_TABLE

const uuidForTypeAndID = (type, id) => `${type}-${id}`

const contentDyno = Dyno({
	table: contentTable,
	accessKeyId: process.env.AWS_STORIES_USER_ACCESS_KEY,
	secretAccessKey: process.env.AWS_STORIES_USER_SECRET,
	region: process.env.AWS_STORIES_REGION
})
const query = fromNode(contentDyno.query.bind(contentDyno))
const putItem = fromNode(contentDyno.putItem.bind(contentDyno))

//const writeStream = contentDyno.putStream()

function readAllContentItemsForType({ organizationID, type }) {
	return query({
		TableName: contentTable,
		IndexName: 'Type',
		KeyConditionExpression: 'organization = :organizationID and #type = :type',
		ExpressionAttributeNames: {
			'#type': 'type'
		},
		ExpressionAttributeValues: {
			':organizationID': organizationID,
			':type': type
		},
		Pages: 1
	})
	.map(R.prop('Items'))
}

function readContentItem({ organizationID, type, id }) {
	return query({
		TableName: contentTable,
		IndexName: 'Type',
		KeyConditionExpression: 'organization = :organizationID and #type = :type',
		ExpressionAttributeNames: {
			'#type': 'type'
		},
		ExpressionAttributeValues: {
			':organizationID': organizationID,
			':type': uuidForTypeAndID(type, id)
		},
		Pages: 1
	})
	.map(R.prop('Items'))
}

function createContentItem({ organizationID, type, tags = [], contentJSON }) {
	console.log('createContentItem')
	return incrementIDForType(type)
	.then(({ counter: id }) => {
		console.log('made id', id, type)
		return putItem({
			TableName: contentTable,
			Item: {
				organization: organizationID,
				uuid: uuidForTypeAndID(type, id),
				type,
				tags,
				contentJSON: JSON.stringify(contentJSON)
			}
		})
		.map(() => ({ type, id }))
	})
}

function updateTagsForItem({ organizationID, type, id, newTags }) {
	return new Promise((resolve, reject) => {
		contentDyno.updateItem({
			TableName: contentTable,
			Key: {
				organization: organizationID,
				uuid: uuidForTypeAndID(type, id)
			},
			UpdateExpression: 'put #tags = :newTags',
			ExpressionAttributeNames: {
				'#tags': 'tags'
			},
			ExpressionAttributeValues: {
				':newTags': newTags
			}
		}, (error, data) => {
			if (error) {
				reject(error)
			}
			else {
				resolve(data)
			}
		})
	})
}

function writeItems(documents) {
	return new Promise((resolve, reject) => {
		contentDyno.batchWriteAll({
			RequestItems: {
				[contentTable]: convertItemsToPutRequests(documents)
			}
		}, 10 /* retries */)
		.sendAll((error, data) => {
			if (error) {
				reject(error)
			}
			else {
				const { UnprocessedItems } = data
				// FIXME: send or enqueue UnprocessedItems
				resolve(data)
			}
		})
	})
}

module.exports = {
	readAllContentItemsForType,
	readContentItem,
	//writeItems,
	createContentItem,
	updateTagsForItem
}
