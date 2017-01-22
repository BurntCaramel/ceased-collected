const events = require('../events/stories')
const { createHMACForString } = require('../utils')
const { uploadHMACStory } = require('../s3/stories')

function uploadStoryContent(storyJSON, userID, organizationID) {
	const jsonString = JSON.stringify(storyJSON)
	const contentHMAC = createHMACForString(jsonString)
	return uploadHMACStory(contentHMAC, jsonString)
	.then(result => ({
		data: {
			contentHMAC
		},
		events: events.storyContentUploaded({ contentHMAC, userID, organizationID })
	}))
}

function addStoryToOrganization(contentHMAC, userID, organizationID) {

}

module.exports = {
	uploadStoryContent
}
