const Home = require("../model/home");
const User = require("../model/user");
const rootDir = require("../utils/path");
const path = require("path");


exports.getIndex = (req, res, next) => {
  Home.find().then(registeredHomes => { res.render('store/index', { registeredHomes: registeredHomes, pageTitle: "airbnb Home", currentPg: "home", isLoggedIn: req.isLoggedIn, user: req.user }) }
  );
}

exports.getHomes = (req, res, next) => {
  Home.find().then(registeredHomes => { res.render('store/homeList', { registeredHomes: registeredHomes, pageTitle: "Home List", currentPg: "Home List", isLoggedIn: req.isLoggedIn, user: req.user }) }
  );
}

exports.getHome = (req, res, next) => {
  const homeId = req.params.homeId;

  Home.findById(homeId).then((home) => {
    if (!home) {
      return res.redirect("/homes")
    }
    res.render("store/homeDetails", { home: home, pageTitle: home.houseName, currentPg: "Homes", isLoggedIn: req.isLoggedIn, user: req.user });
  })

}

exports.getBookings = (req, res, next) => {
  Home.find().then(registeredHomes => { res.render('store/bookings', { registeredHomes: registeredHomes, pageTitle: "My Bookings", currentPg: "Bookings", isLoggedIn: req.isLoggedIn, user: req.user }) }
  );
}

exports.getFavourites = (req, res, next) => {

  const userId = req.session.user._id;
  //populate m hm ref wali filed ko dety hn or ye osk complete document(s) ko dy dyta //yha fvrt refrence hn to ye home m ja kr waha say jo id ism store hn onk complete document ko otha kr fvrt m dal deta yani id ko actula document say replace kr dega
  User.findById(userId).populate("favourites").then(user => {
    // console.log("favourites....", user);
    res.render('store/favouriteList', { favouriteHomes: user.favourites, pageTitle: "My Favourites", currentPg: "Favourites", isLoggedIn: req.isLoggedIn, user: req.user })
  })
}

exports.PostFavourites = (req, res, next) => {
  const homeId = req.body.homeId;
  const userId = req.session.user._id;

  User.findById(userId).then(user => {
    console.log(homeId);

    if (!user.favourites.includes(homeId)) {
      console.log("user ", user.favourites);
      user.favourites.push(homeId);
      user.save()
        .then(updatedUser => {
          console.log("Home favourites successfully");
        }).catch(err => {
          console.log("Error while adding to favourites", err);
        })
    } else {
      console.log("Home Already Marked as favourite ");
    }
    res.redirect("/favourites")
  })
}

exports.DeleteFavourites = (req, res, next) => {
  const homeId = req.params.homeId;
  const userId = req.session.user._id;

  User.findById(userId).then(user => {

    if (user.favourites.includes(homeId)) {
      //homeid is string , //fav is objtype
      user.favourites = user.favourites.filter(fav => fav != homeId)
      user.save().then(updatedUser => {
        console.log("Home removed from favourites successfully");
      }).catch(err => {
        console.log("Error while deleting favourite: ", err);
      });
      res.redirect("/favourites")
    }
  })
}
//it have two middlwares
exports.HouseRules = [(req, res, next) => {
  if (!req.session.isLoggedIn) {
    res.redirect("/login")
  }
  next();
},
(req, res, next) => {
    const homeId = req.params.homeId;
    res.download(path.join(rootDir, "rules", "house rules.pdf"), "Rules.pdf");

}

]


