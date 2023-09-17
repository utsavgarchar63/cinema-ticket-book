const express = require('express')
const app = express()
const port = 8000;
require('./config/mongoose')
// const mongoose = require('mongoose')
// mongoose.connect('mongodb+srv://utsavgarchar:utsavgarchar63@cluster0.wpvtcvx.mongodb.net',{
//     useNewUrlParser : true,
//     useUnifiedTopology : true
// }).then(()=>{
//     console.log('DB Connedcted')
// }).catch(err => console.log(err))

const flash = require('connect-flash');
const passport = require('passport');
const passportLocal = require('./config/passport_local_strategy');
const cookieParser = require('cookie-parser');
const middle_Flash = require('./config/flash');
const path = require('path')
app.set('view engine','ejs')
app.set(path.join(__dirname,'views'))
app.use('/assets/movies_poster',express.static(__dirname+'/assets/movies_poster'));
app.use('/assets/admin_avatar',express.static(__dirname+'/assets/admin_avatar'));
const session = require('express-session')

console.log("Hello");
app.use(express.static('assets'))
app.use(cookieParser());    
app.use(express.urlencoded())
app.use(session({
    name: 'utsav',
    secret:'utsavgarchar',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 60 * 60 ,
    }
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash())
app.use(middle_Flash.setFlash)
app.use('/',require('./Routs/index'))
app.use('/movies',require('./Routs/Admin_Routing/movies'))
app.use('/mall',require('./Routs/Admin_Routing/mall'))
app.use('/movie_mall',require('./Routs/Admin_Routing/movie_mall'))
app.use('/plan',require('./Routs/Admin_Routing/movie_plan'))
app.listen(port,(err)=>{
    if(err){
        console.log(err)
        return false;
    } 
    console.log(`listening on port ${port}`);
})