/*
Contains functionality of all requests, so databaseRoutes simply has to call these functions (minimizes clutter in databaseRoutes.js)
*/

const User=require('../models/userSchema')
const bcrypt = require('bcryptjs');
const generateToken = require('../Utils/generateToken');
const mongoose = require('mongoose')
const algo=require('../Algorithm/sortingUsers');


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
    const { name, email, password,contact,feed,hobbies,livingConditions} = req.body;

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

        // Create new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            contact,
            feed,
            hobbies,
            livingConditions,
            group
        });

        // Send token & user data
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });

    } catch (error) {
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
        const validCategories = ['contact', 'feed', 'livingConditions', 'hobbies', 'name', 'email'];
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
};




module.exports = {
    getUsers,
    getUser,
    registerUser,
    loginUser,
    deleteUser,
    updateUser,
    getUserInfoByCategory
}