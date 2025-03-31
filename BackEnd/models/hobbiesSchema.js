const mongoose=require("mongoose");
const Schema=mongoose.Schema;


const HobbiesSchema=new mongoose.Schema({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', // Reference to the User model
        required: true
    },
    hobbies:{type:String, required:false},
    
},{ timestamps:true});
const hobbies = mongoose.model("Hobbies", HobbiesSchema);
module.exports= hobbies;