const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    // User Basic Info
    name: { type: String, required: true },
    profile_pic :{type: String, required : false},
    // This should be the url and the actual file should be saved on google cloud or something
    email: { type: String, required: true },
    password: { type: String, required: true },
    number: { type: String, required: false },
    bio: {type:String, required: false, maxlength:250},
    prof_questions:{
        q1: { type: String, enum: ["A", "B", "C", "D", "E"], required: false},
        q2: { type: String, enum: ["A", "B", "C", "D", "E"], required: false},
        q3: { type: String, enum: ["A", "B", "C", "D", "E"], required: false},
        q4: { type: String, enum: ["A", "B", "C", "D", "E"], required: false},
        q5: { type: String, enum: ["A", "B", "C", "D", "E"], required: false}
    },
    // Contact Information
    contact: {
        snap: { type: String, required: false },
        insta: { type: String, required: false },
    },

    // Feed Information
    feed: {
        is_freshman: { type: Boolean, required: true },
        gender: { type: String, enum: ["male", "female"], required: true },
        is_honors: { type: Boolean, required: true },
        rank: {
            type: [String],
            validate: [array => array.length <= 3, 'Cannot select more than 3 preferences'],
            enum: ["CHC", "SW", "OH", "NE", "No", "CE", "Sy"],
            required: true
          }
    },
    

    // Hobbies
    hobbies: { type: String, required: false },

    livingConditions: {
        sleep_attitude: { type: String,enum:["earlyBird","nightOwl","flexible"], required: true },
        major: { type: String, required: true },
        cleanliness_score: { type: Number, required: true }
    },
    group:{type:String,enum:["maleFreshman","femaleFreshman","H_maleFreshman","H_femaleFreshman","maleNF","femaleNF","H_maleNF","H_femaleNF"], required:true,index:true},
    
    profile_pic_info: {
        url: { type: String },
        filename: { type: String },
        contentType: { type: String },
        size: { type: Number },
    }
    
}, 

{ timestamps: true });

const User = mongoose.model('User', UserSchema);
module.exports = User;
