const mongoose = require('mongoose');

const movieSchema =  mongoose.Schema({
    movieId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "movies",
        required : true
    },  
    mallId : {
        type : mongoose.Schema.Types.Array,
        ref : "mall",
        required : true
    }
});

const movie = mongoose.model('movie_mall', movieSchema);

module.exports = movie;