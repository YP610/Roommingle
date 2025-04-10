const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    // User Basic Info
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },

    // Contact Information
    contact: {
        number: { type: String, required: false },
        snap: { type: String, required: false },
        insta: { type: String, required: false },
    },

    // Feed Information
    feed: {
        is_freshman: { type: Boolean, required: true },
        gender: { type: String, enum: ["male", "female"], required: true },
        is_honors: { type: Boolean, required: true },
        residence_hall: { type: String, required: true },
    },

    // Hobbies
    hobbies: { type: String, required: false },

    // Living Conditions
    living_conditions: {
        sleep_attitude: { type: String, required: true },
        major: { type: String, required: true },
        cleanliness_score: { type: Number, required: true },
    }

}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
module.exports = User;
