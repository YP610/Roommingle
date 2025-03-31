const express = require('express')
const requireAuth = require('../MiddleWare/authMiddleware'); // Import middleware
const {
    getLivingConditions,
    getLivingCondition,
    deleteLivingCondition,
    createLivingCondition
    
} = require("../controllers/livingConditionsController")
const router = express.Router() //creates router

//adds all request handlers to router
route.use(requireAuth)
// GET all Living Conditions
router.get('/', getLivingConditions)

// Get a single Living Condition
router.get('/:id', getLivingCondition)

// DELETE a new Living Condition
router.delete('/:id',requireAuth, deleteLivingCondition )

// UPDATE a Living Condition
router.patch('/:id', requireAuth, createLivingCondition)

//exports router to server.js
module.exports = router