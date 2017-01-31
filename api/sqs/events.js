const AWS = require('aws-sdk')
const R = require('ramda')
const { observable, action, runInAction, reaction } = require('mobx')
const { writeEvents } = require('../dynamo/events')

const eventsSQS = new AWS.SQS({
	accessKeyId: process.env.AWS_STORIES_USER_ACCESS_KEY,
	secretAccessKey: process.env.AWS_STORIES_USER_SECRET,
	region: process.env.AWS_STORIES_REGION
})

const sqsMessageGroupID = 'events.in'
const sqsURL = process.env.AWS_SQS_EVENTS_URL

const state = observable({
	successCount: 0,
	errorCount: 0
	//errors: observable.shallowArray([])
})

const deleteReceivedMessages = data => (
  eventsSQS.deleteMessageBatch({
    Entries: data.Messages.map((message, index) => ({
      Id: `${ index }`,
      ReceiptHandle: message.ReceiptHandle
    })),
    QueueUrl: sqsURL
  })
  .promise()
)

const processReceivedMessages = data => {
  console.log('processReceivedMessages', data)
  if (data.Messages) {
    const events = data.Messages.map(message => {
      const timestamp = parseFloat(message.Attributes.SentTimestamp)
      const event = JSON.parse(message.Body)
      console.log('event received', event, timestamp)
      return Object.assign({}, event, { timestamp })
    })

    const deleteEntries = data.Messages.map((message, index) => ({
      Id: `${ index }`,
      ReceiptHandle: message.ReceiptHandle
    }))

    return writeEvents(events)
    .then(response => {
      // FIXME: skip unprocessed events
      return deleteReceivedMessages(data)
    })
    .then(action(() => {
      state.successCount += 1
    }))
  }
  else {
    runInAction(() => {
      state.successCount += 1

      //enqueueEvents([{ section: 'test', type: 'test.blah' }])
    })
  }
}

const processReceivedError = action(error => {
  console.error('processReceivedError', error)
	state.errorCount += 1
})

reaction(
	() => ({
		successCount: state.successCount,
		errorCount: state.errorCount
	}),
	() => {
    console.log('start receiveMessage')
		eventsSQS.receiveMessage({
      QueueUrl: sqsURL,
			MaxNumberOfMessages: 10,
			WaitTimeSeconds: 1,
			AttributeNames: ['SenderId', 'SentTimestamp']
		})
		.promise()
		.then(processReceivedMessages)
		.catch(processReceivedError)
	},
	{
		name: 'events.sqs.messages.receiver',
		fireImmediately: true,
		delay: 250
	}
)

function send10EventsToSQS(events) {
	return eventsSQS.sendMessageBatch({
    QueueUrl: sqsURL,
    Entries: events.map((event, index) => ({
      Id: `${index}`,
      MessageBody: JSON.stringify(event),
      MessageGroupId: sqsMessageGroupID
    }))
	}).promise()
}

function enqueueEvents(events, send10Events = send10EventsToSQS) {
  return Promise.all(
    R.splitEvery(10, events).map(send10Events)
  )
}

module.exports = {
  enqueueEvents
}
