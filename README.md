# tutorial-terraform-on-localstack

ref.) https://future-architect.github.io/articles/20201113/

# build lambda

```bash
$ zip function.zip index.mjs
```

build infrastructure.

```bash
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

[WARN] you must this setting item in your ~/.aws/config

```
[default]
cli_binary_format=raw-in-base64-out
```

```bash
$ awslocal s3 ls
$ awslocal kinesis list-streams
$ awslocal lambda invoke --function-name local-lambda --payload '{"body":"{\"num1\":\"10\",\"num2\":\"10\"}"}' output.txt
$ awslocal kinesis put-record --stream-name local-stream --partition-key 123 --data '{"body":"{\"num1\":\"10\",\"num2\":\"10\"}"}'
$ awslocal kinesis get-records --shard-iterator `awslocal kinesis get-shard-iterator --stream-name local-stream --shard-id shardId-000000000000 --shard-iterator-type AT_SEQUENCE_NUMBER --starting-sequence-number 49650018658960598395323651862375761677530678156561743874 | jq ".ShardIterator"`
```
