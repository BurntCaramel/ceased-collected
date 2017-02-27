const Dyno = require('dyno')
const R = require('ramda')
const { runNode } = require('creed')
const {
	incrementIDForType
} = require('./ids')

function createOrganization({ name }) {
	// TODO
	return runNode()
}

module.exports = {
	createOrganization
}
