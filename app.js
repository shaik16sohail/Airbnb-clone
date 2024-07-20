if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}
const express=require("express");
const app=express();
const mongoose=require("mongoose");
let port=8080;
const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
const User=require("./models/user.js");
const methodOverride = require('method-override');
const ejsMate=require("ejs-mate");
const path=require("path");
const wrapAsync=require("./utils/wrapAsync.js");
const expressErrors=require("./utils/expressErrors.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const mongoDB='mongodb://127.0.0.1:27017/wanderlust';
const dbUrl=process.env.ATLASDB_URL;
const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*60*60,
});
const sessionOptions={
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now()+7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true,
    }
};
store.on("error",()=>{
    console.log("ERROR IN SESSION-STORE",err);
});

const passport=require("passport");
const localStrategy=require("passport-local");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"public/css")));
app.use(express.static(path.join(__dirname,"public/js")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride('_method'));
app.engine("ejs",ejsMate);


//for mongoose connection
main()
    .then(()=>{
        console.log("connection successful");
    })
    .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//basic
app.listen(port,()=>{
    console.log(`app is listening to port ${port}`)
});


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    res.locals.place=req.flash("place");
    next();
});
// app.get("/demo",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"something",
//     });
//     let registeredUser=await User.register(fakeUser,"sohail123");
//     res.send(registeredUser);
// })

//for listings addition
app.use("/listings",listingRouter);
//for reviews addition
app.use("/listings/:id/reviews",reviewRouter);
//for users addition
app.use("/",userRouter);

//for all non matched routes
app.use("*",(req,res,next)=>{
    next(new expressErrors("page not found",404));
});

//error handling middleware
app.use((err,req,res,next)=>{
    let {status=500,message="Something went wrong"}=err;
    res.status(status).render("./listings/error.ejs",{message});
});




