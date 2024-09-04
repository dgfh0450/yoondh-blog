
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createHash } from 'crypto';
import path from 'path';
import korTime from "./time";

export async function uploadImage(image:File) {
    const IMAGE_ENDPOINT = process.env.IMAGE_ENDPOINT;
    const IMAGE_ACCESS_KEY = process.env.IMAGE_ACCESS_KEY;
    const IMAGE_SECRET_KEY = process.env.IMAGE_SECRET_KEY;
    const IMAGE_BUCKET = process.env.IMAGE_BUCKET;

    if(!IMAGE_ENDPOINT || !IMAGE_ACCESS_KEY || !IMAGE_SECRET_KEY || !IMAGE_BUCKET){
        console.log('failed', IMAGE_ENDPOINT, IMAGE_ACCESS_KEY, IMAGE_SECRET_KEY, IMAGE_BUCKET);
        return;
    }
    const S3 = new S3Client({
        region: "auto",
        endpoint: IMAGE_ENDPOINT,
        credentials: {
            accessKeyId: IMAGE_ACCESS_KEY,
            secretAccessKey: IMAGE_SECRET_KEY,
        },
    });

      
    const fileBuffer = await image.arrayBuffer();
    const filename = hashFileName(image.name);
    const uploadParams = {
        Bucket: IMAGE_BUCKET,
        Key: filename,
        Body: Buffer.from(fileBuffer),
        ContentType: image.type,
    };
    

    if(!filename) uploadParams.Key = image.name;

    const res = await S3.send(new PutObjectCommand(uploadParams));
    return uploadParams.Key;
}

function hashFileName(fileName: string) {
    const salt = process.env.SHA256_SALT;
    if(!salt) return;

    const extname = path.extname(fileName);
    const basename = path.basename(fileName, extname);
    const dataToHash = `${basename}${korTime()}${salt}`; 
    console.log(korTime());

    const hash = createHash('sha256');
    hash.update(dataToHash);
    const hashedName = hash.digest('hex');

    return `${hashedName}${extname}`;
}