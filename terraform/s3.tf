provider "aws" {
  region = "us-west-2"
}

resource "aws_s3_bucket" "stories" {
  bucket = "royal-icing-stories"
  acl = "authenticated-read"

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

resource "aws_iam_user" "s3-stories" {
    name = "stories"
    path = "/s3/"
}

resource "aws_iam_access_key" "s3-stories" {
    user = "${aws_iam_user.s3-stories.name}"
}

resource "aws_iam_user_policy" "s3-stories" {
    name = "s3-stories"
    user = "${aws_iam_user.s3-stories.name}"
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

output "s3-stories-user-access-key" {
  value = "${aws_iam_access_key.s3-stories.id}"
}

output "s3-stories-user-secret" {
  value = "${aws_iam_access_key.s3-stories.secret}"
}
