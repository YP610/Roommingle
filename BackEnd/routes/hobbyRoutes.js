const express = require('express')
const requireAuth = require('../MiddleWare/authMiddleware'); // Import middleware
const {
    getUserHobbies,
    addHobby,
    deleteHobby,
    updateHobby
} = require("../controllers/hobbyController")
const router = express.Router() //creates router

//adds all request handlers to router

// GET all users
router.use(requireAuth);

router.get('/', getUserHobbies)

// Get a single user
router.post('/:id', addHobby)

// DELETE a new user
router.delete('/:id',deleteHobby)

// UPDATE a user
router.patch('/:id', updateHobby)

//exports router to server.js
module.exports = router