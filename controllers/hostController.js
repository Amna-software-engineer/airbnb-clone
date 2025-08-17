
const Home = require("../model/home")
const fs = require("fs");

exports.AddHome = (req, res, next) => {
  res.render("host/editHome", { pageTitle: "Add Home to airbnb", currentPg: "addHome", editing: false, isLoggedIn: req.isLoggedIn, user: req.user })
}

exports.EditHome = (req, res, next) => {
  const editing = req.query.editing === 'true';
  const homeId = req.params.homeId;

  Home.findById(homeId).then(home => {
    if (!home) {
      console.log("Home not found for editing.");
      return res.redirect("/host/host-home-list");
    }
    res.render("host/editHome", { pageTitle: "Edit Your Home", currentPg: "hostHomes", editing: editing, home: home, isLoggedIn: req.isLoggedIn, user: req.user })
  })

}
exports.PostEditHome = (req, res, next) => {
  const { id, houseName, price, location, rating, description } = req.body;

  Home.findById(id).then(home => {
    console.log(home, req.body);
    home.houseName = houseName;
    home.price = price;
    home.location = location;
    home.rating = rating;
    home.description = description;
    if (req.files && req.files.photo) {
      console.log("home.photo", home.photo);
      console.log("req.files",req.files);

      deleteFile(home.photo && home.photo); //delete prvois img
      home.photo = req.files.photo[0].path; //add new img

    } else if (req.files && req.files.rules) {
      deleteFile(home.rules && home.rules); //delete prvois pdf
      home.rules = req.files.rules[0].path; //add new pdf
    }
    home.save().then((updatedHome) => {
      console.log('Home updated ', updatedHome);
      res.redirect("/host/host-home-list")
    });
  })

}

exports.getHostHomes = (req, res, next) => {
  Home.find().then(registeredHomes =>
    res.render('host/hostHomeList', { registeredHomes: registeredHomes, pageTitle: "Host Homes List", currentPg: "hostHomes", isLoggedIn: req.isLoggedIn, user: req.user }))
}


exports.PostAddHome = (req, res, next) => {
  const { houseName, price, location, rating, description } = req.body;
  console.log("Files received:", req.files);
  const photo = req.files.photo && req.files.photo[0].path;
  const rules = req.files.rules && req.files.rules[0].path;

  console.log(rules, photo);

  const newHome = new Home({
    houseName, price, location, rating,photo,rules,photo,
    description
  });
  if (!req.files) {
    res.status(402).send("No image/pdf provided");
  } else {
    newHome.save().then((homeAdded) => {
      console.log("Home added successfully", homeAdded);
    }).catch(err => {
      console.log("Error while adding home", err);
    })
    res.redirect("/host/host-home-list")
  }


}

exports.PostDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findOneAndDelete({ _id: homeId }).then((deletedHome) => {
    deleteFile(deletedHome.photo)
    deleteFile(deletedHome.rules)
    console.log("Home deleted successfully", deletedHome)
    res.redirect("/host/host-home-list")
  }).catch(err => {
    console.log("Error deleting home", err);
  })
}


const deleteFile = (filePath) => {
  console.log("filePath ", filePath);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.log("Error while deleting file");

    } else {
      console.log("File deleted successfully");

    }
  })
} 