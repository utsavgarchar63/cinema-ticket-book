const mall = require('../../model/mall_model')
module.exports.add_mall = (req,res)=>{
     res.render('add_mall')
}
module.exports.insert_mall = async (req,res)=>{
     const mallData = await mall.create(req.body)
     req.flash('success','Mall Inserted Successfully')
     res.redirect('back')
}
module.exports.view_mall = async (req,res)=>{
     const mallData = await mall.find({})
     res.render('view_mall',{
          mall : mallData
     })
}
module.exports.delete_mall = async (req,res)=>{
     const mallData = await mall.findByIdAndDelete(req.params.id)
     req.flash('success','Mall Deleted Successfully')
     res.redirect('back')
}
module.exports.update_mall = async (req,res)=>{
     const mallData = await mall.findById(req.params.id)
     res.render('update_mall',{
          mall  : mallData
     })
}
module.exports.edit_mall = async (req,res)=>{
     await mall.findByIdAndUpdate(req.body.Id,req.body)
     req.flash('success','Mall Updated Successfully')
     res.redirect('/mall/view_mall')
}
