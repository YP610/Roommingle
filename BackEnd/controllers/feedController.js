/*
Contains functionality of all requests, so databaseRoutes simply has to call these functions (minimizes clutter in databaseRoutes.js)
*/

const Feed=require('../models/feedSchema')
const mongoose = require('mongoose')
const algo=require('../Algorithm/sortingUsers')

// get all feeds
const getFeeds = async (req, res) => {
    const feeds = await Feed.find({}).sort({createdAt: -1})

    res.status(200).json(feeds)
    
}


// get a single feed
const getFeed = async (req, res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'no such feed'})
    }
    const feed = await Feed.findById(id)

    if (!feed) {
        return res.status(404).json({error: "No such feed"})
    }

    res.status(200).json(feed)
}


// create a new feed
const createFeed = async (req, res) => {
    const { user, is_freshman, gender, is_honors, residence_hall } = req.body;

    console.log("Received data:", req.body); // Debugging log

    if (!user) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        const feed = await Feed.create({ user, is_freshman, gender, is_honors, residence_hall });
        algo.addUser(feed); // Adds user to hash map
        res.status(201).json(feed);

    } catch (error) {
        console.error("Error creating feed:", error.message); // Log error
        res.status(400).json({ error: error.message });
    }
};


// delete a feed
const deleteFeed = async (req, res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'no such feed'})
    }

    const feed = await Feed.findOneAndDelete({_id: id})
    algo.removeUser({id});


    if (!feed) {
        return res.status(400).json({error: 'no such feed'})
    }

    res.status(200).json(feed)
}


// update a feed
const updateFeed = async (req, res) => {
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: "no such feed"})
    }
    algo.removeUser({id});
    const feed = await Feed.findOneAndUpdate({ _id: id }, { ...req.body }, { new: true });
    algo.updateUser({...req.body});
    


    if (!feed) {
        return res.status(400).json({error: "no such feed"})
    }

    res.status(200).json(feed)
}



module.exports = {
    getFeeds,
    getFeed,
    createFeed,
    deleteFeed,
    updateFeed
}