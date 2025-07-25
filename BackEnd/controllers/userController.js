/*
Contains functionality of all requests, so databaseRoutes simply has to call these functions (minimizes clutter in databaseRoutes.js)
*/
const path = require('path');

const User=require('../models/userSchema')
const bcrypt = require('bcryptjs');
const generateToken = require('../Utils/generateToken');
const mongoose = require('mongoose')
const algo=require('../Algorithm/sortingUsers');
const getRec=require('../Algorithm/recs')
const {calculateClean}=require('../Algorithm/sortingUsers')


// get all users
const getUsers = async (req, res) => {
    const users = await User.find({}).sort({createdAt: -1}).select('-password')

    res.status(200).json(users)
    
}


// get a single user
const getUser = async (req, res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'no such user'})
    }
    const user = await User.findById(id).select('-password')

    if (!user) {
        return res.status(404).json({error: "No such user"})
    }

    res.status(200).json(user)
}

const registerUser = async (req, res) => {
    console.log("📥 Incoming body:", JSON.stringify(req.body, null, 2));

    const { name, email, password,bio,prof_questions, contact,feed,hobbies,livingConditions} = req.body;

    try {
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const group=algo.getGroupKey({feed});
        const cleanliness_score = calculateClean(prof_questions);


        // Merge score into nested livingConditions
        const updatedLivingConditions = {
            ...livingConditions,
            cleanliness_score
        };
        const DEFAULT_AVATAR = process.env.DEFAULT_AVATAR_URL;


        // Create new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            bio,
            prof_questions,
            contact,
            feed,
            hobbies,
            livingConditions: updatedLivingConditions,
            group,
            profilePic: DEFAULT_AVATAR,
        });

        // Send token & user data
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });

    } catch (error) {
    if (error.name === 'ValidationError') {
        const details = Object.entries(error.errors)
            .map(([key, err]) => `${key}: ${err.message}`)
            .join(' | ');
        console.error("❌ Validation Error:", details);
        return res.status(400).json({ error: details });
    }

    console.error("❌ registerUser error:", error); // full fallback
    res.status(500).json({ error: 'Server error' });
}
};



const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });

    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};


// delete a user
const deleteUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'no such user' });
    }

    try {
        
        // Now delete the user
        const user = await User.findOneAndDelete({ _id: id });


        if (!user) {
            return res.status(404).json({ error: 'no such user' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error deleting user and related data:', error);
        res.status(500).json({ error: 'Server error during deletion' });
    }
};


// update a user
const updateUser = async (req, res) => {
    const {id} = req.params
    const updates={...req.body};
    updates.group = algo.getGroupKey(updates); // or { feed: updates.feed }
    
    // Safely update cleanliness_score inside livingConditions
    updates.livingConditions = {
        ...updates.livingConditions,
        cleanliness_score: calculateClean(scores)
    };

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: "no such user"})
    }
    const user = await User.findOneAndUpdate({_id: id}, updates, { new: true });

    

    if (!user) {
        return res.status(400).json({error: "no such user"})
    }

    res.status(200).json(user)
}

const getUserInfoByCategory = async (req, res) => {
    try {
        const { userId, category } = req.params;

        // Validate category input
        const validCategories = ['contact', 'feed','prof_questions', 'livingConditions','bio', 'hobbies', 'name','profile_pic', 'email','number'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({ message: "Invalid category specified." });
        }

        // Dynamically build query to select only requested category
        const projection = { [category]: 1, _id: 0 };

        const user = await User.findById(userId, projection);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
const getRecommendations = async (req, res) => {
    try {
        const userId = req.params.id;
        console.log("Using userId:", userId);

        const recommendations = await getRec(userId);
        res.status(200).json(recommendations);
    } catch (error) {
        console.error("Error generating recommendations:", error);
        res.status(500).json({ error: "Failed to get recommendations" });
    }
};

const sendRequest = async (req, res) => {
    const fromId = req.user._id     // set by requireAuth
    const toId = req.params.id;
    const io = req.app.get('io');

    if (fromId.equals(toId)) {
        return res.status(400).json({ error: "Can't request yourself" });
    }

    // Add to my 'requestsSent' and their 'requestsReceived'
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        await User.findByIdAndUpdate(fromId, {
            $addToSet: { requestsSent: { from: toId } }
        }, { session });

        await User.findByIdAndUpdate(toId, {
            $addToSet: { requestsReceived: { from: fromId } }
        }, { session });

        // Get sender's profile to send to receiver
        const sender = await User.findById(fromId).select('name profilePic bio');

        // Notify the receiver in real-time
        io.to(toId.toString()).emit('newMatchRequest', {
            sender: {
                _id: sender._id,
                name: sender.name,
                profilePic: sender.profilePic,
                bio: sender.bio
            }
        });

        await session.commitTransaction();
        res.json({ success: true });
    } catch (err) {
        await session.abortTransaction();
        console.error(err);
        res.status(500).json({ error: 'Failed to send request '});
    } finally {
        session.endSession();
    }
};

// Accept or decline a received request
const respondRequest = async (req, res) => {
    const meId = req.user._id;
    const fromId = req.params.id;
    const { action } = req.body; //'accept' or 'decline'
    const io = req.app.get('io');

    if(!['accept','decline'].includes(action)) {
        return res.status(400).json({error: 'Invalid action'});
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        // Remove the pending request
        await User.findByIdAndUpdate(meId, {
            $pull: { requestsReceived: { from: fromId } }
        }, { session });

        await User.findByIdAndUpdate(fromId, {
            $pull: { requestsSent: { from: meId } }
        }, { session });

        if (action === 'accept') {
            // Add each other to matches
            await User.findByIdAndUpdate(meId, {
                $addToSet: {matches: fromId }
            }, { session });
            await User.findByIdAndUpdate(fromId, {
                $addToSet: { matches: meId }
            }, { session });
        }

        // Notify the original sender about the response
        io.to(fromId.toString()).emit('matchRequestUpdate', {
            userId: meId,
            action: action
        });

        await session.commitTransaction();
        res.json({ success: true });
    } catch (err) {
        await session.abortTransaction();
        console.error(err);
        res.status(500).json({ error: 'Failed to respond to request'});
    } finally {
        session.endSession();
    }
};

const uploadProfilePic = async (req, res) => {
  try {
    const userId = req.user._id;
    const profilePicUrl = req.file.path; // Cloudinary returns public URL in path

    const user = await User.findByIdAndUpdate(
      userId,
      { profilePic: profilePicUrl },
      { new: true }
    );

    res.status(200).json({ message: 'Profile picture updated', profilePic: user.profilePic });
  } catch (err) {
    res.status(500).json({ message: 'Error uploading profile picture' });
  }
};


module.exports = {
    getUsers,
    getUser,
    registerUser,
    loginUser,
    deleteUser,
    updateUser,
    getUserInfoByCategory,
    getRecommendations,
    sendRequest,
    respondRequest,
    uploadProfilePic
};