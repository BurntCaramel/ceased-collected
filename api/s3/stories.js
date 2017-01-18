const R = require('ramda')
const uuid = require('uuid/v4')
const { storiesS3 } = require('./init')

const bucket = process.env.S3_STORIES_BUCKET

function list() {
  return storiesS3.listObjectsV2({
    Bucket: bucket
  }).promise()
  .then(R.prop('Contents'))
}

function create(storyJSON, id = uuid()) {
  return storiesS3.upload({
    Bucket: bucket,
    Key: id,
    Body: JSON.stringify(storyJSON)
  }).promise()
}

function read(id) {
  return storiesS3.getObject({
    Bucket: bucket,
    Key: id,
  }).promise()
}

module.exports = {
  list,
  create,
  read
}
