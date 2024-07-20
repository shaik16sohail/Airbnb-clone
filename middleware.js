const Listing=require("./models/listing");
const Review=require("./models/review");
const listingSchema=require("./schema");
const expressErrors=require("./utils/expressErrors.js");
const {reviewSchema}=require("./schema2.js");
//login middleware
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        //redirect url save
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in");
        return res.redirect("/login");
    }
    next();
}
//for redirecting link
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    else
        res.locals.redirectUrl="/listings";
    next();
};
//to check owner
module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listingData=await Listing.findById(id);
    if(!listingData.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
//to check author for a review
module.exports.isAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!res.locals.currUser){
        req.flash("error","Please login first");
        return res.redirect("/login");
    }
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
//validation middleware for listing
module.exports.validateListing=(req,res,next)=>{
    let result=listingSchema.validate(req.body);
    if(result.error)
        throw new expressErrors(result.error,400);
    else
        next();
};
//validation middleware for review
module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
     throw new expressErrors(error.message,400);
    }else
     next();
 }
