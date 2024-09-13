const Listing=require("../models/listing.js");
const {listingSchema2}=require("../schema2.js");
const expressErrors=require("../utils/expressErrors.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
//index
module.exports.index=async (req,res)=>{
    let allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
};
module.exports.type=async(req,res)=>{
    let {name}=req.params;
    let allListings=await Listing.find({kind:{$eq:name}});
    res.render("./listings/index.ejs",{allListings});
};
module.exports.search=async(req,res)=>{
    let {search}=req.query;
    let allListings = await Listing.find({
        title: { $regex: search, $options: 'i' } // 'i' makes the search case-insensitive
      });
    res.render("./listings/index.ejs",{allListings});
}
//new
module.exports.new=(req,res)=>{
    res.render("./listings/new.ejs");
};
//show
module.exports.show=async(req,res)=>{
    let {id}=req.params;
    let idData=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!idData){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{idData});
};
//create
module.exports.create=async (req,res,next)=>{
    const place=req.body.location+","+req.body.country;
    let response=await geocodingClient.forwardGeocode({
        query: place,
        limit: 1
      })
        .send();
    const coordinate=response.body.features[0].geometry;
    let{title,description,image,price,location,country}=req.body;
    const newListing=new Listing({
    title:title,
    price:price,
    image:image,
    country:country,
    location:location,
    description:description,
    owner:req.user._id,
    image:{
        url:req.file.path,
        filename:req.file.filename,
    },
    geometry:coordinate,
});
await newListing.save();
req.flash("success","New Listing created successfully");
res.redirect("/listings");
//Another way of doing above thing is to use object in new.ejs file
//and directly pass req.body.listing object to the new Listing (Document Creation place)
//const newListing=new Listing(req.body.listing);
};
//edit
module.exports.edit=async (req,res)=>{
    let {id}=req.params;
    let idData=await Listing.findById(id);
    if(!idData){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    let originalImage=idData.image.url;
    originalImage=originalImage.replace("/upload","/upload/h_300,w_250");
    res.render("./listings/edit.ejs",{idData,originalImage});
};
//update
module.exports.update=async (req,res)=>{
    let result=listingSchema2.validate(req.body);
    if(result.error)
        throw new expressErrors(result.error,400);
    let {id}=req.params;
    let updatedListing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(req.file){
        let url=req.file.path;
        let filename=req.file.filename;
        updatedListing.image={url,filename};
        await updatedListing.save();
    }
    req.flash("success","Listing updated successfully");
    res.redirect(`/listings/${id}`);
};
//delete
module.exports.delete=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted successfully");
    res.redirect("/listings");
};