const AWS = require('aws-sdk')

const storiesS3 = new AWS.S3({
  accessKeyId: process.env.S3_STORIES_USER_ACCESS_KEY,
  secretAccessKey: process.env.S3_STORIES_USER_SECRET,
  region: process.env.S3_STORIES_REGION
})

module.exports = {
  storiesS3
}
