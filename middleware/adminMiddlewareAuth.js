const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {

    console.log('req.headers',req.headers)
    const token = req.header('Authorization');
    
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    if (token.split(' ')[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Invalid token' });
    }

    console.log('token', token);

    try {
        const verified = jwt.verify(token.replace('Bearer ', ''), process.env.SECRET_KEY);
        req.user = verified;
        console.log('req.user', req.user);
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};
