const movie = require("../../model/movies_model")
const fs = require('fs');
const path = require('path');
module.exports.add_movies = (req, res) => {
     res.render('add_movies')
}
module.exports.insert_movies = async (req,res)=>{
     movie.uploded_poster(req, res, async () => {
          var imgPath = ''
          if (req.file) {
               imgPath = movie.poster_path + '/' + req.file.filename
          }
          req.body.poster = imgPath
          const movieData = await movie.create(req.body)
          if(movieData){
               req.flash('success','Movie inserted successfully')
               res.redirect('back')
          }
     })
}

// module.exports.view_movie = async (req,res)=>{
//      const moviesData = await movie.find({})
//      res.render('view_movies',{
//           movies : moviesData
//      })
// }
module.exports.view_movie = async (req, res) => {
     var page = 1;
     var search = '';
     if (req.query.search) {
         search = req.query.search;
     }
     if (req.query.page) {
         page = req.query.page;
     }
     var per_page = 5;
 
     var record = await movie.find({
         $or: [
             { title: { $regex: '.*' + search + '.*' } }
         ]
     }).skip((page - 1) * per_page).limit(per_page).exec();
 
     var totalpage = await movie.find({
         $or: [
             { title: { $regex: '.*' + search + '.*' } },
         ]
     }).countDocuments();
     return res.render('view_movies', {
         movies: record,
         total: Math.ceil(totalpage / per_page),
         searchData: search,
         prev: Number(page)-1,
         next: Number(page)+1,
         curr: page
     });
 }
module.exports.delete_movie = async (req,res)=>{
    const id = req.params.id;
    const movieData = await movie.findById(id)
    if(movieData.poster){
     fs.unlinkSync(path.join(__dirname,'../../',movieData.poster));
    }
    const movie_data = await movie.findByIdAndDelete(id)
    req.flash('success','Movie Deleted Successfully')
    res.redirect('back')
}
module.exports.update_movie = async (req,res)=>{
     const movieData = await movie.findById(req.params.id)
     if(movieData){
          res.render('update_movies',{
               movies : movieData
          })
     }
}
module.exports.edit_movie = async (req,res) => {
     movie.uploded_poster(req,res, async ()=>{
          const movieData = await movie.findById(req.body.Id)
          if(movieData.poster){
               fs.unlinkSync(path.join(__dirname,"../../",movieData.poster));
          }
          var imgpath = movie.poster_path+"/"+req.file.filename;
          req.body.poster = imgpath;
          const movie_data = await movie.findByIdAndUpdate(req.body.Id,req.body)
          if(movie_data){
               req.flash('success','Movie updated successfully')
               res.redirect('/movies/view_movies')
          }
     })
}