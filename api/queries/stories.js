const storiesS3 = require('../s3/stories')

function listStories(organizationID) {
  return storiesS3.listStoryHMACs()
}

function readHMACStory(hmac, organizationID) {
  return storiesS3.readHMACStory(hmac)
}

module.exports = {
  listStories,
  readHMACStory
}
