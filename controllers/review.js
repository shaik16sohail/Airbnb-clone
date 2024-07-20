const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
module.exports.post=async (req,res)=>{
    const newReview=new Review(req.body.review);
    let listingData=await Listing.findById(req.params.id);
    newReview.author=req.user._id;
    listingData.reviews.push(newReview);
    await newReview.save();
    await listingData.save();
    req.flash("success","New Review created successfully");
    res.redirect(`/listings/${req.params.id}`);
};
module.exports.delete=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    req.flash("success","Review Deleted successfully");
    res.redirect(`/listings/${id}`);
};