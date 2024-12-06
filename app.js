if(process.env.NODE_ENV!="production"){
    require('dotenv').config()
}
// console.log(process.env.SECRET);

const express=require("express");
const mongoose=require("mongoose");
const app=express();
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const mongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const dbUrl=process.env.ATLASDB_URL;
// const {listingSchema,reviewSchema}=require("./schema.js");
// const Review=require("./models/review.js");
// const Listing=require("./models/listing.js");
// const wrapAsync=require("./utils/wrapAsync.js");


const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store=mongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600
})

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION",err);
})

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
};
// app.get("/",(req,res)=>{
//     res.send("root is working");
//  });


 
app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


main()
.then(()=>{
    console.log("connection successful")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}



app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"Delta Student"
//     })
//     let registeredUser=await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// })

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);



//wrong route error
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found!!"));
})
//error handling middleware
app.use((err,req,res,next)=>{
    // res.send("Something went wrong!")
    let {status=500,message="some error occurred"}=err;
    // res.status(status).send(message);
    res.status(status).render("error.ejs",{message});
})
 app.listen(8080,()=>{
     console.log("Server is listening on port : 8080");
 })





 
//  app.get("/testListing",async (req,res)=>{
    //  let sampleListing=new Listing({
    //     title:"My new villa",
    //     description:"By the beach",
    //     price:1200,
    //     location:"Calngute,Goa",
    //     country:"India"
    //  });
    //  await sampleListing.save();
    //  console.log("sample saved");
    //  res.send("successful testing");
//  });