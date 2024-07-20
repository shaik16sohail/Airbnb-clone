const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const listingSchema=require("../schema.js");
const {listingSchema2}=require("../schema2.js");
const expressErrors=require("../utils/expressErrors.js");
const {validateListing,isLoggedIn, isOwner}=require("../middleware.js");
const listingController=require("../controllers/listing.js");
const multer=require("multer");
const {cloudinary,storage}=require("../cloudConfig.js");
const upload = multer({storage});
//all listings or index route and post or create
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single('image'),validateListing,wrapAsync(listingController.create));
    
//new route
router.get("/new",isLoggedIn,listingController.new);

//show ,update,delete
router.route("/:id")
    .get(wrapAsync(listingController.show))
    .put(isLoggedIn,isOwner,upload.single('listing[image]'),wrapAsync(listingController.update))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.delete));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.edit));

module.exports=router;