const db = require("../models/db");
const { extractFileName, deleteImageFromS3, batchDeleteImagesFromS3,insertImageToS3 } = require("../utils/s3Utils");

// ✅ Insert Blog
exports.insertServiceBlog = async (date,title,description,author,productImgfile) => {
    return new Promise((resolve, reject) => {
      const sqlCheck = "SELECT * FROM blogposts WHERE title = ?";
  
      db.query(sqlCheck, [title], async (err, results) => {
        if (err) return reject("Database error: " + err);
        if (results.length > 0) return reject("Blog title already exists");
        
        try {
          const imageUrlInsert = await insertImageToS3(productImgfile);
          const sqlInsert = "INSERT INTO blogposts (date,title, description, author, imageUrl) VALUES (?, ?, ?, ?, ?)";
  
          db.query(sqlInsert, [date,title, description, author, imageUrlInsert], (insertErr, results) => {
            if (insertErr) return reject("Database error: " + insertErr);
            resolve("Blog created successfully");
          });
        } catch (error) {
          reject(error);
        }
      });
    });
};
  
// ✅ Update Blog
exports.updatServiceBlog = async (blogId, date,title, description, author,  productImgfile) => {
    return new Promise((resolve, reject) => {
      console.log('blogId',blogId)
      const sqlCheck = "SELECT * FROM blogposts WHERE blogId = ?";
  
      db.query(sqlCheck, [blogId], async (err, results) => {
        if (err) return reject("Database error: " + err);
        console.log('results',results)
        if (results.length === 0) return reject("Blog not found");

        const previousBlogImage = results[0].imageUrl;
        
        try {
           
          let blogImage = previousBlogImage;
          if(productImgfile){
            if (blogImage) {
              await deleteImageFromS3(extractFileName(previousBlogImage));
            }

            // **Step 2: Upload new image to S3**
            blogImage = await insertImageToS3(productImgfile);                
          }

          const sqlUpdate = "UPDATE blogposts SET date=?, title=?, description=?, author=?, imageUrl=? WHERE blogId = ?";
  
          db.query(sqlUpdate, [date,title, description, author, blogImage, blogId], (updateErr, results) => {
            if (updateErr) return reject("Database error: " + updateErr);
            resolve("Blog updated successfully");
          });
        } catch (error) {
          reject(error.message);
        }
      });
    });
};
  
// ✅ Delete Blog
exports.deleteServiceBlog = async (blogId) => {
    return new Promise((resolve, reject) => {
      // **Step 1: Fetch Image URL from Database**
      const sqlSelect = "SELECT imageUrl FROM blogposts WHERE blogId = ?";
      db.query(sqlSelect, [blogId], async (err, results) => {
        if (err) {
          console.error("Database error:", err);
          return reject(new Error("Database error"));
        }

        if (results.length === 0) {
          return reject(new Error("Blog not found"));
        }

        const imageUrl = results[0].imageUrl;
        if (!imageUrl) {
          return reject(new Error("No image found for this blog"));
        }

        // **Step 2: Extract S3 Key from URL**
        const s3Key = imageUrl.split(".s3.amazonaws.com/")[1];

        try {
          // **Step 3: Delete Image from S3**
          await deleteImageFromS3(s3Key);

          // **Step 4: Delete Blog from Database**
          const sqlDelete = "DELETE FROM blogposts WHERE blogId = ?";
          db.query(sqlDelete, [blogId], (deleteErr) => {
            if (deleteErr) {
              console.error("Database error:", deleteErr);
              return reject(new Error("Error deleting blog from database"));
            }
            resolve("Blog deleted successfully");
          });
        } catch (s3Error) {
          console.error("Error deleting image from S3:", s3Error);
          reject(new Error("Error deleting image from S3"));
        }
      });
    });
};
