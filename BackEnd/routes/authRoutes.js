const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');

const router = express.Router();

router.post('/register', registerUser); // Register Route
router.post('/login', loginUser); // Login Route

module.exports = router;