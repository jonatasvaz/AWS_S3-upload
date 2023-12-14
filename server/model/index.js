const mongoose = require('mongoose')


const Auth= new mongoose.Schema({
     imageName:String,
     caption:String,
     imageUrl:String
      
     
})

const newModel= mongoose.model('upload',Auth)

module.exports=newModel