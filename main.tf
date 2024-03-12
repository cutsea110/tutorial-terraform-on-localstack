# backend
terraform {
  backend "local" {}
}

# provider
provider "aws" {
  region = "ap-northeast-1"

  access_key = "dummy"
  secret_key = "dummy"

  s3_use_path_style           = true
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true

  endpoints {
    iam      = "http://localhost:4566"
    kinesis  = "http://localhost:4566"
    lambda   = "http://localhost:4566"
    s3       = "http://localhost:4566"
    sqs      = "http://localhost:4566"
  }
}
