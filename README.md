# tutorial-terraform-on-localstack

# build lambda

```bash
$ GOOS=linux GOARCH=amd64 go build -o hello
$ zip lambda.zip hello
$ docker-compose up -d
$ terraform init
$ terraform plan
$ terraform apply
```

# access localstack

Prepare for aws command line.

```bash
$ alias awslocal='AWS_ACCESS_KEY_ID=dummy AWS_SECRET_ACCESS_KEY=dummy AWS_DEFAULT_REGION=us-west-1 aws --endpoint-url http://localhost:4566'
```

Run like below.

```bash
$ awslocal s3 ls
$ awslocal kinesis list-streams
```
