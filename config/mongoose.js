const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://utsavgarchar:utsavgarchar63@cluster0.wpvtcvx.mongodb.net')
const db = mongoose.connection
db.once('open',(err)=>{
     if(err){
          console.log(err);
          return false;
     }
     console.log('DB is connected');
})
module.exports = db