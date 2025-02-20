const Schema=mongoose.Schema;
const mongoose=require("mongoose");

const HobbiesSchema=new mongoose.Schema({
    hobbies:{type:String, required:false},
    
},{ timestamps:true});
const hobbies = mongoose.model("Hobbies", HobbiesSchema);
module.exports= hobbies;