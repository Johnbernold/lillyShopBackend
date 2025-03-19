    // const express = require('express');
    // const router = express.Router();
    // const { verifyToken } = require('../middleware/adminMiddlewareAuth');
    // const adminlogin = require('../controllers/adminlogin');
    // const upload = require('../models/multerConfig');
    // const productDetails = require('../controllers/productDetails');
    // const blogDetails = require('../controllers/blogDetails');
    // const ourStories = require('../controllers/ourstories');
    // const scrollScreen = require('../controllers/scrollScreen');
    // const userlists = require('../controllers/userlists');

    // // http://localhost:3600/admin/insertGiftProduct


    // // ✅ Admin Routes
    // router.get('/', adminlogin.getAllUsers);
    // router.post('/signup', adminlogin.signUpUser);
    // router.post('/login', adminlogin.adminLoginDetails);
    // router.get('/allusersdetails', adminlogin.getAllUsers);

    // // get contact messages
    // router.get('/contactMessages', userlists.contactMessages);


    // //category
    // router.post('/insertCategory', verifyToken, upload.single('categoryImage'), adminlogin.insertCategory);
    // router.post('/deleteCategory', adminlogin.deleteCategory);
    // router.put('/updateCategory', upload.single('categoryImage'), adminlogin.updateCategory);

    // //product
    // router.post('/insertGiftProduct', upload.single('productImage'), productDetails.insertGiftProduct);
    // router.post('/delectProduct', productDetails.deleteProduct)
    // router.put('/updateProduct', upload.single('productImage'), productDetails.updateProduct)

    // //blogposts
    // router.post('/insertBlogPost', upload.single('blogImage'), blogDetails.insertBlogPost);
    // router.post('/deleteBlogPost', blogDetails.deleteBlogPost);
    // router.put('/updateBlogPost', upload.single('blogImage'), blogDetails.updateBlogPost);

    // //ourstories
    // router.post('/insertOurStories', upload.single('ourStoriesImage'), ourStories.insertOurStories);
    // router.post('/deleteOurStories', ourStories.deleteOurStories);
    // router.put('/updateOurStories', upload.single('ourStoriesImage'), ourStories.updateOurStories);

    // //scrollScreen
    // router.post('/insertScrollScreen', upload.single('scrollImage'), scrollScreen.insertScrollScreen);
    // router.post('/deleteScrollScreen', scrollScreen.deleteScrollScreen);
    // router.put('/updateScrollScreen', upload.single('scrollImage'), scrollScreen.updateScrollScreen);

    // module.exports = router;


const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/adminMiddlewareAuth");
const adminlogin = require("../controllers/adminlogin");
const upload = require("../models/multerConfig");
const productDetails = require("../controllers/productDetails");
const blogDetails = require("../controllers/blogDetails");
const ourStories = require("../controllers/ourstories");
const scrollScreen = require("../controllers/scrollScreen");
const userlists = require("../controllers/userlists");

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin API routes
 */

/**
 * @swagger
 * /admin/allusersdetails:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Successfully retrieved users.
 *       500:
 *         description: Server error
 */
router.get("/allusersdetails", adminlogin.getAllUsers);

/**
* @swagger
 * /admin/signup:
 *   post:
 *     summary: Admin Signup
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: adminuser
 *               emailid:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: mysecurepassword
 *     responses:
 *       201:
 *         description: User signed up successfully.
 *       400:
 *         description: Invalid request
 */
router.post("/signup", adminlogin.signUpUser);


/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Admin Login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailid:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: mysecurepassword
 *     responses:
 *       200:
 *         description: Successfully logged in.
 *       401:
 *         description: Unauthorized
 */
router.post("/login", adminlogin.adminLoginDetails);

/**
 * @swagger
 * /admin/contactMessages:
 *   get:
 *     summary: Get contact messages
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Successfully retrieved messages.
 *       500:
 *         description: Server error
 */
router.get("/contactMessages", userlists.contactMessages);

/**
 * @swagger
 * /admin/insertCategory:
 *   post:
 *     summary: Insert a new category
 *     tags: [Category]
 *     security:
 *       - BearerAuth: []  # JWT authentication applied globally; no need for 'parameters'
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - categoryImage
 *               - categoryName
 *               - title
 *             properties:
 *               categoryImage:
 *                 type: string
 *                 format: binary
 *                 description: Image file for the category.
 *               categoryName:
 *                 type: string
 *                 example: "Electronics"
 *               title:
 *                 type: string
 *                 example: "Latest Gadgets"
 *     responses:
 *       201:
 *         description: Category added successfully.
 *       400:
 *         description: Bad request (Missing required fields).
 *       401:
 *         description: Unauthorized (Invalid or missing JWT token).
 *       500:
 *         description: Internal server error.
 */
