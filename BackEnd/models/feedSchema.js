const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const feedSchema=new mongoose.Schema({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', // Reference to the User model
        required: true
    },
    is_freshman:{type: Boolean, required: true},
    gender:{type: String, enum:["male","female"],required: true},
    is_honors:{type:Boolean, required:true},
    residence_hall:{type:String, required: true},
},{ timestamps:true});

const feed = mongoose.model("Feed", feedSchema);
module.exports= feed;
