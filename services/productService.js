const db = require("../models/db");
const { deleteImageFromS3 , extractFileName, insertImageToS3} = require("../utils/s3Utils");

// ✅ Insert Product
exports.insertServiceProduct = async (productName, productPrice, categoryId, productImgfile) => {
  return new Promise((resolve, reject) => {
    const sqlCheck = "SELECT * FROM giftdata WHERE productName = ?";

    db.query(sqlCheck, [productName], async (err, results) => {
      if (err) return reject("Database error: " + err);
      if (results.length > 0) return reject("Product name already exists");
      
      try {
        const imageUrl = await insertImageToS3(productImgfile);
        const sqlInsert = "INSERT INTO giftdata (productName, productPrice, productImage, categoryId) VALUES (?, ?, ?, ?)";

        db.query(sqlInsert, [productName, productPrice, imageUrl, categoryId], (insertErr, results) => {
          if (insertErr) return reject("Database error: " + insertErr);
          resolve("Product created successfully");
        });
      } catch (error) {
        reject(error.message);
      }
    });
  });
  };

// ✅ Update Product
  exports.updateServiceProduct = async (productId, productName, productPrice, categoryId, productImgfile) => {
    return new Promise((resolve, reject) => {
      const sqlCheck = "SELECT * FROM giftdata WHERE productId = ?";  
      db.query(sqlCheck, [productId], async (err, results) => {
        if (err) return reject("Database error: " + err);
        if (results.length === 0) return reject("Product not found");

        const previousImageUrl = results[0].productImage;
        try {
          let imageUrl = previousImageUrl;

          if(productImgfile){
            if (previousImageUrl) {
              await deleteImageFromS3(extractFileName(previousImageUrl));
            }

            // **Step 2: Upload new image to S3**
            imageUrl = await insertImageToS3(productImgfile);                
          }

          console.log('imageUrl',imageUrl)
          const sqlUpdate = "UPDATE giftdata SET productName = ?, productPrice = ?, productImage = ?, categoryId = ? WHERE productId = ?";
          db.query(sqlUpdate, [productName, productPrice, imageUrl, categoryId, productId], (updateErr, results) => {   
            if (updateErr) return reject("Database error: " + updateErr);
            resolve("Product updated successfully");
          });
        } catch (error) {
          reject(error.message);
        }
      });
    });
  };

// ✅ Delete Product
exports.deleteServiceProduct = async (productId) => {
  return new Promise((resolve, reject) => {
    // **Step 1: Fetch Image URL from Database**
    const sqlSelect = "SELECT productImage FROM giftdata WHERE productId = ?";
    db.query(sqlSelect, [productId], async (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return reject(new Error("Database error"));
      }

      if (results.length === 0) {
        return reject(new Error("Product not found"));
      }

      const imageUrl = results[0].productImage;
      if (!imageUrl) {
        return reject(new Error("No image found for this product"));
      }

      // **Step 2: Extract S3 Key from URL**
      const s3Key = imageUrl.split(".s3.amazonaws.com/")[1];

      try {
        // **Step 3: Delete Image from S3**
        await deleteImageFromS3(s3Key);

        // **Step 4: Delete Product from Database**
        const sqlDelete = "DELETE FROM giftdata WHERE productId = ?";
        db.query(sqlDelete, [productId], (deleteErr) => {
          if (deleteErr) {
            console.error("Database error:", deleteErr);
            return reject(new Error("Error deleting product from database"));
          }
          resolve("Product deleted successfully");
        });
      } catch (s3Error) {
        console.error("Error deleting image from S3:", s3Error);
        reject(new Error("Error deleting image from S3"));
      }
    });
  });
};