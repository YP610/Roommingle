const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const ContactSchema=new mongoose.Schema({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', // Reference to the User model
        required: true
    },
    number:{type:String, required:false},
    snap:{type:String, required: false},
    insta:{type:String, required:false},
},{ timestamps:true});

const contact = mongoose.model("Contact", ContactSchema);
module.exports=contact;
