const mongoose = require('mongoose');
const movieSchema = mongoose.Schema({
     movieId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "movies",
          required: true
     },
     mallId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "mall",
          required: true
     },
     show_time: {
          type: String,
          required: true
     },
     show_price: {
          type: Number,
          required: true
     },
     qulity : {
          type : Array,
          required : true
     },
     status : {
          type : Boolean,
          required : true,
     }
});

const movie = mongoose.model('movie_plan', movieSchema);

module.exports = movie