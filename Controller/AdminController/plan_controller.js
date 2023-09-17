const movie_plan = require('../../model/movie_plan')
const movie = require('../../model/movies_model')
const movie_mall = require('../../model/moviemall_model')
const mall = require('../../model/mall_model')
module.exports.add_plan = async (req,res)=>{
     const movieData = await movie.find({})
     const mallData = await mall.find({})
     const movie_mallData = await movie_mall.find({}).populate('movieId').exec()
     res.render('add_plan',{
          movie : movieData,
          mall : mallData,
          movie_mall : movie_mallData,
     })    
}
module.exports.get_mallOption = async (req,res)=>{
     const mallData = await movie_mall.findOne({movieId : req.body.Id}).populate('mallId').exec();
     return res.render('get_mallOpt',{
          data : mallData
     })
}
module.exports.insert_plan = async (req,res)=>{
     req.body.status = true
     const planData = await movie_plan.create(req.body)
     req.flash('success','Plan is Inserted Successfully')
     res.redirect('back')
}
module.exports.view_plan = async (req,res)=>{
     const activeData = await movie_plan.find({ status: true}).populate('movieId').populate('mallId').exec()
     const deactiveData = await movie_plan.find({ status: false}).populate('movieId').populate('mallId').exec()
     res.render('view_plan',{
          activedata : activeData,
          deactivedata : deactiveData
     })
}
module.exports.delete_plan = async (req,res)=>{
     const planData = await movie_plan.findByIdAndDelete(req.params.id)
     req.flash('success','Plan Deleted Successfully')
     res.redirect('back')
}
module.exports.update_plan = async (req,res)=>{
     const movieData = await movie.find({})
     const planData = await movie_plan.findById(req.params.id).populate('movieId').exec()
     res.render('update_plan',{
          movie_ : movieData,
          plan : planData,
     })
}
module.exports.edit_plan = async (req,res)=>{
     const planData = await movie_plan.findByIdAndUpdate(req.body.Id,req.body)
     req.flash('success','Plan Updated Successfully')
     res.redirect('/plan/view_plan')
}
module.exports.Active = async (req, res) => {
     let data = await movie_plan.findByIdAndUpdate(req.params.id, { status: true });
     return res.redirect('back');

}
module.exports.Deactive = async (req, res) => {
     let data = await movie_plan.findByIdAndUpdate(req.params.id, { status: false });

     return res.redirect('back');
}