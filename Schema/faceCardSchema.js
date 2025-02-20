const Schema=mongoose.Schema;
const mongoose=require("mongoose");
const FaceCardSchema=new mongoose.Schema({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', // Reference to the User model
        required: true
    },
    year:{type: String, required: true},
    gender:{type: String, required: true},
    is_honors:{type:Boolean, required:true},
    residence_hall:{type:String, required: true},
},{ timestamps:true});

const faceCard = mongoose.model("FaceCard", FaceCardSchema);
module.exports= faceCard;
