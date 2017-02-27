const Dyno = require('dyno')
const R = require('ramda')
const {
	convertItemsToPutRequests,
	readAllFrom
} = require('./utils')

const eventsTable = process.env.AWS_DYNAMODB_EVENTS_TABLE

const eventsDyno = Dyno({
  table: eventsTable,
  accessKeyId: process.env.AWS_STORIES_USER_ACCESS_KEY,
	secretAccessKey: process.env.AWS_STORIES_USER_SECRET,
	region: process.env.AWS_STORIES_REGION
})

//const writeStream = eventsDyno.putStream()

function writeEvents(events) {
  return new Promise((resolve, reject) => {
    eventsDyno.batchWriteAll({
      RequestItems: {
        [eventsTable]: convertItemsToPutRequests(events)
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

function readAllEvents() {
	return readAllFrom(eventsDyno)
}

module.exports = {
  writeEvents,
  readAllEvents
}
