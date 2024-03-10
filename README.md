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
