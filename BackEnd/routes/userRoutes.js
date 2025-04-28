const express = require('express')
const requireAuth = require('../MiddleWare/authMiddleware'); // Import middleware
const {
    getUsers,
    getUser,
    deleteUser,
    updateUser,
    getUserInfoByCategory,
    getRecommendations,
    
} = require("../controllers/userController")
const router = express.Router() //creates router

//adds all request handlers to router

// GET all users
router.get('/', getUsers)

// Get a single user
router.get('/:id', getUser)

// DELETE a new user
router.delete('/:id',requireAuth, deleteUser)

// UPDATE a user
router.patch('/:id', requireAuth, updateUser)

router.get('/:userId/category/:category',getUserInfoByCategory)

router.get('/recs/:id',requireAuth,getRecommendations)

//exports router to server.js
module.exports = router