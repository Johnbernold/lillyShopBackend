const db = require("../models/db");
const { extractFileName,deleteImageFromS3, batchDeleteImagesFromS3,insertImageToS3 } = require("../utils/s3Utils");

// ✅ Insert Category
exports.insertServiceCategory = async (categoryName, title, file) => {
    return new Promise((resolve, reject) => {
        const sqlCheck = "SELECT * FROM gifts WHERE categoryName = ?";

        db.query(sqlCheck, [categoryName], async (err, results) => {
            if (err) return reject("Database error: " + err);
            if (results.length > 0) return reject("Category name already exists");

            try {
                const imageUrl = await insertImageToS3(file);
                const sqlInsert = "INSERT INTO gifts (imageSrc, categoryName, title) VALUES (?, ?, ?)";

                db.query(sqlInsert, [imageUrl, categoryName, title], (insertErr, results) => {
                    if (insertErr) return reject("Database error: " + insertErr);
                    resolve("Category inserted successfully");
                });
            } catch (error) {
                reject(error.message);
            }
        });
    });
};

// ✅ Delete Category
exports.deleteServiceCategory = async (categoryId) => {
    return new Promise((resolve, reject) => {
        // **Step 1: Get Category Image**
        const sqlGetCategory = "SELECT imageSrc FROM gifts WHERE categoryId = ?";
        db.query(sqlGetCategory, [categoryId], async (err, categoryResults) => {
            if (err) {
                console.error("Database error:", err);
                return reject(new Error("Database error"));
            }

            if (categoryResults.length === 0) {
                return reject(new Error("Category not found"));
            }

            const categoryImage = categoryResults[0].imageSrc;

            // **Step 2: Get Product Images**
            const sqlGetProducts = "SELECT productImage FROM giftdata WHERE categoryId = ?";
            db.query(sqlGetProducts, [categoryId], async (err, productResults) => {
                if (err) {
                    console.error("Database error:", err);
                    return reject(new Error("Database error"));
                }

                 // **Step 3: Extract all image keys**
                let imageKeys = [];
                
                if (categoryImage) {
                    imageKeys.push(extractFileName(categoryImage)); // Add category image
                }

                if (productResults.length > 0) {
                    imageKeys.push(
                        ...productResults.map(({ productImage }) => extractFileName(productImage)).filter(Boolean)
                    );
                }

                // **Step 4: Delete images from S3 if any exist**
                if (imageKeys.length > 0) {
                    await batchDeleteImagesFromS3(imageKeys);
                }

                // **Step 3: Extract all image keys**
                // const imageKeys = productResults.map(({ img }) => extractFileName(img)).filter(Boolean);
                // if (categoryImage) imageKeys.push(extractFileName(categoryImage)); // Add category image

                // **Step 4: Delete images from S3**
                // await batchDeleteImagesFromS3(imageKeys);

                // **Step 5: Delete Category (CASCADE deletes products)**
                const sqlDeleteCategory = "DELETE FROM gifts WHERE categoryId = ?";
                db.query(sqlDeleteCategory, [categoryId], (err) => {
                    if (err) {
                        console.error("Database error:", err);
                        return reject(new Error("Database error"));
                    }
                    resolve("Category deleted successfully");
                });
            });
        });
    });
};

// ✅ Update Category
exports.updateServiceCategory = async (categoryId, categoryName, title, file) => {
    return new Promise((resolve, reject) => {
        const sqlCheck = "SELECT * FROM gifts WHERE categoryId = ?";
        
        db.query(sqlCheck, [categoryId], async (err, results) => {
            if (err) return reject("Database error: " + err);
            if (results.length === 0) return reject("Category not found");

            const previousImageUrl = results[0].imageSrc;
            try {

                let imageUrl = previousImageUrl;

                if(file){
                    if (previousImageUrl) {
                        await deleteImageFromS3(extractFileName(previousImageUrl));
                    }

                    // **Step 2: Upload new image to S3**
                    imageUrl = await insertImageToS3(file);                
                }

                const sqlUpdate = "UPDATE gifts SET imageSrc = ?, title = ? ,categoryName = ? WHERE categoryId = ?";
                db.query(sqlUpdate, [imageUrl, title, categoryName, categoryId], (updateErr, results) => {
                    if (updateErr) return reject("Database error: " + updateErr);
                    resolve("Category updated successfully");
                });
            } catch (error) {
                reject(error.message);
            }
        });
    });
};