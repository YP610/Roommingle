/*
Contains functionality of all requests, so databaseRoutes simply has to call these functions (minimizes clutter in databaseRoutes.js)
*/

const User=require('../models/feedSchema')
const mongoose = require('mongoose')

// get all feeds
const getFeeds = async (req, res) => {
    const feeds = await User.find({}).sort({createdAt: -1})

    res.status(200).json(feeds)
    
}


// get a single feed
const getFeed = async (req, res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'no such feed'})
    }
    const feed = await User.findById(id)

    if (!feed) {
        return res.status(404).json({error: "No such feed"})
    }

    res.status(200).json(feed)
}


// create a new feed
const createFeed = async (req, res) => {
    const {year,gender,is_honors,residence_hall}=req.body

    //add doc to db
    try{
        const feed= await User.create({year,gender,is_honors,residence_hall}) 
        res.status(200).json({feed})
    } catch(error){
        res.status(400).json({year,gender,is_honors,residence_hall})
    }
}


// delete a feed
const deleteFeed = async (req, res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'no such feed'})
    }

    const feed = await User.findOneAndDelete({_id: id})

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

    const feed = await User.findOneAndUpdate({_id: id}, {
        ...req.body // new object with properties of body
    })

    if (!feed) {
        return res.status(400).json({error: "no such feed"})
    }

    res.status(200).json(User)
}



module.exports = {
    getFeeds,
    getFeed,
    createFeed,
    deleteFeed,
    updateFeed
}