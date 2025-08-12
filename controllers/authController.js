const { check } = require("express-validator")

exports.getLogin = (req, res) => {
    res.render("auth/login", { pageTitle: "Login", currentPg: "Login", editing: false, isLoggedIn: false})
}
exports.postLogin = (req, res) => {
    req.session.isLoggedIn=true
    res.redirect("/")
}
exports.postLogout = (req, res) => {
    req.session.destroy(()=>{
        res.redirect("/login")
    })
}
exports.getSignup = (req, res) => {
    res.render("auth/signup", { pageTitle: "signup", currentPg: "signup", editing: false, isLoggedIn: false})
}
exports.postSignup = (req, res) => {
    console.log(req.body);
    res.redirect("/login")
//   const{firstName,lastName,email,password,confirmPassword,userType,terms}=req.body;
//   check(firstName).notEmpty().withMessage("First name is required").trim().isLength({min:2}).withMessage("First name must be at least 2 character long").matches(/^[a-zA-Z\s]+$/).withMessage("First name must contain letters")
}



