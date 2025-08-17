// core Module
const path = require("path");
// External Module
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const mongodbStore = require("connect-mongodb-session")(session);
const dotenv = require("dotenv");
const multer = require("multer")
// local Module
const hostRouter = require("./routes/hostRouter");
const userRouter = require("./routes/userRouter");
const errorController = require('./controllers/error');
const rootDir = require("./utils/path");
const authRouter = require("./routes/authRouter");

const app = express();
dotenv.config();
const mongodbURL = process.env.MONGODB_URL;

const storage = multer.diskStorage({
    destination: (req, file, cb) => { //cb(err,filepath) is callback 
        // console.log(file);
        if (file.mimetype == "application/pdf") {
            cb(null, "./rules");
        } else if (['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) {
            cb(null, "./upload");
        }
    },
    filename: (req, file, cb) => {
        // console.log("file from filename",file);
        // fn=file.originalname +req.body.id;
        // cb(null,file.originalname)
        cb(null, Date.now() + "-" + file.originalname)//for uniq img name i had removed here becaus i want if img have same name then don't add duplicate imgs
    }
})
const fileFilter = (req, file, cb) => {
    // console.log(file);
    if (file.mimetype === "application/pdf") { //accept only pdf
        cb(null, true)
    } else if (['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) { //accept only png,jpg,jpeg file
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({ storage, fileFilter })

// make public foldr public
app.use(express.static(path.join(rootDir, 'public'))) // express.static serve static files like imgs,css,js
app.use(express.urlencoded({ extended: true })); //help parse form data
app.use("/upload", express.static(path.join(rootDir, 'upload')))
app.use("/host/upload", express.static(path.join(rootDir, 'upload')))
app.use("/homes/upload", express.static(path.join(rootDir, 'upload')))


// set engine as ejs
app.set("view engine", "ejs")
app.set("views", "views")
const store = new mongodbStore({
    uri: mongodbURL,
    collection: "sessions"
})
//creating session
app.use(session({
    secret: "my-secret",
    saveUninitialized: false,
    resave: false,   // Don't save session if unmodified
    saveUninitialized: true,   // Don't create session until something stored
    store
}))

// setting isLoggedIn in req
app.use((req, res, next) => {
    req.isLoggedIn = req.session.isLoggedIn;
    req.user = req.session.user;
    next();
})
app.use(authRouter);
app.use("/host", upload.fields([{ name: "photo", maxCount: 1 }, { name: "rules", maxCount: 1 }]), (req, res, next) => {
    req.isLoggedIn ?
        req.user.userType == "host" ? next() : res.redirect("/")
        : res.redirect("/login");
});
app.use("/host", hostRouter);
app.use(userRouter);
app.use(errorController.getPgNotFound);


const PORT = 3005;
mongoose.connect(mongodbURL)
    .then(() => {
        console.log("Connected to database successfully");
        app.listen(PORT, () => {
            console.log(`Server running at PORT ${PORT}`);
        })
    })
    .catch(err => {
        console.log("Error while connecting to database: ", err);
    });
