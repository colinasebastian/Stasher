const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');
const crypto = require('crypto');
const sharp = require('sharp');
dotenv.config();

module.exports = class ImagesService {
    constructor() {
        this.bucketName = process.env.BUCKET_NAME;
        this.bucketRegion = process.env.BUCKET_REGION;
        this.accessKey = process.env.ACCESS_KEY;
        this.secretAccessKey = process.env.SECRET_ACCESS_KEY;
        this.sessionToken = process.env.SESSION_TOKEN;
        this.s3 = new S3Client({
            credentials: {
                accessKeyId: this.accessKey,
                secretAccessKey: this.secretAccessKey,
                sessionToken: this.sessionToken
            },
            region: this.bucketRegion
        });
    }

    async upload(file) {
        try {
            const randomImageName = (bytes = 32) => crypto.randomBytes(16).toString('hex');
            let imageName = randomImageName();
            const buffer = await sharp(file.buffer).resize({ height: 500 }).toBuffer();
            const params = {
                Bucket: this.bucketName,
                Key: imageName,
                Body: buffer,
                ContentType: file.mimetype
            }
            const command = new PutObjectCommand(params);
            const result = await this.s3.send(command);
            if (!result || result.$metadata.httpStatusCode != 200) {
                imageName = null;
            }
            return imageName;
        } catch (error) {
            throw new Error(error);
        }
    }

    async delete(imageName) {
        try {
            const params = {
                Bucket: this.bucketName,
                Key: imageName
            }
            const command = new DeleteObjectCommand(params);
            await this.s3.send(command);
        } catch (error) {
            throw new Error(error);
        }
    }

    getImageURL(imageName) {
        return process.env.CLOUDFRONT_URL + imageName;
    }
}