const mongoose = require('mongoose')
const mallSchema = mongoose.Schema({
     mall : {
          type : String,
          required : true
     },
})

const mall = mongoose.model('mall',mallSchema)
module.exports = mall