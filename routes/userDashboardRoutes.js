const express = require('express');
const router = express.Router();    
const userlists = require('../controllers/userlists');


/**
 * @swagger
 * tags:
 *   name: User
 *   description: User API routes
 */

// ✅ User Dashboard Routes

// router.get('/gifts', userlists.gifts);
// router.get('/giftData', userlists.giftData);
// router.get('/blog', userlists.blogPosts);
// router.get('/ourStories', userlists.ourStories);
// router.post('/insertMessage', userlists.contactMessagesInsert);

// //get product with the category id
// router.post('/getProducts', userlists.getProducts);

/**
 * @swagger
 * /user/gifts:
 *   get:
 *     summary: Get all gifts
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Successfully retrieved gifts.
 *       500:
 *         description: Internal server error.
 */
router.get('/gifts', userlists.gifts);

/**
 * @swagger
 * /user/giftData:
 *   get:
 *     summary: Get gift data
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Successfully retrieved gift data.
 *       500:
 *         description: Internal server error.
 */
router.get('/giftData', userlists.giftData);

/**
 * @swagger
 * /user/blog:
 *   get:
 *     summary: Get all blog posts
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Successfully retrieved blog posts.
 *       500:
 *         description: Internal server error.
 */
router.get('/blog', userlists.blogPosts);

/**
 * @swagger
 * /user/ourStories:
 *   get:
 *     summary: Get all our stories
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Successfully retrieved stories.
 *       500:
 *         description: Internal server error.
 */
router.get('/ourStories', userlists.ourStories);

/**
 * @swagger
 * /user/insertMessage:
 *   post:
 *     summary: Insert a new contact message
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message inserted successfully.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 */
router.post('/insertMessage', userlists.contactMessagesInsert);

/**
 * @swagger
 * /user/getProducts:
 *   post:
 *     summary: Get products by category ID
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - categoryId
 *             properties:
 *               categoryId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved products.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 */
router.post('/getProducts', userlists.getProducts);

module.exports = router;