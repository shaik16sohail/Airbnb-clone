const express=require("express");
const router=express.Router({mergeParams:true});
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const Review=require("../models/review.js");
const {reviewSchema}=require("../schema2.js");
const expressErrors=require("../utils/expressErrors.js");
const { validateReview,isLoggedIn, isAuthor } = require("../middleware.js");
// const Listing=require("../models/listing.js");
const reviewController=require("../controllers/review.js");

 //adding the reviews for listing
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.post));

 //delete review route
router.delete("/:reviewId",isAuthor,wrapAsync(reviewController.delete));

 module.exports=router;