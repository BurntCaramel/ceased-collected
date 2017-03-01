variable "region" {
  default = "us-west-2"
}

provider "aws" {
  region = "${var.region}"
}

# resource "aws_iam_role" "stories" {
#   name = "stories-read-write"

#   assume_role_policy = <<EOF
# {
#   "Version": "2012-10-17",
#   "Statement": [
#     {
#       "Action": "sts:AssumeRole",
#       "Principal": {
#         "AWS": "${aws_iam_user.stories.arn}"
#       },
#       "Effect": "Allow",
#       "Sid": ""
#     }
#   ]
# }
# EOF
# }

resource "aws_iam_user" "stories" {
  name = "stories"
  path = "/data/"
}

resource "aws_s3_bucket" "stories" {
  bucket = "royal-icing-stories"
  acl    = "authenticated-read"

  versioning {
    enabled = true
  }

  lifecycle {
    prevent_destroy = true
  }

  tags {
    Name = "Stories"
  }
}

data "aws_iam_policy_document" "event-writes-sqs" {
  statement {
    resources = [
      "${aws_sqs_queue.event-writes.arn}",
    ]

    condition = {
      test     = "ArnEquals"
      variable = "aws:SourceArn"
      values   = ["${aws_sqs_queue.event-writes.arn}"]
    }

    actions = [
      "sqs:*",
    ]
  }

  statement {
    resources = [
      "${aws_sqs_queue.event-writes.arn}",
    ]

    actions = [
      "sqs:*",
    ]

    principals = {
      type        = "AWS"
      identifiers = ["${aws_iam_user.stories.arn}"]
    }
  }
}

resource "aws_sqs_queue" "event-writes" {
  name                        = "Stories-EventWrites.fifo"
  fifo_queue                  = true
  content_based_deduplication = true                       # Same event at similar time will become one
}

resource "aws_sqs_queue_policy" "event-writes" {
  queue_url = "${aws_sqs_queue.event-writes.id}"
  policy    = "${data.aws_iam_policy_document.event-writes-sqs.json}"
}

## DynamoDB

data "aws_iam_policy_document" "events-dynamodb" {
  statement {
    resources = [
      "${aws_dynamodb_table.events.arn}",
    ]

    actions = [
      "dynamodb:BatchGetItem",
      "dynamodb:BatchWriteItem",
      "dynamodb:DeleteItem",
      "dynamodb:GetItem",
      "dynamodb:GetRecords",
      "dynamodb:GetShardIterator",
      "dynamodb:PutItem",
      "dynamodb:Query",
      "dynamodb:Scan",
      "dynamodb:UpdateItem",
    ]
  }
}

data "aws_iam_policy_document" "ids-dynamodb" {
  statement {
    resources = [
      "${aws_dynamodb_table.ids.arn}",
    ]

    actions = [
      "dynamodb:BatchGetItem",
      "dynamodb:BatchWriteItem",
      "dynamodb:DeleteItem",
      "dynamodb:GetItem",
      "dynamodb:GetRecords",
      "dynamodb:GetShardIterator",
      "dynamodb:PutItem",
      "dynamodb:Query",
      "dynamodb:Scan",
      "dynamodb:UpdateItem",
    ]
  }
}

data "aws_iam_policy_document" "items-dynamodb" {
  statement {
    resources = [
      "${aws_dynamodb_table.items.arn}",
      "${aws_dynamodb_table.items.arn}/*",
    ]

    actions = [
      "dynamodb:BatchGetItem",
      "dynamodb:BatchWriteItem",
      "dynamodb:DeleteItem",
      "dynamodb:GetItem",
      "dynamodb:GetRecords",
      "dynamodb:GetShardIterator",
      "dynamodb:PutItem",
      "dynamodb:Query",
      "dynamodb:Scan",
      "dynamodb:UpdateItem",
    ]
  }
}

resource "aws_dynamodb_table" "events" {
  name             = "Stories.Events"
  read_capacity    = 10
  write_capacity   = 10
  stream_enabled   = true
  stream_view_type = "NEW_IMAGE"

  hash_key  = "section"
  range_key = "timestamp"

  attribute {
    name = "section"
    type = "S"
  }

  attribute {
    name = "timestamp"
    type = "N"
  }
}

resource "aws_dynamodb_table" "ids" {
  name             = "Stories.IDs"
  read_capacity    = 10
  write_capacity   = 10
  stream_enabled   = true
  stream_view_type = "NEW_IMAGE"

  hash_key = "type"

  attribute {
    name = "type"
    type = "S"
  }
}

resource "aws_dynamodb_table" "items" {
  name             = "Organization.Items"
  read_capacity    = 1
  write_capacity   = 1
  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"

  hash_key  = "ownerID"
  range_key = "id"

  attribute {
    name = "ownerID"
    type = "S"
  }

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "type"
    type = "S"
  }

  local_secondary_index {
    name            = "Type"
    range_key       = "type"
    projection_type = "ALL"
  }
}

resource "aws_iam_access_key" "stories" {
  user = "${aws_iam_user.stories.name}"
}

resource "aws_iam_user_policy" "stories" {
  name = "s3-stories"
  user = "${aws_iam_user.stories.name}"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "s3:ListBucket"
      ],
      "Effect": "Allow",
      "Resource": "arn:aws:s3:::${aws_s3_bucket.stories.bucket}"
    },
    {
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Effect": "Allow",
      "Resource": "arn:aws:s3:::${aws_s3_bucket.stories.bucket}/*"
    }
  ]
}
EOF
}

resource "aws_iam_user_policy" "user-stories-items-dynamodb" {
  name   = "user-stories-itens-dynamodb"
  user   = "${aws_iam_user.stories.name}"
  policy = "${data.aws_iam_policy_document.items-dynamodb.json}"
}

resource "aws_iam_user_policy" "user-stories-ids-dynamodb" {
  name   = "user-stories-ids-dynamodb"
  user   = "${aws_iam_user.stories.name}"
  policy = "${data.aws_iam_policy_document.ids-dynamodb.json}"
}

resource "aws_iam_user_policy" "user-stories-events-dynamodb" {
  name   = "user-stories-events-dynamodb"
  user   = "${aws_iam_user.stories.name}"
  policy = "${data.aws_iam_policy_document.events-dynamodb.json}"
}

output "AWS_STORIES_USER_ACCESS_KEY" {
  value = "${aws_iam_access_key.stories.id}"
}

output "AWS_STORIES_USER_SECRET" {
  value = "${aws_iam_access_key.stories.secret}"
}

output "AWS_SQS_EVENTS_URL" {
  value = "${aws_sqs_queue.event-writes.id}"
}

output "AWS_DYNAMODB_EVENTS_TABLE" {
  value = "${aws_dynamodb_table.events.id}"
}

output "AWS_DYNAMODB_IDS_TABLE" {
  value = "${aws_dynamodb_table.ids.id}"
}

output "AWS_DYNAMODB_ITEMS_TABLE" {
  value = "${aws_dynamodb_table.items.id}"
}
