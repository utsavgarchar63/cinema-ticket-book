const mongoose = require('mongoose')
const multer = require('multer')
const path = require('path')
const adminSchema = mongoose.Schema({
     name : {
          type : String,
          required : true
     },
     email : {
          type : String,
          required : true     
     },
     password:{
          type : String,
          required : true
     },
     age : {
          type : String,
          required : true
     },
     gender :{
          type: String,
          required : true,
     },
     city : {
          type: String,
          required : true
     }, 
     avatar :{
          type: String,
     },
})
const storage = multer.diskStorage({
     destination: function(req, file, cb) {
          cb(null, path.join(__dirname,'..','/assets/admin_avatar'))
     },
     filename: function (req, file, cb) {
          cb(null, file.fieldname + '-' + Date.now())
     }
})
adminSchema.statics.uploded_avatar = multer({ storage: storage }).single('avatar')
adminSchema.statics.avatar_path ='/assets/admin_avatar'

const admin = mongoose.model('admin',adminSchema)
module.exports = admin