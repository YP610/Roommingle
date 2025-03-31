const Hobby = require('../models/hobbiesSchema'); // Hobby model
const mongoose = require('mongoose');

// Get all hobbies for a user
const getUserHobbies = async (req, res) => {
    const {id} = req.params

    try {
        const hobbies = await Hobby.find({ user: userId }); // Get hobbies for this user
        res.status(200).json(hobbies);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Add a new hobby for a user
const addHobby = async (req, res) => {
    const { user,hobbies } = req.body; // Expecting only "hobbies"

    if (!hobbies) {
        return res.status(400).json({ error: "Hobby is required" });
    }

    try {
        const newHobby = await Hobby.create({ user, hobbies });
        res.status(201).json(newHobby);
    } catch (error) {
        res.status(500).json({ error: 'Could not add hobby' });
    }
};

// Delete a hobby
const deleteHobby = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid hobby ID' });
    }

    const hobby = await Hobby.findOneAndDelete({ _id: id});

    if (!hobby) {
        return res.status(404).json({ error: 'Hobby not found' });
    }

    res.status(200).json({ message: 'Hobby deleted' });
};


// Update a hobby
const updateHobby = async (req, res) => {
    const { id } = req.params;
    const { hobbies } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid hobby ID' });
    }

    const hobby = await Hobby.findOneAndUpdate(
        { _id: id, user: req.user.id },
        { hobbies },  // Only updating hobbies field
        { new: true }
    );

    if (!hobby) {
        return res.status(404).json({ error: 'Hobby not found' });
    }

    res.status(200).json(hobby);
};

module.exports = {
    getUserHobbies,
    addHobby,
    deleteHobby,
    updateHobby
};
