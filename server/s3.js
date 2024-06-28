const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3")
const { getSignedUrl } = require ("@aws-sdk/s3-request-presigner")

require('dotenv').config()


const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
const cloudfrontstring=process.env.CLOUDFRONT_AWS_STRING



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
    
 //o codigo de baixo so seria necessario so fosse usar a url original do arquivo que esta no bucket s3..neste caso fiz alteraçao para usar cdn cloudfront então a url é apenas cloudfront(cdn)/key

    /*/const params = {
        Bucket: bucketName,
        Key: key
      }

      const command = new GetObjectCommand(params);
      console.log(command)
      const seconds = 60
      const url = await getSignedUrl(s3Client, command, { expiresIn: seconds });
     console.log(key)
      /*/


      //esta funçao vai retorna  a string do cloudfront(cdn)/key  

      return cloudfrontstring + key
  }


  