const express = require('express');
const routs = express.Router()
const passport = require('passport');
const mallController = require('../../Controller/AdminController/mall_controller')
routs.get('/add_mall',passport.checkAuthentication,mallController.add_mall)
routs.post('/insert_mall',passport.checkAuthentication,mallController.insert_mall)
routs.get('/view_mall',passport.checkAuthentication,mallController.view_mall)
routs.get('/delete_mall/:id',passport.checkAuthentication,mallController.delete_mall)
routs.get('/update_mall/:id',passport.checkAuthentication,mallController.update_mall)
routs.post('/edit_mall',passport.checkAuthentication,mallController.edit_mall)
module.exports = routs  