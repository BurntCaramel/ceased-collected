//const { resolve, reject } = require('creed')
const {
	createItem
} = require('../dynamo/items')

module.exports = function({
	owner,
	type,
	name,
	contentJSON,
	tags
}) {
	return createItem({ owner, type, contentJSON, name, tags })
}