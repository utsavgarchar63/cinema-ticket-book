const express = require('express')
const movie = require("../../model/movies_model")
const passport = require('passport')
const routs = express.Router();
const moviesController = require('../../Controller/AdminController/movies_controller')
routs.get('/add_movies',passport.checkAuthentication,moviesController.add_movies)
routs.post('/insert_movies',passport.checkAuthentication, moviesController.insert_movies)
routs.get('/view_movies',passport.checkAuthentication,moviesController.view_movie)
routs.get('/delete_movie/:id',moviesController.delete_movie)
routs.get('/update_movie/:id',passport.checkAuthentication,moviesController.update_movie)
routs.post('/edit_movie',passport.checkAuthentication,moviesController.edit_movie)
module.exports = routs