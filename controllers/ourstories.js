const db = require("../models/db")
const { S3Client, PutObjectCommand, DeleteObjectCommand  } = require('@aws-sdk/client-s3');
const ourStoriesService = require("../services/ourstorieService");

// ✅ Insert Our Stories
exports.insertOurStories = async (req, res) => {
    const { headline, description, imageUrl } = req.body;

    if (!headline || !description) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const ourStoriesImage = req.file

    try {
        const result = await ourStoriesService.insertServiceOurStories(headline, description, ourStoriesImage);
        return res.status(200).json({ success: true, message: result });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Update Our Stories        
exports.updateOurStories = async (req, res) => {
    console.log('req.body',req.body)
    const {storyId, headline, description } = req.body;

    if (!headline || !description) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const file = req.file || null; // If no file is uploaded, pass null

    try {
        const result = await ourStoriesService.updateServiceOurStories(storyId, headline, description, file);
        return res.status(200).json({ success: true, message: result });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ success: false, message: error });
    }
};

// ✅ Delete Our Stories
exports.deleteOurStories = async (req, res) => {
    const { storyId } = req.body;

    if (!storyId) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
        const result = await ourStoriesService.deleteServiceOurStories(storyId);
        return res.status(200).json({ success: true, message: result });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};