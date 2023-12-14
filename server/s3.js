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


  exports.getObject = async (key)=>{
   
      const bucket= process.env.AWS_BUCKET_NAME
        const KeyImage= key
     

   
      return new Promise(async (resolve, reject) => {
       // const getObjectCommand = new GetObjectCommand({ bucket, KeyImage })
    
        try {
         // const response = await s3Client.send(getObjectCommand)

      const response=  await  s3Client.send(new GetObjectCommand({
          Bucket: bucket,
          Key: KeyImage
        }));
 
//console.log(response)
      
          // Store all of data chunks returned from the response data stream 
          // into an array then use Array#join() to use the returned contents as a String
          let responseDataChunks = []
            console.log(responseDataChunks) 
          // Handle an error while streaming the response body
          response.Body.once('error', err => reject(err))
       
          // Attach a 'data' listener to add the chunks of data to our array
          // Each chunk is a Buffer instance
     response.Body.on('data', chunk => responseDataChunks.push(chunk))
      
          // Once the stream has no more data, join the chunks into a string and return the string
          response.Body.once('end', () => resolve(responseDataChunks.join('')))
        } catch (err) {
          // Handle the error or throw
          return reject(err)
        } 
      })


  }