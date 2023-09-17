const mongoose = require('mongoose')
const multer = require('multer')
const path = require('path')
const moviesSchema = mongoose.Schema({
     title : {
          type : String,
          required : true
     },
     year : {
          type : String,
          required : true     
     },
     imdb:{
          type : String,
          required : true
     },
     poster: {
          type : String,
     },
     rel_date : {
          type : String,
          required : true
     },
     genre :{
          type: Array,
          required : true,
     },
     language : {
          type : Array,
          required : true
     },
     posterlink:{
          type : String,
          required : true
     },
     country : {
          type : String,
          required : true
     }
})
const storage = multer.diskStorage({
     destination: function(req, file, cb) {
          cb(null, path.join(__dirname,'..','/assets/movies_poster'))
     },
     filename: function (req, file, cb) {
          cb(null, file.fieldname + '-' + Date.now())
     }
})
moviesSchema.statics.uploded_poster = multer({ storage: storage }).single('poster')
moviesSchema.statics.poster_path ='/assets/movies_poster'

const movies = mongoose.model('movies',moviesSchema)
module.exports = movies