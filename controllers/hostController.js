
const Home = require("../model/home")

exports.AddHome = (req, res, next) => {  
  res.render("host/editHome", { pageTitle: "Add Home to airbnb", currentPg: "addHome", editing: false,isLoggedIn: req.isLoggedIn,user: req.user })
}

exports.EditHome = (req, res, next) => {  
  const editing = req.query.editing === 'true';
  const homeId = req.params.homeId;

  Home.findById(homeId).then(home => {
    if (!home) {
      console.log("Home not found for editing.");
      return res.redirect("/host/host-home-list");
    }
    res.render("host/editHome", { pageTitle: "Edit Your Home", currentPg: "hostHomes", editing: editing, home: home,isLoggedIn: req.isLoggedIn,user: req.user})
  })

}
exports.PostEditHome = (req, res, next) => { 
  const { id, houseName, price, location, rating, photoUrl, description } = req.body
  Home.findByIdAndUpdate(id, { houseName, price, location, rating, photoUrl, description }).then((updatedHome) => {
    console.log('Home updated ', updatedHome);
  });
  res.redirect("/host/host-home-list")
}

exports.getHostHomes = (req, res, next) => {  
  Home.find().then(registeredHomes =>
    res.render('host/hostHomeList', { registeredHomes: registeredHomes, pageTitle: "Host Homes List", currentPg: "hostHomes" ,isLoggedIn: req.isLoggedIn,user: req.user}))
}


exports.PostAddHome = (req, res, next) => { 
  const { houseName, price, location, rating, photoUrl, description } = req.body

  const newHome = new Home({ houseName, price, location, rating, photoUrl, description });

  newHome.save().then((homeAdded) => {
    console.log("Home added successfully", homeAdded);
  }).catch(err => {
    console.log("Error while adding home", err);
  })
  res.redirect("/host/host-home-list")

}

exports.PostDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findOneAndDelete({_id:homeId}).then((deletedHome) => {
    console.log("Home deleted successfully", deletedHome)
    res.redirect("/host/host-home-list")
  }).catch(err => {
    console.log("Error deleting home", err);
  })
}

