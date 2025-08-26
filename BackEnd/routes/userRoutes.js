const multer = require('multer');
const path = require('path');
const { storage } = require('../config/cloudinary'); 
const upload = multer({ storage });

const express = require('express')
const requireAuth = require('../MiddleWare/authMiddleware'); // Import middleware
const {
    getUsers,
    getUser,
    deleteUser,
    updateUser,
    checkEmailExists,
    getUserInfoByCategory,
    getRecommendations,
    sendRequest,
    respondRequest,
    removeMatch,
    uploadProfilePic,
    getUserChats,
    getOrCreateChat

    
} = require("../controllers/userController")
const router = express.Router(); //creates router

//adds all request handlers to router

// GET all users
router.get('/', getUsers);

// Get a single user
router.get('/:id', getUser);

// DELETE a new user
router.delete('/:id',requireAuth, deleteUser);

// UPDATE a user
router.patch('/:id', requireAuth, updateUser);

router.post('/check-email', checkEmailExists);

router.get('/:userId/category/:category',getUserInfoByCategory);

router.get('/recs/:id',requireAuth,getRecommendations);

// send a request To user: id
router.post('/:id/request', requireAuth, sendRequest);

// respond on a request FROM user :id
router.post('/:id/respond', requireAuth, respondRequest);

// remove a match FROM user :id
router.post('/:id/remove', requireAuth, removeMatch);

// Upload profile picture
router.post(
  '/upload-profile-pic',
  requireAuth,
  upload.single('profilePic'),
  uploadProfilePic
);

router.get('/chats', requireAuth, getUserChats);

router.get('/chat/:userId', requireAuth, getOrCreateChat);

//exports router to server.js
module.exports = router