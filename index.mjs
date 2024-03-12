import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const handler = async(event) => {
    let records = event.Records.map(function(record) {
      let body = Buffer.from(record.kinesis.data, 'base64').toString('ascii');
      let rec  = JSON.parse(body);
      return { "num1": rec.body.num1
             , "num2": rec.body.num2
             , "product": rec.body.num1 * rec.body.num2
             , "raw": record.kinesis.data
             };
    });

    const s3 = new S3Client({});
    const params = {
	Bucket: "local-archive",
	Key: "test" + Date.now() + ".json",
	Body: JSON.stringify({ records }),
    };
    await s3.send(new PutObjectCommand(params));

    return {
	statusCode: 200,
	body: JSON.stringify({ records }),
    };
};
