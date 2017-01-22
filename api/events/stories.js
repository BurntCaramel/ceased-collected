const R = require('ramda')

const section = 'stories'

const createEvent = R.curry((section, type, payload) => ({
  section,
  type,
  payload: JSON.stringify(payload)
}))

//const storyCreated = createEvent('story.created')

const storyContentUploaded = ({ contentHMAC, userID, organizationID }) => ({
  section,
  type: 'stories.storyContentUploaded',
  payload: {
    contentHMAC,
    userID,
    organizationID
  }
})

module.exports = {
  storyContentUploaded
}
