const Dyno = require('dyno')
const R = require('ramda')

const eventsTable = process.env.AWS_DYNAMODB_EVENTS_TABLE

const eventsDyno = Dyno({
  table: eventsTable,
  accessKeyId: process.env.AWS_STORIES_USER_ACCESS_KEY,
	secretAccessKey: process.env.AWS_STORIES_USER_SECRET,
	region: process.env.AWS_STORIES_REGION
})

//const writeStream = eventsDyno.putStream()

const convertEventsToPutRequests = R.map(R.pipe(
  R.objOf('Item'),
  R.objOf('PutRequest')
))

function writeEvents(events) {
  return new Promise((resolve, reject) => {
    eventsDyno.batchWriteAll({
      RequestItems: {
        [eventsTable]: convertEventsToPutRequests(events)
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

function readEvents() {
  return new Promise((resolve, reject) => {
    eventsDyno.scan({ Pages: 1 }, (error, data) => {
      if (error) {
        reject(error)
      }
      else {
        resolve(data.Items)
      }
    })
  })
}

module.exports = {
  writeEvents,
  readEvents
}
