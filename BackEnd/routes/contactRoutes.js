const express = require('express')
const requireAuth = require('../MiddleWare/authMiddleware'); // Import middleware

const {
    getContacts,
    getContact,
    createContact,
    deleteContact,
    updateContact
} = require("../controllers/contactController")
const router = express.Router() //creates router

//adds all request handlers to router
router.use(requireAuth);
// GET all users
router.get('/', getContacts)

// Get a single user
router.get('/:id', getContact)

// POST a new user
router.post('/', createContact)

// DELETE a new user
router.delete('/:id', deleteContact)

// UPDATE a user
router.patch('/:id', updateContact)

//exports router to server.js
module.exports = router