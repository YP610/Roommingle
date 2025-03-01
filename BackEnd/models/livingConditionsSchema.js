const Schema=mongoose.Schema;
const mongoose=require("mongoose");

const LivingConditionsSchema=new mongoose.Schema({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', // Reference to the User model
        required: true
    },
    sleep_attitude:{type:String, required:true},
    major:{type:String, required:true},
    cleaniness_score:{type:int, required:true},
},{ timestamps:true});

const livingConditions = mongoose.model("LivingConditions", LivingConditionsSchema);
module.exports=livingConditions;