router.post("/insertCategory", verifyToken, upload.single("categoryImage"), adminlogin.insertCategory);

/**
 * @swagger
 * /admin/deleteCategory:
 *   post:
 *     summary: Delete a category
 *     tags: [Category]
 *     security:
 *       - BearerAuth: []
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
 *                 example: 123
 *     responses:
 *       200:
 *         description: Category deleted successfully.
 *       400:
 *         description: Bad request (Category ID is required).
 *       404:
 *         description: Category not found.
 *       500:
 *         description: Internal server error.
 */
router.post("/deleteCategory", verifyToken, adminlogin.deleteCategory);

/**
 * @swagger
 * /admin/updateCategory:
 *   put:
 *     summary: Update a category
 *     tags: [Category]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - categoryId
 *               - categoryName
 *               - title
 *             properties:
 *               categoryId:
 *                 type: string
 *                 example: "123"
 *                 description: "The ID of the category to update."
 *               categoryName:
 *                 type: string
 *                 example: "Electronics"
 *                 description: "New name of the category."
 *               title:
 *                 type: string
 *                 example: "Latest Gadgets"
 *                 description: "New title of the category."
 *               categoryImage:
 *                 type: string
 *                 format: binary
 *                 description: "Optional image file for the category."
 *     responses:
 *       200:
 *         description: "Category updated successfully."
 *       400:
 *         description: "Bad request (Missing required fields)."
 *       401:
 *         description: "Unauthorized (Invalid or missing JWT token)."
 *       404:
 *         description: "Category not found."
 *       500:
 *         description: "Internal server error."
 */
router.put("/updateCategory", verifyToken, upload.single("categoryImage"), adminlogin.updateCategory);

/**
 * @swagger
 * /admin/insertGiftProduct:
 *   post:
 *     summary: Insert a new gift product
 *     tags: [product]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - productImage
 *               - productName
 *               - productPrice
 *               - categoryId
 *             properties:
 *               productImage:
 *                 type: string
 *                 format: binary
 *               productName:
 *                 type: string
 *               productPrice:
 *                 type: number
 *               categoryId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Product added successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
router.post("/insertGiftProduct", verifyToken, upload.single("productImage"), productDetails.insertGiftProduct);

/**
 * @swagger
 * /admin/updateGiftProduct:
 *   put:
 *     summary: Update a gift product
 *     tags: [product]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - productName
 *               - productPrice
 *               - categoryId
 *             properties:
 *               productImage:
 *                 type: string
 *                 format: binary
 *               productId:
 *                 type: integer
 *               productName:
 *                 type: string
 *               productPrice:
 *                 type: number
 *               categoryId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product updated successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Product not found.
 *       500:
 *         description: Internal server error.
 */
router.put("/updateGiftProduct", verifyToken, upload.single("productImage"), productDetails.updateProduct);

/**
 * @swagger
 * /admin/deleteGiftProduct:
 *   post:
 *     summary: Delete a gift product
 *     tags: [product]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product deleted successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Product not found.
 *       500:
 *         description: Internal server error.
 */
router.post("/deleteGiftProduct", verifyToken, productDetails.deleteProduct);

/**
 * @swagger
 * /admin/insertBlogPost:
 *   post:
 *     summary: Insert a new blog post
 *     tags: [BlogPosts]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - blogImage
 *               - date
 *               - title
 *               - description
 *               - author
 *             properties:
 *               blogImage:
 *                 type: string
 *                 format: binary
 *                 description: Image file for the blog post.
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-03-19"
 *               title:
 *                 type: string
 *                 example: "New Blog Post"
 *               description:
 *                 type: string
 *                 example: "This is a detailed description of the blog post."
 *               author:
 *                 type: string
 *                 example: "John Doe"
 *     responses:
 *       201:
 *         description: Blog post added successfully.
 *       400:
 *         description: Bad request (Missing required fields).
 *       401:
 *         description: Unauthorized (Invalid or missing JWT token).
 *       500:
 *         description: Internal server error.
 */
router.post('/insertBlogPost',verifyToken, upload.single('blogImage'), blogDetails.insertBlogPost);

/**
 * @swagger
 * /admin/updateBlogPost:
 *   put:
 *     summary: Update an existing blog post
 *     tags: [BlogPosts]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - blogId
 *               - date
 *               - title
 *               - description
 *               - author
 *             properties:
 *               blogId:
 *                 type: integer
 *                 example: 1
 *               blogImage:
 *                 type: string
 *                 format: binary
 *                 description: Updated image file for the blog post (optional).
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-03-19"
 *               title:
 *                 type: string
 *                 example: "Updated Blog Title"
 *               description:
 *                 type: string
 *                 example: "Updated description of the blog post."
 *               author:
 *                 type: string
 *                 example: "Jane Doe"
 *     responses:
 *       200:
 *         description: Blog post updated successfully.
 *       400:
 *         description: Bad request (Missing required fields).
 *       401:
 *         description: Unauthorized (Invalid or missing JWT token).
 *       404:
 *         description: Blog post not found.
 *       500:
 *         description: Internal server error.
 */
