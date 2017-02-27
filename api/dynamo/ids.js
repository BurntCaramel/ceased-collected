const Dyno = require('dyno')
const R = require('ramda')
const { runNode } = require('creed')
const {
	convertItemsToPutRequests,
	readAllFrom
} = require('./utils')

const idsTable = process.env.AWS_DYNAMODB_IDS_TABLE

const idsDyno = Dyno({
  table: idsTable,
  accessKeyId: process.env.AWS_STORIES_USER_ACCESS_KEY,
	secretAccessKey: process.env.AWS_STORIES_USER_SECRET,
	region: process.env.AWS_STORIES_REGION
})

//const writeStream = idsDyno.putStream()

function readAllIDs() {
	return readAllFrom(idsDyno)
}

function createIDForType(type) {
	return runNode(idsDyno.putItem, {
		TableName: idsTable,
		Item: {
			type,
			counter: 0
		}
	})
}

function incrementIDForType(type) {
	return runNode(idsDyno.updateItem, {
		TableName: idsTable,
		Key: { type },
		UpdateExpression: 'set #counter = #counter + :change',
		ExpressionAttributeNames: {
			'#counter': 'counter'
		},
		ExpressionAttributeValues: {
			':change': 1
		},
		ReturnValues: 'UPDATED_NEW'
	})
	.map(R.prop('Attributes'))
}

module.exports = {
  readAllIDs,
	createIDForType,
  incrementIDForType
}
