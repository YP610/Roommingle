/*
Contains functionality of all requests, so databaseRoutes simply has to call these functions (minimizes clutter in databaseRoutes.js)
*/

const User=require('../models/userSchema')
const bcrypt = require('bcryptjs');
const generateToken = require('../Utils/generateToken');
const mongoose = require('mongoose')

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
    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        // Send token & user data
        res.status(201).json({
            _id: user._id,
            username: user.username,
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
            username: user.username,
            email: user.email,
            token: generateToken(user._id)
        });

    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};


// delete a user
const deleteUser = async (req, res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'no such user'})
    }

    const user = await User.findOneAndDelete({_id: id})

    if (!user) {
        return res.status(400).json({error: 'no such user'})
    }

    res.status(200).json(user)
}


// update a user
const updateUser = async (req, res) => {
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: "no such user"})
    }

    const user = await User.findOneAndUpdate({_id: id}, {
        ...req.body // new object with properties of body
    })

    if (!user) {
        return res.status(400).json({error: "no such user"})
    }

    res.status(200).json(user)
}



module.exports = {
    getUsers,
    getUser,
    registerUser,
    loginUser,
    deleteUser,
    updateUser
}