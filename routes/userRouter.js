const express = require("express");
const userRouter = express.Router();
const storeController= require('../controllers/storeController');

userRouter.get('/', storeController.getIndex);
userRouter.get('/homes', storeController.getHomes);
userRouter.get("/homes/:homeId", storeController.getHome);
userRouter.get('/bookings', storeController.getBookings);
userRouter.get('/favourites', storeController.getFavourites);
userRouter.post('/favourites', storeController.PostFavourites);
userRouter.post('/favourites/delete/:homeId', storeController.DeleteFavourites);
userRouter.get('/rules/:homeId', storeController.HouseRules);
userRouter.post('/bookings/:homeId', storeController.postBookings);


module.exports = userRouter;