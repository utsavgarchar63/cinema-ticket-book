const passport = require('passport');
const passportlocal = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const admin = require('../model/admin_model')
passport.use(new passportlocal({
     usernameField: 'email'
},async (email, password,done)=>{
     const user = await admin.findOne({email: email});
     if(user) {
          const pass = await bcrypt.compare(password, user.password)
          if(pass == false){
               console.log("Invalid password !!!!!!!!!")
               return done(null,false)
          }
          else{
               return done(null,user)
          }
     }
     else{
          console.log('Email is not Found')
     }
}))

passport.serializeUser((user,done)=>{
     done(null,user.id)
})

passport.deserializeUser( async (id,done)=>{
     const user = await admin.findById(id)
     if(user){
          return done(null,user)
     }
})

passport.checkAuthentication = (req,res,next)=>{
     if(req.isAuthenticated()){
          return next()
     }
     return res.redirect('/login')
}
passport.setAuthenticatedUser = (req,res,next)=>{
     if(req.isAuthenticated()){
          res.locals.user = req.user
     }
     next()
}
module.exports = passport