const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requestSchema = new mongoose.Schema({
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
})
const UserSchema = new Schema({
    // User Basic Info
    name: { type: String, required: true },
    // This should be the url and the actual file should be saved on google cloud or something
    email: { type: String, required: true },
    password: { type: String, required: true },
    number: { type: String, required: false },
    bio: {type:String, required: false, maxlength:250},
    profilePic: { type: String, default: 'https://res.cloudinary.com/<YOUR_CLOUD_NAME>/image/upload/v1234567890/roommingle_profiles/default_avatar.png'},
    prof_questions:{
        q1: { type: Number, enum: [2, 1, 0, -1, -2], required: true},
        q2: { type: Number, enum: [2, 1, 0, -1, -2], required: true},
        q3: { type: Number, enum: [2, 1, 0, -1, -2], required: true},
        q4: { type: Number, enum: [2, 1, 0, -1, -2], required: true},
        q5: { type: Number, enum: [2, 1, 0, -1, -2], required: true},
    },
    // Contact Information
    contact: {
        snap: { type: String, required: false },
        insta: { type: String, required: false },
    },

    // Feed Information
    feed: {
        year: { type: String, enum: ["Freshman", "Sophomore", "Junior", "Senior"], required: true },
        gender: { type: String, enum: ["male", "female"], required: true },
        is_honors: { type: Boolean, required: true },
        rank: {
            type: [String],
            validate: {
                validator: function(array) {
                    // For honors students, rank can be empty
                    if (this.feed.is_honors) return true;
                    // For non-honors, validate as before
                    return array.length <= 3;
                },
                message: 'Cannot select more than 3 preferences'
            },
            enum: ["CHC", "SW", "OH", "NE", "No", "CE", "Sy"],
            required: function() {
                // Only required for non-honors students
                return !this.feed.is_honors;
            }
          }
    },
    

    // Hobbies
    hobbies: { type: String, required: false },

    livingConditions: {
        sleep_attitude: { type: String,enum:["Early Bird","Night Owl","Flexible"], required: true },
        major: { type: String, required: true },
        cleanliness_score: { type: Number, required: true }
    },
    group:{type:String,enum:["maleFreshman","femaleFreshman","H_maleFreshman","H_femaleFreshman","maleNF","femaleNF","H_maleNF","H_femaleNF"], required:true,index:true},

    // Requests I've sent to others
    requestsSent: {
        type: [requestSchema],
        default: []
    },

    // Requests other users have sent to me
    requestsReceived: {
        type: [requestSchema],
        default: []
    },

    // Matches (accepted)
    matches: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        default: []
    }
}, 

{ timestamps: true });

const User = mongoose.model('User', UserSchema);
module.exports = User;
