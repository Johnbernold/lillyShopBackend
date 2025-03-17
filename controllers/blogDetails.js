const db = require("../models/db")
const { S3Client, PutObjectCommand, DeleteObjectCommand  } = require('@aws-sdk/client-s3');
const blogService = require("../services/blogService");

// ✅ Insert Blog Post

exports.insertBlogPost = async (req, res) => {
    const { date, title, description, author } = req.body;

    console.log('blogImage',  req.file )

    if (!date || !title || !description || !author || !req.file) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const blogImage = req.file // If no file is uploaded, pass null

   

    try {
        const result = await blogService.insertServiceBlog(date,title, description, author, blogImage);
        return res.status(200).json({ success: true, message: result });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Update Blog
exports.updateBlogPost = async (req, res) => {
    const {blogId, date, title, description, author } = req.body;

    if (!date || !title || !description || !author) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const file = req.file || null; // If no file is uploaded, pass null

    try {
        const result = await blogService.updatServiceBlog(blogId, date, title, description, author, file);
        return res.status(200).json({ success: true, message: result });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ success: false, message: error });
    }
};


// ✅ Delete Blog
exports.deleteBlogPost = async (req, res) => {
  const { blogId } = req.body;

  if (!blogId) {
    return res.status(400).json({ success: false, message: "Blog ID is required" });
  }

  try {
    const result = await blogService.deleteServiceBlog(blogId);
    return res.status(200).json({ success: true, message: result });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


