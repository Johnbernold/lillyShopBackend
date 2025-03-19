const db = require("../models/db");
const { extractFileName, deleteImageFromS3,insertImageToS3 } = require("../utils/s3Utils");

// ✅ Insert Scroll Screen
exports.insertServiceScrollScreen = async ( scrollTitle, scrollSubtitle1, scrollSubtitle2, scrollSubtitle3, scrollImage) => {
    return new Promise((resolve, reject) => {
        const sqlCheck = "SELECT * FROM scrollscreen WHERE scrollTitle = ?";
        
        db.query(sqlCheck, [scrollTitle], async (err, results) => {
            if (err) return reject("Database error: " + err);
            if (results.length > 0) return reject("Scroll Title already exists");

            try {
                const imageUrlInsert = await insertImageToS3(scrollImage);
                const sqlInsert = "INSERT INTO scrollscreen (scrollTitle, scrollSubtitle1, scrollSubtitle2, scrollSubtitle3, scrollImage) VALUES (?, ?, ? ,?, ?)";

                db.query(sqlInsert, [scrollTitle, scrollSubtitle1, scrollSubtitle2, scrollSubtitle3, imageUrlInsert], (insertErr, results) => {
                    if (insertErr) return reject("Database error: " + insertErr);
                    resolve("Scroll Screen inserted successfully");
                });
            } catch (error) {
                reject(error.message);
            }
        });
    });
};

// ✅ Update Scroll Screen
exports.updateServiceScrollScreen = async (scrollId, scrollTitle, scrollSubtitle1, scrollSubtitle2, scrollSubtitle3, scrollImagefile) => {
    return new Promise((resolve, reject) => {    
        const sqlCheck = "SELECT * FROM scrollscreen WHERE scrollId = ?";

        db.query(sqlCheck, [scrollId], async (err, results) => {
            if (err) return reject("Database error: " + err);
            if (results.length === 0) return reject("Scroll Screen not found");

            const previousImageUrl = results[0].scrollImage;
            try {

                let imageUrl = previousImageUrl;

                if(scrollImagefile){
                    if (previousImageUrl) {
                        await deleteImageFromS3(extractFileName(previousImageUrl));
                    }

                    // **Step 2: Upload new image to S3**
                    imageUrl = await insertImageToS3(scrollImagefile);                
                }

                const sqlUpdate = "UPDATE scrollscreen SET scrollTitle = ?, scrollSubtitle1 = ?, scrollSubtitle2 = ?, scrollSubtitle3 = ?, scrollImage = ? WHERE scrollId = ?";
                db.query(sqlUpdate, [scrollTitle, scrollSubtitle1, scrollSubtitle2, scrollSubtitle3, imageUrl, scrollId], (updateErr, results) => {
                    if (updateErr) return reject("Database error: " + updateErr);
                    resolve("Scroll Screen updated successfully");
                });
            } catch (error) {
                reject(error.message);
            }
        });
    });
};

// ✅ Delete Scroll Screen
exports.deleteServiceScrollScreen = async (scrollId) => {
    return new Promise((resolve, reject) => {
        // **Step 1: Fetch Image URL from Database**
        const sqlSelect = "SELECT scrollImage FROM scrollscreen WHERE scrollId = ?";
        db.query(sqlSelect, [scrollId], async (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return reject(new Error("Database error"));
            }

            if (results.length === 0) {
                return reject(new Error("Scroll Screen not found"));
            }

            const imageUrl = results[0].scrollImage;
            if (!imageUrl) {
                return reject(new Error("No image found for this Scroll Screen"));
            }

            // **Step 2: Extract S3 Key from URL**
            const s3Key = imageUrl.split(".s3.amazonaws.com/")[1];

            try {
                // **Step 3: Delete Image from S3**
                await deleteImageFromS3(s3Key);

                // **Step 4: Delete Scroll Screen from Database**
                const sqlDelete = "DELETE FROM scrollscreen WHERE scrollId = ?";
                db.query(sqlDelete, [scrollId], (deleteErr) => {
                    if (deleteErr) {
                        console.error("Database error:", deleteErr);
                        return reject(new Error("Error deleting Scroll Screen from database"));
                    }
                    resolve("Scroll Screen deleted successfully");
                });
            } catch (s3Error) {
                console.error("Error deleting image from S3:", s3Error);
                reject(new Error("Error deleting image from S3"));
            }
        });
    });
};