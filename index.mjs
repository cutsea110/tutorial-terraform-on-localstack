import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const handler = async(event) => {
    let body = JSON.parse(event.body);
    const product = body.num1 + body.num2;

    const s3 = new S3Client({});
    const params = {
	Bucket: "local-archive",
	Key: "test" + Date.now() + ".json",
	Body: JSON.stringify({ product }),
    };
    await s3.send(new PutObjectCommand(params));

    return {
	statusCode: 200,
	body: JSON.stringify({ product }),
    };
};
