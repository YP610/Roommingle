const express = require('express')

const router = express.Router() //creates router

//adds all request handlers to router

// GET all students
router.get('/', (req, res) => {
    res.json({mssg: 'GET all students'})
})

// Get a single student
router.get('/:id', (req, res) => {
    res.json({mssg: 'GET a single student'})
})

// POST a new student
router.post('/', (req, res) => {
    res.json({mssg: 'POST a new student'})
})

// DELETE a new student
router.delete('/:id', (req, res) => {
    res.json({mssg: 'DELETE a new student'})
})

// UPDATE a student
router.patch('/:id', (req, res) => {
    res.json({mssg: 'UPDATE a student'})
})

//exports router to server.js
module.exports = router