router.put('/updateBlogPost',verifyToken, upload.single('blogImage'), blogDetails.updateBlogPost);

/**
 * @swagger
 * /admin/deleteBlogPost:
 *   post:
 *     summary: Delete a blog post
 *     tags: [BlogPosts]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - blogId
 *             properties:
 *               blogId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Blog post deleted successfully.
 *       400:
 *         description: Bad request (Blog ID is required).
 *       401:
 *         description: Unauthorized (Invalid or missing JWT token).
 *       404:
 *         description: Blog post not found.
 *       500:
 *         description: Internal server error.
 */
router.post('/deleteBlogPost',verifyToken, blogDetails.deleteBlogPost);

/**
 * @swagger
 * /admin/insertOurStories:
 *   post:
 *     summary: Insert a new story
 *     tags: [Stories]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - ourStoriesImage
 *               - headline
 *               - description
 *             properties:
 *               ourStoriesImage:
 *                 type: string
 *                 format: binary
 *               headline:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Story added successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
router.post("/insertOurStories", verifyToken, upload.single("ourStoriesImage"), ourStories.insertOurStories);

/**
 * @swagger
 * /admin/updateOurStories:
 *   put:
 *     summary: Update a story
 *     tags: [Stories]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - storyId
 *               - headline
 *               - description
 *             properties:
 *               
 *               storyId:
 *                 type: integer
 *               headline:
 *                 type: string
 *               description:
 *                 type: string
 *               ourStoriesImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Story updated successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Story not found.
 *       500:
 *         description: Internal server error.
 */
router.put("/updateOurStories", verifyToken, upload.single("ourStoriesImage"), ourStories.updateOurStories);

/**
 * @swagger
 * /admin/deleteOurStories:
 *   post:
 *     summary: Delete a story
 *     tags: [Stories]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - storyId
 *             properties:
 *               storyId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Story deleted successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Story not found.
 *       500:
 *         description: Internal server error.
 */
router.post("/deleteOurStories", verifyToken, ourStories.deleteOurStories);

/**
 * @swagger
 * /admin/insertScrollScreen:
 *   post:
 *     summary: Insert a new scroll screen
 *     tags: [ScrollScreen]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - scrollImage
 *               - scrollTitle
 *               - scrollSubtitle1
 *               - scrollSubtitle2
 *               - scrollSubtitle3
 *             properties:
 *               scrollImage:
 *                 type: string
 *                 format: binary
 *                 description: Image file for the scroll screen.
 *               scrollTitle:
 *                 type: string
 *               scrollSubtitle1:
 *                 type: string
 *               scrollSubtitle2:
 *                 type: string
 *               scrollSubtitle3:
 *                 type: string
 *     responses:
 *       201:
 *         description: Scroll screen added successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
router.post("/insertScrollScreen", verifyToken, upload.single("scrollImage"), scrollScreen.insertScrollScreen);

/**
 * @swagger
 * /admin/updateScrollScreen:
 *   put:
 *     summary: Update a scroll screen
 *     tags: [ScrollScreen]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - scrollId
 *               - scrollTitle
 *               - scrollSubtitle1
 *               - scrollSubtitle2
 *               - scrollSubtitle3
 *             properties:
 *               scrollId:
 *                 type: integer
 *               scrollImage:
 *                 type: string
 *                 format: binary
 *                 description: Updated image file for the scroll screen.
 *               scrollTitle:
 *                 type: string
 *               scrollSubtitle1:
 *                 type: string
 *               scrollSubtitle2:
 *                 type: string
 *               scrollSubtitle3:
 *                 type: string
 *     responses:
 *       200:
 *         description: Scroll screen updated successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Scroll screen not found.
 *       500:
 *         description: Internal server error.
 */
router.put("/updateScrollScreen", verifyToken, upload.single("scrollImage"), scrollScreen.updateScrollScreen);

/**
 * @swagger
 * /admin/deleteScrollScreen:
 *   post:
 *     summary: Delete a scroll screen
 *     tags: [ScrollScreen]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - scrollId
 *             properties:
 *               scrollId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Scroll screen deleted successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Scroll screen not found.
 *       500:
 *         description: Internal server error.
 */
router.post("/deleteScrollScreen", verifyToken, scrollScreen.deleteScrollScreen);

module.exports = router;
