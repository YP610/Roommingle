const mongoose=require("mongoose");
const UserSchema=new mongoose.Schema({
    name:{type:String, required: true},
    email:{type:String, required: true},
    password:{type:String, required: true},
    year:{type: String, required: true},
    gender:{type: String, required: true},
    is_honors:{type:Boolean, required:true},
    residence_hall:{type:String, required: true},
    sleep_attitude:{type:String, required:true},
    major:{type:String, required:false},
    cleaniness_score:{type:int, required:true},
    hobbies:{type:String, required:false},
    is_number:{type:Boolean, required:true},
    cell_number:{type:String, required:false},
    is_snap:{type:Boolean, required:true},
    snap:{type:String, required: false},
    is_insta:{type:Boolean, required:true},
    insta:{type:String, required:false},
},{ timestamps:true});
module.exports = mongoose.model("User", UserSchema);
