const db = require("../models/db");
const { deleteImageFromS3 , extractFileName, insertImageToS3} = require("../utils/s3Utils");

// ✅ Insert Our Stories
exports.insertServiceOurStories = async (headline, description, imageUrl) => {
    return new Promise((resolve, reject) => {
        const sqlCheck = "SELECT * FROM ourStories WHERE headline = ?";

        db.query(sqlCheck, [headline], async (err, results) => {
            if (err) return reject("Database error: " + err);
            if (results.length > 0) return reject("Headline already exists");

            try {
                const imageUrlInsert = await insertImageToS3(imageUrl);
                const sqlInsert = "INSERT INTO ourStories (headline, description, imageUrl) VALUES (?, ?, ?)";

                db.query(sqlInsert, [headline, description, imageUrlInsert], (insertErr, results) => {
                    if (insertErr) return reject("Database error: " + insertErr);
                    resolve("Our Stories inserted successfully");
                });
            } catch (error) {
                reject(error.message);
            }
        });
    });
};

// ✅ Update Our Stories
exports.updateServiceOurStories = async (storyId, headline, description, storyImageUrl) => {
    return new Promise((resolve, reject) => {
        const sqlCheck = "SELECT * FROM ourStories WHERE storyId = ?";

        db.query(sqlCheck, [storyId], async (err, results) => {
            if (err) return reject("Database error: " + err);
            if (results.length === 0) return reject("Data not found");

            const previousImageUrl = results[0].imageUrl;
            try {

                let imageUrl = previousImageUrl;

                if(storyImageUrl){
                    if (previousImageUrl) {
                        await deleteImageFromS3(extractFileName(previousImageUrl));
                    }

                    // **Step 2: Upload new image to S3**
                    imageUrl = await insertImageToS3(storyImageUrl);                
                }

                const sqlUpdate = "UPDATE ourStories SET headline = ?, description = ?, imageUrl = ? WHERE storyId = ?";
                db.query(sqlUpdate, [headline, description, imageUrl, storyId], (updateErr, results) => {
                    if (updateErr) return reject("Database error: " + updateErr);
                    resolve("Our Stories updated successfully");
                });
            } catch (error) {
                reject(error.message);
            }
        });
    });
};

// ✅ Delete Our Stories
exports.deleteServiceOurStories = async (storyId) => {
    return new Promise((resolve, reject) => {
        // **Step 1: Fetch Image URL from Database**
        const sqlSelect = "SELECT imageUrl FROM ourStories WHERE storyId = ?";
        db.query(sqlSelect, [storyId], async (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return reject(new Error("Database error"));
            }

            if (results.length === 0) {
                return reject(new Error("Our Stories not found"));
            }

            const imageUrl = results[0].imageUrl;
            if (!imageUrl) {
                return reject(new Error("No image found for this Our Stories"));
            }

            // **Step 2: Extract S3 Key from URL**
            const s3Key = imageUrl.split(".s3.amazonaws.com/")[1];

            try {
                // **Step 3: Delete Image from S3**
                await deleteImageFromS3(s3Key);

                // **Step 4: Delete Our Stories from Database**
                const sqlDelete = "DELETE FROM ourStories WHERE storyId = ?";
                db.query(sqlDelete, [storyId], (deleteErr) => {
                    if (deleteErr) {
                        console.error("Database error:", deleteErr);
                        return reject(new Error("Error deleting Our Stories from database"));
                    }
                    resolve("Our Stories deleted successfully");
                });
            } catch (s3Error) {
                console.error("Error deleting image from S3:", s3Error);
                reject(new Error("Error deleting image from S3"));
            }
        });
    });
};  