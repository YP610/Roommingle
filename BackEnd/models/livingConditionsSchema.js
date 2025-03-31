const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const LivingConditionsSchema=new mongoose.Schema({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', // Reference to the User model
        required: true
    },
    sleep_attitude:{type:String, required:true},
    major:{type:String, required:true},
    cleaniness_score:{type:Number, required:true},
},{ timestamps:true});

const livingConditions = mongoose.model("LivingConditions", LivingConditionsSchema);
module.exports=livingConditions;