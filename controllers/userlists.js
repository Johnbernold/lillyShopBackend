const db = require("../models/db")

// ✅ Fetch All Gifts
exports.gifts = (req, res) => {
    let sql = 'SELECT * FROM gifts';
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).json({ success: false, message: 'Database query failed', error: err.message });
        } 
    res.json({ success: true, data: results });    });
};

// ✅ Fetch Gift Data
exports.giftData = (req, res) => {
    let sql = 'SELECT * FROM giftdata';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database Error (giftData):', err);
            return res.status(500).json({ success: false, message: 'Failed to fetch gift data', error: err.message });
        }
        console.log('Gift Data:', results);
        res.json({ success: true, data: results });
    });
};

// ✅ Fetch Gift Catagories
exports.giftCatagories = (req, res) => {
    let sql = 'SELECT * FROM gifts';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database Error (giftCatagories):', err);
            return res.status(500).json({ success: false, message: 'Failed to fetch gift catagories', error: err.message });
        }
        console.log('Gift Catagories:', results);
        res.json({ success: true, data: results });
    });
};

// ✅ Fetch Blog Posts
exports.blogPosts = (req, res) => {
    let sql = 'SELECT * FROM blogposts';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database Error (blogPosts):', err);
            return res.status(500).json({ success: false, message: 'Failed to fetch blog posts', error: err.message });
        }
        console.log('Blog Posts:', results);
        res.json({ success: true, data: results });
    });
};

// ✅ Fetch Our Stories
exports.ourStories = (req, res) => {
    let sql = 'SELECT * FROM ourStories';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database Error (ourStories):', err);
            return res.status(500).json({ success: false, message: 'Failed to fetch stories', error: err.message });
        }
        console.log('Our Stories:', results);
        res.json({ success: true, data: results });
    });
};

// ✅ Insert Contact Message
exports.contactMessagesInsert = (req, res) => {
    const { name, email, message } = req.body;

    let sql = 'INSERT INTO contactMessages (name, email, message) VALUES (?, ?, ?)';
    db.query(sql, [name, email, message], (err, results) => {
        if (err) {
            console.error('Database Error (contactMessagesInsert):', err);
            return res.status(500).json({ success: false, message: 'Failed to insert contact message', error: err.message });
        }        
        console.log('Contact Message Inserted:', results);
        res.json({ success: true, data: results });
    });
};  

// ✅ Fetch Contact Messages
exports.contactMessages = (req, res) => {
    let sql = 'SELECT * FROM contactMessages';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database Error (contactMessages):', err);
            return res.status(500).json({ success: false, message: 'Failed to fetch contact messages', error: err.message });
        }
        console.log('Contact Messages:', results);
        res.json({ success: true, data: results });
    });
};

exports.getProducts = (req, res) => {
    let sql = 'SELECT * FROM giftdata WHERE categoryId = ?';

    db.query(sql, [req.body.categoryId], (err, results) => {
        if (err) {
            console.error('Database Error (getProducts):', err);
            return res.status(500).json({ success: false, message: 'Failed to fetch contact messages', error: err.message });
        }
        console.log('Contact Messages:', results);
        res.json({ success: true, data: results });
    });
};

exports.scrollscreen = (req, res) => {
    const sql = `SELECT * FROM scrollscreen`;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database Error (scrollscreen):', err);
            return res.status(500).json({ success: false, message: 'Failed to fetch scroll screens', error: err.message });
        }
        console.log('Scroll Screens:', results);
        res.json({ success: true, data: results });
    });
};      