const express = require('express')
const User=require('../models/userSchema')
const router = express.Router() //creates router

//adds all request handlers to router

// GET all users
router.get('/', (req, res) => {
    res.json({mssg: 'GET all users'})
})

// Get a single user
router.get('/:id', (req, res) => {
    res.json({mssg: 'GET a single user'})
})

// POST a new user
router.post('/', async (req, res) => {
    const {name,email,password}=req.body
    try{
        const user= await User.create({name,email,password})
        res.status(200).json({user})
    } catch(error){
        res.status(400).json({error: error.message})
    }

})

// DELETE a new user
router.delete('/:id', (req, res) => {
    res.json({mssg: 'DELETE a new user'})
})

// UPDATE a user
router.patch('/:id', (req, res) => {
    res.json({mssg: 'UPDATE a user'})
})

//exports router to server.js
module.exports = router