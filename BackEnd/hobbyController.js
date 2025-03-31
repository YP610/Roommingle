const Hobby = require('../models/hobbiesSchema'); // Hobby model
const mongoose = require('mongoose');

// Get all hobbies for a user
const getUserHobbies = async (req, res) => {
    const userId = req.user.id; // Get user ID from authenticated request

    try {
        const hobbies = await Hobby.find({ user: userId });
        res.status(200).json(hobbies);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Add a new hobby for a user
const addHobby = async (req, res) => {
    const userId = req.user.id;
    const { name, description } = req.body;

    try {
        const newHobby = await Hobby.create({ user: userId, name, description });
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

    const hobby = await Hobby.findOneAndDelete({ _id: id, user: req.user.id });

    if (!hobby) {
        return res.status(404).json({ error: 'Hobby not found' });
    }

    res.status(200).json({ message: 'Hobby deleted' });
};

// Update a hobby
const updateHobby = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid hobby ID' });
    }

    const hobby = await Hobby.findOneAndUpdate(
        { _id: id, user: req.user.id },
        { ...req.body },
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
