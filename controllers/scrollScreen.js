const scrollScreenService = require("../services/scrollScreenService");

// ✅ Insert Scroll Screen
exports.insertScrollScreen = async (req, res) => {
    const { scrollTitle, scrollSubtitle1, scrollSubtitle2, scrollSubtitle3 } = req.body;

    if (!scrollTitle  || !scrollSubtitle1 || !scrollSubtitle2 || !scrollSubtitle3) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    console.log('scrollImageFile',req.file)

    const scrollImageFile = req.file

    try {
        const result = await scrollScreenService.insertServiceScrollScreen(scrollTitle, scrollSubtitle1, scrollSubtitle2, scrollSubtitle3, scrollImageFile);
        return res.status(200).json({ success: true, message: result });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ success: false, message: error });
    }
};

// ✅ Update Scroll Screen
exports.updateScrollScreen = async (req, res) => {
    const { scrollId, scrollTitle, scrollSubtitle1, scrollSubtitle2, scrollSubtitle3 } = req.body;

    if (!scrollId || !scrollTitle || !scrollSubtitle1 || !scrollSubtitle2 || !scrollSubtitle3) {
        return res.status(400).json({ success: false, message: "Scroll ID, Title and Description are required" });
    }

    const file = req.file || null; // If no file is uploaded, pass null

    try {
        const result = await scrollScreenService.updateServiceScrollScreen(scrollId, scrollTitle, scrollSubtitle1, scrollSubtitle2, scrollSubtitle3, file);
        return res.status(200).json({ success: true, message: result });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ success: false, message: error });
    }
};

// ✅ Delete Scroll Screen
exports.deleteScrollScreen = async (req, res) => {
    const { scrollId } = req.body;

    if (!scrollId) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
        const result = await scrollScreenService.deleteServiceScrollScreen(scrollId);
        return res.status(200).json({ success: true, message: result });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};      