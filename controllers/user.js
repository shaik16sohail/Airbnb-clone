const User=require("../models/user");
module.exports.signupget=(req,res)=>{
    res.render("../views/users/signup.ejs");
};
module.exports.signuppost=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({email,username});
        let registeredUser=await User.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err)
                return next(err);
            req.flash("success","Welcome to Wanderlust");
            res.redirect("/listings");
        });
        
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
};
module.exports.loginget=(req,res)=>{
    res.render("../views/users/login.ejs");
};
module.exports.loginpost=async(req,res)=>{
    req.flash("success","Welcome back to wanderlust!");
    res.redirect(res.locals.redirectUrl);
};
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err)
            return next(err);
        req.flash("success","You are Logged out");
        res.redirect("/listings");
    });
};