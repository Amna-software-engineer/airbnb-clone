const express=require("express");
const hostRouter=express.Router();
const homeController= require('../controllers/hostController');


hostRouter.get('/add-home',homeController.AddHome)
hostRouter.post('/add-home',homeController.PostAddHome)
hostRouter.get('/host-home-list',homeController.getHostHomes)
hostRouter.get('/edit-home/:homeId',homeController.EditHome)
hostRouter.post('/edit-home',homeController.PostEditHome)
hostRouter.post('/delete-home/:homeId',homeController.PostDeleteHome)

// exports.hostRouter=hostRouter;
// exoort only one thing(function object array) from file
// module.exports=hostRouter;
// this adds a property to an object being exported.This is used when you want to export multiple things from a file. yo can use like const { hostRouter, adminRouter } = require('./hostRouter');  
module.exports=hostRouter;


