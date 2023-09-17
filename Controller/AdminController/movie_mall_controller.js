const movie_mall = require('../../model/moviemall_model')
const movie  = require('../../model/movies_model')
const mall  = require('../../model/mall_model')
module.exports.add_moviemall = async (req,res)=>{
    const movieData = await movie.find({})
    const mallData = await mall.find({})
    res.render('add_movie_mall',{
        movie : movieData,
        mall  : mallData
    })
}
module.exports.insert_moviemall = async (req,res)=>{
    const data = await movie_mall.create(req.body);
    if(data){
        req.flash('success','Mall and Movie Detaile Inserted Successfully')
        return res.redirect('back');
    }
}
module.exports.view_moviemall = async (req,res)=>{
    const movie_mallData = await movie_mall.find({}).populate('movieId').populate('mallId').exec()
    res.render('view_movie_mall',{
        movieMall : movie_mallData
    })
}
module.exports.delete_moviemall = async (req,res)=>{
    const movie_mallData = await movie_mall.findByIdAndDelete(req.params.id)
    req.flash('success','Detail is Deleted Successfully')
    res.redirect('back')
}
module.exports.update_moviemall = async (req,res)=>{
    const movie_mallData = await movie_mall.findById(req.params.id)
    const movieData = await movie.find({})
    const mallData = await mall.find({})
    res.render('update_moviemall',{
        movieMall : movie_mallData,
        movie : movieData,
        mall : mallData
    })
}
module.exports.edit_moviemall = async (req,res)=>{
    const movie_mallData = await movie_mall.findByIdAndUpdate(req.body.Id,req.body)
    req.flash('success','Detail is Updated Successfully')
    res.redirect('/movie_mall/view_moviemall')
}