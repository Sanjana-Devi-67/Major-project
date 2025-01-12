const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js")
const User=require("./user.js");
const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    image:{
        // type:String,
        // default: "https://i.pinimg.com/originals/73/ff/b1/73ffb12652fe34f11fba54fa480ab972.jpg",
        // set: (v) => v ==="" 
        // ? "https://i.pinimg.com/originals/73/ff/b1/73ffb12652fe34f11fba54fa480ab972.jpg"
        // : v,
        url:String,
        filename:String
    },
    price:{
        type:Number
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    reviews:
    [{
        type: Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type: Schema.Types.ObjectId,
        ref:"User"
    },
   geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
   if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}});
   }
})



const listing=mongoose.model("listing",listingSchema);
module.exports=listing;
