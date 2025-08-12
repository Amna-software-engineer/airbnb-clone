const Favourite = require("../model/favourite");
const Home = require("../model/home")


exports.getIndex = (req, res, next) => {
  Home.find().then(registeredHomes => { res.render('store/index', { registeredHomes: registeredHomes, pageTitle: "airbnb Home", currentPg: "home", isLoggedIn: req.isLoggedIn }) }
  );
}

exports.getHomes = (req, res, next) => {
  Home.find().then(registeredHomes => { res.render('store/homeList', { registeredHomes: registeredHomes, pageTitle: "Home List", currentPg: "Home List", isLoggedIn: req.isLoggedIn }) }
  );
}

exports.getHome = (req, res, next) => {
  const homeId = req.params.homeId;

  Home.findById(homeId).then((home) => {
    if (!home) {
      return res.redirect("/homes")
    }
    res.render("store/homeDetails", { home: home, pageTitle: home.houseName, currentPg: "Homes", isLoggedIn: req.isLoggedIn });
  })

}

exports.getBookings = (req, res, next) => {
  Home.find().then(registeredHomes => { res.render('store/bookings', { registeredHomes: registeredHomes, pageTitle: "My Bookings", currentPg: "Bookings", isLoggedIn: req.isLoggedIn }) }
  );
}

exports.getFavourites = (req, res, next) => {
  // Referenced documents ko full detail ke sath fetch karta hai. populate: Ek document ke andar reference ID (usually ObjectId) ko uske actual document data se replace kar dena.
  Favourite.find()
    .populate("homeId")
    .then((favourites) => {
      console.log("favourites....",favourites);
      //getting only homeId from full obj as populate return complete obj
      const favouriteHomes = favourites.map(fav => fav.homeId);
      res.render('store/favouriteList', { favouriteHomes: favouriteHomes, pageTitle: "My Favourites", currentPg: "Favourites", isLoggedIn: req.isLoggedIn })
    })
}

exports.PostFavourites = (req, res, next) => {
  const homeId = req.body.homeId;
  // console.log(homeId);
  Favourite.findOne({ homeId: homeId }).then(existingFavourite => {
    if (existingFavourite) {
      console.log("Home already in favourites");
      res.redirect("/favourites")

    } else {
      const newFavourite = new Favourite({ homeId: homeId });
      newFavourite.save().then(() => {
        res.redirect("/favourites")
      });
    }
  })
}

exports.DeleteFavourites = (req, res, next) => {
  const homeId = req.params.homeId;
  Favourite.findOneAndDelete({ homeId: homeId })
    .then(() => {
      res.redirect("/favourites")
    })
    .catch(err => {
      console.log("Error while deleting favourite: ", err);
    });

}


