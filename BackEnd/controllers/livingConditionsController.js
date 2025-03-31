const LivingConditions = require("../models/livingConditionsSchema");
const mongoose = require("mongoose");

// Get all living conditions
const getLivingConditions = async (req, res) => {
    
    const conditions = await LivingConditions.find({}).sort({ createdAt: -1 }).populate('user');
    res.status(200).json(conditions);
};

// Get a single living condition
const getLivingCondition = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such living condition' });
    }
    const condition = await LivingConditions.findById(id).populate('user');
    if (!condition) {
        return res.status(404).json({ error: "No such living condition" });
    }
    res.status(200).json(condition);
};

// Create a new living condition
const createLivingCondition = async (req, res) => {
    const { user, sleep_attitude, major, cleanliness_score } = req.body;
    try {
        const condition = await LivingConditions.create({ user, sleep_attitude, major, cleanliness_score });
        res.status(200).json(condition);
    } catch (error) {
        res.status(400).json({ error: "could not add" });
    }
};

// Delete a living condition
const deleteLivingCondition = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'No such living condition' });
    }
    const condition = await LivingConditions.findOneAndDelete({ _id: id });
    if (!condition) {
        return res.status(400).json({ error: 'No such living condition' });
    }
    res.status(200).json(condition);
};

// Update a living condition
const updateLivingCondition = async (req, res) => {
    const userId = req.user.id;

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "No such living condition" });
    }
    const condition = await LivingConditions.findOneAndUpdate({ _id: id }, {
        ...req.body
    }, { new: true });
    if (!condition) {
        return res.status(400).json({ error: "No such living condition" });
    }
    res.status(200).json(condition);
};

module.exports = {
    getLivingConditions,
    getLivingCondition,
    createLivingCondition,
    deleteLivingCondition,
    updateLivingCondition
};
