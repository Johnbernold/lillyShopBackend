const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/adminMiddlewareAuth');
const adminlogin = require('../controllers/adminlogin');
const upload = require('../models/multerConfig');
const productDetails = require('../controllers/productDetails');
const blogDetails = require('../controllers/blogDetails');
const ourStories = require('../controllers/ourstories');
const scrollScreen = require('../controllers/scrollScreen');
const userlists = require('../controllers/userlists');

// http://localhost:3600/admin/insertGiftProduct

// ✅ Admin Routes
router.get('/', adminlogin.getAllUsers);
router.post('/signup', adminlogin.signUpUser);
router.post('/login', adminlogin.adminLoginDetails);
router.get('/allusersdetails', adminlogin.getAllUsers);

// get contact messages
router.get('/contactMessages', userlists.contactMessages);


//category
router.post('/insertCategory', verifyToken, upload.single('categoryImage'), adminlogin.insertCategory);
router.post('/deleteCategory', adminlogin.deleteCategory);
router.put('/updateCategory', upload.single('categoryImage'), adminlogin.updateCategory);

//product
router.post('/insertGiftProduct', upload.single('productImage'), productDetails.insertGiftProduct);
router.post('/delectProduct', productDetails.deleteProduct)
router.put('/updateProduct', upload.single('productImage'), productDetails.updateProduct)

//blogposts
router.post('/insertBlogPost', upload.single('blogImage'), blogDetails.insertBlogPost);
router.post('/deleteBlogPost', blogDetails.deleteBlogPost);
router.put('/updateBlogPost', upload.single('blogImage'), blogDetails.updateBlogPost);

//ourstories
router.post('/insertOurStories', upload.single('ourStoriesImage'), ourStories.insertOurStories);
router.post('/deleteOurStories', ourStories.deleteOurStories);
router.put('/updateOurStories', upload.single('ourStoriesImage'), ourStories.updateOurStories);

//scrollScreen
router.post('/insertScrollScreen', upload.single('scrollImage'), scrollScreen.insertScrollScreen);
router.post('/deleteScrollScreen', scrollScreen.deleteScrollScreen);
router.put('/updateScrollScreen', upload.single('scrollImage'), scrollScreen.updateScrollScreen);

module.exports = router;