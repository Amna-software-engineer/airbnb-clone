exports.getPgNotFound=(req,res,next)=>{
res.status(404).render("404",{ pageTitle: "Page Not Found", currentPg: "404",isLoggedIn: req.isLoggedIn,user: req.user})
}