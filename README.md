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
$ awslocal lambda invoke --function-name local-lambda output.log
$ awslocal kinesis put-record --stream-name local-stream --partition-key 123 --data testdata
{
    "ShardId": "shardId-000000000000",
	"SequenceNumber": "49650018658960598395323651862376970603350306529631797250",
	"EncryptionType": "NONE"
}
$ awslocal kinesis get-records --shard-iterator `awslocal kinesis get-shard-iterator --stream-name local-stream --shard-id shardId-000000000000 --shard-iterator-type AT_SEQUENCE_NUMBER --starting-sequence-number 49650018658960598395323651862375761677530678156561743874 | jq ".ShardIterator"`
```
