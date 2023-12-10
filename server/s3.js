const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3")
const { getSignedUrl } = require ("@aws-sdk/s3-request-presigner")

const dotenv =require ('dotenv')

dotenv.config()


const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
})

exports.uploadFile = async(fileBuffer, fileName, mimetype)=> {
    const uploadParams = {
      Bucket: bucketName,
      Body: fileBuffer,
      Key: fileName,
      ContentType: mimetype
    }
  
    return s3Client.send(new PutObjectCommand(uploadParams));
    
  }

  exports.getObjectSignedUrl = async (key)=>{
    const params = {
        Bucket: bucketName,
        Key: key
      }

      const command = new GetObjectCommand(params);
      const seconds = 60
      const url = await getSignedUrl(s3Client, command, { expiresIn: seconds });
    
      return url
  }