const AWS = require('aws-sdk')
const R = require('ramda')

const storiesS3 = new AWS.S3({
  accessKeyId: process.env.AWS_STORIES_USER_ACCESS_KEY,
  secretAccessKey: process.env.AWS_STORIES_USER_SECRET,
  region: process.env.AWS_STORIES_REGION
})
const bucket = process.env.AWS_S3_STORIES_BUCKET

const keyForHMACStory = (hmac) => `stories/hmac/${hmac}`

function listStoryHMACs() {
  return storiesS3.listObjectsV2({
    Bucket: bucket,
    Prefix: 'stories/hmac/'
  }).promise()
  .then(R.pipe(
    R.prop('Contents'),
    R.map(R.pipe(
      R.prop('Key'),
      R.objOf('id')
    ))
  ))
}

function readHMACStory(hmac) {
  return storiesS3.getObject({
    Bucket: bucket,
    Key: keyForHMACStory(hmac),
  }).promise()
}

function upload(key, body) {
  return storiesS3.upload({
    Bucket: bucket,
    Key: key,
    Body: body
  }).promise()
}

function uploadHMACStory(hmac, jsonString) {
  return upload(keyForHMACStory(hmac), jsonString)
}

module.exports = {
  listStoryHMACs,
  readHMACStory,
  uploadHMACStory
}
