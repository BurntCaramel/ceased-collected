const AWS = require('aws-sdk')

const eventsDynamo = new AWS.DynamoDB({
  apiVersion: '2012-08-10',
  accessKeyId: process.env.AWS_STORIES_USER_ACCESS_KEY,
  secretAccessKey: process.env.AWS_STORIES_USER_SECRET,
  region: process.env.AWS_STORIES_REGION,
  sslEnabled: true
})

module.exports = {
  eventsDynamo
}
