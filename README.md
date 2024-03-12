# tutorial-terraform-on-localstack

ref.) https://future-architect.github.io/articles/20201113/

# build lambda

```bash
$ rm function.zip
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
$ alias awslocal='AWS_ACCESS_KEY_ID=dummy AWS_SECRET_ACCESS_KEY=dummy AWS_DEFAULT_REGION=ap-northeast-1 aws --endpoint-url http://localhost:4566'
```

[WARN] you must this setting item in your ~/.aws/config

```
[default]
cli_binary_format=raw-in-base64-out
```

Run like below.

```bash
$ awslocal s3 ls
$ awslocal kinesis list-streams
$ awslocal lambda invoke --function-name local-lambda --payload "{\"Records\": [{\"kinesis\": {\"data\": \"$(base64 payload.json)\"}}]}" output.txt
$ awslocal kinesis put-record --stream-name local-stream --partition-key `date +%s` --data '{"body":{"num1":10,"num2":10}}'
$ awslocal kinesis put-record --stream-name local-stream --partition-key `date +%s` --data $(cat payload.json)
$ awslocal kinesis get-records --shard-iterator `awslocal kinesis get-shard-iterator --stream-name local-stream --shard-id shardId-000000000000 --shard-iterator-type AT_SEQUENCE_NUMBER --starting-sequence-number 49650018658960598395323651862375761677530678156561743874 | jq ".ShardIterator"`
```

If you put an invalid record like below:

```bash
$ awslocal kinesis put-record --stream-name local-stream --partition-key `date +%s` --data "{\"rec\":{\"num1\":$RANDOM,\"num2\":$RANDOM}}" ## rec is invalid, body is correct data format in this solution.
```

You found the message in dead-letter-queue instead of an object in s3 bucket.

```bash
$ awslocal sqs receive-message --queue-url "http://sqs.ap-northeast-1.localhost.localstack.cloud:4566/000000000000/local-dlq"
{
    "Messages": [
        {
            "MessageId": "7b1388e4-010c-4eac-932d-24d6178ab687",
            "ReceiptHandle": "NWQ2OGVlZWMtMGUyMS00MzQwLWExNGItMTY0NmMwNjM0MWI2IGFybjphd3M6c3FzOmFwLW5vcnRoZWFzdC0xOjAwMDAwMDAwMDAwMDpsb2NhbC1kbHEgN2IxMzg4ZTQtMDEwYy00ZWFjLTkzMmQtMjRkNjE3OGFiNjg3IDE3MTAyODY2NDkuMjI5ODEzMw==",
            "MD5OfBody": "0b057a1f45bfe8a001ea14267605f537",
            "Body": "{\"version\":\"1.0\",\"timestamp\":\"2024-03-12T22:53:52.062Z\",\"requestContext\":{\"requestId\":\"908cb503-7a61-4f93-9bf0-52378b1ba382\",\"functionArn\":\"arn:aws:lambda:ap-northeast-1:000000000000:function:local-lambda\",\"condition\":\"RetryAttemptsExhausted\",\"approximateInvokeCount\":1},\"responseContext\":{\"statusCode\":500,\"executedVersion\":\"$LATEST\",\"functionError\":\"Unhandled\"},\"KinesisBatchInfo\":{\"shardId\":\"shardId-000000000000\",\"startSequenceNumber\":\"49650107012015391511417108835032303908901587019005689858\",\"endSequenceNumber\":\"49650107012015391511417108835032303908901587019005689858\",\"approximateArrivalOfFirstRecord\":\"2024-03-12T22:53:51.563000Z\",\"approximateArrivalOfLastRecord\":\"2024-03-12T22:53:51.563000Z\",\"batchSize\":100,\"streamArn\":\"arn:aws:kinesis:ap-northeast-1:000000000000:stream/local-stream\"}}"
        }
    ]
}
```
You should get the message from kinesis again as like as below:

```bash
$ awslocal kinesis get-records --shard-iterator `awslocal kinesis get-shard-iterator --stream-name local-stream --shard-id shardId-000000000000 --shard-iterator-type AT_SEQUENCE_NUMBER --starting-sequence-number 49650107012015391511417108835032303908901587019005689858 | jq ".ShardIterator"`
{
    "Records": [
        {
            "SequenceNumber": "49650107012015391511417108835032303908901587019005689858",
            "ApproximateArrivalTimestamp": "2024-03-13T07:53:51.563000+09:00",
            "Data": "eyJyZWMiOnsibnVtMSI6MzE5NzIsIm51bTIiOjIzMDI3fX0=",
            "PartitionKey": "1710284031",
            "EncryptionType": "NONE"
        }
    ],
    "NextShardIterator": "AAAAAAAAAAEaJgF94N3PCA+ZyoJN5kglI0YIABPtrvk9Koa5EEcA1YfA2hE9FUhfvuYwgg2GvG3HLQOMX+13Sph8ddDJZcD9W8fUcXDV2nzAT2dRlZ2Ewy1bCit1KInq63bbHGlUPVvGmkMBg9xNuUuWhJM+1gZA7kPFOuxFRHgWs9zocBwqkc9f/dPdCBTO7tR4/c0dKkY=",
    "MillisBehindLatest": 0
}
$ echo eyJyZWMiOnsibnVtMSI6MzE5NzIsIm51bTIiOjIzMDI3fX0= | base64 -d
{"rec":{"num1":31972,"num2":23027}}
```
