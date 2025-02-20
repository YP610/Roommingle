const Schema=mongoose.Schema;
const mongoose=require("mongoose");
const ContactSchema=new mongoose.Schema({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', // Reference to the User model
        required: true
    },
    is_number:{type:Boolean, required:true},
    cell_number:{type:String, required:false},
    is_snap:{type:Boolean, required:true},
    snap:{type:String, required: false},
    is_insta:{type:Boolean, required:true},
    insta:{type:String, required:false},
},{ timestamps:true});

const contact = mongoose.model("Contact", ContactSchema);
module.exports=contact;
