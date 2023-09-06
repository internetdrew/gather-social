import { S3Client } from "@aws-sdk/client-s3";

const bucketRegion = process.env.S3_BUCKET_REGION;
const accessKey = process.env.S3_ACCESS_KEY;
const secretKey = process.env.S3_SECRET_KEY;

export function useS3() {
  const s3 = new S3Client({
    region: bucketRegion,
    credentials: {
      accessKeyId: accessKey!,
      secretAccessKey: secretKey!,
    },
  });
  return s3;
}
