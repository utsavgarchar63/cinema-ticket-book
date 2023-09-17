const mongoose = require('mongoose');
const movieSchema = mongoose.Schema({
     planId : {
          type : mongoose.Schema.Types.ObjectId,
          ref : 'movie_plan',
          required : true
     },
     sheets : {
          type : Number ,
          required : true ,
     },
     total  :{
          type : Number,
          required : true
     },
     email  : {
          type : String, 
          required : true
     },
     password :{
          type : String,
          required : true
     },
     phone : {
          type  : Number, 
          required  : true
     }
});

const user = mongoose.model('user', movieSchema);

module.exports = user