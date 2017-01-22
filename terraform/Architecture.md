## S3

Stories are stored in S3, bucket ‘royal-icing-stories’.

## SQS



## Processes


### Creating a new story anonymously

Hash story JSON to HMAC "contents_hmac"
Upload story JSON to S3, with key "contents_hmac"
Add event to DynamoDB: stories.storyContentUploaded
---
API result: "contents_hmac"
User’s URL becomes /stories/256:{contents_hmac}


### Creating a new story while logged in to "organization.uuid"

Hash story JSON to HMAC "contents_hmac"
Upload story JSON to S3, with key "contents_hmac"
Add event to DynamoDB: stories.storyContentUploaded
---
Create referenced content, with generated uuid "story.uuid", and specified name "story.name"
Add event to DynamoDB: organization.stories.storyUpdated
Store in memory cache: organization:{organization.uuid}/content:stories/uuid:{story.uuid}
---
API result: "story.uuid", "story.name"
User’s URL becomes /{organization.uuid}/stories/{story.uuid}


### Listing a user’s stories

Use in memory store
OR
Use RedisLabs cache
OR
Query OrganizationStories table

### Save memory cache to S3

Every 30 seconds, save in memory database to S3
