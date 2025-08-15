const { check, validationResult } = require("express-validator");
const User = require("../model/user");
const bcrypt = require("bcryptjs");


exports.getLogin = (req, res) => {
    res.render("auth/login", { pageTitle: "Login", currentPg: "Login", editing: false, isLoggedIn: false, errorMsgs: "", user: {} })
}
exports.postLogin = (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email: email })
        .then(async (user) => {
            if (!user) {
                res.render("auth/login", {
                    pageTitle: "Login", currentPg: "Login", editing: false, isLoggedIn: false, errorMsgs: "invalid Email", user: {}
                })
            } else {
                const match = await bcrypt.compare(password, user.password);
                if (match) {
                    req.session.isLoggedIn = true
                    req.session.user = user;
                    // console.log("userType ",req.session.userType);
                    res.redirect("/")

                } else {
                    console.log("Password does not match");
                    res.render("auth/login", {
                        pageTitle: "Login", currentPg: "Login", editing: false, isLoggedIn: false, errorMsgs: "Password does not match", user: {}
                    })
                }
            }
        }
        )

}
exports.postLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login")
    })
}
exports.getSignup = (req, res) => {
    res.render("auth/signup", {
        pageTitle: "signup", currentPg: "signup", editing: false, isLoggedIn: false, errorMsgs: [], oldInputs: {
            firstName: "", lastName: "", email: "", password: "", userType: ""
        }, user: {}
    })
}
exports.postSignup = [
    // validating first name
    check("firstName")
        .notEmpty()
        .withMessage("First name is required")
        .trim()
        .isLength({ min: 2 })
        .withMessage("First name must be at least 2 character long")
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage("First name must contain letters"),
    // validating Last name
    check("lastName")
        .notEmpty()
        .matches(/^[a-zA-Z\s]+$/) //  /^[A-Z]+$/    Match a string that is only uppercase letters, from start to end. ==> "HELLO" → ✅ full match ==> "Hello" → ❌ because of lowercase "e" ==>  "HELLO123" → ❌ because of numbers
        .withMessage("Last name must contain letters"),
    // validating email
    check("email")
        .isEmail()
        .withMessage("Please enter valid email")
        .trim() //remove extra space 
        .normalizeEmail(),//convert email to lowercase,remove dots and + signs 
    //validating password
    check("password")
        .trim()
        .isLength({ min: 4 })
        .withMessage("Password must contain 4 characters")
        .matches(/[a-z]/) //Match any single uppercase letter anywhere in the string.
        .withMessage("Password must contain atleast one lowercase letter")
        .matches(/[A-Z]/)
        .withMessage("Password must contain atleast one uppercase letter")
    ,
    //validating confirm password
    check("confirmPassword")
        .trim()
        .custom((value, { req }) => {
            console.log(req.body);

            if (value !== req.body.password) {
                throw new Error("Password does not match")
            } else {

                return true
            }
        }),
    // validating user type
    check("userType")
        .notEmpty().withMessage("Please choose user type")
        .isIn(["guest", "host"])
        .withMessage("invalid user type")
    ,
    // validating terms
    check("terms")
        .notEmpty()
        .withMessage("Please accept terms and conditions")
        .custom((value) => {
            if (value !== 'on') {
                throw new Error("Please accept terms and conditions")
            }
            return true
        }),
    // final midlleware
    (req, res) => {
        const { firstName, lastName, email, password, userType, } = req.body;
        const errors = validationResult(req);

        console.log("userType", userType);
        if (!errors.isEmpty()) {
            res.status(422).render("auth/signup", {
                pageTitle: "signup",
                currentPg: "signup",
                isLoggedIn: false,
                errorMsgs: errors.array().map(err => (err.msg)), //converting erros to array then extracting only error msgs
                oldInputs: {
                    firstName, lastName, email, password, userType
                }, user: {}
            })
        } else {
            bcrypt.hash(password, 10)
                .then(hashedPassword => {
                    const newUser = new User({ firstName: firstName, lastName: lastName, email: email, password: hashedPassword, userType: userType });
                    return newUser.save()//retun a promise which wil pas to next .then
                })
                .then((userAdded) => {
                    console.log("user Added successfully", userAdded);
                    res.redirect("/login")
                }).catch(err => {
                    console.log("err while adding user ", err);
                    res.status(422).render("auth/signup", {
                        pageTitle: "signup",
                        currentPg: "signup",
                        isLoggedIn: false,
                        errorMsgs: [err.message],
                        oldInputs: { firstName, lastName, email, password, userType }, user: {}
                    })

                })


        }
    }]



