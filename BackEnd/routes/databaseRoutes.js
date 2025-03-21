const express = require('express')
const {
    getUsers,
    getUser,
    createUser,
    deleteUser,
    updateUser
} = require("../controllers/userController")
const router = express.Router() //creates router

//adds all request handlers to router

// GET all users
router.get('/', getUsers)

// Get a single user
router.get('/:id', getUser)

// POST a new user
router.post('/', createUser)

// DELETE a new user
router.delete('/:id', deleteUser)

// UPDATE a user
router.patch('/:id', updateUser)

//exports router to server.js
module.exports = router