const express = require("express")
const mongoose= require('mongoose')
const multer = require("multer")
const sharp = require("sharp")
const crypto = require("crypto")
const Auth= require("./model/index.js")
const cors = require("cors")
require('dotenv').config()
const app = express()
app.set('view engine', 'ejs')
app.use(express.static("public"))
app.use(cors())
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const { uploadFile,getObjectSignedUrl,getObject }= require('./s3.js')

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

app.set('view engine', 'ejs')
app.use(express.static("public"))


//este endpoint faz o upload do arquivo

app.post("/post",upload.single("image"),async (req,res)=>{
    const file = req.file
    const caption = req.body.caption
    const imageName = generateFileName()

    
  const fileBuffer = await sharp(file.buffer)
  .resize({ height: 1920, width: 1080, fit: "contain" })
  .toBuffer()

 const upload=  await uploadFile(fileBuffer, imageName, file.mimetype)
 if(upload){ 
     await Auth.create({
        imageName,
        caption
        
     })
     return res.json({ status: "success" });
 }



}) 
 

app.get("/", async (req, res) => {
  const posts = await Auth.find()
  for (let post of posts) {

  post.imageUrl= await getObjectSignedUrl(post.imageName)
  //acima poderia ser  =       post.imageurl =stringcloudfront/post.imageName
 
  }
  
res.send(posts)

  })

const connectstring= process.env.CONECTION_MONGODB

mongoose.connect(connectstring , )
.then(()=> console.log('conected at database'))
.catch((err)=> console.log(err  +  "  erro in conect at database"))



app.listen(3003,()=>console.log("running at port 3003"))