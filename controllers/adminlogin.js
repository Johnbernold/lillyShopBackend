const db = require("../models/db")
const categoryService = require("../services/categoryService");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.getAllUsers = (req, res) => {
    let sql = 'SELECT * FROM adminusers';
    
    db.query(sql, (err, results) => {
        if (err) throw err;
        console.log('results',results);
        res.send(results);
    });
};

// Sign Up User
exports.signUpUser = (req, res) => {
    const { emailid, password , username} = req.body;
    console.log(req.body);

    if (!emailid || !password || !username) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if email already exists
    const checkEmailSql = 'SELECT * FROM adminusers WHERE emailid = ?';
    db.query(checkEmailSql, [emailid], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length > 0) {
            return res.status(409).json({ message: 'Email already exists' });
        }

        // Hash password before inserting into DB
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err);
                return res.status(500).json({ message: 'Error hashing password' });
            }

            // Insert user into DB
            const insertSql = `INSERT INTO adminusers (emailid,username, password) VALUES (?, ?, ?)`;  
            db.query(insertSql, [emailid, username, hashedPassword], (err, result) => {
                if (err) {
                    console.error('Error inserting user:', err);
                    return res.status(500).json({ message: 'Failed to create user' });
                }

                console.log('User registered:', result);
                return res.status(200).json({ message: 'User registered successfully.' });
            });
        });
    });
};

// ✅ Login Admin Details
exports.adminLoginDetails = (req, res) => {
    const { emailid, password } = req.body;

    if (!emailid || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    let sql = 'SELECT * FROM adminusers WHERE emailid = ?';
    
    db.query(sql, [emailid], async (err, results) => {

        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ success: false, message: 'Email not found' });
        }

        const user = results[0];

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
                
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Incorrect password' });
        }
    
        const token = jwt.sign({ adminId: user.adminId, emailid: user.emailid }, process.env.SECRET_KEY, {
            expiresIn: '1h',
        });

        const userDetails = { adminId: user.adminId, emailid: user.emailid, token };
        res.status(200).json({ success: true, message: 'Login successful', user: userDetails });

    });
};

// ✅ Insert Category

exports.insertCategory = async (req, res) => {
    const { categoryName, title } = req.body;

    console.log('req.file',req)

    if (!req.file || !categoryName || !title) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
        const message = await categoryService.insertServiceCategory(categoryName, title, req.file);
        res.status(200).json({ success: true, message });
    } catch (error) {
        console.error(" Error:", error);
        res.status(500).json({ success: false, message: error });
    }
};

// ✅ Delete Category from Database and S3
exports.deleteCategory = async (req, res) => {
    const { categoryId } = req.body;

    if (!categoryId ) {
        return res.status(400).json({ success: false, message: "Category ID is required" });
    }

    try {
        const result = await categoryService.deleteServiceCategory(categoryId);
        return res.status(200).json({ success: true, message: result });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ✅ Update Category
exports.updateCategory = async (req, res) => {
    console.log('req.body',req.body)
    const { categoryId, categoryName, title } = req.body;   
    if (!categoryId || !categoryName || !title) {
        return res.status(400).json({ success: false, message: "Category ID, Name and Title are required" });
    }   

    const file = req.file || null; // If no file is uploaded, pass null

    try {
        const result = await categoryService.updateServiceCategory(categoryId, categoryName, title, file);
        return res.status(200).json({ success: true, message: result });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ success: false, message: error });
    }
};










