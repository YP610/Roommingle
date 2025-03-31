const express = require('express')
const requireAuth = require('../MiddleWare/authMiddleware'); // Import middleware

const {
    getFeeds,
    getFeed,
    createFeed,
    deleteFeed,
    updateFeed
} = require("../controllers/feedController")
const router = express.Router() //creates router

//adds all request handlers to router
router.use(requireAuth);

// GET all s
router.get('/', getFeeds)

// Get a single feed
router.get('/:id', getFeed)

// POST a new feed
router.post('/', createFeed)

// DELETE a new feed
router.delete('/:id', deleteFeed)

// UPDATE a feed
router.patch('/:id', updateFeed)

//exports router to server.js
module.exports = router