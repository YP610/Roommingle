const express = require('express')
const requireAuth = require('../MiddleWare/authMiddleware'); // Import middleware
const {
    getLivingConditions,
    getLivingCondition,
    createLivingCondition,
    deleteLivingCondition,
    updateLivingCondition,

    
} = require("../controllers/livingConditionsController")
const router = express.Router() //creates router

//adds all request handlers to router
router.use(requireAuth)
// GET all Living Conditions
router.get('/', getLivingConditions)

// Get a single Living Condition
router.get('/:id', getLivingCondition)

router.post('/',createLivingCondition)

// DELETE a new Living Condition
router.delete('/:id',requireAuth, deleteLivingCondition )

// UPDATE a Living Condition
router.patch('/:id', requireAuth, updateLivingCondition)

//exports router to server.js
module.exports = router