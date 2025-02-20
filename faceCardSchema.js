const Schema=mongoose.Schema;
const mongoose=require("mongoose");
const FaceCardSchema=new mongoose.Schema({
    year:{type: String, required: true},
    gender:{type: String, required: true},
    is_honors:{type:Boolean, required:true},
    residence_hall:{type:String, required: true},
},{ timestamps:true});

const faceCard = mongoose.model("FaceCard", FaceCardSchema);
module.exports= faceCard;
