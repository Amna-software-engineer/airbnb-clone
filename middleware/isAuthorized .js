

exports.isAuthorized =(req,res,next)=>{
    if(req.isLoggedIn){
        next()
    }else{
        res.redirect("/login")
    }
} 