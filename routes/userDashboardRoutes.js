const express = require('express');
const router = express.Router();    
const userlists = require('../controllers/userlists');

// ✅ User Dashboard Routes
router.get('/gifts', userlists.gifts);
router.get('/giftData', userlists.giftData);
router.get('/blog', userlists.blogPosts);
router.get('/ourStories', userlists.ourStories);
router.post('/insertMessage', userlists.contactMessagesInsert);


module.exports = router;