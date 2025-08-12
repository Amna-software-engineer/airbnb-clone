// core Module
const path = require("path");
// External Module
const express = require("express");
const mongoose = require("mongoose");
const session=require("express-session");
const mongodbStore=require("connect-mongodb-session")(session);
const dotenv=require("dotenv");
// local Module
const hostRouter = require("./routes/hostRouter");
const userRouter = require("./routes/userRouter");
const errorController = require('./controllers/error');
const rootDir = require("./utils/path");
const authRouter = require("./routes/authRouter");

const app = express();
dotenv.config();
const mongodbURL = process.env.MONGODB_URL;
 
// make public foldr public
app.use(express.static(path.join(rootDir, 'public')))
// set engine as ejs
app.set("view engine", "ejs")
app.set("views", "views")
const store = new mongodbStore({
    uri: mongodbURL,
    collection:"sessions"
})

app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: "my-secret",  
  saveUninitialized: false,       
    resave:false,   // Don't save session if unmodified
    saveUninitialized:true,   // Don't create session until something stored
    store
}))

// setting isLoggedIn in req
app.use((req,res,next)=>{
    req.isLoggedIn= req.session.isLoggedIn  
    next();
})
app.use(authRouter);
app.use("/host", (req, res, next) => {
    req.isLoggedIn ? next() : res.redirect("/login")
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


    



